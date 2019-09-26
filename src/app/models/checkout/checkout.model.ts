import { BaseAddress } from '../address/address.model';
import { Payment, PaymentMethodOption } from '../payment/payment.model';
import { DeliveryHour } from '../provider/delivery-day.model';
import { Cart } from './cart.model';

export class Checkout {
    address?: BaseAddress;
    cart?: Cart;
    deliveryHour?: DeliveryHour;
    payment?: Payment;
    paymentOptions?: Array<PaymentMethodOption>;
    corporateCode?: string;
    couponCode?: string;
    walletAmount?: number;
    deviceData?: string;
    manualValidationInProgress?: boolean;
    automaticAddressSaveInProgress?: boolean;
    automaticPaymentSaveInProgress?: boolean;
}
