import * as _ from 'lodash';

import { Component, Input, OnInit } from '@angular/core';

import { OrderAmount } from '../../../../models/corporate/order-amount.model';

@Component({
    selector: 'ri-corporate-client-order-amount-table',
    templateUrl: 'corporate-client-order-amount-table.component.html',
    styleUrls: ['corporate-client-order-amount-table.component.scss']
})
export class CorporateClientOrderAmountTableComponent implements OnInit {
    @Input() selectedOrderAmounts: string;

    orderAmounts: Array<OrderAmount> = [
        { day: 'WEEKDAY_MONDAY' },
        { day: 'WEEKDAY_TUESDAY' },
        { day: 'WEEKDAY_WEDNESDAY' },
        { day: 'WEEKDAY_THURSDAY' },
        { day: 'WEEKDAY_FRIDAY' },
        { day: 'WEEKDAY_SATURDAY' },
        { day: 'WEEKDAY_SUNDAY' }
    ];

    ngOnInit(): void {
        if (this.selectedOrderAmounts) {
            this.getOrderAmountsFromApiOrderAmounts();
        }
    }

    getOrderAmountsFromApiOrderAmounts(): void {
        _.values(JSON.parse(this.selectedOrderAmounts)).forEach((selectedOrderAmount: any, index: number) => {
            this.orderAmounts[index].limit = selectedOrderAmount.limit;
            this.orderAmounts[index].orders = selectedOrderAmount.orders;
        });
    }

    getApiOrderAmountsFromOrderAmounts(): string {
        const apiOrderAmounts: Array<string> = [];

        this.orderAmounts.forEach((orderAmount: OrderAmount, index: number) => {
            const apiOrderAmount: OrderAmount = {
                orders: orderAmount.orders,
                limit: orderAmount.limit
            };

            apiOrderAmounts.push(`"${index + 1}":${JSON.stringify(apiOrderAmount)}`);
        });

        return `{${apiOrderAmounts.join(',')}}`;
    }
}
