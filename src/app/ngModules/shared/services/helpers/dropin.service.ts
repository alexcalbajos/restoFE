import * as dropin from 'braintree-web-drop-in';
import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { PaymentsService } from '../business/payment/payments.service';
import { SessionAddressService } from '../business/session-address/session-address.service';

@Injectable()
export class DropinService {
    stopCreation: boolean;

    constructor(
        private sessionAddressService: SessionAddressService,
        private payments: PaymentsService) { }

    getDropinInstance(containerId: string, authorization: string): Observable<any> {
        const container: HTMLElement = document.getElementById(containerId);

        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }

        const _dropinInstance: Subject<any> = new Subject<any>();

        const countryCode: string = this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code;
        const locale: string = `${countryCode}_${countryCode.toUpperCase()}`;

        dropin.create({
            authorization,
            selector: `#${containerId}`,
            locale,
            dataCollector: {
                kount: true
            }
        }, (creationError: any, dropinInstance: any) => {
            if (this.stopCreation) {
                this.stopCreation = false;

                return;
            }

            if (creationError) {
                throw (creationError);
            }

            _dropinInstance.next(dropinInstance);
        });

        return _dropinInstance.asObservable();
    }

    getDropinPaymentMethod(dropinInstance: any): Observable<any> {
        const _paymentSubject: Subject<any> = new Subject<any>();

        dropinInstance.requestPaymentMethod((error: any, payload: any) => {
            if (error) {
                _paymentSubject.next({ error });

                return;
            }

            payload.deviceData = this.payments.prepareDeviceData(payload.deviceData);
            _paymentSubject.next(payload);
        });

        return _paymentSubject.asObservable();
    }
}
