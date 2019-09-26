import 'intl-tel-input';

import * as $ from 'jquery';
import * as _ from 'lodash';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { CorporateClient, Division } from '../../../../models/client/client.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { IntlTelInputDirective } from '../../../shared/directives/intl-tel-input.directive';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    CorporateApiService
} from '../../../shared/services/business/corporate/corporate.api.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { DatesHelperService } from '../../../shared/services/helpers/dates-helper.service';
import { FormValidationService } from '../../../shared/services/helpers/form-validation.service';
import {
    CorporateClientOrderAmountTableComponent
} from '../corporate-client-order-amount-table/corporate-client-order-amount-table.component';

@Component({
    selector: 'ri-add-corporate-client-dialog',
    templateUrl: 'add-corporate-client-dialog.component.html',
    styleUrls: ['add-corporate-client-dialog.component.scss']
})
export class AddCorporateClientDialogComponent implements OnInit {
    addCorporateClientForm: FormGroup;
    selectedOrderAmounts: string;
    fullName: string;
    client: CorporateClient;
    divisions: Array<Division>;

    @ViewChild(IntlTelInputDirective) phoneInput: IntlTelInputDirective;
    @ViewChild('corporateTable') corporateTable: CorporateClientOrderAmountTableComponent;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private corporateApiService: CorporateApiService,
        private clientService: ClientService,
        public formValidationService: FormValidationService,
        private formBuilder: FormBuilder,
        private datesHelperService: DatesHelperService,
        public sessionAddressService: SessionAddressService,
        public dialogRef: MatDialogRef<AddCorporateClientDialogComponent>) { }

    ngOnInit(): void {
        this.client = this.data.client;
        this.divisions = this.data.divisions;

        if (this.client) {
            this.fullName = [this.client.first_name, this.client.last_name].join(' ');
            this.prepareEditForm();
            this.selectedOrderAmounts = this.client.max_order_amount_json;
        } else {
            this.prepareAddForm();
        }
    }

    onSubmit(): void {
        this.formValidationService.validateForm(this.addCorporateClientForm, $('.input-title').outerHeight(), 'mat-dialog-container');

        if (!this.addCorporateClientForm.valid) return;

        if (this.client) {
            this.editClient();
        } else {
            this.addClient();
        }
    }

    private prepareEditForm(): void {
        this.addCorporateClientForm = this.formBuilder.group({
            first_name: [this.client.first_name, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(60)]],
            last_name: [this.client.last_name, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(60)]],
            phone: [this.client.phone, [
                Validators.required,
                Validators.minLength(9),
                Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
            email: [this.client.email, [Validators.required, Validators.email]],
            account_expiration_date: [this.client.account_expiration_date ?
                this.datesHelperService.getDateForSafari(this.client.account_expiration_date) : ''],
            division: _.find(this.divisions, { id: this.client.division_id })
        });
    }

    private prepareAddForm(): void {
        this.addCorporateClientForm = this.formBuilder.group({
            first_name: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(60)]],
            last_name: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(60)]],
            phone: ['', [
                Validators.required,
                Validators.minLength(9),
                Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
            email: ['', [Validators.required, Validators.email]],
            account_expiration_date: [''],
            division: undefined
        });
    }

    private editClient(): void {
        this.corporateApiService
            .editClient(this.client.id, this.getRequestParams(this.addCorporateClientForm.value))
            .subscribe((editClientResponse: GenericResponse) => {
                this.handleResponse(editClientResponse);
            });
    }

    private addClient(): void {
        this.corporateApiService
            .addClient(this.getRequestParams(this.addCorporateClientForm.value))
            .subscribe((addClientResponse: GenericResponse) => {
                this.handleResponse(addClientResponse);
            });
    }

    private handleResponse(response: GenericResponse): void {
        if (response.errors) {
            this.addCorporateClientForm =
                this.formValidationService.setCustomErrors(this.addCorporateClientForm, response.errors);
        } else {
            this.dialogRef.close(true);
        }
    }

    private getRequestParams(addCorporateClientForm: any): CorporateClient {
        const phoneFullValue: string = this.phoneInput.getNumber();

        let accountExpirationDate: string;
        let expiration: string;

        if (addCorporateClientForm.account_expiration_date) {
            accountExpirationDate = addCorporateClientForm.account_expiration_date.toISOString();
            expiration = addCorporateClientForm.account_expiration_date
                .toLocaleDateString('en', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\u200E/g, '');
        }

        const params: CorporateClient = {
            account_expiration_date: accountExpirationDate,
            brandId: this.staticConfig.brandId,
            cityId: this.sessionAddressService._sessionAddress.getValue().deliveryCity.id,
            clientId: this.clientService._client.getValue().id,
            email: addCorporateClientForm.email,
            expiration,
            first_name: addCorporateClientForm.first_name,
            last_name: addCorporateClientForm.last_name,
            phone: phoneFullValue,
            max_order_amount_json: this.corporateTable.getApiOrderAmountsFromOrderAmounts()
        };

        if (this.divisions && addCorporateClientForm.division) {
            params.division_id = addCorporateClientForm.division.id;
        }

        return params;
    }
}
