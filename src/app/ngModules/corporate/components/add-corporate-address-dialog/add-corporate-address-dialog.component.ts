import * as $ from 'jquery';
import * as _ from 'lodash';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
    BaseAddress, CorporateAddress, CorporateAddressParams
} from '../../../../models/address/address.model';
import { ApiSchedule, Schedule } from '../../../../models/corporate/schedule.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { AddressInputDirective } from '../../../shared/directives/address-input.directive';
import { AddressesService } from '../../../shared/services/business/addresses/addresses.service';
import {
    CorporateApiService
} from '../../../shared/services/business/corporate/corporate.api.service';
import { FormValidationService } from '../../../shared/services/helpers/form-validation.service';
import {
    CorporateScheduleTableComponent
} from '../corporate-schedule-table/corporate-schedule-table.component';

@Component({
    selector: 'ri-add-corporate-address-dialog',
    templateUrl: 'add-corporate-address-dialog.component.html',
    styleUrls: ['add-corporate-address-dialog.component.scss']
})
export class AddCorporateAddressDialogComponent implements OnInit {
    addCorporateAddressForm: FormGroup;
    morningSchedules: Array<Schedule>;
    eveningSchedules: Array<Schedule>;
    selectedSchedules: Array<ApiSchedule>;

    @ViewChild(AddressInputDirective) addressInput: AddressInputDirective;
    @ViewChild('corporateTable') corporateTable: CorporateScheduleTableComponent;

    constructor(
        @Inject(MAT_DIALOG_DATA) public address: CorporateAddress,
        private addressesService: AddressesService,
        private corporateApiService: CorporateApiService,
        private formBuilder: FormBuilder,
        public formValidationService: FormValidationService,
        public dialogRef: MatDialogRef<AddCorporateAddressDialogComponent>) {
        this.morningSchedules = this.getScheduleValues(7, 16);
        this.eveningSchedules = this.getScheduleValues(16, 2, true);
    }

    ngOnInit(): void {
        if (this.address) {
            this.addCorporateAddressForm = this.formBuilder.group({
                address: [this.address.address, Validators.required],
                comments: [this.address.comments],
                use_schedule: [this.address.use_schedule ? true : false],
                schedules: ''
            });

            if (this.address.schedules.length > 0) {
                this.selectedSchedules = this.address.schedules;
            }
        } else {
            this.addCorporateAddressForm = this.formBuilder.group({
                address: [''],
                comments: [''],
                use_schedule: [false],
                schedules: ''
            });
        }
    }

    onSubmit(): void {
        this.addressInput.validateAddress(true);
    }

    selectedPlaceValidated(result: any): void {
        if (!result.forcedValidation) return;

        let addressIsValid: boolean = false;
        let address: BaseAddress;

        if (result.selectedPlace) {
            address = this.addressesService.composeAddressFromPlace(result.selectedPlace);
            addressIsValid = this.addressesService.isDeliverable(address, true);
        }

        if (!addressIsValid) {
            this.addCorporateAddressForm.controls.address.setErrors({ invalidAddress: true });
            this.addCorporateAddressForm.controls.address.markAsDirty();
        }

        this.formValidationService.validateForm(this.addCorporateAddressForm, $('.input-title').outerHeight(), 'mat-dialog-container');

        if (!this.addCorporateAddressForm.valid) return;

        if (addressIsValid) {
            const requestParams: CorporateAddressParams = this.getRequestParams(address);
            const isCorporateTableValid: boolean = this.corporateTable.validate();

            if (!isCorporateTableValid) return;

            if (this.address) {
                this.editAddress(requestParams);
            } else {
                this.addAddress(requestParams);
            }
        }
    }

    scheduleChanged(): void {
        this.addCorporateAddressForm.controls.schedules.reset();
    }

    private getRequestParams(address: BaseAddress): CorporateAddressParams {
        const addressParams: CorporateAddressParams = _.merge(address,
            {
                comments: this.addCorporateAddressForm.value.comments,
                phone1: '',
                bis: 0,
                useSchedule: this.addCorporateAddressForm.value.use_schedule,
                schedules: []
            }
        );

        if (addressParams.useSchedule) {
            addressParams.schedules = this.corporateTable.getApiSchedulesFromSchedules();
        }

        return addressParams;
    }

    private editAddress(requestParams: CorporateAddressParams): void {
        this.corporateApiService.editAddress(this.address.id, requestParams)
            .subscribe((addressResponse: GenericResponse) => {
                this.handleResponse(addressResponse);
            });
    }

    private addAddress(requestParams: CorporateAddressParams): void {
        this.corporateApiService.addAddress(requestParams)
            .subscribe((addressResponse: GenericResponse) => {
                this.handleResponse(addressResponse);
            });
    }

    private handleResponse(response: GenericResponse): void {
        if (response.errors) {
            const schedulesErrorCode: number = 1419;
            if (response.errors[0].code === schedulesErrorCode) {
                this.addCorporateAddressForm.controls.schedules.setErrors({ custom: `ERR_${response.errors[0].code}` });
                this.addCorporateAddressForm.controls.schedules.markAsDirty();
            } else {
                this.addCorporateAddressForm.controls.address.setErrors({ custom: response.errors[0].message });
                this.addCorporateAddressForm.controls.address.markAsDirty();
            }
        } else {
            this.dialogRef.close(true);
        }
    }

    private getScheduleValues(startHour: number, endHour: number, isEndHourNextDay: boolean = false): Array<Schedule> {
        const scheduleValues: Array<Schedule> = [];

        let startDate: Date = new Date(2018, 1, 1, startHour, 0);
        const endDate: Date = isEndHourNextDay ? new Date(2018, 1, 2, endHour, 0) : new Date(2018, 1, 1, endHour, 0);

        while (startDate <= endDate) {
            const time: string = startDate.toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit' });
            scheduleValues.push({
                time,
                value: time.replace(':', ''),
                date: startDate
            });

            startDate = new Date(startDate.getTime() + 15 * 60000);
        }

        scheduleValues.unshift({
            time: 'Bloqué',
            value: 'Bloqué'
        });

        return scheduleValues;
    }
}
