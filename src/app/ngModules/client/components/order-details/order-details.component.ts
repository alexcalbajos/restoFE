import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { environment } from '../../../../../environments/environment';
import { OrderStatus } from '../../../../enums/order-status.enum';
import { DeliveryMan, Order } from '../../../../models/order/order.model';
import { AgmMapComponent } from '../../../shared/components/agm-map/agm-map.component';
import {
    OrderProblemConfirmDialogComponent
} from '../order-problem-confirm-dialog/order-problem-confirm-dialog.component';
import {
    OrderProblemDialogComponent
} from '../order-problem-dialog/order-problem-dialog.component';

@Component({
    selector: 'ri-order-details',
    templateUrl: 'order-details.component.html',
    styleUrls: ['order-details.component.scss']
})
export class OrderDetailsComponent implements OnChanges {
    @Input() order: Order;
    @Output() readonly orderDelivered: EventEmitter<Order> = new EventEmitter<Order>();
    status: string;
    statusParams: any;

    @ViewChild('map') agmMap: AgmMapComponent;

    constructor(
        private dialog: MatDialog) { }

    ngOnChanges(): void {
        if (this.agmMap) {
            this.agmMap.orderId = this.order.id;
            this.agmMap.checkOrder();
        }
    }

    getBill(): void {
        window.open(`https://${environment.domain}${this.order.url_delivery_note}`);
    }

    isDelivered(): boolean {
        return this.order.client_side_status === OrderStatus.Delivered;
    }

    newStatus(order: Order): void {
        this.order = order;

        this.status = undefined;
        this.statusParams = undefined;

        switch (this.order.client_side_status) {
            case OrderStatus.Preorder:
                this.status = 'PREORDER_TEXT';
                this.statusParams = { providerName: this.order.selling_point.provider.name };
                break;
            case OrderStatus.SearchingDriver:
                this.status = 'SEARCHING_DRIVER_TEXT';
                break;
            case OrderStatus.PickingOrder:
                this.status = 'PICKING_DRIVER_TEXT';
                this.statusParams = { deliveryMan: this.getDeliveryManName(this.order.delivery_men_id) };
                break;
            case OrderStatus.Delivering:
                this.status = 'DELIVERING_TEXT';
                this.statusParams = {
                    providerName: this.order.selling_point.provider.name,
                    deliveryMan: this.getDeliveryManName(this.order.delivery_men_id)
                };
                break;
            case OrderStatus.Delivered:
                this.status = 'DELIVERED_TEXT';
                this.orderDelivered.emit(this.order);
                break;
            default:
                return;
        }
    }

    signalProblem(): void {
        const dialog: MatDialogRef<OrderProblemDialogComponent> = this.dialog.open(OrderProblemDialogComponent, {
            autoFocus: false,
            data: this.order.id
        });

        dialog.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.dialog.open(OrderProblemConfirmDialogComponent, {
                    autoFocus: false
                });
            }
        });
    }

    private getDeliveryManName(deliveryMan: DeliveryMan): string {
        if (deliveryMan && deliveryMan.first_name) {
            return deliveryMan.first_name;
        }

        return undefined;
    }
}
