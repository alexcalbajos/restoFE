import * as $ from 'jquery';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { Code } from '../../../../models/corporate/code.model';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    CorporateApiService
} from '../../../shared/services/business/corporate/corporate.api.service';
import { FormValidationService } from '../../../shared/services/helpers/form-validation.service';

@Component({
    selector: 'ri-add-corporate-code-dialog',
    templateUrl: 'add-corporate-code-dialog.component.html',
    styleUrls: ['add-corporate-code-dialog.component.scss']
})
export class AddCorporateCodeDialogComponent implements OnInit {
    addCodeForm: FormGroup;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        @Inject(MAT_DIALOG_DATA) public code: Code,
        private clientService: ClientService,
        private formBuilder: FormBuilder,
        public formValidationService: FormValidationService,
        private corporateApiService: CorporateApiService,
        public dialogRef: MatDialogRef<AddCorporateCodeDialogComponent>) { }

    ngOnInit(): void {
        if (this.code) {
            this.addCodeForm = this.formBuilder.group({
                code: [this.code.code, Validators.required],
                date: [this.code.expiration_date ? new Date(this.code.expiration_date) : '']
            });
        } else {
            this.addCodeForm = this.formBuilder.group({
                code: ['', Validators.required],
                date: ['']
            });
        }
    }

    onSubmit(): void {
        this.formValidationService.validateForm(this.addCodeForm, $('.input-title').outerHeight(), 'mat-dialog-container');

        if (!this.addCodeForm.valid) return;

        if (this.code) {
            this.corporateApiService.editCode(this.code.id, this.getRequestParams(this.addCodeForm.value)).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.corporateApiService.addCode(this.getRequestParams(this.addCodeForm.value)).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    private getRequestParams(addCodeForm: any): Code {
        let expirationDate: string;

        if (addCodeForm.date) {
            expirationDate = addCodeForm.date
                .toLocaleDateString('en', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\u200E/g, '');
        }

        return {
            clientId: this.clientService._client.getValue().id,
            brandId: this.staticConfig.brandId,
            code: this.addCodeForm.value.code,
            expirationDate
        };
    }

}
