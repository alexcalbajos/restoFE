import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ClientAddress } from '../../../../models/address/address.model';
import {
    AddAddressDialogComponent
} from '../../../shared/components/add-address-dialog/add-address-dialog.component';
import {
    AddressesApiService
} from '../../../shared/services/business/addresses/addresses.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';

@Component({
    selector: 'ri-client-addresses',
    templateUrl: 'client-addresses.component.html',
    styleUrls: ['client-addresses.component.scss']
})
export class ClientAddressesComponent implements OnInit {
    addresses: Array<ClientAddress>;
    dataLoaded: boolean;

    constructor(
        public clientService: ClientService,
        private addressesApiService: AddressesApiService,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.getAddresses();
    }

    add(): void {
        const dialog: MatDialogRef<AddAddressDialogComponent> = this.dialog.open(AddAddressDialogComponent, {
            autoFocus: false
        });

        dialog.afterClosed().subscribe((addedAddress: ClientAddress) => {
            if (addedAddress) {
                this.getAddresses();
            }
        });
    }

    getAddresses(): void {
        this.dataLoaded = false;
        this.addressesApiService.getAll().subscribe((addresses: Array<ClientAddress>) => {
            this.addresses = addresses;
            this.dataLoaded = true;
        });
    }
}
