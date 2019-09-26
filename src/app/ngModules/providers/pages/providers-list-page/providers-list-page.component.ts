import * as $ from 'jquery';
import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import {
    AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseAddress, SessionAddress } from '../../../../models/address/address.model';
import { MetaData } from '../../../../models/meta/meta-data.model';
import { Provider, ProviderSortingOption } from '../../../../models/provider/provider.model';
import {
    AddressDialogService
} from '../../../shared/services/business/addresses/address-dialog.service';
import {
    ProvidersApiService
} from '../../../shared/services/business/providers/providers.api.service';
import { ProvidersService } from '../../../shared/services/business/providers/providers.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { MetaService } from '../../../shared/services/helpers/meta.service';
import {
    ProvidersFiltersDialogComponent
} from '../../components/providers-filters-dialog/providers-filters-dialog.component';
import {
    ProvidersFiltersComponent
} from '../../components/providers-filters/providers-filters.component';

@Component({
    selector: 'ri-providers-list-page',
    templateUrl: 'providers-list-page.component.html',
    styleUrls: ['providers-list-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProvidersListPageComponent implements OnInit, AfterViewInit, OnDestroy {
    providers: Array<Provider>;
    dataLoaded: boolean;
    address: string;
    fixedMobileElementInitialPosition: number;

    @ViewChild('fixedElement') fixedElement: ElementRef;
    @ViewChild('fixedElementMobile') fixedElementMobile: ElementRef;
    @ViewChild('fixedElementContainer') fixedElementContainer: ElementRef;
    @ViewChild('providersFilters') providersFilters: ProvidersFiltersComponent;

    constructor(
        private renderer2: Renderer2,
        private router: Router,
        private dialog: MatDialog,
        private metaService: MetaService,
        private providersService: ProvidersService,
        private providersApiService: ProvidersApiService,
        public sessionAddressService: SessionAddressService,
        private addressDialogService: AddressDialogService,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.scrollUp();

        combineLatest(
            this.sessionAddressService.sessionAddress$,
            this.activatedRoute.queryParams,
            this.activatedRoute.params
        ).pipe(untilDestroyed(this)).subscribe((data: any) => {
            const sessionAddress: SessionAddress = data[0];
            const queryParams: any = data[1];
            const params: any = data[2];

            this.dataLoaded = false;
            this.address = sessionAddress.address;
            this.setMeta(params, sessionAddress);

            this.prepareProviders(sessionAddress, queryParams, params);
        });

        this.providersService.selectedSortingOption$.pipe(untilDestroyed(this))
            .subscribe((providerSortingOption: ProviderSortingOption) => {
                if (providerSortingOption.id) {
                    this.providers = this.providersService.orderProviders(this.providers);
                    this.scrollUp();
                }
            });
    }

    ngAfterViewInit(): void {
        this.setFixedElementWidth();

        const header: Element = document.getElementsByTagName('ri-header')[0];
        const fixedMobileNativeElement: any = this.fixedElementMobile.nativeElement;

        if (header && fixedMobileNativeElement) {
            const headerBottom: number = header.getBoundingClientRect().bottom;
            this.fixedMobileElementInitialPosition = fixedMobileNativeElement.getBoundingClientRect().top - headerBottom;
        }
    }

    ngOnDestroy(): void {/**/ }

    prepareProviders(sessionAddress: SessionAddress, queryParams: any, params: any): void {
        if (!queryParams.categories && !params.providerCategory) {
            this.providersService.providerCategories = [];
        }

        this.providersApiService.getAll(sessionAddress.deliveryCity.id)
            .subscribe((providersFromRespons: Array<Provider>) => {
                if (!providersFromRespons.length) {
                    this.router.navigate(['/static/no-providers'], { queryParams: { reason: 'providers-closed' } });

                    return;
                }

                const providers: Array<Provider> = this.providersService.filterProvidersByRange(providersFromRespons, sessionAddress);
                this.providersService.setProviderCategories(providers, queryParams, params);
                this.providers = this.providersService.filterProvidersByCategories(providers, queryParams);
                this.dataLoaded = true;

                if (this.providers.length === 0) {
                    this.router.navigate(['/static/no-providers'], { queryParams: { reason: 'providers-out-of-range' } });
                } else {
                    this.scrollUp();
                }
            });
    }

    openMobileFilters(): void {
        const dialog: MatDialogRef<ProvidersFiltersDialogComponent> = this.dialog.open(ProvidersFiltersDialogComponent, {
            autoFocus: false,
            panelClass: 'mobile'
        });

        dialog.afterClosed().subscribe((newList: MatSelectionList) => {
            if (newList) {
                this.onNewCategoriesList(newList);
            }
        });
    }

    onNewCategoriesList(list: MatSelectionList): void {
        const selectedCategories: Array<string> = list.selectedOptions.selected.map((item: MatListOption) => item.value.toLowerCase());

        if (selectedCategories.length === 1) {
            this.router.navigate(
                [this.sessionAddressService._sessionAddress.getValue().deliveryCity.route_relative, selectedCategories[0]]);
        } else if (selectedCategories.length > 1) {
            this.router.navigate(
                [this.sessionAddressService._sessionAddress.getValue().deliveryCity.route_relative],
                { queryParams: { categories: selectedCategories.join('%') } });
        } else {
            this.router.navigate([this.sessionAddressService._sessionAddress.getValue().deliveryCity.route_relative]);
        }
    }

    changeAddress(): void {
        this.addressDialogService.changeAddress().pipe(take(1)).subscribe((address: BaseAddress) => {
            this.sessionAddressService.changeSessionAddress(address);
        });
    }

    @HostListener('window:scroll') toggleFixedMobileElementPosition(): void {
        if (window.scrollY > this.fixedMobileElementInitialPosition) {
            this.renderer2.addClass(this.fixedElementMobile.nativeElement, 'fixed');
        } else {
            this.renderer2.removeClass(this.fixedElementMobile.nativeElement, 'fixed');
        }
    }

    @HostListener('window:resize') private setFixedElementWidth(): void {
        const fixedElementContainerWidth: number = this.fixedElementContainer.nativeElement.offsetWidth;
        this.renderer2.setStyle(this.fixedElement.nativeElement, 'width', `${fixedElementContainerWidth}px`);
        this.renderer2.setStyle(this.fixedElementMobile.nativeElement, 'width', `${fixedElementContainerWidth}px`);
    }

    private scrollUp(): void {
        setTimeout(() => {
            // This forces the lazy loading of images
            $('html, body').animate({ scrollTop: 0 }, 0);
            $('html, body').animate({ scrollTop: 1 }, 0);
            $('html, body').animate({ scrollTop: 0 }, 0);

            const categoriesList: JQuery = $('#CategoriesList');
            if (categoriesList) {
                categoriesList.animate({ scrollTop: 0 }, 0);
            }
        }, 100);
    }

    private setMeta(params: any, sessionAddress: SessionAddress): void {
        const meta: MetaData = {
            description: 'DESCRIPTION_PROVIDERS',
            descriptionTranslationParam: { cityName: sessionAddress.deliveryCity.name }
        };

        if (params && params.providerCategory) {
            const title: string = 'TITLE_H1_CATEGORY';
            const titleTranslationParam: any = {
                city: sessionAddress.deliveryCity.name,
                category: params.providerCategory
            };
            meta.title = title;
            meta.titleTranslationParam = titleTranslationParam;
            meta.openGraph = {
                title,
                titleTranslationParam
            };
        } else {
            meta.title = 'PAGE_TITLE_LIST';
            meta.titleTranslationParam = { city: sessionAddress.deliveryCity.name };
        }

        this.metaService.setMeta(meta);
    }
}
