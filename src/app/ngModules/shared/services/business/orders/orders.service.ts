import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Order, OrderDetail } from '../../../../../models/order/order.model';
import { BingTagService } from '../../helpers/bing-tag.service';
import { GooglAnalyticsService } from '../../helpers/google-analytics.service';
import { YahooTagService } from '../../helpers/yahoo-tag.service';
import { CartService } from '../cart/cart.service';
import { OrdersApiService } from './orders.api.service';

@Injectable()
export class OrdersService {
    constructor(
        private cartService: CartService,
        private router: Router,
        private googlAnalyticsService: GooglAnalyticsService,
        private yahooTagService: YahooTagService,
        private bingTagService: BingTagService,
        private ordersApiService: OrdersApiService) { }

    orderCompleted(orderId: any, orderTotal: number): void {
        this.trackOrder(orderId);
        this.cartService.clearCart();
        this.router.navigateByUrl('/client/orders');
        this.googlAnalyticsService.pushEvent('CreditSpent');
        this.yahooTagService.confirmedConversion();
        this.bingTagService.confirmedConversion(orderTotal);
    }

    trackOrder(orderId: number): void {
        this.ordersApiService.isMultiorder(orderId).subscribe((response: any) => {
            if (response.errors) return;

            if (response.isMultiorder) {
                this.ordersApiService.getMultiorder(orderId).subscribe((multiorder: Array<Order>) => {
                    multiorder.forEach((order: Order) => {
                        this.sendTrackingData(order);
                    });
                });
            } else {
                this.ordersApiService.get(orderId).subscribe((order: Order) => {
                    this.sendTrackingData(order);
                });
            }
        });
    }

    sendTrackingData(order: Order): void {
        let deliveryPrice: number = 0;
        const dataProducts: any = [];
        const productCategoryId: number = order.provider.id;

        order.details.forEach((detail: OrderDetail) => {
            if (detail.product.id === 0) {
                deliveryPrice = detail.price;
            } else {
                const product: any = {
                    sku: detail.product.id,
                    name: detail.product_name,
                    category: productCategoryId,
                    price: detail.price,
                    quantity: detail.quantity
                };

                dataProducts.push(product);
            }
        });

        const trackingData: any = {
            transactionId: order.id,
            paymentType: order.payment_type.id,
            transactionAffiliation: 'Resto-in',
            transactionTotal: order.total_ft,
            transactionTax: order.vat,
            transactionShipping: deliveryPrice,
            transactionProducts: dataProducts
        };

        this.googlAnalyticsService.pushObject(trackingData);
        this.googlAnalyticsService.sendDataLayer();
        this.googlAnalyticsService.pushEvent('confirmation');
    }
}
