import { Inject, Injectable } from '@angular/core';

import { STATIC_API } from '../../../../../_root/static/api';
import { CreditCardType } from '../../../../../enums/credit-card-type.enum';
import { PaymentMethodEnum } from '../../../../../enums/payment-method.enum';
import { Checkout } from '../../../../../models/checkout/checkout.model';
import { CreditCard, Payment, PaymentMethod } from '../../../../../models/payment/payment.model';

@Injectable()
export class PaymentsService {
    constructor(@Inject(STATIC_API) private staticApi: any) { }

    mapCreditCard(creditCard: CreditCard): void {
        creditCard.iconUrl = this.getCardIcon(creditCard.credit_card_types.id);
        creditCard.paymentMethod = {
            id: PaymentMethodEnum.CreditCard
        };
    }

    mapPaymentMethod(paymentMethod: PaymentMethod): void {
        paymentMethod.description =
            paymentMethod.id === PaymentMethodEnum.CreditCard ? 'CREDIT_CARD' : paymentMethod.description;
    }

    getPaymentMethodIcon(paymentMethod: PaymentMethod): string {
        let icon: string = '';

        switch (paymentMethod.id) {
            case PaymentMethodEnum.Paypal:
                icon = '/assets/svg/paypal.svg';
                break;
            default:
                icon = '/assets/svg/generic-card.svg';
                break;
        }

        return icon;
    }

    getCardIcon(creditCardTypeId: number): string {
        let icon: string = '';

        switch (creditCardTypeId) {
            case CreditCardType.Jcb:
                icon = '/assets/svg/jcb.svg';
                break;
            case CreditCardType.Mastercard:
                icon = '/assets/svg/mastercard.svg';
                break;
            case CreditCardType.Visa:
                icon = '/assets/svg/visa.svg';
                break;
            case CreditCardType.Amex:
                icon = '/assets/svg/amex.svg';
                break;
            default:
                icon = '/assets/svg/generic-card.svg';
                break;
        }

        return icon;
    }

    preparePaymentForCheckout(checkout: Checkout): PaymentMethod {
        if (!checkout.payment) return;

        return {
            id: checkout.payment.paymentMethod.id,
            details: {
                creditCardId: checkout.payment.id
            },
            options: checkout.paymentOptions,
            code: checkout.corporateCode
        };
    }

    getCorporatePayment(): Payment {
        return {
            paymentMethod: {
                id: PaymentMethodEnum.Corporate
            }
        };
    }

    prepareDeviceData(payloadDeviceData: any): string {
        const deviceDataAsObject: any = JSON.parse(payloadDeviceData);

        deviceDataAsObject.fraud_merchant_id = this.staticApi.kountMerchantId;

        return JSON.stringify(deviceDataAsObject);
    }
}
