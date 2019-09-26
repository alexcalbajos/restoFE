import { Component, OnInit } from '@angular/core';

import { Client } from '../../../../models/client/client.model';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';

@Component({
    selector: 'ri-checkout-wallet',
    templateUrl: 'checkout-wallet.component.html',
    styleUrls: ['checkout-wallet.component.scss']
})
export class CheckoutWalletComponent implements OnInit {
    walletAmount: number;

    constructor(
        private checkoutService: CheckoutService,
        private clientApiService: ClientApiService,
        private clientService: ClientService) { }

    ngOnInit(): void {
        this.clientApiService.get(this.clientService._client.getValue().id).subscribe((client: Client) => {
            this.walletAmount = client.wallet_amount;
        });
    }

    useCredit(): void {
        this.checkoutService._checkout.next(
            {
                ...this.checkoutService._checkout.getValue(),
                walletAmount: this.walletAmount,
                couponCode: ''
            }
        );
    }
}
