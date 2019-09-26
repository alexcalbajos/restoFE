import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from '../shared/services/business/cart/cart.service';

@Component({
    selector: 'ri-checkout',
    templateUrl: 'checkout.component.html',
    styleUrls: ['checkout.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CheckoutComponent implements OnInit {
    backUrl: string;

    constructor(
        private router: Router,
        private cartService: CartService) {
    }

    ngOnInit(): void {
        this.backUrl = this.cartService._cart.getValue().provider.provider_url;
    }

    back(): void {
        this.router.navigate([this.backUrl]);
    }
}
