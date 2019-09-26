import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CreditCard } from '../../../../models/payment/payment.model';
import {
    AddCreditCardDialogComponent
} from '../../../shared/components/add-credit-card-dialog/add-credit-card-dialog.component';
import { PaymentsApiService } from '../../../shared/services/business/payment/payments.api.service';

@Component({
    selector: 'ri-client-credit-cards',
    templateUrl: 'client-credit-cards.component.html',
    styleUrls: ['client-credit-cards.component.scss']
})
export class ClientCreditCardsComponent implements OnInit {
    creditCards: Array<CreditCard>;
    dataLoaded: boolean;

    constructor(
        private dialog: MatDialog,
        private paymentsApiService: PaymentsApiService) { }

    ngOnInit(): void {
        this.getAllCards();
    }

    add(): void {
        const dialog: MatDialogRef<AddCreditCardDialogComponent> = this.dialog.open(AddCreditCardDialogComponent, {
            autoFocus: false
        });

        dialog.afterClosed().subscribe((creditCard: CreditCard) => {
            if (creditCard) {
                this.getAllCards();
            }
        });
    }

    getAllCards(): void {
        this.dataLoaded = false;
        this.paymentsApiService.getAllCreditCards().subscribe((creditCards: Array<CreditCard>) => {
            this.creditCards = creditCards;
            this.dataLoaded = true;
        });
    }
}
