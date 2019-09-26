import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';

import {
    AfterViewInit, Component, ElementRef, HostBinding, Inject, OnDestroy, OnInit, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Cart } from '../../../../models/checkout/cart.model';
import {
    CheckoutValidationResponse
} from '../../../../models/checkout/checkout-validation-response.model';
import {
    ShoppingCartDialogComponent
} from '../../../providers/components/shopping-cart-dialog/shopping-cart-dialog.component';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';
import { ZopimService } from '../../../shared/services/helpers/zopim.service';

@Component({
    selector: 'ri-checkout-cart-dialog',
    templateUrl: 'checkout-cart-dialog.component.html',
    styleUrls: ['checkout-cart-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CheckoutCartDialogComponent implements OnInit, OnDestroy, AfterViewInit {
    @HostBinding('class') class: string = 'mobile-component';
    cart: Cart;
    groupedProducts: any;
    @ViewChild('mobileBottomRow') mobileBottomRow: ElementRef;

    constructor(
        @Inject(MAT_DIALOG_DATA) public automaticValidationResponse: CheckoutValidationResponse,
        private zopimService: ZopimService,
        private cartService: CartService,
        private checkoutService: CheckoutService,
        public dialogRef: MatDialogRef<ShoppingCartDialogComponent>) { }

    ngOnInit(): void {
        this.checkoutService.automaticValidationResponse$.pipe(untilDestroyed(this))
            .subscribe((automaticValidationResponse: CheckoutValidationResponse) => {
                this.automaticValidationResponse = automaticValidationResponse;
            });

        this.cartService.cart$.pipe(untilDestroyed(this))
            .subscribe((cart: Cart) => {
                this.cart = cart;
                this.groupedProducts = cart.isMultiOrder ? _.groupBy(cart.products, 'clientFullName') : undefined;
            });
    }

    ngAfterViewInit(): void {
        this.zopimService.moveChatButton(this.mobileBottomRow.nativeElement.offsetHeight);
    }

    ngOnDestroy(): void {
        this.zopimService.moveChatButton(0);
    }
}
