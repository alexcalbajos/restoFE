import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MessageType } from '../../../../enums/message-type.enum';
import { ConfirmDialogData } from '../../../../models/dialogs/confirm-dialog-data.model';
import { CreditCard } from '../../../../models/payment/payment.model';
import { PaymentsApiService } from '../../../shared/services/business/payment/payments.api.service';
import { ToasterWrapperService } from '../../services/helpers/toaster-wrapper.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'ri-credit-card-box',
    templateUrl: 'credit-card-box.component.html',
    styleUrls: ['credit-card-box.component.scss']
})
export class CreditCardBoxComponent {
    @Input() creditCard: CreditCard;
    @Input() allowDelete: boolean;
    @Output() readonly creditCardDeleted: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private toasterWrapperService: ToasterWrapperService,
        private dialog: MatDialog,
        private paymentsApiService: PaymentsApiService) { }

    delete(): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: ['DELETE_CONFIRMATION_NEW'],
            descriptionLinesTranslationParam: [{ item: this.creditCard.four_digits }],
            showSecondAction: true
        };

        const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe((accept: ConfirmDialogComponent) => {
            if (accept) {
                this.paymentsApiService.delete(this.creditCard.id)
                    .subscribe(() => {
                        this.creditCardDeleted.emit();
                        this.toasterWrapperService.show('CARD_DELETED', MessageType.Success);
                    });
            }
        });
    }
}
