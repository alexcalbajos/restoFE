import { City } from '../address/city.model';
import { ProductCategory } from './product-category.model';
import { Product } from './product.model';

// tslint:disable:variable-name

export class CartProvider {
    id?: number;
    provider_url?: string;
    name?: string;
    selling_points?: Array<SellingPoint>;
    min_order_amount?: number;
    max_range?: number;
    estimated_delivery_time?: number;
    calculatedEta?: number;
    etaToDisplay?: string;
    etaToDisplayParams?: any;
    status?: number;
    opensAt?: Date;
    distance?: number;
    link?: string;
}

export class Provider extends CartProvider {
    category?: any;
    provider_categories?: Array<ProviderCategory>;
    categories?: Array<ProductCategory>;
    short_description?: string;
    description?: string;
    providers_web_main?: string;
    providers_app_main?: string;
    orders_count?: number;
    selling_point_address?: string;
    logo_app_internal_list?: string;
    providers_top1165?: string;
    logo_url?: string;
    sanitizedLogo?: any;
    avg_note?: number;
    url_image_provider: string;
    main_image_url: string;
    products_searched?: Array<Product>;
    schedules_hours: ProviderSchedule;
    num_comments?: number;
    delay?: number;
    absoluteUrl?: string;
    unavailable_products?: Array<SellingPointProductsPair>;
    unavailable_options?: Array<SellingPointOptionsPair>;
}

export class ProviderCategory {
    category: ProviderCategoryDetails;
}

export class ProviderCategoryDetails {
    label: string;
    link: string;
    numberOfProviders?: number;
    selected?: boolean;
    id?: number;
    schema?: string;
}

export class SellingPoint {
    address: string;
    address_comment: string;
    city: City;
    id: number;
    latitude: number;
    legal_address: string;
    legal_info: string;
    longitude: number;
    siret: string;
    tel: string;
    zip_code: string;
    next_delivery: any;
    isClosest?: boolean;
}

class ProviderSchedule {
    daysStr: string;
    hours: Array<ProviderHours>;
}

class ProviderHours {
    start: string;
    end: string;
}

export class ProviderSortingOption {
    id: number;
    name: string;
    sortByForOpen?: Array<string>;
    sortByForLater?: Array<string>;
    sortingDirectionForOpen?: Array<'asc' | 'desc'>;
    sortingDirectionForLater?: Array<'asc' | 'desc'>;
}

export class SellingPointProductsPair {
    sellingPointId: number;
    products: Array<number>;
}

export class SellingPointOptionsPair {
    sellingPointId: number;
    options: Array<number>;
}
