// tslint:disable:variable-name

export class ClientsParams {
    clientId: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    sms?: boolean;
    news?: boolean;
    brandId: number;
    cityId: number;
    gdpr_accept?: boolean;
}
