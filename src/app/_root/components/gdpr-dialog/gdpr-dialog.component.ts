import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'ri-gdpr-dialog',
    templateUrl: 'gdpr-dialog.component.html',
    styleUrls: ['gdpr-dialog.component.scss']
})
export class GdprDialogComponent {
    constructor(public dialogRef: MatDialogRef<GdprDialogComponent>) { }
}
