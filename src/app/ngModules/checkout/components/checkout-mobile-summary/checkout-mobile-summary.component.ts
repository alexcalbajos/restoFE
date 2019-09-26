import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime } from 'rxjs/operators';

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
    CheckoutValidationResponse
} from '../../../../models/checkout/checkout-validation-response.model';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';
import {
    CheckoutCartDialogComponent
} from '../checkout-cart-dialog/checkout-cart-dialog.component';

@Component({
    selector: 'ri-checkout-mobile-summary',
    templateUrl: './checkout-mobile-summary.component.html',
    styleUrls: ['./checkout-mobile-summary.component.scss']
})
export class CheckoutMobileSummaryComponent implements OnInit, OnDestroy {
    dataLoaded: boolean;
    automaticValidationResponse: CheckoutValidationResponse;
    @Output() readonly validateCart: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private dialog: MatDialog,
        private checkoutService: CheckoutService) { }

    ngOnInit(): void {
        this.checkoutService.automaticValidationResponse$.pipe(untilDestroyed(this))
            .subscribe((automaticValidationResponse: CheckoutValidationResponse) => {
                this.automaticValidationResponse = automaticValidationResponse;
            });

        this.checkoutService.dataLoaded$.pipe(untilDestroyed(this)).pipe(debounceTime(500)).subscribe((dataLoaded: boolean) => {
            this.dataLoaded = dataLoaded;
        });

        this.checkoutService.setDataLoadedTimeout();
    }

    ngOnDestroy(): void {
        clearInterval(this.checkoutService.dataLoadedInterval);
    }

    onValidateCart(): void {
        this.validateCart.emit();
    }

    viewCart(): void {
        this.dialog.open(CheckoutCartDialogComponent, {
            autoFocus: false,
            panelClass: 'mobile',
            data: this.automaticValidationResponse
        });
    }
}
