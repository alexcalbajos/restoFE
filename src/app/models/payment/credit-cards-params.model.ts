// tslint:disable:variable-name

export class CreditCardsParams {
    credct_type_id?: number;
    credit_card_pan: string;
    cvv: string;
    device_data?: string;
    expiring_month: string;
    expiring_year: string;
    name: string;
    nonce: string;
    save_for_display: boolean;
}
