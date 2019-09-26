import * as $ from 'jquery';

import {
    AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { EmailCheck } from '../../../../enums/email-check.enum';
import { MessageType } from '../../../../enums/message-type.enum';
import { Client } from '../../../../models/client/client.model';
import { LoginParams } from '../../../../models/client/login-params.model';
import { Product } from '../../../../models/provider/product.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import { FormValidationService } from '../../../shared/services/helpers/form-validation.service';
import { GooglAnalyticsService } from '../../../shared/services/helpers/google-analytics.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-login-form',
    templateUrl: 'login-form.component.html',
    styleUrls: ['login-form.component.scss']
})

export class LoginFormComponent implements OnInit, AfterViewInit {
    @Input() email: string;
    loginForm: FormGroup;
    disableRestorePassword: boolean;
    disableLogin: boolean;
    @Output() readonly emailChanged: EventEmitter<string> = new EventEmitter<string>();
    @Output() readonly clientLoggedIn: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('passwordInput') passwordInput: ElementRef;

    constructor(
        @Inject(STATIC_CONFIG) public staticConfig: StaticConfig,
        private formBuilder: FormBuilder,
        private cartService: CartService,
        public formValidationService: FormValidationService,
        private clientApiService: ClientApiService,
        private toasterWrapperService: ToasterWrapperService,
        private googlAnalyticsService: GooglAnalyticsService,
        private clientService: ClientService) { }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: [this.email, [Validators.required]],
            password: ['', [Validators.required]],
            stayConnected: [true]
        });
    }

    ngAfterViewInit(): void {
        this.passwordInput.nativeElement.focus();
    }

    onSubmit(): void {
        this.formValidationService.validateForm(this.loginForm, $('ri-header').outerHeight() + $('.input-title').outerHeight());

        if (!this.loginForm.valid) return;

        this.disableLogin = true;

        this.clientApiService.login(this.getRequestParams(this.loginForm.value)).subscribe((loginResponse: GenericResponse) => {
            if (loginResponse.errors && loginResponse.errors[0].code === EmailCheck.WrongPassword) {
                this.loginForm.controls.password.setErrors({ invalidPassword: true });
                this.loginForm.controls.password.markAsDirty();
                this.disableLogin = false;
            } else {
                this.clientService.set({
                    login_token: loginResponse.data.loginToken,
                    doNotCache: !this.loginForm.value.stayConnected
                });
                this.clientApiService.get(loginResponse.data.clientId).subscribe((client: Client) => {
                    if (this.clientService.isAccountExpired(client)) {
                        this.toasterWrapperService.show('ACCOUNT_EXPIRED', MessageType.Error);
                    } else {
                        client.doNotCache = !this.loginForm.value.stayConnected;
                        this.clientService.set(client);

                        if (client.attached_clients) {
                            this.cartService._cart.getValue().products.forEach((product: Product) => {
                                this.cartService.attachClientToProduct(product, client.selectedAttachedClient);
                            });
                            this.cartService.onCartChange(this.cartService._cart.getValue());
                        }

                        this.googlAnalyticsService.pushEvent(client.id.toString(), 'USER_ID');
                        this.clientLoggedIn.emit();
                    }

                    this.disableLogin = false;
                });
            }
        });
    }

    watchForEmailChange(): void {
        const email: string = this.loginForm.controls.email.value;

        if (email !== this.email) {
            this.emailChanged.emit(email);
        }
    }

    restorePassword(): void {
        this.disableRestorePassword = true;

        this.clientApiService
            .recoverPassword(this.email, this.staticConfig.brandId)
            .subscribe((response: GenericResponse) => {
                if (response.errors) {
                    this.loginForm.controls.email.setErrors({ custom: response.errors[0].message });
                    this.loginForm.controls.email.markAsDirty();
                } else {
                    this.toasterWrapperService.show('RESET_PASSWORD_SENT', MessageType.Success);
                }

                this.disableRestorePassword = false;
            });
    }

    private getRequestParams(loginForm: any): LoginParams {
        return {
            login: loginForm.email,
            password: loginForm.password,
            brandId: this.staticConfig.brandId
        };
    }
}
