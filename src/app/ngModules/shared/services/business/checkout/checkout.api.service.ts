import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import {
    CheckoutValidationParams
} from '../../../../../models/checkout/checkout-validation-params.model';
import {
    CheckoutValidationResponse
} from '../../../../../models/checkout/checkout-validation-response.model';
import { GenericResponse } from '../../../../../models/response/generic-response.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';

@Injectable()
export class CheckoutApiService {
    constructor(private http: HttpWrapperService) { }

    validate(checkoutValidationParams: CheckoutValidationParams): Observable<CheckoutValidationResponse> {
        return this.http.post('orders/validations.json', { order: JSON.stringify(checkoutValidationParams) }, true)
            .pipe(map((response: GenericResponse) => {
                if (response.data) {
                    return response.data.validation;
                }
            }));
    }
}
