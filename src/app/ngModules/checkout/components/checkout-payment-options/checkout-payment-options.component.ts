import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { PaymentMethodEnum } from '../../../../enums/payment-method.enum';
import {
    CheckoutValidationResponse
} from '../../../../models/checkout/checkout-validation-response.model';
import { Code } from '../../../../models/corporate/code.model';
import { PaymentMethod, PaymentMethodOption } from '../../../../models/payment/payment.model';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';
import { PaymentsApiService } from '../../../shared/services/business/payment/payments.api.service';

@Component({
    selector: 'ri-checkout-payment-options',
    templateUrl: 'checkout-payment-options.component.html',
    styleUrls: ['checkout-payment-options.component.scss']
})
export class CheckoutPaymentOptionsComponent implements OnInit, OnDestroy {
    allPaymentMethods: Array<PaymentMethod>;
    corporatePaymentMethod: PaymentMethod;
    corporateCodes: Array<Code>;
    selecedCorporateCode: Code;

    constructor(
        private paymentsApiService: PaymentsApiService,
        private checkoutService: CheckoutService) { }

    ngOnInit(): void {
        this.paymentsApiService.getPaymentMethods().subscribe((allPaymentMethods: Array<PaymentMethod>) => {
            this.allPaymentMethods = allPaymentMethods;
            this.corporatePaymentMethod = _.find(this.allPaymentMethods, { id: PaymentMethodEnum.Corporate });

            if (this.corporatePaymentMethod.display_codes_selector) {
                this.paymentsApiService.getCorporateCodes().subscribe((codes: Array<Code>) => {
                    this.corporateCodes = codes;
                    this.selecedCorporateCode = codes[0];
                    this.setSelectedCorporateCode();
                });
            }

            this.checkoutService.automaticValidationResponse$.pipe(untilDestroyed(this))
                .subscribe((automaticValidationResponse: CheckoutValidationResponse) => {
                    this.highlightInvalidOptions(automaticValidationResponse);
                });
        });
    }

    ngOnDestroy(): void {/**/ }

    highlightInvalidOptions(automaticValidationResponse: CheckoutValidationResponse): void {
        this.corporatePaymentMethod.options.forEach((option: PaymentMethodOption) => {
            option.invalid =
                automaticValidationResponse.clientRequested &&
                automaticValidationResponse.payment &&
                automaticValidationResponse.payment.dataErrors &&
                _.some(automaticValidationResponse.payment.dataErrors, { id: option.id });
        });
    }

    optionUpdated(paymentOption: PaymentMethodOption, value: any): void {
        let paymentOptions: Array<PaymentMethodOption> = this.checkoutService._checkout.getValue().paymentOptions;
        if (!paymentOptions) {
            paymentOptions = [];
        }

        _.remove(paymentOptions, { id: paymentOption.id });
        paymentOption.value = value;
        paymentOptions.push(paymentOption);

        this.checkoutService._checkout.getValue().paymentOptions = paymentOptions;
    }

    codeUpdated(corporateCode: string): void {
        this.checkoutService._checkout.getValue().corporateCode = corporateCode;
    }

    setSelectedCorporateCode(): void {
        this.checkoutService._checkout.getValue().corporateCode = this.selecedCorporateCode.code;
    }
}
