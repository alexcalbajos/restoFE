import * as $ from 'jquery';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { MessageType } from '../../../../enums/message-type.enum';
import { BaseAddress, SessionAddress } from '../../../../models/address/address.model';
import { Cart } from '../../../../models/checkout/cart.model';
import { Client } from '../../../../models/client/client.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import { AddressDialogService } from '../../services/business/addresses/address-dialog.service';
import {
    SessionAddressService
} from '../../services/business/session-address/session-address.service';
import { LoggerService } from '../../services/helpers/logger.service';

@Component({
    selector: 'ri-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Input() isIncomplete: boolean;
    @Input() headerClass: string;
    client: Client;
    cart: Cart;
    sessionAddress: SessionAddress;
    languages: Array<any> = [
        { text: 'Fr', language: 'fr' },
        { text: 'Esp', language: 'es' },
        { text: 'Eng', language: 'en' }
    ];

    constructor(
        private router: Router,
        private sessionAddressService: SessionAddressService,
        private clientService: ClientService,
        private translateService: TranslateService,
        private addressDialogService: AddressDialogService,
        private loggerService: LoggerService,
        private cartService: CartService) { }

    ngOnInit(): void {
        this.clientService.client$.pipe(untilDestroyed(this)).subscribe((client: Client) => {
            this.client = client;
        });

        this.cartService.cart$.pipe(untilDestroyed(this)).subscribe((cart: Cart) => {
            this.cart = cart;
        });

        this.sessionAddressService.sessionAddress$.pipe(untilDestroyed(this)).subscribe((sessionAddress: SessionAddress) => {
            this.sessionAddress = sessionAddress;
        });
    }

    ngOnDestroy(): void {/**/ }

    goToProvider(): void {
        this.router.navigate([this.cart.provider.provider_url]);
    }

    logout(): void {
        this.loggerService.log('Logout From Header', MessageType.Warning);
        this.clientService.logout();
    }

    changeLanguage(language: string): void {
        this.translateService.use(language);
    }

    changeAddress(): void {
        this.addressDialogService.changeAddress().pipe(take(1)).subscribe((address: BaseAddress) => {
            this.sessionAddressService.changeSessionAddress(address);
        });
    }

    goHome(): void {
        if (this.router.url === '/') {
            $('html, body').animate({ scrollTop: 0 }, 700);
        } else {
            this.router.navigateByUrl('/');
        }
    }
}
