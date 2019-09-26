import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Provider } from '../../../../models/provider/provider.model';

@Component({
    selector: 'ri-eta-change-dialog',
    templateUrl: './eta-change-dialog.component.html',
    styleUrls: ['./eta-change-dialog.component.scss']
})
export class EtaChangeDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<EtaChangeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public provider: Provider) { }
}
