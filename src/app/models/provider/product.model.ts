import { CartProvider } from './provider.model';

// tslint:disable:variable-name

export class Product {
    id: number;
    name: string;
    shortName: string;
    description: string;
    shortDescription: string;
    final_price: number;
    image_app_list: string;
    image_web_list: string;
    image_web_big_restoin: string;
    image_web_options: string;
    options: Array<ProductOption>;
    calculatedPrice: number;
    qty: number;
    comment: string;
    cartIndex: number;
    cartProvider: CartProvider;
    clientId?: number;
    clientFullName?: string;
    categoryName?: string;
    isAvailable?: boolean;
}

export class ProductOption {
    id: number;
    name: string;
    values: Array<OptionValue>;
    required: number;
    limit: number;
    singleChoice: number;
    selectedValue: OptionValue;
    selectedValues: Array<OptionValue>;
    unselected: boolean;
    atLimit: boolean;
    isAvailable?: boolean;
}

export class OptionValue {
    id: number;
    name: string;
    price: number;
    qty: number;
    isAvailable?: boolean;
}
