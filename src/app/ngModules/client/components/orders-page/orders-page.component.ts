import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';

import {
    AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren
} from '@angular/core';
import { MediaChange } from '@angular/flex-layout';

import { MqAlias } from '../../../../enums/media-query-alias.enum';
import { Order } from '../../../../models/order/order.model';
import { OrdersApiService } from '../../../shared/services/business/orders/orders.api.service';
import { MediaQueryService } from '../../../shared/services/helpers/media-query.service';
import { MetaService } from '../../../shared/services/helpers/meta.service';
import { OrderBoxComponent } from '../order-box/order-box.component';

@Component({
    selector: 'ri-orders-page',
    templateUrl: 'orders-page.component.html',
    styleUrls: ['orders-page.component.scss']
})
export class OrdersPageComponent implements OnInit, AfterViewInit, OnDestroy {
    orders: Array<Order> = [];
    currentPage: number = 1;
    allPages: number;
    dataLoaded: boolean;
    selectedOrder: Order;
    mediaChange: MediaChange;
    @ViewChildren('orderBoxComponents') orderBoxComponents: QueryList<OrderBoxComponent>;

    constructor(
        private metaService: MetaService,
        private mediaQueryService: MediaQueryService,
        private ordersApiService: OrdersApiService) { }

    ngOnInit(): void {
        this.metaService.setMeta({
            title: 'MY_ORDERS',
            description: 'MY_ORDERS_DESCRIPTION'
        });

        this.mediaQueryService.mediaChange$.pipe(untilDestroyed(this)).subscribe((mediaChange: MediaChange) => {
            this.mediaChange = mediaChange;
        });
    }

    ngAfterViewInit(): void {
        this.getOrders();
    }

    ngOnDestroy(): void {/**/ }

    onScroll(): void {
        if ((this.currentPage + 1) <= this.allPages) {
            this.currentPage++;
            this.getOrders();
        }
    }

    viewDetails(actionIndex: number): void {
        this.orderBoxComponents.forEach((orderBoxComponent: OrderBoxComponent, index: number) => {
            if (actionIndex === index) {
                orderBoxComponent.viewDetails();
            }
        });
    }

    orderDelivered(order: Order): void {
        _.find(this.orders, { id: order.id }).client_side_status = order.client_side_status;
        this.orders = _.cloneDeep(this.orders);
    }

    private getOrders(): void {
        this.ordersApiService.getAll(this.currentPage).subscribe((responseData: any) => {
            this.orders = this.orders.concat(responseData.orders);
            this.allPages = responseData.pageCount;
            this.setOrdersPageHeight();
            this.dataLoaded = true;
            this.openFirstOrder();
        });
    }

    private openFirstOrder(): void {
        if (this.currentPage === 1 && this.orders.length && this.mediaChange.value >= MqAlias.Md) {
            setTimeout(() => {
                if (this.orderBoxComponents.first) {
                    this.orderBoxComponents.first.viewDetails();
                }
            });
        }
    }

    private setOrdersPageHeight(): void {
        const minHeight: string = this.orders.length ? '100vh' : '35vh';
        const ordersPage: HTMLElement = (document.querySelector('ri-orders-page') as HTMLElement);

        if (ordersPage) {
            ordersPage.style.minHeight = minHeight;
        }
    }
}
