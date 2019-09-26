import * as $ from 'jquery';

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ProductDialogData } from '../../../../../models/dialogs/product-dialog-data.model';
import {
    ProductDialogComponent
} from '../../../components/product-dialog/product-dialog.component';

@Injectable()
export class ProductDialogService {
    constructor(private dialog: MatDialog) { }

    loadProductDialog(productDialogData: ProductDialogData): void {
        if (!productDialogData.product.image_app_list) {
            this.openProductDialog(productDialogData);
        } else {
            const img: HTMLImageElement = new Image();

            $(img).on('load', () => {
                this.openProductDialog(productDialogData);
            });

            img.src = productDialogData.product.image_app_list;
        }
    }

    private openProductDialog(productDialogData: ProductDialogData): void {
        this.dialog.closeAll();

        this.dialog.open(ProductDialogComponent, {
            data: productDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });
    }
}
