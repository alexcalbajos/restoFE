import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { MessageType } from '../../../enums/message-type.enum';
import { SessionAddress } from '../../../models/address/address.model';
import { Authentication } from '../../../models/authentication/authentication.model';
import { Cart } from '../../../models/checkout/cart.model';
import {
    CheckoutValidationResponse
} from '../../../models/checkout/checkout-validation-response.model';
import { Checkout } from '../../../models/checkout/checkout.model';
import { Client } from '../../../models/client/client.model';
import {
    AuthenticationService
} from '../../../ngModules/shared/services/business/authentication/authentication.service';
import { CartService } from '../../../ngModules/shared/services/business/cart/cart.service';
import {
    CheckoutService
} from '../../../ngModules/shared/services/business/checkout/checkout.service';
import {
    ClientApiService
} from '../../../ngModules/shared/services/business/client/client.api.service';
import { ClientService } from '../../../ngModules/shared/services/business/client/client.service';
import {
    SessionAddressService
} from '../../../ngModules/shared/services/business/session-address/session-address.service';
import { BingTagService } from '../../../ngModules/shared/services/helpers/bing-tag.service';
import {
    GooglAnalyticsService
} from '../../../ngModules/shared/services/helpers/google-analytics.service';
import { HistoryService } from '../../../ngModules/shared/services/helpers/history.service';
import { LoggerService } from '../../../ngModules/shared/services/helpers/logger.service';
import { MediaQueryService } from '../../../ngModules/shared/services/helpers/media-query.service';
import {
    TranslationWrapperService
} from '../../../ngModules/shared/services/helpers/translation-wrapper.service';
import { YahooTagService } from '../../../ngModules/shared/services/helpers/yahoo-tag.service';
import { GdprDialogComponent } from '../../components/gdpr-dialog/gdpr-dialog.component';

@Component({
    selector: 'ri-root-page',
    templateUrl: 'root-page.component.html',
    styleUrls: ['root-page.component.scss']
})
export class RootPageComponent {
    headerClass: string;
    footerClass: string;

    constructor(
        private checkoutService: CheckoutService,
        private historyService: HistoryService,
        private cartService: CartService,
        private sessionAddressService: SessionAddressService,
        private authenticationService: AuthenticationService,
        private clientService: ClientService,
        private translationWrapperService: TranslationWrapperService,
        private googlAnalyticsService: GooglAnalyticsService,
        private yahooTagService: YahooTagService,
        private bingTagService: BingTagService,
        private mediaQueryService: MediaQueryService,
        private clientApiService: ClientApiService,
        private loggerService: LoggerService,
        private dialog: MatDialog,
        private router: Router) {
        this.resetOldLocalStorage();
        this.initServices();
        this.handleClientChanges();
        this.listenOnNavigation();
        this.theme();
    }

    private handleClientChanges(): void {
        this.clientService.client$.subscribe((client: Client) => {
            if (client && client.id && !client.gdpr_accept) {
                const dialog: MatDialogRef<GdprDialogComponent> = this.dialog.open(GdprDialogComponent, {
                    autoFocus: false,
                    disableClose: true,
                    closeOnNavigation: false
                });

                dialog.afterClosed().subscribe((closeResult: boolean) => {
                    if (closeResult) {
                        this.clientApiService.acceptGdpr(client.id).subscribe(() => {
                            this.clientService._client.getValue().gdpr_accept = true;
                            this.clientService.set(this.clientService._client.getValue());
                        });
                    } else {
                        this.loggerService.log('Logout From Root Page', MessageType.Warning);
                        this.clientService.logout();
                    }
                });
            }
        });
    }

    private resetOldLocalStorage(): void {
        if (localStorage.getItem('apiAuth')) {
            localStorage.clear();
        }

        const cachedClient: Client = JSON.parse(localStorage.getItem('client'));
        if (cachedClient && !cachedClient.phone) {
            localStorage.clear();
        }
    }

    private initServices(): void {
        if (!environment.production) {
            this.logChanges();
        }

        this.authenticationService.authentication$.subscribe((authentication: any) => {
            if (authentication && !authentication.doNotCache) {
                this.clientService.init();
            }
        });
        this.authenticationService.init();

        this.sessionAddressService.init();
        this.cartService.init();
        this.historyService.init();
        this.mediaQueryService.init();
        this.translationWrapperService.init();
        this.googlAnalyticsService.initAnalytics();
        this.googlAnalyticsService.initTagManager(this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code);
        this.yahooTagService.initTag();
        this.bingTagService.initTag();
    }

    private listenOnNavigation(): void {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.googlAnalyticsService.sendPageView(event.urlAfterRedirects);
                this.headerClass = this.getRootData('headerClass');
                this.footerClass = this.getRootData('footerClass');
            }
        });
    }

    private getRootData(key: string): string {
        let data: string = '';

        let root: any = this.router.routerState.snapshot.root;
        while (root) {
            if (root.children && root.children.length) {
                root = root.children[0];
            } else {
                if (root.data && root.data[key]) {
                    data = root.data[key];

                    return data;
                }

                return;
            }
        }
    }

    private theme(): void {
        const themeWrapper: HTMLElement = document.querySelector('body');
        themeWrapper.style.setProperty('--zopimBottom', '15px');
        themeWrapper.style.setProperty('--headerTop', '0px');
    }

    private logChanges(): void {
        // tslint:disable:no-console
        this.clientService.client$.subscribe((client: Client) => {
            console.log('Client', client);
        });

        this.authenticationService.authentication$.subscribe((authentication: Authentication) => {
            console.log('Authentication', authentication);
        });

        this.sessionAddressService.sessionAddress$.subscribe((sessionAddress: SessionAddress) => {
            console.log('SessionAddress', sessionAddress);
        });

        this.cartService.cart$.subscribe((cart: Cart) => {
            console.log('Cart', cart);
        });

        this.checkoutService.checkout$.subscribe((checkout: Checkout) => {
            console.log('Checkout', checkout);
        });

        this.checkoutService.automaticValidationResponse$.subscribe((automaticValidationResponse: CheckoutValidationResponse) => {
            console.log('Automatic Validation', automaticValidationResponse);
        });

        this.checkoutService.manualValidationResponse$.subscribe((manualValidationResponse: CheckoutValidationResponse) => {
            console.log('Manual Validation', manualValidationResponse);
        });
    }
}
