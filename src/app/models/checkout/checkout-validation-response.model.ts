export class CheckoutValidationResponse {
    isValid: boolean;
    cartTotal: number;
    cart: Cart;
    delivery: Delivery;
    client: Client;
    provider: Provider;
    sellingPoint: Provider;
    couponCode: CouponCode;
    tip: Tip;
    fidelityPoints: FidelityPoints;
    walletAmount: WalletAmount;
    payment: Payment;
    clientRequested?: boolean;
}

class Client {
    isValid: boolean;
    error: string;
}

export class CouponCode {
    isValid: boolean;
    code: string;
    amount: number;
    value: number;
    providerId: number;
    error: string;
    errorCode: number;
    type: number;
    couponProduct: string;
}

class Delivery {
    isValid: boolean;
    distance: number;
    fee: number;
    estimatedTime: number;
    estimatedDeliveryTime: string;
    isOutOfRange: boolean;
}

class Cart {
    isValid: boolean;
    error: string;
    errorCode: number;
}

class FidelityPoints {
    isValid: boolean;
    pointsUsed: number;
    pointsAmount: number;
    clientFidelityPoints: number;
}

class Payment {
    isValid: boolean;
    id: number;
    '3dSecure': boolean;
    bonificationAmount: number;
    dataErrors: Array<DataError>;
}

export class DataError {
    conditions: string;
    field: string;
    id: number;
}

class Provider {
    id: number;
    isValid: boolean;
}

class Tip {
    isValid: boolean;
    amount: number;
}

class WalletAmount {
    isValid: boolean;
    walletAmountUsed: number;
    clientWalletAmount: number;
}
