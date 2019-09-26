import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MessageType } from '../../../../../enums/message-type.enum';
import {
    CheckoutValidationParams
} from '../../../../../models/checkout/checkout-validation-params.model';
import { Order } from '../../../../../models/order/order.model';
import { GenericResponse } from '../../../../../models/response/generic-response.model';
import { DatesHelperService } from '../../helpers/dates-helper.service';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';
import { LoggerService } from '../../helpers/logger.service';
import { ClientService } from '../client/client.service';

@Injectable()
export class OrdersApiService {
    private lastExecutionTime: number;
    constructor(
        private loggerService: LoggerService,
        private http: HttpWrapperService,
        private datesHelperService: DatesHelperService,
        private clientService: ClientService) { }

    getAll(page: number): Observable<any> {
        const url: string = `clients/${this.clientService._client.getValue().id}/orders.json`;
        const params: HttpParams = new HttpParams()
            .set('page', page.toString());

        return this.http.get(url, params).pipe(map((responseData: any) => {
            _.remove(responseData.orders, { is_blocked: true });
            responseData.orders.forEach((order: Order) => {
                this.mapOrder(order);
            });

            return responseData;
        }));
    }

    get(orderId: number): Observable<Order> {
        const url: string = `clients/${this.clientService._client.getValue().id}/orders/${orderId}.json`;

        return this.http.get(url).pipe(map((order: Order) => {
            this.mapOrder(order);

            return order;
        }));
    }

    getFromTracking(orderId: number): Observable<Order> {
        const url: string = `clients/${this.clientService._client.getValue().id}/orders/${orderId}/tracking.json`;

        return this.http.get(url).pipe(map((order: Order) => {
            this.mapOrder(order);

            return order;
        }));
    }

    getMultiorder(orderId: number): Observable<Array<Order>> {
        const url: string = `clients/${this.clientService._client.getValue().id}/orders/${orderId}/multiorder.json`;

        return this.http.get(url);
    }

    add(checkoutValidationParams: CheckoutValidationParams, extraHeader?: { key: string, value: string }): Observable<GenericResponse> {
        const currentTime: number = new Date().getTime();

        if (!this.lastExecutionTime ||
            currentTime > this.lastExecutionTime + 5000) {
            this.lastExecutionTime = currentTime;

            return this.http.post('orders.json', { order: JSON.stringify(checkoutValidationParams) }, true, extraHeader)
                .pipe(map((response: GenericResponse) => {
                    if (response.data) {
                        this.loggerService.log(`New Order ${response.data.id}`, MessageType.Warning, true);
                    }

                    return response;
                }));
        }

        return of({});
    }

    confirmPaypal(locale: string, token: string): Observable<GenericResponse> {
        const url: string = 'paypal/complete.json';
        const params: HttpParams = new HttpParams()
            .set('_format', 'json')
            .set('locale', locale)
            .set('token', token);

        return this.http.get(url, params, true);
    }

    addRating(orderId: number, comments: string, note: number): Observable<GenericResponse> {
        const url: string = `clients/${this.clientService._client.getValue().id}/orders/${orderId}/ratings.json`;

        return this.http.post(url, { comments, note }, true);
    }

    isMultiorder(orderId: number): Observable<any> {
        const url: string = `orders/${orderId}/isMultiorder.json`;

        return this.http.get(url, undefined, true);
    }

    private mapOrder(order: Order): void {
        this.datesHelperService.clearInvalidDate(order, 'deliverytime');
        this.datesHelperService.clearInvalidDate(order, 'datetime');
        this.datesHelperService.clearInvalidDate(order, 'delivered');
    }
}
