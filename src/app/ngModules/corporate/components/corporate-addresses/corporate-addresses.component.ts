import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CorporateAddress } from '../../../../models/address/address.model';
import { ConfirmDialogData } from '../../../../models/dialogs/confirm-dialog-data.model';
import {
    ConfirmDialogComponent
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
    CorporateApiService
} from '../../../shared/services/business/corporate/corporate.api.service';
import {
    AddCorporateAddressDialogComponent
} from '../add-corporate-address-dialog/add-corporate-address-dialog.component';

@Component({
    selector: 'ri-corporate-addresses',
    templateUrl: 'corporate-addresses.component.html',
    styleUrls: ['corporate-addresses.component.scss']
})
export class CorporateAddressesComponent implements OnInit {
    addresses: MatTableDataSource<CorporateAddress>;
    displayedColumns: Array<string> = ['address', 'comments', 'actions'];
    dataLoaded: boolean;

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private dialog: MatDialog,
        private corporateApiService: CorporateApiService) { }

    ngOnInit(): void {
        this.getAddresses();
    }

    getAddresses(): void {
        this.dataLoaded = false;

        this.corporateApiService.getAddresses(1).subscribe((addresses: any) => {
            this.addresses = new MatTableDataSource(addresses);
            this.addresses.sort = this.sort;
            this.dataLoaded = true;
        });
    }

    applyFilter(filterValue: string): void {
        this.addresses.filter = filterValue.trim().toLowerCase();
    }

    addAddress(): void {
        const dialogRef: MatDialogRef<AddCorporateAddressDialogComponent> = this.dialog.open(AddCorporateAddressDialogComponent, {
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.getAddresses();
            }
        });
    }

    editAddress(address: CorporateAddress): void {
        const dialogRef: MatDialogRef<AddCorporateAddressDialogComponent> = this.dialog.open(AddCorporateAddressDialogComponent, {
            autoFocus: false,
            data: address
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.getAddresses();
            }
        });
    }

    deleteAddress(address: CorporateAddress): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: ['DELETE_ITEM'],
            descriptionLinesTranslationParam: [{ item: address.address }],
            showSecondAction: true
        };

        const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.corporateApiService.deleteAddress(address.id).subscribe(() => {
                    this.getAddresses();
                });
            }
        });
    }
}
