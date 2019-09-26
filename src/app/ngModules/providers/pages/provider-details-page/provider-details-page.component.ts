import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest } from 'rxjs';

import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { SessionAddress } from '../../../../models/address/address.model';
import { Cart } from '../../../../models/checkout/cart.model';
import { Client } from '../../../../models/client/client.model';
import { ConfirmDialogData } from '../../../../models/dialogs/confirm-dialog-data.model';
import { Provider } from '../../../../models/provider/provider.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import {
    ConfirmDialogComponent
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    ProvidersApiService
} from '../../../shared/services/business/providers/providers.api.service';
import { ProvidersService } from '../../../shared/services/business/providers/providers.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { AnalyticsService } from '../../../shared/services/helpers/analytics.service';
import { MetaService } from '../../../shared/services/helpers/meta.service';

@Component({
    selector: 'ri-provider-details',
    templateUrl: 'provider-details-page.component.html',
    styleUrls: ['provider-details-page.component.scss']
})
export class ProviderDetailsPageComponent implements OnInit, OnDestroy {
    @HostBinding('class') class: string = 'large-page';
    provider: Provider;
    itemType: string;
    isRestaurant: boolean;
    private sessionAddress: SessionAddress;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private metaService: MetaService,
        private translateService: TranslateService,
        private providersApiService: ProvidersApiService,
        private cartService: CartService,
        private providersService: ProvidersService,
        private dialog: MatDialog,
        private clientService: ClientService,
        private router: Router,
        private sessionAddressService: SessionAddressService,
        private analyticsService: AnalyticsService,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.sessionAddress = this.sessionAddressService._sessionAddress.getValue();

        this.providersApiService
            .get(this.activatedRoute.snapshot.params.providerLink, this.sessionAddress.deliveryCity.id, this.staticConfig.brandId)
            .subscribe((genericResponse: GenericResponse) => {
                if (genericResponse.data) {
                    this.setItemType(genericResponse.data);

                    this.provider = genericResponse.data;
                    this.providersService.checkLastProviderEta(this.provider);

                    this.setMeta();
                    this.analyticsService.ee_productImpressions(this.provider.categories, this.provider.name);

                    this.sessionAddressService.sessionAddress$.pipe(untilDestroyed(this)).subscribe((sessionAddress: SessionAddress) => {
                        if (sessionAddress.lat !== this.sessionAddress.lat || sessionAddress.lng !== this.sessionAddress.lng) {
                            this.providersService.mapProvider(this.provider, sessionAddress.deliveryCity.id);
                            this.sessionAddress = sessionAddress;
                        }
                    });
                } else if (genericResponse.errors) {
                    this.showProviderError();
                }
            });
    }

    ngOnDestroy(): void {/**/ }

    showProviderError(): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: ['PROVIDER_NOT_FOUND'],
            firstActionLabel: 'SEE_SELECTION'
        };

        const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe(() => {
            this.router.navigateByUrl(
                `${this.sessionAddress.deliveryCity.route_relative}/${this.activatedRoute.snapshot.params.providerCategory}`);
        });
    }

    validateCart(): void {
        const client: Client = this.clientService._client.getValue();
        const cart: Cart = this.cartService._cart.getValue();
        const minOrderAmount: number = this.provider.min_order_amount ?
            this.provider.min_order_amount :
            this.sessionAddressService._sessionAddress.getValue().deliveryCity.min_order_amount;

        if (client && client.id && client.isCorporate) {
            this.router.navigate(['/checkout/validation']);
        } else if (cart.total < minOrderAmount) {
            this.showConfirmDialog(minOrderAmount, cart.provider.name);
        } else if (!client || !client.id) {
            this.router.navigate(['/checkout/registration']);
        } else {
            this.router.navigate(['/checkout/validation']);
        }
    }

    private showConfirmDialog(minimum: number, providerName: string): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: ['MIN_ORDER_MESSAGE_NEW'],
            descriptionLinesTranslationParam: [{ minimum, providerName }]
        };

        this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            panelClass: 'small-dialog'
        });
    }

    private setMeta(): void {
        combineLatest(
            this.translateService.get('PAGE_TITLE_PROVIDER', {
                city: this.sessionAddress.deliveryCity.name
            }),
            this.translateService.get('DESCRIPTION_PROVIDER', {
                providerName: this.provider.name,
                categoryName: this.provider.provider_categories[0].category.label.toLowerCase(),
                cityName: this.sessionAddress.deliveryCity.name
            })).subscribe((translations: Array<string>) => {
                this.metaService.setMeta({
                    title: `${this.provider.name} ${translations[0]}`,
                    description: translations[1],
                    openGraph: {
                        image: this.provider.url_image_provider || this.provider.main_image_url,
                        title: this.provider.name,
                        description: new DOMParser().parseFromString(this.provider.description, 'text/html').documentElement.textContent
                    }
                });
            });
    }

    private setItemType(provider: Provider): void {
        this.itemType = provider.provider_categories[0].category.schema;
        this.isRestaurant = this.itemType === 'http://schema.org/Restaurant';
    }
}
