import { Product } from '../provider/product.model';
import { CartProvider } from '../provider/provider.model';

export class Cart {
    products: Array<Product>;
    productIdQtyPairs?: any;
    numberOfProducts?: number;
    total: number;
    provider?: CartProvider;
    isMultiOrder?: boolean;
    cutlery?: boolean;
}
