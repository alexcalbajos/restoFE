import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { Cart } from '../../../../../models/checkout/cart.model';
import { AttachedClient, Client } from '../../../../../models/client/client.model';
import { OptionValue, Product, ProductOption } from '../../../../../models/provider/product.model';
import { AnalyticsService } from '../../helpers/analytics.service';
import { CacheSyncService } from '../../helpers/cache-sync.service';
import { ClientService } from '../client/client.service';

@Injectable()
export class CartService {
    _cart: BehaviorSubject<Cart> = new BehaviorSubject<any>({ doNotCache: true });
    cart$: Observable<Cart> = this._cart.asObservable();
    private client: Client;

    constructor(
        private clientService: ClientService,
        private analyticsService: AnalyticsService,
        private cacheSyncService: CacheSyncService) { }

    init(): void {
        this.cacheSyncService.add(this.cart$, 'cart');

        const cachedCart: Cart = JSON.parse(localStorage.getItem('cart'));
        if (cachedCart) {
            this._cart.next(cachedCart);
        } else {
            this._cart.next(this.getEmptyCart());
        }

        this.clientService.client$.subscribe((client: Client) => {
            this.client = client;

            if (!client) {
                this.clearCart();
            }
        });
    }

    addProduct(newProduct: Product): void {
        if (this.client && this.client.selectedAttachedClient) {
            this.attachClientToProduct(newProduct, this.client.selectedAttachedClient);
        }

        const cart: Cart = this._cart.getValue();
        const indexOfEqualProduct: number = this.getIndexOfEqualProduct(newProduct, cart);

        if (isNaN(indexOfEqualProduct)) {
            cart.products.push(newProduct);
            cart.provider = newProduct.cartProvider;
        } else {
            cart.products[indexOfEqualProduct].qty += newProduct.qty;
            cart.products[indexOfEqualProduct].calculatedPrice += newProduct.calculatedPrice;
        }

        this.analyticsService.ee_productCartAction('addToCart', newProduct);
        this.onCartChange(cart);
    }

    editProduct(newProduct: Product): void {
        const cart: Cart = this._cart.getValue();
        const indexOfEqualProduct: number = this.getIndexOfEqualProduct(newProduct, cart);

        if (isNaN(indexOfEqualProduct)) {
            cart.products[newProduct.cartIndex] = newProduct;
        } else {
            if (indexOfEqualProduct === newProduct.cartIndex) {
                cart.products[indexOfEqualProduct].qty = newProduct.qty;
                cart.products[indexOfEqualProduct].calculatedPrice = newProduct.calculatedPrice;
            } else {
                cart.products[indexOfEqualProduct].qty += newProduct.qty;
                cart.products[indexOfEqualProduct].calculatedPrice += newProduct.calculatedPrice;
                cart.products.splice(newProduct.cartIndex, 1);
            }
        }

        this.onCartChange(cart);
    }

    removeProduct(product: Product): void {
        const cart: Cart = this._cart.getValue();
        cart.products.splice(product.cartIndex, 1);

        this.analyticsService.ee_productCartAction('removeFromCart', product);
        this.onCartChange(cart);
    }

    removeProductsWithNoQty(cart: Cart): void {
        const productsToRemove: Array<Product> = [];

        cart.products.forEach((product: Product) => {
            if (product.qty <= 0) {
                productsToRemove.push(product);
                this.analyticsService.ee_productCartAction('removeFromCart', product);
            }
        });

        _.pullAll(cart.products, productsToRemove);
    }

    removeProductsWithNoAttachedClients(): void {
        if (!this.client || !this.client.attached_clients) return;

        const cart: Cart = this._cart.getValue();
        const productsToRemove: Array<Product> = [];

        cart.products.forEach((product: Product) => {
            if (!_.some(_.filter(this.client.attached_clients, { checked: true }), { id: product.clientId })) {
                productsToRemove.push(product);
                this.analyticsService.ee_productCartAction('removeFromCart', product);
            }
        });

        _.pullAll(cart.products, productsToRemove);

        this.onCartChange(cart);
    }

    clearCart(): void {
        this._cart.next(this.getEmptyCart());
    }

    onCartChange(cart: Cart): void {
        this.removeProductsWithNoQty(cart);

        if (cart.products.length > 0) {
            this.calculateTotal(cart);
            this.assignCartIntex(cart);
            this.setProductIdQtyPairs(cart);
            this.checkMultiorder(cart);
            this._cart.next(cart);
        } else {
            this.clearCart();
        }
    }

    attachClientToProduct(product: Product, attachedClient: AttachedClient): void {
        product.clientId = attachedClient.id;
        product.clientFullName = attachedClient.fullName;
    }

    private calculateTotal(cart: Cart): void {
        cart.total = 0;
        cart.numberOfProducts = 0;

        cart.products.forEach((product: Product) => {
            cart.total += product.calculatedPrice;
            cart.numberOfProducts += product.qty;
        });
    }

    private assignCartIntex(cart: Cart): void {
        cart.products.forEach((product: Product, index: number) => {
            product.cartIndex = index;
        });
    }

    private setProductIdQtyPairs(cart: Cart): void {
        cart.productIdQtyPairs = {};

        const groupedProducts: _.Dictionary<Array<Product>> = _.groupBy(cart.products, (product: Product) =>
            product.id);

        for (const key in groupedProducts) {
            if (groupedProducts.hasOwnProperty(key)) {
                let qty: number = 0;

                groupedProducts[key].forEach((product: Product) => {
                    qty += product.qty;
                });

                cart.productIdQtyPairs[key] = qty;
            }
        }
    }

    private getIndexOfEqualProduct(newProduct: Product, currentCart: Cart): number {
        let indexOfEqualProduct: number;

        currentCart.products.forEach((productInCart: Product, index: number) => {
            if (!indexOfEqualProduct && this.areEqual(productInCart, newProduct)) {
                indexOfEqualProduct = index;
            }
        });

        return indexOfEqualProduct;
    }

    private areEqual(firstProduct: Product, secondProduct: Product): boolean {
        let result: boolean = true;

        if (firstProduct.id !== secondProduct.id) {
            result = false;
        }

        if (JSON.stringify(this.getAllSelectedValues(firstProduct)) !== JSON.stringify(this.getAllSelectedValues(secondProduct))) {
            result = false;
        }

        if (firstProduct.comment !== secondProduct.comment) {
            result = false;
        }

        if (firstProduct.clientId !== secondProduct.clientId) {
            result = false;
        }

        return result;
    }

    private getAllSelectedValues(product: Product): Array<OptionValue> {
        const allSelectedValues: Array<OptionValue> = [];

        product.options.forEach((option: ProductOption) => {
            if (option.selectedValues) {
                option.selectedValues.forEach((selectedValue: OptionValue) => {
                    allSelectedValues.push(selectedValue);
                });
            }

            if (option.selectedValue) {
                allSelectedValues.push(option.selectedValue);
            }
        });

        return _.sortBy(allSelectedValues, 'id');
    }

    private getEmptyCart(): Cart {
        return {
            products: [],
            numberOfProducts: 0,
            total: 0
        };
    }

    private checkMultiorder(currentCart: Cart): void {
        const selectedUsers: Array<number> = Array.from(new Set(_.map(currentCart.products, 'clientId')));
        currentCart.isMultiOrder = selectedUsers.length > 1 || (selectedUsers[0] && selectedUsers[0] !== this.client.id);

        if (currentCart.isMultiOrder) {
            currentCart.products.sort((a: Product, b: Product) =>
                a.clientId - b.clientId
            );
        }
    }
}
