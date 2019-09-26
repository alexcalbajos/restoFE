import * as _ from 'lodash';
import { take } from 'rxjs/operators';

import { Component, OnInit, ViewChild } from '@angular/core';

import { BaseAddress, ClientAddress } from '../../../../models/address/address.model';
import {
    AddAddressFormComponent
} from '../../../shared/components/add-address-form/add-address-form.component';
import {
    AddressDialogService
} from '../../../shared/services/business/addresses/address-dialog.service';
import {
    AddressesApiService
} from '../../../shared/services/business/addresses/addresses.api.service';
import { CheckoutService } from '../../../shared/services/business/checkout/checkout.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';

@Component({
    selector: 'ri-checkout-addresses',
    templateUrl: 'checkout-addresses.component.html',
    styleUrls: ['checkout-addresses.component.scss']
})
export class CheckoutAddressesComponent implements OnInit {
    selectedAddress: BaseAddress;
    dataLoaded: boolean;
    clientHasAddresses: boolean;

    @ViewChild('addAddressForm') addAddressForm: AddAddressFormComponent;

    constructor(
        private checkoutService: CheckoutService,
        private addressDialogService: AddressDialogService,
        private clientService: ClientService,
        private addressesApiService: AddressesApiService,
        private sessionAddressService: SessionAddressService) { }

    ngOnInit(): void {
        this.addressesApiService.getAll().subscribe((addresses: Array<ClientAddress>) => {
            if (addresses.length < 1) {
                this.dataLoaded = true;

                return;
            }

            this.clientHasAddresses = true;

            this.addressesApiService.getLatest().subscribe((lastAddress: ClientAddress) => {
                if (!lastAddress) {
                    this.dataLoaded = true;

                    return;
                }

                const addressForInput: BaseAddress =
                    this.sessionAddressService
                        .getAddressForInput(lastAddress, addresses, this.clientService._client.getValue().isCorporate);

                if (addressForInput.isSaved) {
                    this.setSelectedAddress(addressForInput);
                }

                this.dataLoaded = true;
            });
        });
    }

    displayChangeSelectedAddressDialogComponent(): void {
        this.addressDialogService.changeAddress().pipe(take(1)).subscribe((clientAddress: ClientAddress) => {
            this.setSelectedAddress(clientAddress);
        });
    }

    setSelectedAddress(address: BaseAddress): void {
        this.selectedAddress = address;
        this.emitAddressChange(address);
    }

    submitAddressForm(): void {
        this.addAddressForm.submit();
    }

    emitAddressChange(address: BaseAddress): void {
        this.checkoutService._checkoutAddress.next(address);
    }
}
