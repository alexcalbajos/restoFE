import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderStatus } from '../../enums/order-status.enum';
import { Order } from '../../models/order/order.model';

@Component({
    selector: 'ri-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
    orderId: number;
    mapHeight: string;
    status: string;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        if (this.activatedRoute.snapshot.params.orderId) {
            this.mapHeight = `${window.innerHeight - (document.querySelector('ri-header') as HTMLElement).offsetHeight}px`;
            this.orderId = this.activatedRoute.snapshot.params.orderId;
        } else {
            this.router.navigateByUrl('/');
        }
    }

    statusChanged(order: Order): void {
        this.status = OrderStatus[order.client_side_status];
    }
}
