import { Component, HostBinding, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Order } from '../../../../models/order/order.model';

@Component({
    selector: 'ri-order-details-dialog',
    templateUrl: './order-details-dialog.component.html',
    styleUrls: ['./order-details-dialog.component.scss']
})
export class OrderDetailsDialogComponent {
    @HostBinding('class') class: string = 'mobile-component';

    constructor(
        @Inject(MAT_DIALOG_DATA) public order: Order,
        public dialogRef: MatDialogRef<OrderDetailsDialogComponent>) { }

    orderDelivered(order: Order): void {
        this.dialogRef.close(order.client_side_status);
    }
}
