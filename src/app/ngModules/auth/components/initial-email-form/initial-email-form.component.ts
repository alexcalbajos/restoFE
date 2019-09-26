import * as $ from 'jquery';

import {
    AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { EmailCheck } from '../../../../enums/email-check.enum';
import { MessageType } from '../../../../enums/message-type.enum';
import { LoginParams } from '../../../../models/client/login-params.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { FormValidationService } from '../../../shared/services/helpers/form-validation.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-initial-email-form',
    templateUrl: 'initial-email-form.component.html',
    styleUrls: ['initial-email-form.component.scss']
})

export class InitialEmailFormComponent implements OnInit, AfterViewInit {
    @Input() email: string;
    authForm: FormGroup;
    disableContinue: boolean;
    @Output() readonly validEmail: EventEmitter<string> = new EventEmitter<string>();
    @Output() readonly newEmail: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('emailInput') emailInput: ElementRef;

    constructor(
        @Inject(STATIC_CONFIG) public staticConfig: StaticConfig,
        private clientApiService: ClientApiService,
        private toasterWrapperService: ToasterWrapperService,
        public formValidationService: FormValidationService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.authForm = this.formBuilder.group({
            email: [this.email, [Validators.required, Validators.email]]
        });
    }

    ngAfterViewInit(): void {
        this.emailInput.nativeElement.focus();
    }

    onSubmit(): void {
        this.formValidationService.validateForm(this.authForm, $('ri-header').outerHeight() + $('.input-title').outerHeight());

        if (!this.authForm.valid) return;

        this.disableContinue = true;

        this.clientApiService.login(this.getRequestParams(this.authForm.value)).subscribe((loginResponse: GenericResponse) => {
            this.disableContinue = false;

            if (!loginResponse.errors) {
                this.toasterWrapperService.show('WE_ARE_SORRY', MessageType.Error);

                return;
            }

            if (loginResponse.errors[0].code === EmailCheck.WrongPassword) {
                this.validEmail.emit(this.authForm.value.email);
            }

            if (loginResponse.errors[0].code === EmailCheck.WrongEmail) {
                this.newEmail.emit(this.authForm.value.email);
            }
        });
    }

    private getRequestParams(authForm: any): LoginParams {
        return {
            login: authForm.email,
            password: '',
            brandId: this.staticConfig.brandId
        };
    }
}
