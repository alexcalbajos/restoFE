import * as _ from 'lodash';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { PaymentMethodEnum } from '../../../../enums/payment-method.enum';
import { CreditCard, Payment, PaymentMethod } from '../../../../models/payment/payment.model';
import {
    AddCreditCardDialogComponent
} from '../../../shared/components/add-credit-card-dialog/add-credit-card-dialog.component';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';
import { PaymentsApiService } from '../../../shared/services/business/payment/payments.api.service';
import { PaymentsService } from '../../../shared/services/business/payment/payments.service';
import {
    ChangeSelectedPaymentDialogComponent
} from '../change-selected-payment-dialog/change-selected-payment-dialog.component';
import { PaymentMethodsComponent } from '../payment-methods/payment-methods.component';

@Component({
    selector: 'ri-checkout-payment',
    templateUrl: 'checkout-payment.component.html',
    styleUrls: ['checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
    @Input() bonificationAmount: number;
    @Input() corporateExtraPay: number;
    allPaymentMethods: Array<PaymentMethod>;
    selectedPayment: Payment;
    creditCardMethodId: number = PaymentMethodEnum.CreditCard;
    paypalMethodId: number = PaymentMethodEnum.Paypal;
    dataLoaded: boolean;
    displayPaymentOptions: boolean;

    @ViewChild('paymentMethods') paymentMethods: PaymentMethodsComponent;

    constructor(
        private checkoutService: CheckoutService,
        private dialog: MatDialog,
        private paymentsService: PaymentsService,
        private paymentsApiService: PaymentsApiService) { }

    ngOnInit(): void {
        this.paymentsApiService.getPaymentMethods().subscribe((allPaymentMethods: Array<PaymentMethod>) => {
            this.allPaymentMethods = allPaymentMethods;

            this.paymentsApiService.getLastPaymentMethod().subscribe((lastPaymentMethod: PaymentMethod) => {
                if (lastPaymentMethod && _.some(this.allPaymentMethods, { id: lastPaymentMethod.id })) {
                    if (lastPaymentMethod.id === PaymentMethodEnum.CreditCard ||
                        (lastPaymentMethod.id === PaymentMethodEnum.Corporate &&
                            _.some(this.allPaymentMethods, { id: PaymentMethodEnum.CreditCard }))) {
                        this.paymentsApiService.getLatestCreditCard().subscribe((lastCreditCard: CreditCard) => {
                            if (lastCreditCard) {
                                this.setSelectedPayment(lastCreditCard);
                            } else {
                                this.setDefaultPayment();
                            }

                            this.dataLoaded = true;
                        });
                    } else {
                        this.setSelectedPayment({
                            paymentMethod: lastPaymentMethod,
                            iconUrl: this.paymentsService.getPaymentMethodIcon(lastPaymentMethod),
                            id: lastPaymentMethod.id
                        });

                        this.dataLoaded = true;
                    }
                } else {
                    this.setDefaultPayment();
                    this.dataLoaded = true;
                }
            });
        });
    }

    displayChangeSelectedPaymentDialogComponent(): void {
        const dialog: MatDialogRef<ChangeSelectedPaymentDialogComponent> = this.dialog.open(ChangeSelectedPaymentDialogComponent, {
            autoFocus: false,
            data: this.allPaymentMethods
        });

        dialog.afterClosed().subscribe((closeResult: any) => {
            if (closeResult === 'add') {
                this.displayAddCreditCardDialogComponent();
            } else if (closeResult && closeResult.paymentMethod) {
                this.setSelectedPayment(closeResult);
            }
        });
    }

    displayAddCreditCardDialogComponent(): void {
        const dialog: MatDialogRef<AddCreditCardDialogComponent> = this.dialog.open(AddCreditCardDialogComponent, {
            autoFocus: false
        });

        dialog.afterClosed().subscribe((creditCard: CreditCard) => {
            if (creditCard) {
                this.setSelectedPayment(creditCard);
            }
        });
    }

    setSelectedPayment(payment: Payment): void {
        if (!payment) {
            this.setDefaultPayment();
        } else {
            this.selectedPayment = payment;
            this.emitPaymentChange(payment);
        }
    }

    setDefaultPayment(): void {
        const defaultPayment: any = {
            paymentMethod: this.allPaymentMethods[0],
            id: PaymentMethodEnum.Default
        };

        this.emitPaymentChange(defaultPayment);
    }

    submitPayment(): void {
        this.paymentMethods.submitDropinForm();
    }

    emitPaymentChange(payment: Payment): void {
        this.checkoutService._checkoutPayment.next(payment);
    }
}
