import * as $ from 'jquery';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { MessageType } from '../../../../enums/message-type.enum';
import { LoginParams } from '../../../../models/client/login-params.model';
import { PasswordParams } from '../../../../models/client/password-params.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import { FormValidationService } from '../../../shared/services/helpers/form-validation.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-client-password',
    templateUrl: 'client-password.component.html',
    styleUrls: ['client-password.component.scss']
})
export class ClientPassowrdComponent implements OnInit {
    currentPasswordForm: FormGroup;
    showRestoreForm: boolean;
    newPasswordForm: FormGroup;
    clientPassword: string;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private formBuilder: FormBuilder,
        public formValidationService: FormValidationService,
        private clientApiService: ClientApiService,
        private toasterWrapperService: ToasterWrapperService,
        private clientService: ClientService) { }

    ngOnInit(): void {
        this.currentPasswordForm = this.formBuilder.group({
            password: ['', [Validators.required]]
        });

        this.newPasswordForm = this.formBuilder.group({
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    onCurrentPasswordSubmit(): void {
        this.formValidationService.validateForm(this.currentPasswordForm, $('ri-header').outerHeight() + $('.input-title').outerHeight());

        if (!this.currentPasswordForm.valid) return;

        this.clientApiService.login(this.getLoginParams(this.currentPasswordForm.value)).subscribe((loginResponse: GenericResponse) => {
            if (loginResponse.errors) {
                this.currentPasswordForm.controls.password.setErrors({ invalidPassword: true });
                this.currentPasswordForm.controls.password.markAsDirty();
            } else {
                this.clientPassword = this.currentPasswordForm.value.password;
                this.currentPasswordForm.reset();
                this.showRestoreForm = true;
            }
        });
    }

    restorePassword(): void {
        this.clientApiService
            .recoverPassword(this.clientService._client.getValue().email, this.staticConfig.brandId)
            .subscribe((response: GenericResponse) => {
                if (response.errors) {
                    this.toasterWrapperService.show('WE_ARE_SORRY', MessageType.Error);
                } else {
                    this.toasterWrapperService.show('RESET_PASSWORD_SENT', MessageType.Success);
                }
            });
    }

    onNewPasswordSubmit(): void {
        this.formValidationService.validateForm(this.newPasswordForm, $('ri-header').outerHeight() + $('.input-title').outerHeight());

        if (!this.newPasswordForm.valid) return;

        if (this.newPasswordForm.controls.newPassword.value !== this.newPasswordForm.controls.confirmPassword.value) {
            this.newPasswordForm.controls.confirmPassword.setErrors({ noMatch: true });
            this.newPasswordForm.controls.confirmPassword.markAsDirty();
        } else {
            this.clientApiService.changePassword(this.getPasswordParams(this.newPasswordForm.value))
                .subscribe((passwordResponse: GenericResponse) => {
                    if (passwordResponse.errors) {
                        if (passwordResponse.errors[0].property) {
                            this.newPasswordForm.controls.newPassword.setErrors({ custom: passwordResponse.errors[0].message });
                            this.newPasswordForm.controls.newPassword.markAsDirty();
                        } else {
                            this.newPasswordForm.controls.currentPassword.setErrors({ custom: passwordResponse.errors[0].message });
                            this.newPasswordForm.controls.currentPassword.markAsDirty();
                        }
                    } else {
                        this.toasterWrapperService.show('PASSWORD_CHANGED', MessageType.Success);
                        this.clientPassword = undefined;
                        this.newPasswordForm.reset();
                        this.showRestoreForm = false;
                    }
                });
        }
    }

    private getLoginParams(currentPasswordForm: any): LoginParams {
        return {
            login: this.clientService._client.getValue().email,
            password: currentPasswordForm.password,
            brandId: this.staticConfig.brandId
        };
    }

    private getPasswordParams(newPasswordForm: any): PasswordParams {
        return {
            clientId: this.clientService._client.getValue().id,
            oldPassword: this.clientPassword,
            password: newPasswordForm.newPassword
        };
    }
}
