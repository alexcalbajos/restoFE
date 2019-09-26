import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ClientAddress } from '../../../../models/address/address.model';
import { ClientService } from '../../services/business/client/client.service';

@Component({
    selector: 'ri-change-selected-address-dialog',
    templateUrl: 'change-selected-address-dialog.component.html',
    styleUrls: ['change-selected-address-dialog.component.scss']
})
export class ChangeSelectedAddressDialogComponent implements OnInit {
    addressess: Array<ClientAddress>;
    allowAdd: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public clientService: ClientService,
        public dialogRef: MatDialogRef<ChangeSelectedAddressDialogComponent>) { }

    ngOnInit(): void {
        this.addressess = this.data.addressess;
        this.allowAdd = this.data.allowAdd;
    }
}
