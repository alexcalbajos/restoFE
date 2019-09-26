import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PaymentMethod } from '../../../../models/payment/payment.model';

@Component({
    selector: 'ri-change-selected-payment-dialog',
    templateUrl: 'change-selected-payment-dialog.component.html',
    styleUrls: ['change-selected-payment-dialog.component.scss']
})
export class ChangeSelectedPaymentDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ChangeSelectedPaymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public allPaymentMethods: Array<PaymentMethod>) { }
}
