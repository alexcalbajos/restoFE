import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { DropinFormComponent } from '../dropin-form/dropin-form.component';

@Component({
    selector: 'ri-add-credit-card-dialog',
    templateUrl: 'add-credit-card-dialog.component.html',
    styleUrls: ['add-credit-card-dialog.component.scss']
})
export class AddCreditCardDialogComponent {
    dataLoaded: boolean;

    @ViewChild('dropinForm') dropinForm: DropinFormComponent;

    constructor(public dialogRef: MatDialogRef<AddCreditCardDialogComponent>) { }

    submitDropinForm(): void {
        this.dropinForm.addCard();
    }
}
