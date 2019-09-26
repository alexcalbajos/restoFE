import * as _ from 'lodash';

import { Injectable } from '@angular/core';

import { Cart } from '../../../../../models/checkout/cart.model';
import {
    CheckoutItem, CheckoutItemOption
} from '../../../../../models/checkout/checkout-validation-params.model';
import { OptionValue, Product, ProductOption } from '../../../../../models/provider/product.model';

@Injectable()
export class ProductService {
    valueQtyChange(product: Product, value: OptionValue, option: ProductOption, newQty: number): void {
        value.qty = newQty;

        if (!option.selectedValues) {
            option.selectedValues = [value];
        } else if (value.qty === 0) {
            _.remove(option.selectedValues, { id: value.id });
        } else if (!_.some(option.selectedValues, { id: value.id })) {
            option.selectedValues.push(value);
        }

        this.handleProductChange(product);
    }

    productQtyChange(product: Product, newQty: number): void {
        product.qty = newQty;
        this.handleProductChange(product);
    }

    handleProductChange(product: Product): void {
        let total: number = product.final_price;

        product.options.forEach((option: ProductOption) => {
            this.checkLimit(option);
            total = total + this.calculateProductOptionPrice(option);
        });

        product.calculatedPrice = total * product.qty;
    }

    prepareProductsForCheckout(cart: Cart): Array<CheckoutItem> {
        const items: Array<any> = [];

        cart.products.forEach((product: Product) => {
            const itemOptions: Array<CheckoutItemOption> = [];

            product.options.forEach((productOption: ProductOption) => {
                if (productOption.selectedValue) {
                    itemOptions.push(this.getItemOption(productOption.selectedValue, true));
                } else if (productOption.selectedValues) {
                    productOption.selectedValues.forEach((optionValue: OptionValue) => {
                        itemOptions.push(this.getItemOption(optionValue));
                    });
                }
            });

            const item: CheckoutItem = {
                comment: product.comment,
                options: itemOptions,
                quantity: product.qty,
                clientId: product.clientId,
                product: {
                    id: product.id
                }
            };

            items.push(item);
        });

        return this.addCutlery(cart, items);
    }

    private addCutlery(cart: Cart, items: Array<any>): Array<CheckoutItem> {
        if (!cart.cutlery) return items;

        const clientIds: Array<number> = _.chain(items).map('clientId').uniq().value();

        if (clientIds.length) {
            clientIds.forEach((clientId: number) => {
                items.push({
                    clientId,
                    product: {
                        id: 1000000
                    }
                });
            });
        } else {
            items.push({
                product: {
                    id: 1000000
                }
            });
        }

        return items;
    }

    private getItemOption(optionValue: OptionValue, isSingleChoice?: boolean): CheckoutItemOption {
        return {
            id: optionValue.id,
            qty: isSingleChoice ? 1 : optionValue.qty
        };
    }

    private checkLimit(option: ProductOption): void {
        if (option.limit > 0) {
            let selectedItems: number = 0;

            option.values.forEach((value: OptionValue) => {
                if (value.qty) {
                    selectedItems = selectedItems + value.qty;
                }
            });

            option.atLimit = option.limit === selectedItems ? true : false;
        }
    }

    private calculateProductOptionPrice(option: ProductOption): number {
        let price: number = 0;

        if (option.selectedValues) {
            option.selectedValues.forEach((selectedValue: OptionValue) => {
                price = price + selectedValue.price * selectedValue.qty;
            });
        }

        if (option.selectedValue) {
            price = price + option.selectedValue.price;
        }

        return price;
    }
}
