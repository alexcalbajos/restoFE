import * as _ from 'lodash';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { PaymentMethodEnum } from '../../../../enums/payment-method.enum';
import { CreditCard, Payment, PaymentMethod } from '../../../../models/payment/payment.model';
import { DropinFormComponent } from '../../../shared/components/dropin-form/dropin-form.component';
import { PaymentsApiService } from '../../../shared/services/business/payment/payments.api.service';
import { PaymentsService } from '../../../shared/services/business/payment/payments.service';

@Component({
    selector: 'ri-payment-methods',
    templateUrl: 'payment-methods.component.html',
    styleUrls: ['payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
    @Input() allowAdd: boolean;
    @Input() paymentMethods: Array<PaymentMethod>;
    @Output() readonly paymentSelected: EventEmitter<Payment> = new EventEmitter<Payment>();
    selectedPaymentMethod: PaymentMethod;
    creditCards: Array<CreditCard>;
    showDropin: boolean;
    dataLoaded: boolean;
    dropinLoaded: boolean;

    @ViewChild('dropinForm') dropinForm: DropinFormComponent;

    constructor(
        private paymentsService: PaymentsService,
        private paymentsApiService: PaymentsApiService) { }

    ngOnInit(): void {
        _.remove(this.paymentMethods, { id: PaymentMethodEnum.Corporate });
        this.selectedPaymentMethod = this.paymentMethods[0];
        this.handleSelectedPaymentMethod();
    }

    handleSelectedPaymentMethod(): void {
        if (this.allowAdd) {
            this.handleAddOptions();
        } else {
            this.handleSelectOptions();
        }
    }

    handleSelectedPayment(payment: Payment): void {
        if (!payment || (payment.paymentMethod && payment.paymentMethod.id)) {
            this.paymentSelected.emit(payment);
        } else {
            this.paymentSelected.emit({
                paymentMethod: this.selectedPaymentMethod,
                iconUrl: this.paymentsService.getPaymentMethodIcon(this.selectedPaymentMethod),
                id: this.selectedPaymentMethod.id
            });
        }
    }

    submitDropinForm(): void {
        this.dropinForm.addCard();
    }

    private handleAddOptions(): void {
        if (this.selectedPaymentMethod.id === PaymentMethodEnum.CreditCard) {
            this.dropinLoaded = false;
            this.showDropin = true;
        } else {
            this.dataLoaded = true;
            this.showDropin = false;
        }
    }

    private handleSelectOptions(): void {
        if (this.selectedPaymentMethod.id === PaymentMethodEnum.CreditCard) {
            this.getCreditCards();
        } else {
            this.creditCards = [];
            this.dataLoaded = true;
        }
    }

    private getCreditCards(): void {
        this.paymentsApiService.getAllCreditCards().subscribe((creditCards: Array<CreditCard>) => {
            this.dataLoaded = true;
            this.creditCards = creditCards;
        });
    }
}
