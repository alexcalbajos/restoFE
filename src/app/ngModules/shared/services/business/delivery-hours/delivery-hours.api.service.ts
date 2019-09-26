import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DeliveryDay } from '../../../../../models/provider/delivery-day.model';
import { DeliveryDaysParams } from '../../../../../models/provider/delivery-days-params.model';
import { GenericResponse } from '../../../../../models/response/generic-response.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';
import { DeliveryHoursService } from './delivery-hours.service';

@Injectable()
export class DeliveryHoursApiService {
    constructor(
        private http: HttpWrapperService,
        private deliveryHoursService: DeliveryHoursService) { }

    getAll(deliveryDaysParams: DeliveryDaysParams): Observable<Array<DeliveryDay>> {
        const url: string = `providers/${deliveryDaysParams.providerId}/deliverytime.json`;
        const params: HttpParams = new HttpParams()
            .set('clientId', deliveryDaysParams.clientId.toString())
            .set('isTakeaway', '0')
            .set('lat', deliveryDaysParams.lat.toString())
            .set('lng', deliveryDaysParams.lng.toString())
            .set('orderTotal', deliveryDaysParams.total.toString());

        return this.http.get(url, params, true).pipe(map((deliveryTimeResponse: GenericResponse) => {
            if (deliveryTimeResponse.errors || !deliveryTimeResponse.data.length) {
                return [];
            }

            return this.deliveryHoursService.mapDeliveryDays(deliveryTimeResponse);
        }));
    }
}
