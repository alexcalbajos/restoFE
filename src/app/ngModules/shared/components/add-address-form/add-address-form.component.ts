import 'intl-tel-input';

import * as $ from 'jquery';
import * as _ from 'lodash';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MessageType } from '../../../../enums/message-type.enum';
import { BaseAddress, ClientAddress } from '../../../../models/address/address.model';
import { ConfirmDialogData } from '../../../../models/dialogs/confirm-dialog-data.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import {
    AddressesApiService
} from '../../../shared/services/business/addresses/addresses.api.service';
import { AddressesService } from '../../../shared/services/business/addresses/addresses.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { AddressInputDirective } from '../../directives/address-input.directive';
import { IntlTelInputDirective } from '../../directives/intl-tel-input.directive';
import { ClientService } from '../../services/business/client/client.service';
import { FormValidationService } from '../../services/helpers/form-validation.service';
import { ToasterWrapperService } from '../../services/helpers/toaster-wrapper.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'ri-add-address-form',
    templateUrl: 'add-address-form.component.html',
    styleUrls: ['add-address-form.component.scss']
})
export class AddAddressFormComponent implements OnInit {
    @Input() address: ClientAddress;
    @Output() readonly addressChanged: EventEmitter<ClientAddress> = new EventEmitter<ClientAddress>();
    @Output() readonly addressPseudoSelected: EventEmitter<BaseAddress> = new EventEmitter<BaseAddress>();
    @Output() readonly addressNotChanged: EventEmitter<void> = new EventEmitter<void>();
    addAddressForm: FormGroup;
    preselectedAddress: BaseAddress;
    preselectedPhoneNumber: string;

    @ViewChild(AddressInputDirective) addressInput: AddressInputDirective;
    @ViewChild(IntlTelInputDirective) intlInput: IntlTelInputDirective;

    constructor(
        private formBuilder: FormBuilder,
        public formValidationService: FormValidationService,
        public sessionAddressService: SessionAddressService,
        private toasterWrapperService: ToasterWrapperService,
        private dialog: MatDialog,
        private clientService: ClientService,
        private addressesApiService: AddressesApiService,
        private addressesService: AddressesService) { }

    ngOnInit(): void {
        if (this.address) {
            this.preselectedAddress = this.address;
            this.preselectedPhoneNumber = this.address.phone1;

            this.addAddressForm = this.formBuilder.group({
                address: [this.address.address, Validators.required],
                comments: [this.address.comments],
                phone: [this.address.phone1, Validators.minLength(9)],
                floor: [this.address.floor],
                apartment: [this.address.apartment],
                interphone: [this.address.interphone]
            });
        } else {
            this.preselectedAddress = this.sessionAddressService._sessionAddress.getValue();
            this.preselectedPhoneNumber = this.clientService._client.getValue().phone;

            this.addAddressForm = this.formBuilder.group({
                address: ['', Validators.required],
                comments: [''],
                phone: [this.clientService._client.getValue().phone, Validators.minLength(9)],
                floor: [''],
                apartment: [''],
                interphone: ['']
            });
        }

        this.addAddressForm.controls.address.setValue(this.preselectedAddress.address);
    }

    submit(): void {
        this.addressInput.validateAddress(true);
    }

    selectedPlaceValidated(result: any): void {
        result.forcedValidation ? this.handleForcedValidation(result.selectedPlace) : this.handleValidation(result.selectedPlace);
    }

    private handleForcedValidation(place: google.maps.places.PlaceResult): void {
        let addressIsValid: boolean = false;
        let address: BaseAddress;

        if (place) {
            address = this.addressesService.composeAddressFromPlace(place);
            addressIsValid = this.addressesService.isDeliverable(address, true);
        }

        if (!addressIsValid) {
            this.addAddressForm.controls.address.setErrors({ invalidAddress: true });
            this.addAddressForm.controls.address.markAsDirty();
        }

        this.formValidationService
            .validateForm(this.addAddressForm, $('ri-header').outerHeight() + $('.input-title').outerHeight());

        if (!this.addAddressForm.valid || !addressIsValid) {
            this.addressNotChanged.emit();
        } else {
            this.submitParams(this.getRequestParams(address));
        }
    }

    private handleValidation(place: google.maps.places.PlaceResult): void {
        if (place) {
            const address: BaseAddress = this.addressesService.composeAddressFromPlace(place);
            this.addressPseudoSelected.emit(address);
        }
    }

    private submitParams(requestParams: ClientAddress): void {
        if (!requestParams.comments) {
            const confirmDialogData: ConfirmDialogData = {
                showSecondAction: true,
                descriptionLines: ['ADDRESS_VALIDATION_COMMENT_BLANK_WARNING']
            };

            const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
                data: confirmDialogData,
                panelClass: 'small-dialog'
            });

            dialogRef.afterClosed().subscribe((accept: boolean) => {
                if (accept) {
                    this.address ? this.confirmedEdit(requestParams) : this.confirmedAdd(requestParams);
                } else {
                    this.addressNotChanged.emit();
                }
            });
        } else {
            this.address ? this.confirmedEdit(requestParams) : this.confirmedAdd(requestParams);
        }
    }

    private confirmedAdd(requestParams: ClientAddress): void {
        this.addressesApiService.add(requestParams)
            .subscribe((addressResponse: GenericResponse) => {
                if (addressResponse.errors) {
                    this.addAddressForm.controls.address.setErrors({ custom: addressResponse.errors[0].message });
                    this.addAddressForm.controls.address.markAsDirty();
                } else {
                    this.addressChanged.emit(addressResponse.data);
                    this.toasterWrapperService.show('ADDRESS_ADDED', MessageType.Success);
                }
            });
    }

    private confirmedEdit(requestParams: ClientAddress): void {
        requestParams.id = this.address.id;
        this.addressesApiService.edit(requestParams)
            .subscribe((addressResponse: GenericResponse) => {
                if (addressResponse.errors) {
                    this.addAddressForm.controls.address.setErrors({ custom: addressResponse.errors[0].message });
                    this.addAddressForm.controls.address.markAsDirty();
                } else {
                    this.addressChanged.emit(addressResponse.data);
                    this.toasterWrapperService.show('ADDRESS_EDITED', MessageType.Success);
                }
            });
    }

    private getRequestParams(address: BaseAddress): ClientAddress {
        const addressParams: ClientAddress = _.merge(address,
            {
                comments: this.addAddressForm.value.comments,
                phone1: this.intlInput.getNumber(),
                floor: this.addAddressForm.value.floor,
                apartment: this.addAddressForm.value.apartment,
                interphone: this.addAddressForm.value.interphone,
                bis: 0
            }
        );

        return addressParams;
    }
}
