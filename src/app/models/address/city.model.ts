import { Country } from './country.model';

// tslint:disable:variable-name

export class City {
    id: number;
    name: string;
    country: Country;
    latitude: number;
    longitude: number;
    route_relative: string;
    max_delivery_distance: number;
    min_order_amount: number;
    delivery_costs: Array<DeliveryCost>;
    timezone?: string;
}

export class DeliveryCost {
    amount_end: number;
    amount_start: number;
    cost: number;
    estimated_time: number;
    delivery_time: number;
    km_end: number;
    km_start: number;
    takeaway_time: number;
}
