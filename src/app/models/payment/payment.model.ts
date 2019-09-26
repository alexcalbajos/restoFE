// tslint:disable:variable-name

export class Payment {
    id?: number;
    paymentMethod?: PaymentMethod;
    iconUrl?: string;
}

export class CreditCard extends Payment {
    four_digits: string;
    name: string;
    credit_card_types: CreditCardType;
}

export class CreditCardType {
    id: number;
    credct_type: string;
}

export class PaymentMethod {
    id: number;
    description?: string;
    details?: any;
    code?: string;
    options?: Array<PaymentMethodOption>;
    use_codes?: number;
    display_codes_selector?: boolean;
}

export class PaymentMethodOption {
    type: string;
    id: number;
    title: string;
    value: any;
    invalid?: boolean;
}
