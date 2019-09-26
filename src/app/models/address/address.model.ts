import { City } from './city.model';

// tslint:disable:variable-name

export class PointAddress {
    id?: number;
    lat: number;
    lng: number;
}

export class GoogleCircle extends PointAddress {
    radius: number;
}

export class BaseAddress extends PointAddress {
    address: string;
    city: string;
    code: string;
    zipcode: string;
    isSaved?: boolean;
    route?: string;
    streetNumber?: string;
}

export class SessionAddress extends BaseAddress {
    deliveryCity: City;
    isDeliverable: boolean;
    isDefault?: boolean;
}

export class ClientAddress extends BaseAddress {
    bis: number;
    phone1: string;
    comments?: string;
    floor?: string;
    apartment?: string;
    interphone?: string;
}

export class CorporateAddress extends ClientAddress {
    use_schedule?: boolean;
    schedules: any;
}

export class CorporateAddressParams extends CorporateAddress {
    useSchedule: boolean;
}
