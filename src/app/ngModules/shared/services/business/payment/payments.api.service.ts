import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Cart } from '../../../../../models/checkout/cart.model';
import { Code } from '../../../../../models/corporate/code.model';
import { CreditCardsParams } from '../../../../../models/payment/credit-cards-params.model';
import { CreditCard, PaymentMethod } from '../../../../../models/payment/payment.model';
import { GenericResponse } from '../../../../../models/response/generic-response.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';
import { CartService } from '../cart/cart.service';
import { ClientService } from '../client/client.service';
import { SessionAddressService } from '../session-address/session-address.service';
import { PaymentsService } from './payments.service';

@Injectable()
export class PaymentsApiService {
    constructor(
        private paymentService: PaymentsService,
        private sessionAddressService: SessionAddressService,
        private clientService: ClientService,
        private cartService: CartService,
        private http: HttpWrapperService) { }

    getPaymentMethods(): Observable<Array<PaymentMethod>> {
        const url: string = `cities/${this.sessionAddressService._sessionAddress.getValue().deliveryCity.id}/paymentmethods.json`;

        const cart: Cart = this.cartService._cart.getValue();
        const isMultiOrder: number = cart.isMultiOrder ? 1 : 0;

        const params: HttpParams = new HttpParams()
            .set('clientId', this.clientService._client.getValue().id.toString())
            .set('isMultiorder', isMultiOrder.toString());

        return this.http.get(url, params)
            .pipe(map((paymentMetods: Array<PaymentMethod>) => {
                paymentMetods.forEach((paymentMethod: PaymentMethod) => {
                    this.paymentService.mapPaymentMethod(paymentMethod);
                });

                return paymentMetods;
            }));
    }

    getLastPaymentMethod(): Observable<PaymentMethod> {
        const params: HttpParams = new HttpParams()
            .set('clientId', this.clientService._client.getValue().id.toString());

        return this.http.get('paymentMethod/last.json', params, true)
            .pipe(map((response: GenericResponse) => {
                if (response.data) {
                    this.paymentService.mapPaymentMethod(response.data);

                    return response.data;
                }
            }));
    }

    getLatestCreditCard(): Observable<CreditCard> {
        const params: HttpParams = new HttpParams()
            .set('clientId', this.clientService._client.getValue().id.toString());

        return this.http.get('creditCard/last.json', params)
            .pipe(map((lastCreditCard: CreditCard) => {
                if (!lastCreditCard) return;

                this.paymentService.mapCreditCard(lastCreditCard);

                return lastCreditCard;
            }));
    }

    getAllCreditCards(): Observable<Array<CreditCard>> {
        return this.http.get(`clients/${this.clientService._client.getValue().id}/creditcards.json`)
            .pipe(map((creditCardsFromResponse: Array<CreditCard>) => {
                const creditCards: Array<CreditCard> = creditCardsFromResponse ? creditCardsFromResponse : [];

                creditCards.forEach((creditCard: CreditCard) => {
                    this.paymentService.mapCreditCard(creditCard);
                });

                return creditCards;
            }));
    }

    getBraintreeToken(): Observable<string> {
        const params: HttpParams = new HttpParams()
            .set('countryId', this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.id.toString());

        return this.http.get('braintree/token.json', params);
    }

    add(params: CreditCardsParams): Observable<GenericResponse> {
        return this.http.post(`clients/${this.clientService._client.getValue().id}/creditcards.json`, params, true)
            .pipe(map((response: GenericResponse) => {
                if (response.data) {
                    this.paymentService.mapCreditCard(response.data);
                }

                return response;
            }));
    }

    delete(cardId: number): Observable<any> {
        return this.http.delete(`clients/${this.clientService._client.getValue().id}/creditcards/${cardId}.json`);
    }

    getNonce(cardId: number): Observable<string> {
        const url: string = `clients/${this.clientService._client.getValue().id}/creditcards/${cardId}/nonce.json`;

        return this.http.get(url);
    }

    updateNonce(cardId: number, newNonce: string): Observable<any> {
        const url: string = `clients/${this.clientService._client.getValue().id}/creditcards/${cardId}/nonces/${newNonce}.json`;

        return this.http.post(url);
    }

    getCorporateCodes(): Observable<Array<Code>> {
        const url: string = `codes/${this.clientService._client.getValue().id}/list.json`;

        return this.http.get(url, undefined, true)
            .pipe(map((response: GenericResponse) => {
                if (response.data && response.data.codes) {
                    return response.data.codes;
                }
            }));
    }
}
