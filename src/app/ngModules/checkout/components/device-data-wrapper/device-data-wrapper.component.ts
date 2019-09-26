import { untilDestroyed } from 'ngx-take-until-destroy';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';
import { PaymentsApiService } from '../../../shared/services/business/payment/payments.api.service';
import { BraintreeService } from '../../../shared/services/helpers/braintree.service';

@Component({
    selector: 'ri-device-data-wrapper',
    templateUrl: 'device-data-wrapper.component.html',
    styleUrls: ['device-data-wrapper.component.scss']
})
export class DeviceDataWrapperComponent implements OnInit, OnDestroy {
    constructor(
        private checkoutService: CheckoutService,
        private paymentsApiService: PaymentsApiService,
        private braintreeService: BraintreeService) { }
    ngOnInit(): void {
        this.paymentsApiService.getBraintreeToken().subscribe((braintreeToken: string) => {
            this.braintreeService.getDeviceData(braintreeToken).pipe(untilDestroyed(this)).subscribe((deviceData: string) => {
                this.checkoutService._checkout.getValue().deviceData = deviceData;
            });
        });
    }

    ngOnDestroy(): void {/**/ }
}
