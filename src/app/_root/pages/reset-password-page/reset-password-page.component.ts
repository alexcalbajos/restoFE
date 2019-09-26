import * as $ from 'jquery';

import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageType } from '../../../enums/message-type.enum';
import { Client } from '../../../models/client/client.model';
import { ResetPasswordParams } from '../../../models/client/reset-password-params.model';
import { GenericResponse } from '../../../models/response/generic-response.model';
import {
    ClientApiService
} from '../../../ngModules/shared/services/business/client/client.api.service';
import { ClientService } from '../../../ngModules/shared/services/business/client/client.service';
import {
    FormValidationService
} from '../../../ngModules/shared/services/helpers/form-validation.service';
import {
    ToasterWrapperService
} from '../../../ngModules/shared/services/helpers/toaster-wrapper.service';
import { STATIC_CONFIG, StaticConfig } from '../../static/config';

@Component({
    selector: 'ri-reset-password-page',
    templateUrl: 'reset-password-page.component.html',
    styleUrls: ['reset-password-page.component.scss']
})
export class ResetPasswordPageComponent implements OnInit {
    @HostBinding('class') class: string = 'template-page';
    dataLoaded: boolean;
    token: string;
    client: Client;
    resetPasswordForm: FormGroup;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private toasterWrapperService: ToasterWrapperService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        public formValidationService: FormValidationService,
        private clientService: ClientService,
        private clientApiService: ClientApiService) { }

    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.params.token;

        this.clientApiService.loginWithToken(this.token).subscribe((response: GenericResponse) => {
            if (response.errors) {
                this.toasterWrapperService.show(response.errors[0].message, MessageType.Error);
                this.router.navigateByUrl('/');
            } else if (response.data) {
                this.clientService.set({ login_token: response.data.loginToken });
                this.clientApiService.get(response.data.clientId).subscribe((client: Client) => {
                    this.client = client;
                    this.initForm();

                    this.dataLoaded = true;
                });
            }
        });
    }

    initForm(): void {
        this.resetPasswordForm = this.formBuilder.group({
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    onResetPasswordSubmit(): void {
        this.formValidationService.validateForm(this.resetPasswordForm, $('ri-header').outerHeight() + $('.input-title').outerHeight());

        if (!this.resetPasswordForm.valid) return;

        if (this.resetPasswordForm.controls.newPassword.value !== this.resetPasswordForm.controls.confirmPassword.value) {
            this.resetPasswordForm.controls.confirmPassword.setErrors({ noMatch: true });
            this.resetPasswordForm.controls.confirmPassword.markAsDirty();
        } else {
            this.clientApiService.resetPassword(this.getParams(this.resetPasswordForm.value), this.client.id)
                .subscribe((passwordResetResponse: GenericResponse) => {
                    if (passwordResetResponse.errors) {
                        if (passwordResetResponse.errors[0].property) {
                            this.resetPasswordForm.controls.newPassword.setErrors({ custom: passwordResetResponse.errors[0].message });
                            this.resetPasswordForm.controls.newPassword.markAsDirty();
                        }
                    } else {
                        this.toasterWrapperService.show('PASSWORD_CHANGED', MessageType.Success);
                        this.clientService.set(undefined);
                        this.router.navigateByUrl('/');
                    }
                });
        }
    }

    private getParams(resetPasswordForm: any): ResetPasswordParams {
        return {
            brandId: this.staticConfig.brandId,
            newPass: resetPasswordForm.newPassword,
            resetToken: this.token
        };
    }
}
