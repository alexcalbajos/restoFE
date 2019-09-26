import { Product } from './product.model';

// tslint:disable:variable-name

export class ProductCategory {
    id: number;
    name: string;
    show_images: boolean;
    products: Array<Product>;
    scrollToSelector?: string;
    scrollOffset?: number;
    hasAvailableProducts?: boolean;
}
