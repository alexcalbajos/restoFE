import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PaymentMethodEnum } from '../../../../../enums/payment-method.enum';
import { BaseAddress } from '../../../../../models/address/address.model';
import { Cart } from '../../../../../models/checkout/cart.model';
import {
    CheckoutValidationParams
} from '../../../../../models/checkout/checkout-validation-params.model';
import {
    CheckoutValidationResponse
} from '../../../../../models/checkout/checkout-validation-response.model';
import { Checkout } from '../../../../../models/checkout/checkout.model';
import { Client } from '../../../../../models/client/client.model';
import { Payment } from '../../../../../models/payment/payment.model';
import { GooglAnalyticsService } from '../../helpers/google-analytics.service';
import { CartService } from '../cart/cart.service';
import { ClientService } from '../client/client.service';
import { PaymentsService } from '../payment/payments.service';
import { ProductService } from '../products/product.service';
import { SessionAddressService } from '../session-address/session-address.service';
import { CheckoutApiService } from './checkout.api.service';

@Injectable()
export class CheckoutService {
    _checkout: BehaviorSubject<Checkout> = new BehaviorSubject<any>({});
    checkout$: Observable<Checkout> = this._checkout.asObservable();
    _checkoutAddress: Subject<BaseAddress> = new Subject<BaseAddress>();
    checkoutAddress$: Observable<BaseAddress> = this._checkoutAddress.asObservable();
    _checkoutPayment: Subject<Payment> = new Subject<Payment>();
    checkoutPayment$: Observable<Payment> = this._checkoutPayment.asObservable();
    _automaticValidationResponse: Subject<CheckoutValidationResponse> = new Subject<any>();
    automaticValidationResponse$: Observable<CheckoutValidationResponse> = this._automaticValidationResponse.asObservable();
    _manualValidationResponse: Subject<CheckoutValidationResponse> = new Subject<any>();
    manualValidationResponse$: Observable<CheckoutValidationResponse> = this._manualValidationResponse.asObservable();
    _dataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    dataLoaded$: Observable<boolean> = this._dataLoaded.asObservable();
    dataLoadedTimeout: any;
    dataLoadedInterval: number = 15000;
    oldPayment: Payment;

    constructor(
        private paymentsService: PaymentsService,
        private sessionAddressService: SessionAddressService,
        private productService: ProductService,
        private cartService: CartService,
        private checkoutApiService: CheckoutApiService,
        private translateService: TranslateService,
        private googlAnalyticsService: GooglAnalyticsService,
        private clientService: ClientService) {
        this.handleCartChanges();
        this.handleAddressChanges();
        this.handlePaymentChanges();
        this.handleCheckoutChanges();
    }

    handleCartChanges(): void {
        this.cartService.cart$.subscribe((cart: Cart) => {
            this._checkout.getValue().cart = cart;
            this._dataLoaded.next(false);
        });
    }

    handleAddressChanges(): void {
        this.checkoutAddress$.subscribe((checkoutAddress: BaseAddress) => {
            if (!checkoutAddress) {
                this._dataLoaded.next(true);
            }

            this._checkout.getValue().address = checkoutAddress;
            this._checkout.getValue().automaticAddressSaveInProgress = false;
        });
    }

    handlePaymentChanges(): void {
        this.checkoutPayment$.subscribe((payment: Payment) => {
            if (!payment.id) {
                this._dataLoaded.next(true);
            }

            this._checkout.getValue().payment = payment;

            if (this._checkout.getValue().automaticPaymentSaveInProgress) {
                this._checkout.getValue().automaticPaymentSaveInProgress = false;
                this._checkout.next(this._checkout.getValue());
            }

            this.listenToPaymentChange(payment);
        });
    }

