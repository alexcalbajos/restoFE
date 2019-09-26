import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ClientAddress } from '../../../../models/address/address.model';
import { AddAddressFormComponent } from '../add-address-form/add-address-form.component';

@Component({
    selector: 'ri-add-address-dialog',
    templateUrl: 'add-address-dialog.component.html',
    styleUrls: ['add-address-dialog.component.scss']
})
export class AddAddressDialogComponent {
    @ViewChild('addAddressForm') addAddressForm: AddAddressFormComponent;

    constructor(
        @Inject(MAT_DIALOG_DATA) public clientAddress: ClientAddress,
        public dialogRef: MatDialogRef<AddAddressDialogComponent>) { }

    submit(): void {
        this.addAddressForm.submit();
    }
}
