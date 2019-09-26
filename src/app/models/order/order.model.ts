import { ClientAddress } from '../address/address.model';
import { City } from '../address/city.model';
import { OptionValue } from '../provider/product.model';
import { Provider } from '../provider/provider.model';

// tslint:disable:variable-name

export class Order {
    status_description: string;
    tracking_status_description: string;
    eta: string;
    url_detail: string;
    url_delivery_note: string;
    url_tracking: string;
    status: number;
    client_side_status: number;
    is_takeaway: boolean;
    is_delivered: boolean;
    is_blocked: boolean;
    id: number;
    address: ClientAddress;
    payment_type: PaymentType;
    selling_point: SellingPoint;
    total_ft: number;
    datetime: string;
    delivered: string;
    delivery_men_id: DeliveryMan;
    deliverytime: string;
    sent_to_provider: string;
    real_status: RealStatus;
    driver_status: string;
    provider: Provider;
    rating: Rating;
    details: Array<OrderDetail>;
    city: City;
    vat?: any;
    resend?: number;
}

export class OrderDetail {
    extras: Array<DetailExtra>;
    product: StatusType;
    quantity: number;
    price: number;
    product_options_id: string;
    product_options: string;
    product_name: string;
    product_type: StatusType;
    comment: string;
}

export class DetailExtra {
    id: number;
    name: string;
    values: OptionValue;
}

export class DeliveryMan {
    num_deliveries: number;
    note_avg: number;
    last_location_update: string;
    recently_geolocated: boolean;
    today_was_geolocated: boolean;
    seconds_since_last_update: number;
    first_name: string;
    mobile: string;
    latitude: number;
    longitude: number;
    photo_url: string;
    sanitizedPhoto: any;
}

class SellingPoint {
    id: number;
    provider: Provider;
    latitude: number;
    longitude: number;
    tel: string;
}

class PaymentType {
    id: number;
    name_en: string;
}

class RealStatus {
    status_type: StatusType;
}

class StatusType {
    id: number;
}

class Rating {
    note_avg: number;
}
