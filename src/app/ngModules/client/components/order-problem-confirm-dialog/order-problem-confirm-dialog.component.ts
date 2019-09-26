import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Client } from '../../../../models/client/client.model';
import { ClientService } from '../../../shared/services/business/client/client.service';
import { ZopimService } from '../../../shared/services/helpers/zopim.service';

@Component({
    selector: 'ri-order-problem-confirm-dialog',
    templateUrl: 'order-problem-confirm-dialog.component.html',
    styleUrls: ['order-problem-confirm-dialog.component.scss']
})
export class OrderProblemConfirmDialogComponent implements OnInit {
    phoneNumber: string;

    constructor(
        private clientService: ClientService,
        public zopimService: ZopimService,
        public dialogRef: MatDialogRef<OrderProblemConfirmDialogComponent>) { }

    ngOnInit(): void {
        const client: Client = this.clientService._client.getValue();

        if (client && client.phone) {
            this.phoneNumber = client.phone;
        }
    }
}
