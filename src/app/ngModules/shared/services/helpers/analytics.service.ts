import { Injectable } from '@angular/core';

import { ProductCategory } from '../../../../models/provider/product-category.model';
import { Product } from '../../../../models/provider/product.model';
import { GooglAnalyticsService } from './google-analytics.service';

@Injectable()
export class AnalyticsService {
    dynxAvailablePageTypes: Array<string> = [
        'home',
        'searchresults',
        'offerdetail',
        'conversionintent',
        'conversion',
        'cancel',
        'other'
    ];

    constructor(private googlAnalyticsService: GooglAnalyticsService) { }

    /**
     * Enhaced Ecommerce Event for product impression in list
     */
    ee_productImpressions(productCategories: Array<ProductCategory>, providerName: string): any {
        const object: any = {
            ecommerce: {
                currencyCode: 'EUR',
                impressions: []
            }
        };
        this._addImpressionFieldObjects(object, productCategories, providerName);
        this.googlAnalyticsService.pushObject(object);
    }

    /**
     * Enhaced Ecommerce Event for product click
     */
    ee_productClick(product: Product): any {
        const object: any = {
            ecommerce: {
                detail: {
                    products: [
                        {
                            name: product.name,
                            id: product.id,
                            price: product.final_price,
                            brand: product.cartProvider.name,
                            category: product.categoryName
                        }
                    ]
                }
            }
        };
        this.googlAnalyticsService.pushObject(object);
    }

    /**
     * Enhaced Ecommerce Event for adding / removing product from cart
     */
    ee_productCartAction(event: 'addToCart' | 'removeFromCart', product: Product): any {
        const object: any = {
            event,
            ecommerce: {
                currencyCode: 'EUR'
            }
        };
        object.ecommerce[event] = {
            products: [
                {
                    name: product.name,
                    id: product.id,
                    price: product.final_price,
                    brand: product.cartProvider.name,
                    category: product.categoryName,
                    quantity: product.qty
                }
            ]
        };
        this.googlAnalyticsService.pushObject(object);
    }

    ee_trackCheckoutStep(products: Array<Product>): any {
        const object: any = {
            event: 'checkout',
            ecommerce: {
                checkout: {
                    actionField: { step: 1 },
                    products: []
                }
            }
        };
        this._addProductFieldObjects(object, products);
        this.googlAnalyticsService.pushObject(object);
    }

    /**
     * Dynamic Remarketing page type tracking
     */
    dynx_pageType(pageType: string): any {
        if (this.dynxAvailablePageTypes.indexOf(pageType) > -1) {
            const object: any = {
                dynx_pagetype: pageType
            };
            this.googlAnalyticsService.pushObject(object);
        }
    }

    private _addProductFieldObjects(object: any, products: Array<Product>): any {
        products.forEach((product: Product) => {
            object.ecommerce.checkout.products.push({
                id: product.id,
                name: product.name,
                category: product.categoryName,
                brand: product.cartProvider.name,
                variant: product.comment,
                quantity: product.qty
            });
        });
    }

    private _addImpressionFieldObjects(object: any, productCategories: Array<ProductCategory>, providerName: string): any {
        let index: number = 0;
        productCategories.forEach((productCategory: ProductCategory) => {
            productCategory.products.forEach((product: Product) => {
                index++;
                const impressionFieldObject: any = {
                    id: product.id,
                    name: product.name,
                    list: productCategory.name,
                    price: product.final_price,
                    brand: providerName,
                    position: index
                };
                object.ecommerce.impressions.push(impressionFieldObject);
            });
        });
    }
}
