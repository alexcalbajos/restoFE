import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../models/client/client.model';
import { CartProvider } from '../../../../models/provider/provider.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ClientService } from '../../../shared/services/business/client/client.service';

@Component({
    selector: 'ri-checkout-registration',
    templateUrl: 'checkout-registration.component.html',
    styleUrls: ['checkout-registration.component.scss']
})

export class CheckoutRegistrationComponent implements OnInit {
    provider: CartProvider;

    constructor(
        private clientService: ClientService,
        public cartService: CartService,
        private router: Router) { }

    ngOnInit(): void {
        const client: Client = this.clientService._client.getValue();

        if (client && client.id) {
            this.router.navigate(['/checkout/validation']);
        }

        this.provider = this.cartService._cart.getValue().provider;
    }

    clientAuthenticated(): void {
        this.router.navigate(['/checkout/validation']);
    }
}
