import { untilDestroyed } from 'ngx-take-until-destroy';

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
    CheckoutValidationResponse
} from '../../../../models/checkout/checkout-validation-response.model';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';

@Component({
    selector: 'ri-change-promo-code',
    templateUrl: 'change-promo-code.component.html',
    styleUrls: ['change-promo-code.component.scss']
})
export class ChangePromoCodeComponent implements OnInit, OnDestroy {
    promo: string;
    validationError: string;
    dataLoaded: boolean = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private checkoutService: CheckoutService,
        public dialogRef: MatDialogRef<ChangePromoCodeComponent>) { }

    ngOnInit(): void {
        this.promo = this.checkoutService._checkout.getValue().couponCode;

        this.checkoutService.automaticValidationResponse$.pipe(untilDestroyed(this))
            .subscribe((automaticValidationResponse: CheckoutValidationResponse) => {
                if (automaticValidationResponse.couponCode.code === this.promo) {
                    this.dataLoaded = true;

                    if (automaticValidationResponse.couponCode.isValid) {
                        this.dialogRef.close();
                    } else {
                        this.checkoutService._checkout.getValue().couponCode = '';
                        this.validationError = automaticValidationResponse.couponCode.error;
                    }
                }
            });
    }

    ngOnDestroy(): void {/**/ }

    validatePromoCode(): void {
        this.dataLoaded = false;

        if (!this.promo) {
            this.promo = '';
        }

        this.checkoutService._checkout.next(
            {
                ...this.checkoutService._checkout.getValue(),
                couponCode: this.promo,
                walletAmount: 0
            });
    }
}
