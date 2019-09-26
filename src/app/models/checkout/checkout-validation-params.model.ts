import { PointAddress } from '../address/address.model';
import { PaymentMethod } from '../payment/payment.model';

export class CheckoutValidationParams {
    address: PointAddress;
    clientId: number;
    couponCode: string;
    delivery: Delivery;
    items: Array<CheckoutItem>;
    locale: string;
    minOrderAmount: number;
    paymentType: PaymentMethod;
    providerId: number;
    walletAmount: number;
    selectedUsers?: Array<number>;
    deviceData?: string;
}

export class CheckoutItem {
    quantity: number;
    product: CheckoutItemProduct;
    comment: string;
    options: Array<CheckoutItemOption>;
    clientId: number;
}

export class CheckoutItemOption {
    id: number;
    qty: number;
}

export class CheckoutItemProduct {
    id: number;
}

export class Delivery {
    selectedDeliveryTime: string;
}
