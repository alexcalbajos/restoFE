import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { MessageType } from '../../../../enums/message-type.enum';
import { PaymentMethodEnum } from '../../../../enums/payment-method.enum';
import {
    CheckoutValidationParams
} from '../../../../models/checkout/checkout-validation-params.model';
import {
    CheckoutValidationResponse
} from '../../../../models/checkout/checkout-validation-response.model';
import { ConfirmDialogData } from '../../../../models/dialogs/confirm-dialog-data.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import {
    ConfirmDialogComponent
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import { OrdersApiService } from '../../../shared/services/business/orders/orders.api.service';
import { OrdersService } from '../../../shared/services/business/orders/orders.service';
import { PaymentsApiService } from '../../../shared/services/business/payment/payments.api.service';
import { PaymentsService } from '../../../shared/services/business/payment/payments.service';
import {
    ProvidersApiService
} from '../../../shared/services/business/providers/providers.api.service';
import { ProvidersService } from '../../../shared/services/business/providers/providers.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { AnalyticsService } from '../../../shared/services/helpers/analytics.service';
import { BraintreeService } from '../../../shared/services/helpers/braintree.service';
import { MetaService } from '../../../shared/services/helpers/meta.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';
import {
    CheckoutAddressesComponent
} from '../../components/checkout-addresses/checkout-addresses.component';
import {
    CheckoutPaymentComponent
} from '../../components/checkout-payment/checkout-payment.component';
import {
    ThreeDSecureDialogComponent
} from '../../components/three-d-secure-dialog/three-d-secure-dialog.component';

@Component({
    selector: 'ri-checkout-validation',
    templateUrl: 'checkout-validation.component.html',
    styleUrls: ['checkout-validation.component.scss']
})
export class CheckoutValidationComponent implements OnInit, OnDestroy {
    bonificationAmount: number;
    corporateExtraPay: number;
    iframeSubscription: Subscription;
    cardValidationSubscription: Subscription;
    threeDSecureInstance: Subscription;
    displayPaymentOptions: boolean;
    displayPayment: boolean;
    displayCodePromo: boolean;

