import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ProductDialogData } from '../../../../models/dialogs/product-dialog-data.model';

@Component({
    selector: 'ri-different-provider-dialog',
    templateUrl: 'different-provider-dialog.component.html',
    styleUrls: ['different-provider-dialog.component.scss']
})
export class DifferentProviderDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ProductDialogData,
        public cartService: CartService,
        public dialogRef: MatDialogRef<DifferentProviderDialogComponent>) { }

    createNewCart(): void {
        this.dialogRef.close(this.data);
        this.cartService.clearCart();
    }

    keepInitialCart(): void {
        this.dialogRef.close();
    }
}
