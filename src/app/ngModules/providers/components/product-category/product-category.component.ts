import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BaseAddress, SessionAddress } from '../../../../models/address/address.model';
import { Cart } from '../../../../models/checkout/cart.model';
import { ProductDialogData } from '../../../../models/dialogs/product-dialog-data.model';
import { ProductCategory } from '../../../../models/provider/product-category.model';
import { Product } from '../../../../models/provider/product.model';
import { Provider } from '../../../../models/provider/provider.model';
import {
    AddressDialogService
} from '../../../shared/services/business/addresses/address-dialog.service';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    ProductDialogService
} from '../../../shared/services/business/products/product-dialog.service';
import { ProvidersService } from '../../../shared/services/business/providers/providers.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { AnalyticsService } from '../../../shared/services/helpers/analytics.service';
import {
    DifferentProviderDialogComponent
} from '../different-provider-dialog/different-provider-dialog.component';
import { OutOfRangeDialogComponent } from '../out-of-range-dialog/out-of-range-dialog.component';

@Component({
    selector: 'ri-product-category',
    templateUrl: 'product-category.component.html',
    styleUrls: ['product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit, OnDestroy {
    @Input() provider: Provider;
    @Input() category: ProductCategory;
    cart: Cart;

    constructor(
        private dialog: MatDialog,
        private sessionAddressService: SessionAddressService,
        private addressDialogService: AddressDialogService,
        private cartService: CartService,
        private productDialogService: ProductDialogService,
        private clientService: ClientService,
        private analyticsService: AnalyticsService,
        private providersService: ProvidersService) { }

    ngOnInit(): void {
        this.cartService.cart$.pipe(untilDestroyed(this)).subscribe((cart: Cart) => {
            this.cart = cart;
        });
    }

    ngOnDestroy(): void {/**/ }

    openDialog(product: Product): void {
        const productForDialog: Product = _.cloneDeep(product);

        productForDialog.qty = 1;
        productForDialog.cartProvider = this.providersService.getCartProvider(this.provider);
        productForDialog.categoryName = this.category.name;

        this.analyticsService.ee_productClick(productForDialog);

        const productDialogData: ProductDialogData = {
            product: productForDialog,
            isEdit: false
        };

        this.handleProductDialogData(productDialogData);
    }

    displaySelectedCount(product: Product): void {
        return this.cart.productIdQtyPairs && this.cart.productIdQtyPairs[product.id];
    }

    private handleProductDialogData(productDialogData: ProductDialogData): void {
        const cart: Cart = this.cartService._cart.getValue();
        if (cart.provider && cart.provider.id !== productDialogData.product.cartProvider.id) {
            this.openWarningDialog(productDialogData, DifferentProviderDialogComponent);

            return;
        }

        const sessionAddress: SessionAddress = this.sessionAddressService._sessionAddress.getValue();
        if (!sessionAddress.isDeliverable) {
            this.addressDialogService.changeAddress().pipe(take(1)).subscribe((address: BaseAddress) => {
                this.sessionAddressService.changeSessionAddress(address).pipe(take(1)).subscribe((cityWasChanged: boolean) => {
                    if (!cityWasChanged) {
                        this.handleProductDialogData(productDialogData);
                    }
                });
            });

            return;
        }

        if (!this.providersService.isProviderInRange(
            sessionAddress.deliveryCity.id, this.provider, this.clientService._client.getValue())) {
            this.openWarningDialog(productDialogData, OutOfRangeDialogComponent);

            return;
        }

        this.productDialogService.loadProductDialog(productDialogData);
    }

    private openWarningDialog(productDialogData: ProductDialogData, dialogComponent: any): void {
        const dialogRef: MatDialogRef<any> = this.dialog.open(dialogComponent, {
            data: productDialogData,
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe((responseData: ProductDialogData) => {
            if (responseData) {
                this.handleProductDialogData(responseData);
            }
        });
    }
}
