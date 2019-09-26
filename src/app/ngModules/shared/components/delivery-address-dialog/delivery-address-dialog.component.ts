import * as _ from 'lodash';

import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { BaseAddress } from '../../../../models/address/address.model';
import { AddressInputDirective } from '../../../shared/directives/address-input.directive';
import { AddressesService } from '../../../shared/services/business/addresses/addresses.service';

@Component({
    selector: 'ri-delivery-address-dialog',
    templateUrl: 'delivery-address-dialog.component.html',
    styleUrls: ['delivery-address-dialog.component.scss']
})
export class DeliveryAddressDialogComponent {
    error: string;
    @ViewChild(AddressInputDirective) addressInput: AddressInputDirective;

    constructor(
        public dialogRef: MatDialogRef<DeliveryAddressDialogComponent>,
        private addressesService: AddressesService) { }

    submit(): void {
        this.addressInput.validateAddress(true);
    }

    refreshValidation(): void {
        this.error = undefined;
    }

    selectedPlaceValidated(result: any): void {
        if (!result.forcedValidation) return;

        if (!result.selectedPlace) {
            this.error = 'AUTOCOMPLETE_ADDRESS_EXACT';

            return;
        }

        const address: BaseAddress = this.addressesService.composeAddressFromPlace(result.selectedPlace);
        if (!this.addressesService.isDeliverable(address, true)) {
            this.error = 'AUTOCOMPLETE_ADDRESS_EXACT';

            return;
        }

        this.dialogRef.close(address);
    }
}
