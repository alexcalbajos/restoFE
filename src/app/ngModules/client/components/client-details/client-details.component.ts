import 'intl-tel-input';

import * as $ from 'jquery';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { MessageType } from '../../../../enums/message-type.enum';
import { Client } from '../../../../models/client/client.model';
import { ClientsParams } from '../../../../models/client/clients-params.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { IntlTelInputDirective } from '../../../shared/directives/intl-tel-input.directive';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { FormValidationService } from '../../../shared/services/helpers/form-validation.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-client-details',
    templateUrl: 'client-details.component.html',
    styleUrls: ['client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
    userDetailsForm: FormGroup;
    client: Client;

    @ViewChild(IntlTelInputDirective) intlInput: IntlTelInputDirective;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private toasterWrapperService: ToasterWrapperService,
        public formValidationService: FormValidationService,
        private sessionAddressService: SessionAddressService,
        private clientService: ClientService,
        private clientApiService: ClientApiService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.client = this.clientService._client.getValue();

        this.userDetailsForm = this.formBuilder.group({
            first_name: [this.client.first_name, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(60)]
            ],
            last_name: [this.client.last_name, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(60)]],
            phone: [this.client.phone, [
                Validators.required,
                Validators.minLength(9),
                Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
            email: [this.client.email, [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        this.formValidationService
            .validateForm(this.userDetailsForm, $('ri-header').outerHeight() + $('.input-title').outerHeight());

        if (!this.userDetailsForm.valid) return;

        this.clientApiService.update(this.getRequestParams(this.userDetailsForm.value)).subscribe((clientsResponse: GenericResponse) => {
            if (clientsResponse.errors) {
                this.userDetailsForm = this.formValidationService
                    .setCustomErrors(this.userDetailsForm, clientsResponse.errors);
            } else {
                this.clientApiService.get(this.client.id).subscribe((client: Client) => {
                    this.clientService.set(client);
                    this.toasterWrapperService.show('INFO_UPDATED', MessageType.Success);
                });
            }
        });
    }

    private getRequestParams(userDetailsForm: any): ClientsParams {
        const phoneFullValue: string = this.intlInput.getNumber();

        return {
            clientId: this.client.id,
            first_name: userDetailsForm.first_name,
            last_name: userDetailsForm.last_name,
            email: userDetailsForm.email,
            phone: phoneFullValue,
            brandId: this.staticConfig.brandId,
            cityId: this.sessionAddressService._sessionAddress.getValue().deliveryCity.id,
            news: this.clientService._client.getValue().newsletter,
            sms: this.clientService._client.getValue().sms,
            gdpr_accept: this.clientService._client.getValue().gdpr_accept
        };
    }
}