    @ViewChild('checkoutAddresses') checkoutAddresses: CheckoutAddressesComponent;
    @ViewChild('checkoutPayment') checkoutPayment: CheckoutPaymentComponent;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private metaService: MetaService,
        private dialog: MatDialog,
        private braintreeService: BraintreeService,
        private ordersApiService: OrdersApiService,
        private checkoutService: CheckoutService,
        private clientService: ClientService,
        private paymentsApiService: PaymentsApiService,
        private paymentsService: PaymentsService,
        private toasterWrapperService: ToasterWrapperService,
        private ordersService: OrdersService,
        private providersApiService: ProvidersApiService,
        private providersService: ProvidersService,
        private sessionAddressService: SessionAddressService,
        private analyticsService: AnalyticsService,
        private cartService: CartService) { }

    ngOnInit(): void {
        this.metaService.setMeta({
            title: 'CHECKOUT_TITLE',
            description: 'CHECKOUT_DESCRIPTION',
            descriptionTranslationParam: { providerName: this.staticConfig.brandName }
        });

        this.checkoutService._checkout.getValue().cart = this.cartService._cart.getValue();

        this.checkoutService.automaticValidationResponse$
            .pipe(untilDestroyed(this))
            .pipe(filter((automaticValidationResponse: CheckoutValidationResponse) => !_.isEmpty(automaticValidationResponse)))
            .subscribe((automaticValidationResponse: CheckoutValidationResponse) => {
                this.refreshDisplayFlags(automaticValidationResponse);
            });

        this.checkoutService.manualValidationResponse$
            .pipe(untilDestroyed(this))
            .subscribe((manualValidationResponse: CheckoutValidationResponse) => {
                this.handleManualValidationResponse(manualValidationResponse);
            });

        this.checkEtaChange();
        this.setDisplayFlags();
        this.analyticsService.ee_trackCheckoutStep(this.cartService._cart.getValue().products);
        this.analyticsService.dynx_pageType('conversionintent');
    }

    ngOnDestroy(): void {
        this.checkoutService._checkout.next({});
    }

    checkEtaChange(): void {
        const providerLink: string = this.cartService._cart.getValue().provider.link;
        const deliveryCityId: number = this.sessionAddressService._sessionAddress.getValue().deliveryCity.id;

        this.providersApiService.get(providerLink, deliveryCityId, this.staticConfig.brandId)
            .subscribe((genericResponse: GenericResponse) => {
                if (genericResponse.data) {
                    this.providersService.checkLastProviderEta(genericResponse.data);
                }
            });
    }

    validateOrder(): void {
        this.checkoutService._dataLoaded.next(false);
        this.checkoutService._checkout.getValue().manualValidationInProgress = true;

        if (this.checkoutService.checkoutHasSelectedAddress() && this.checkoutService.checkoutHasSelectedPayment()) {
            this.checkoutService._checkout.next(this.checkoutService._checkout.getValue());
        } else {
            if (!this.checkoutService.checkoutHasSelectedAddress()) {
                this.checkoutService._checkout.getValue().automaticAddressSaveInProgress = true;
                this.checkoutAddresses.submitAddressForm();
            }

            if (!this.checkoutService.checkoutHasSelectedPayment()) {
                this.checkoutService._checkout.getValue().automaticPaymentSaveInProgress = true;
                this.checkoutPayment.submitPayment();
            }
        }
    }

    private handleManualValidationResponse(manualValidationResponse: CheckoutValidationResponse): void {
        if (!manualValidationResponse.isValid) {
            const errors: Array<string> = this.checkoutService.getCheckoutValidationResponseErrors(manualValidationResponse);
            this.showValidationErrors(errors);
        } else if (manualValidationResponse.payment['3dSecure']) {
            this.handl3DSecure(manualValidationResponse);
        } else if (manualValidationResponse.payment.id === PaymentMethodEnum.Paypal) {
            this.addOrder({ key: 'Referer', value: window.location.href });
        } else {
            this.addOrder();
        }
    }

    private handl3DSecure(manualValidationResponse: CheckoutValidationResponse): void {
        if (this.threeDSecureInstance) {
            this.threeDSecureInstance.unsubscribe();
        }

        if (this.iframeSubscription) {
            this.iframeSubscription.unsubscribe();
        }

        if (this.cardValidationSubscription) {
            this.cardValidationSubscription.unsubscribe();
        }

        combineLatest(
            this.paymentsApiService.getBraintreeToken(),
            this.paymentsApiService.getNonce(this.checkoutService._checkout.getValue().payment.id)
        ).subscribe((data: any) => {
            const braintreeToken: string = data[0];
            const nonce: string = data[1];

            this.threeDSecureInstance = this.braintreeService.getThreeDSecureInstance(braintreeToken).pipe(take(1))
                .subscribe((threeDSecureInstance: any) => {
                    let dialogRef: MatDialogRef<ThreeDSecureDialogComponent>;

                    this.iframeSubscription = this.braintreeService.$iframe.pipe(take(1))
                        .subscribe((iframe: any) => {
                            if (iframe) {
                                dialogRef = this.dialog.open(ThreeDSecureDialogComponent, {
                                    autoFocus: false,
                                    panelClass: 'secure-dialog',
                                    data: iframe
                                });

                                dialogRef.afterClosed().subscribe((cardVerification: any) => {
                                    if (!cardVerification) {
                                        this.checkoutService._dataLoaded.next(true);
                                    }
                                });
                            }
                        });

                    this.cardValidationSubscription = this.braintreeService.$cardVerification.pipe(take(1))
                        .subscribe((cardVerification: any) => {
                            if (this.braintreeService.isCardVerificationValid(cardVerification)) {
                                this.paymentsApiService
                                    .updateNonce(this.checkoutService._checkout.getValue().payment.id, cardVerification.nonce)
                                    .subscribe(() => {
                                        this.addOrder();
                                    });
                            } else {
                                this.toasterWrapperService.show('WE_ARE_SORRY', MessageType.Error);
                            }

                            if (dialogRef) {
                                dialogRef.close(cardVerification);
                            }
                        });

                    this.braintreeService.verifyCard(threeDSecureInstance, manualValidationResponse.cartTotal, nonce);
                });
        });
    }

    private addOrder(extraHeader?: { key: string, value: string }): void {
        const checkoutValidationParams: CheckoutValidationParams =
            this.checkoutService.createCheckoutValidationParams(this.checkoutService._checkout.getValue());

        this.ordersApiService.add(checkoutValidationParams, extraHeader).subscribe((addOrderResponse: GenericResponse) => {
            if (addOrderResponse.errors) {
                this.showValidationErrors(this.checkoutService.getOrdersResponseErrors(addOrderResponse.errors));
            } else if (addOrderResponse.data) {
                if (addOrderResponse.data.redirectUrl) {
                    window.location.href = addOrderResponse.data.redirectUrl;
                } else {
                    this.ordersService.orderCompleted(addOrderResponse.data.id, addOrderResponse.data.total_ft);
                }
            }
        });
    }

    private showValidationErrors(errors: Array<string>): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: errors
        };

        const dialog: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialog.afterClosed().subscribe(() => {
            this.checkoutService._dataLoaded.next(true);
        });
    }

    private setDisplayFlags(): void {
        if (this.clientService._client.getValue().isCorporate) {
            this.checkoutService._checkout.getValue().payment = this.paymentsService.getCorporatePayment();
            this.displayPaymentOptions = true;
        } else {
            this.displayPayment = true;
            this.displayCodePromo = true;
        }
    }

    private refreshDisplayFlags(automaticValidationResponse: CheckoutValidationResponse): void {
        if (this.cartService._cart.getValue().isMultiOrder) return;

        if (isNaN(automaticValidationResponse.payment.bonificationAmount)) return;

        this.bonificationAmount = automaticValidationResponse.payment.bonificationAmount;
        this.corporateExtraPay = automaticValidationResponse.cartTotal - this.bonificationAmount;

        if (this.corporateExtraPay > 0) {
            this.displayPayment = true;
        } else if (this.displayPayment) {
            this.checkoutService._checkout.getValue().payment = this.paymentsService.getCorporatePayment();
            this.displayPayment = false;
        }
    }
}
