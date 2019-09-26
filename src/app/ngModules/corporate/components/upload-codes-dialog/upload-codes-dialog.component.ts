import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { GenericResponse } from '../../../../models/response/generic-response.model';
import {
    CorporateApiService
} from '../../../shared/services/business/corporate/corporate.api.service';

@Component({
    selector: 'ri-upload-codes-dialog',
    templateUrl: 'upload-codes-dialog.component.html',
    styleUrls: ['upload-codes-dialog.component.scss']
})
export class UploadCodesDialogComponent {
    fileToUpload: File = undefined;
    error: string;

    constructor(
        private corporateApiService: CorporateApiService,
        public dialogRef: MatDialogRef<UploadCodesDialogComponent>) { }

    setFile(files: FileList): void {
        this.fileToUpload = files.item(0);
        this.error = undefined;
    }

    upload(): void {
        this.corporateApiService.uploadCodes(this.fileToUpload).subscribe((genericRespons: GenericResponse) => {
            if (genericRespons.errors) {
                this.error = genericRespons.errors[0].message;
            } else {
                this.error = undefined;
                this.dialogRef.close(true);
            }
        });
    }
}
