import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import {
    NotificationsApiService
} from '../../../shared/services/business/notifications/notifications.api.service';

@Component({
    selector: 'ri-order-problem-dialog',
    templateUrl: 'order-problem-dialog.component.html',
    styleUrls: ['order-problem-dialog.component.scss']
})
export class OrderProblemDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public orderId: any,
        private translateService: TranslateService,
        private notificationsApiService: NotificationsApiService,
        public dialogRef: MatDialogRef<OrderProblemDialogComponent>) { }

    sendProblem(key: string): void {
        this.translateService.get(key).subscribe((problem: string) => {
            this.notificationsApiService.sendProblem(problem, this.orderId).subscribe((response: boolean) => {
                if (response) {
                    this.dialogRef.close(true);
                }
            });
        });
    }
}
