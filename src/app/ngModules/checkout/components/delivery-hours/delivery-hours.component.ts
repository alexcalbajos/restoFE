import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BaseAddress } from '../../../../models/address/address.model';
import { Cart } from '../../../../models/checkout/cart.model';
import { DeliveryDay, DeliveryHour } from '../../../../models/provider/delivery-day.model';
import { DeliveryDaysParams } from '../../../../models/provider/delivery-days-params.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    DeliveryHoursApiService
} from '../../../shared/services/business/delivery-hours/delivery-hours.api.service';
import {
    ChangeDeliveryHoursDialogComponent
} from '../change-delivery-hours-dialog/change-delivery-hours-dialog.component';

@Component({
    selector: 'ri-delivery-hours',
    templateUrl: 'delivery-hours.component.html',
    styleUrls: ['delivery-hours.component.scss']
})
export class DeliveryHoursComponent implements OnInit, OnDestroy {
    selectedDeliveryMoment: number = 0;
    deliveryDays: Array<DeliveryDay>;
    selectedyDay: DeliveryDay;
    selectedHour: DeliveryHour;
    address: string;

    constructor(
        private dialog: MatDialog,
        private clientService: ClientService,
        private deliveryHoursApiService: DeliveryHoursApiService,
        private cartService: CartService,
        private checkoutService: CheckoutService) { }

    ngOnInit(): void {
        combineLatest(this.cartService.cart$, this.checkoutService.checkoutAddress$)
            .pipe(untilDestroyed(this))
            .pipe(filter((data: any) => data[0].provider && data[1]))
            .pipe(debounceTime(500))
            .subscribe((data: any) => {
                const cart: Cart = data[0];
                const address: BaseAddress = data[1];

                this.address = address.address;

                this.deliveryHoursApiService.getAll(this.getRequestParams(cart, address))
                    .subscribe((deliveryDays: Array<DeliveryDay>) => {
                        this.deliveryDays = deliveryDays;
                        this.emmitDeliveryHour();
                    });
            });
    }

    ngOnDestroy(): void {/**/ }

    emmitDeliveryHour(): void {
        this.checkoutService._checkout.next({ ...this.checkoutService._checkout.getValue(), deliveryHour: this.getDeliveryHour() });
    }

    selectSpecificDeliveryTime(): void {
        const dialog: MatDialogRef<ChangeDeliveryHoursDialogComponent> = this.dialog.open(ChangeDeliveryHoursDialogComponent, {
            data: {
                deliveryDays: this.deliveryDays, selectedDay: this.selectedyDay, selectedHour: this.selectedHour
            },
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialog.afterClosed().subscribe((result: any) => {
            if (result && result.deliveryDay && result.deliveryHour) {
                this.selectedyDay = result.deliveryDay;
                this.selectedHour = result.deliveryHour;
            }

            this.emmitDeliveryHour();
        });
    }

    private getDeliveryHour(): DeliveryHour {
        if (this.deliveryDays.length < 1) {
            this.selectedDeliveryMoment = 0;

            return undefined;
        }

        if (!this.selectedyDay) {
            this.selectedDeliveryMoment = 0;

            return this.deliveryDays[0].hours[0];
        }

        if (new Date(this.selectedHour.initialPariFromResponse) < new Date(this.deliveryDays[0].hours[0].initialPariFromResponse)) {
            this.selectedDeliveryMoment = 0;

            this.selectedyDay = undefined;
            this.selectedHour = undefined;

            return this.deliveryDays[0].hours[0];
        }

        this.selectedDeliveryMoment = 1;

        return this.selectedHour;
    }

    private getRequestParams(cart: Cart, address: BaseAddress): DeliveryDaysParams {
        return {
            providerId: cart.provider.id,
            clientId: this.clientService._client.getValue().id,
            lat: address.lat,
            lng: address.lng,
            total: cart.total
        };
    }
}
