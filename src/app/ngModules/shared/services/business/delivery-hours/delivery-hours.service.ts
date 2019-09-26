import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DeliveryDay } from '../../../../../models/provider/delivery-day.model';
import { GenericResponse } from '../../../../../models/response/generic-response.model';
import { SessionAddressService } from '../session-address/session-address.service';

@Injectable()
export class DeliveryHoursService {

    constructor(
        private translateService: TranslateService,
        private sessionAddressService: SessionAddressService) { }

    mapDeliveryDays(deliveryTimeResponse: GenericResponse): Array<DeliveryDay> {
        const deliveryDays: object = {};

        const countryCode: string = this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code;
        const locale: string = `${countryCode}-${countryCode.toUpperCase()}`;

        deliveryTimeResponse.data.forEach((pairFromResponse: string) => {
            const dateFromResponse: string = pairFromResponse.split('T')[0];
            const timeElementsFromResponse: Array<string> = pairFromResponse.split('T')[1].split(':');
            const timeFromResponse: string = `${timeElementsFromResponse[0]}:${timeElementsFromResponse[1]}`;
            if (!deliveryDays[dateFromResponse]) {
                const dt: Date = new Date(dateFromResponse);
                const weekday: string = dt.toLocaleDateString('en-EN', { weekday: 'long' }).toUpperCase();
                const date: string = dt.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
                deliveryDays[dateFromResponse] =
                    ({
                        weekdayKey: weekday,
                        date,
                        hours: [{ id: 0, time: timeFromResponse, initialPariFromResponse: pairFromResponse }]
                    });
            } else {
                deliveryDays[dateFromResponse].hours.push({
                    id: deliveryDays[dateFromResponse].hours.length,
                    time: timeFromResponse,
                    initialPariFromResponse: pairFromResponse
                });
            }
        });
        const orderedDeliveryDays: Array<DeliveryDay> = _.values(deliveryDays);

        orderedDeliveryDays.sort((a: DeliveryDay, b: DeliveryDay) =>
            new Date(a.hours[0].initialPariFromResponse).getTime() -
            new Date(b.hours[0].initialPariFromResponse).getTime()
        );

        const todayString: string = new Date().toLocaleDateString(locale, { month: '2-digit', day: '2-digit' });

        const tomorrow: Date = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tommorrowString: string = tomorrow.toLocaleDateString(locale, { month: '2-digit', day: '2-digit' });

        orderedDeliveryDays.forEach((deliveryDay: DeliveryDay, index: number) => {
            const deliveryDayString: string = new Date(deliveryDay.hours[0].initialPariFromResponse)
                .toLocaleDateString(locale, { month: '2-digit', day: '2-digit' });

            if (todayString === deliveryDayString) {
                orderedDeliveryDays[index].weekdayKey = 'TODAY';
            } else if (tommorrowString === deliveryDayString) {
                orderedDeliveryDays[index].weekdayKey = 'TOMORROW';
            }
        });

        this.setWeekdayTranslation(orderedDeliveryDays);

        return orderedDeliveryDays;
    }

    setWeekdayTranslation(deliveryDays: Array<DeliveryDay>): void {
        deliveryDays.forEach((deliveryDay: DeliveryDay) => {
            if (!deliveryDay.weekdayKey) return;

            this.translateService.get(deliveryDay.weekdayKey).subscribe((result: string) => {
                (deliveryDay.weekdayKey === 'TODAY' || deliveryDay.weekdayKey === 'TOMORROW') ?
                    deliveryDay.weekday = result :
                    deliveryDay.weekday = `${result} ${deliveryDay.date}`;
            });
        });
    }
}
