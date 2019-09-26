import { Component, Input } from '@angular/core';

import { OrderAmount } from '../../../../models/corporate/order-amount.model';

@Component({
    selector: 'ri-corporate-client-order-amount-row',
    templateUrl: 'corporate-client-order-amount-row.component.html',
    styleUrls: ['corporate-client-order-amount-row.component.scss']
})
export class CorporateClientOrderAmountRowComponent {
    @Input() orderAmount: OrderAmount;
}
