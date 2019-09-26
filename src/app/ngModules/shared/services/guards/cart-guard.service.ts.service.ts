import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';

import { Cart } from '../../../../models/checkout/cart.model';
import { CartService } from '../business/cart/cart.service';
import { GuardBaseService } from './guard-base.service';

@Injectable()
export class CartGuardService implements CanLoad, CanActivate {
    constructor(
        private guardBaseService: GuardBaseService,
        private cartService: CartService) { }

    canLoad(): boolean {
        return this.checkCart();
    }

    canActivate(): boolean {
        return this.checkCart();
    }

    private checkCart(): boolean {
        const cart: Cart = this.cartService._cart.getValue();

        if (cart && cart.numberOfProducts > 0) {
            return true;
        } else {
            this.guardBaseService.goBack();

            return false;
        }
    }
}
