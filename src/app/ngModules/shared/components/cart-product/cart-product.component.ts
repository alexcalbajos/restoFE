import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Client } from '../../../../models/client/client.model';
import { Product } from '../../../../models/provider/product.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import {
    ProductDialogService
} from '../../../shared/services/business/products/product-dialog.service';
import { ProductService } from '../../../shared/services/business/products/product.service';
import { ClientService } from '../../services/business/client/client.service';

@Component({
    selector: 'ri-cart-product',
    templateUrl: 'cart-product.component.html',
    styleUrls: ['cart-product.component.scss']
})
export class CartProductComponent implements OnInit, OnDestroy {
    @Input() product: Product;
    @Input() isShoppingCart: boolean;
    hideProduct: boolean;

    constructor(
        private cartService: CartService,
        private clientService: ClientService,
        private productDialogService: ProductDialogService,
        private productService: ProductService) { }

    ngOnInit(): void {
        this.clientService.client$.pipe(untilDestroyed(this)).subscribe((client: Client) => {
            this.hideProduct = this.isShoppingCart &&
                client &&
                client.selectedAttachedClient &&
                this.product.clientId &&
                this.product.clientId !== client.selectedAttachedClient.id;
        });
    }

    ngOnDestroy(): void {/**/ }

    productQtyChange(product: Product, newQty: number): void {
        this.productService.productQtyChange(product, newQty);
        this.cartService.onCartChange(this.cartService._cart.getValue());
    }

    edit(product: Product): void {
        this.productDialogService.loadProductDialog({ product: _.cloneDeep(product), isEdit: true });
    }
}
