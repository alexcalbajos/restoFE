import * as _ from 'lodash';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Provider, SellingPoint } from '../../../../models/provider/provider.model';
import {
    ProviderDetailsDialogComponent
} from '../provider-details-dialog/provider-details-dialog.component';

@Component({
    selector: 'ri-allergies-dialog',
    templateUrl: './allergies-dialog.component.html',
    styleUrls: ['./allergies-dialog.component.scss']
})
export class AllergiesDialogComponent implements OnInit {
    phoneNumber: string;
    phoneNumberRef: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public provider: Provider,
        public dialogRef: MatDialogRef<ProviderDetailsDialogComponent>) { }

    ngOnInit(): void {
        const closestSellingPoint: SellingPoint = _.find(this.provider.selling_points, { isClosest: true });
        this.phoneNumber = closestSellingPoint.tel;
        this.phoneNumberRef = `tel:${this.phoneNumber}`;
    }
}
