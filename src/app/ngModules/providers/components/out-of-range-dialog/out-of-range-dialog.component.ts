import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ProductDialogData } from '../../../../models/dialogs/product-dialog-data.model';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';

@Component({
    selector: 'ri-out-of-range-dialog',
    templateUrl: 'out-of-range-dialog.component.html',
    styleUrls: ['out-of-range-dialog.component.scss']
})
export class OutOfRangeDialogComponent {
    constructor(
        public sessionAddressService: SessionAddressService,
        private router: Router,
        public dialogRef: MatDialogRef<OutOfRangeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private productDialogData: ProductDialogData) { }

    goToProvidersListPage(): void {
        this.dialogRef.close();
        this.router.navigate([this.sessionAddressService._sessionAddress.getValue().deliveryCity.route_relative]);
    }

    changeAddress(): void {
        this.sessionAddressService.set(
            this.sessionAddressService.composeFromCity(this.sessionAddressService._sessionAddress.getValue().deliveryCity));
        this.dialogRef.close(this.productDialogData);
    }
}