    handleCheckoutChanges(): void {
        this.checkout$
            .pipe(filter((checkout: Checkout) => this.checkoutHasValidData(checkout)))
            .pipe(debounceTime(500))
            .subscribe((checkout: Checkout) => {
                this._dataLoaded.next(false);

                this.checkoutApiService.validate(this.createCheckoutValidationParams(checkout))
                    .subscribe((checkoutValidationResponse: CheckoutValidationResponse) => {
                        this._automaticValidationResponse.next(checkoutValidationResponse);

                        if (checkout.manualValidationInProgress) {
                            this._manualValidationResponse.next(checkoutValidationResponse);
                        } else {
                            this._dataLoaded.next(true);
                        }

                        this._checkout.getValue().manualValidationInProgress = false;
                    });
            });
    }

    setDataLoadedTimeout(): void {
        this.dataLoaded$.pipe(distinctUntilChanged()).subscribe((dataLoaded: boolean) => {
            if (!dataLoaded) {
                this.dataLoadedTimeout = setTimeout(() => {
                    this._dataLoaded.next(true);
                }, this.dataLoadedInterval);
            } else {
                clearTimeout(this.dataLoadedTimeout);
            }
        });
    }

    createCheckoutValidationParams(checkout: Checkout): CheckoutValidationParams {
        const client: Client = this.clientService._client.getValue();

        const params: CheckoutValidationParams = {
            address: checkout.address,
            clientId: client.id,
            couponCode: checkout.couponCode,
            items: this.productService.prepareProductsForCheckout(checkout.cart),
            locale: `${this.translateService.currentLang}_RI`,
            paymentType: this.paymentsService.preparePaymentForCheckout(checkout),
            providerId: checkout.cart.provider.id,
            walletAmount: checkout.walletAmount,
            delivery: {
                selectedDeliveryTime: checkout.deliveryHour ? checkout.deliveryHour.initialPariFromResponse : undefined
            },
            minOrderAmount: checkout.cart.provider.min_order_amount ?
                checkout.cart.provider.min_order_amount :
                this.sessionAddressService._sessionAddress.getValue().deliveryCity.min_order_amount,
            deviceData: checkout.deviceData ? checkout.deviceData : undefined
        };

        if (checkout.cart.isMultiOrder) {
            params.selectedUsers = _.map(_.filter(client.attached_clients, { checked: true }), 'id');
        }

        return params;
    }

    checkoutHasValidData(checkout: Checkout): boolean {
        return checkout.cart &&
            checkout.cart.provider &&
            !checkout.automaticAddressSaveInProgress &&
            !checkout.automaticPaymentSaveInProgress;
    }

    checkoutHasSelectedAddress(): boolean {
        const address: BaseAddress = this._checkout.getValue().address;

        if (address && address.id) {
            return true;
        } else {
            return false;
        }
    }

    checkoutHasSelectedPayment(): boolean {
        const payment: Payment = this._checkout.getValue().payment;

        if (payment && payment.id === PaymentMethodEnum.Default) {
            return false;
        }

        if (payment && payment.paymentMethod) {
            return true;
        } else {
            return false;
        }
    }

    getCheckoutValidationResponseErrors(manualValidationResponse: CheckoutValidationResponse): Array<string> {
        const errors: Array<string> = [];

        _.values(manualValidationResponse).forEach((validationProp: any) => {
            if (validationProp &&
                validationProp.hasOwnProperty('isValid') &&
                validationProp.hasOwnProperty('error')) {
                errors.push(validationProp.error);
            }
        });

        return errors;
    }

    getOrdersResponseErrors(errorsFromResponse: any): Array<string> {
        const errors: Array<string> = [];

        errorsFromResponse.forEach((errorFromResponse: any) => {
            if (errorFromResponse.message) {
                errors.push(errorFromResponse.message);
            }
        });

        return errors;
    }

    listenToPaymentChange(payment: Payment): void {
        if (JSON.stringify(this.oldPayment) !== JSON.stringify(payment)) {
            this.googlAnalyticsService.pushEvent('Addpayment');
        }

        this.oldPayment = payment;
    }
}
