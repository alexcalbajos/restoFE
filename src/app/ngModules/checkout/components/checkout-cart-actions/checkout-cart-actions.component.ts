import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

import { CouponCodeType } from '../../../../enums/coupon-code-type.enum';
import {
    CheckoutValidationResponse, CouponCode
} from '../../../../models/checkout/checkout-validation-response.model';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';

@Component({
    selector: 'ri-checkout-cart-actions',
    templateUrl: 'checkout-cart-actions.component.html',
    styleUrls: ['checkout-cart-actions.component.scss']
})
export class CheckoutCartActionsComponent implements OnDestroy, OnChanges {
    @Input() automaticValidationResponse: CheckoutValidationResponse;
    couponCodeIcon: string;
    couponCodeTypeProduct: number = CouponCodeType.Product;

    constructor(private checkoutService: CheckoutService) { }

    ngOnChanges(): void {
        if (this.automaticValidationResponse && this.automaticValidationResponse.couponCode) {
            this.setCouponCodeIcon(this.automaticValidationResponse.couponCode);
        }
    }

    ngOnDestroy(): void {/**/ }

    disablePromoCode(): void {
        this.checkoutService._checkout.next({ ...this.checkoutService._checkout.getValue(), couponCode: '' });
    }

    disableWallet(): void {
        this.checkoutService._checkout.next({ ...this.checkoutService._checkout.getValue(), walletAmount: 0 });
    }

    setCouponCodeIcon(couponCode: CouponCode): void {
        this.couponCodeIcon = couponCode.type === CouponCodeType.Product ? '/assets/svg/gift.svg' : '/assets/svg/promotion.svg';
    }
}
