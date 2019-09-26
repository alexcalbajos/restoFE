import * as _ from 'lodash';

import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ProductDialogData } from '../../../../models/dialogs/product-dialog-data.model';
import { OptionValue, Product, ProductOption } from '../../../../models/provider/product.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ProductService } from '../../../shared/services/business/products/product.service';
import { AnalyticsService } from '../../services/helpers/analytics.service';
import { GooglAnalyticsService } from '../../services/helpers/google-analytics.service';
import { ScrollService } from '../../services/helpers/scroll.service';

@Component({
    selector: 'ri-product-dialog',
    templateUrl: 'product-dialog.component.html',
    styleUrls: ['product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit, AfterViewInit {
    product: Product;
    isEdit: boolean;

    constructor(
        public productService: ProductService,
        private scrollService: ScrollService,
        public dialogRef: MatDialogRef<ProductDialogComponent>,
        private cartService: CartService,
        private googlAnalyticsService: GooglAnalyticsService,
        private analyticsService: AnalyticsService,
        @Inject(MAT_DIALOG_DATA) public productDialogData: ProductDialogData) {
    }

    ngOnInit(): void {
        this.product = this.productDialogData.product;
        this.isEdit = this.productDialogData.isEdit;
        this.productService.handleProductChange(this.product);

        this.googlAnalyticsService.pushEvent('Viewcontent');
        this.analyticsService.dynx_pageType('offerdetail');
    }

    ngAfterViewInit(): void {
        this.addPseudoCheckboxEvent();
    }

    optionClicked(product: Product, value: OptionValue, option: ProductOption): void {
        if (option.atLimit) return;

        if (!value.qty) {
            value.qty = 0;
        }

        this.productService.valueQtyChange(product, value, option, value.qty + 1);
    }

    addProductToCart(): void {
        const unselectedOptions: Array<ProductOption> = this.getUnselectedOptions();

        if (unselectedOptions.length > 0) {
            this.scrollService.scrollTo(`ri-product-dialog div[data='${unselectedOptions[0].id}']`, 'mat-dialog-container');

            return;
        }

        if (this.product.comment === '') {
            this.product.comment = undefined;
        }

        if (this.isEdit) {
            this.cartService.editProduct(_.cloneDeep(this.product));
        } else {
            this.cartService.addProduct(_.cloneDeep(this.product));
        }

        this.dialogRef.close();
    }

    private getUnselectedOptions(): Array<ProductOption> {
        this.productService.handleProductChange(this.product);

        this.product.options.forEach((option: ProductOption) => {
            this.checkRequired(option);
        });

        return _.filter(this.product.options, { unselected: true });
    }

    private checkRequired(option: ProductOption): void {
        if (option.required === 1) {
            if (option.singleChoice === 1) {
                option.unselected = !option.selectedValue ? true : false;
            }

            if (option.singleChoice === 0) {
                option.unselected =
                    !option.selectedValues || option.selectedValues.length < 1 ? true : false;
            }
        }
    }

    private addPseudoCheckboxEvent(): void {
        this.product.options.forEach((option: ProductOption) => {
            if (option.singleChoice === 0) {
                option.values.forEach((value: OptionValue) => {
                    const pseudoCheckbox: any = document.querySelector(`mat-list-option[data="${value.id}"] mat-pseudo-checkbox`);

                    if (pseudoCheckbox) {
                        pseudoCheckbox.productOption = option;
                        pseudoCheckbox.optionValue = value;
                        pseudoCheckbox.product = this.product;
                        pseudoCheckbox.productService = this.productService;

                        pseudoCheckbox.addEventListener('click', this.setOptionQty, false);
                    }
                });
            }
        });
    }

    private setOptionQty(event: any): void {
        event.preventDefault();

        let qty: number = 0;
        if (!event.target.optionValue.qty || event.target.optionValue.qty === 0) {
            qty = 1;
        }
        event.target.productService.valueQtyChange(event.target.product, event.target.optionValue, event.target.productOption, qty);
    }
}
