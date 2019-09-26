import { City } from '../address/city.model';
import { Country } from '../address/country.model';

// tslint:disable:variable-name

export class AttachedClient {
    id?: number;
    first_name?: string;
    last_name?: string;
    fullName?: string;
    checked?: boolean;
}
export class Client extends AttachedClient {
    admin?: number;
    isCorporate?: boolean;
    attached_clients?: Array<AttachedClient>;
    selectedAttachedClient?: AttachedClient;
    phone?: string;
    mobile?: string;
    email?: string;
    sms?: boolean;
    newsletter?: boolean;
    gdpr_accept?: boolean;
    brandId?: number;
    city?: City;
    country?: Country;
    doNotCache?: boolean;
    login_token?: string;
    login_token_expiration_date?: string;
    wallet_amount?: number;
    max_order_amount_json?: string;
    account_expiration_date?: string;
    type?: ClientType;
    company?: Client;
    isSocGen?: boolean;
    delivery_range?: number;
}

export class CorporateClient extends Client {
    clientId: number;
    cityId: number;
    expiration: string;
    division_id?: number;
}

export class ClientType {
    id: number;
}

export class Division {
    id: number;
    name: string;
}
