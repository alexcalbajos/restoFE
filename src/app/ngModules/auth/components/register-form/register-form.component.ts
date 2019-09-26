import 'intl-tel-input';

import * as $ from 'jquery';
import * as _ from 'lodash';

import {
    AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {
    GdprDialogComponent
} from '../../../../_root/components/gdpr-dialog/gdpr-dialog.component';
import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { MessageType } from '../../../../enums/message-type.enum';
import { BoursamaEmails, SocGenEmails } from '../../../../enums/soc-gen-emails.enum';
import { Client, Division } from '../../../../models/client/client.model';
import { RegisterParams } from '../../../../models/client/register-params.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { IntlTelInputDirective } from '../../../shared/directives/intl-tel-input.directive';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { FormValidationService } from '../../../shared/services/helpers/form-validation.service';
import { GooglAnalyticsService } from '../../../shared/services/helpers/google-analytics.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-register-form',
    templateUrl: 'register-form.component.html',
    styleUrls: ['register-form.component.scss']
})

export class RegisterFormComponent implements OnInit, AfterViewInit {
    @Input() email: string;
    registerForm: FormGroup;
    isBoursorama: boolean;
    isSocGen: boolean;
    divisions: Array<Division> = [];
    inputTimeout: any;
    disableRegister: boolean;
    @Output() readonly clientRegistered: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild(IntlTelInputDirective) intlInput: IntlTelInputDirective;
    @ViewChild('firstNameInput') firstNameInput: ElementRef;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        public formValidationService: FormValidationService,
        private clientApiService: ClientApiService,
        private toasterWrapperService: ToasterWrapperService,
        private sessionAddressService: SessionAddressService,
        private googlAnalyticsService: GooglAnalyticsService,
        private clientService: ClientService) { }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
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
                Validators.maxLength(10),
                Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
            email: [this.email, [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            gdpr: ['', Validators.requiredTrue],
            newsletter: [],
            stayConnected: [true],
            division: undefined
        });
    }

    ngAfterViewInit(): void {
        this.firstNameInput.nativeElement.focus();
    }

    onSubmit(): void {
        this.formValidationService.validateForm(this.registerForm, $('ri-header').outerHeight() + $('.input-title').outerHeight());

        if (!this.registerForm.valid) {
            if (this.registerForm.controls.gdpr.invalid) {
                this.toasterWrapperService.show('GDPR_NOT_ACCEPTED', MessageType.Warning);
            }

            return;
        }

        this.disableRegister = true;

        this.clientApiService.register(this.getRequestParams(this.registerForm.value)).subscribe((registerResponse: GenericResponse) => {
            if (registerResponse.errors) {
                this.registerForm =
                    this.formValidationService.setCustomErrors(this.registerForm, registerResponse.errors, true);
            } else {
                this.clientService.set({
                    login_token: registerResponse.data.login_token,
                    doNotCache: !this.registerForm.value.stayConnected
                });
                this.clientApiService.get(registerResponse.data.id).subscribe((client: Client) => {
                    client.doNotCache = !this.registerForm.value.stayConnected;
                    this.clientService.set(client);
                    this.googlAnalyticsService.pushEvent('InscriptionValid');
                    this.clientRegistered.emit();
                });
            }

            this.disableRegister = false;
        });
    }

    watchForSocGen(): void {
        clearTimeout(this.inputTimeout);

        this.inputTimeout = setTimeout(() => {
            const email: string = this.registerForm.controls.email.value;

            this.isBoursorama = _.some(BoursamaEmails, (boursamaEmail: any) => {
                if (isNaN(boursamaEmail)) {
                    return email.includes(boursamaEmail);
                }
            });

            if (!this.isBoursorama) {
                this.isSocGen = _.some(SocGenEmails, (socGenEmail: any) => {
                    if (isNaN(socGenEmail)) {
                        return email.includes(socGenEmail);
                    }
                });

                if (this.isSocGen && this.divisions.length < 1) {
                    this.clientApiService.getDivisions().subscribe((divisions: Array<Division>) => {
                        this.divisions = divisions;
                    });
                }
            } else {
                this.isSocGen = false;
            }

            if (!this.isSocGen) {
                this.divisions = [];
                this.registerForm.controls.division.setValue(undefined);
            }
        }, 1000);
    }

    openGdpr(): void {
        const dialog: MatDialogRef<GdprDialogComponent> = this.dialog.open(GdprDialogComponent, {
            autoFocus: false,
            disableClose: true,
            closeOnNavigation: false
        });

        dialog.afterClosed().subscribe((closeResult: boolean) => {
            this.registerForm.controls.gdpr.setValue(closeResult);
        });
    }

    private getRequestParams(registerForm: any): RegisterParams {
        const phoneFullValue: string = this.intlInput.getNumber();

        const params: RegisterParams = {
            first_name: registerForm.first_name,
            last_name: registerForm.last_name,
            email: registerForm.email,
            phone: phoneFullValue,
            password: registerForm.password,
            brandId: this.staticConfig.brandId,
            cityId: this.sessionAddressService._sessionAddress.getValue().deliveryCity.id,
            gdpr_accept: registerForm.gdpr,
            newsletter: registerForm.newsletter
        };

        if (registerForm.division) {
            params.divisionId = registerForm.division.id;
        }

        return params;
    }
}
