import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Code } from '../../../../models/corporate/code.model';
import { ConfirmDialogData } from '../../../../models/dialogs/confirm-dialog-data.model';
import {
    ConfirmDialogComponent
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
    CorporateApiService
} from '../../../shared/services/business/corporate/corporate.api.service';
import {
    AddCorporateCodeDialogComponent
} from '../add-corporate-code-dialog/add-corporate-code-dialog.component';
import { UploadCodesDialogComponent } from '../upload-codes-dialog/upload-codes-dialog.component';

@Component({
    selector: 'ri-corporate-codes',
    templateUrl: 'corporate-codes.component.html',
    styleUrls: ['corporate-codes.component.scss']
})
export class CorporateCodesComponent implements OnInit {
    codes: MatTableDataSource<Code>;
    activePage: number;
    pages: Array<any> = [];
    displayedColumns: Array<string> = ['code', 'expiration_date', 'actions'];
    dataLoaded: boolean;

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private dialog: MatDialog,
        private corporateApiService: CorporateApiService) { }

    ngOnInit(): void {
        this.getCodes(1);
    }

    getCodes(page: number): void {
        this.activePage = page;
        this.dataLoaded = false;

        this.corporateApiService.getCodes(page).subscribe((responseData: any) => {
            if (responseData.codes.length) {
                this.codes = new MatTableDataSource(responseData.codes);
                this.codes.sort = this.sort;
            } else {
                this.codes = new MatTableDataSource([]);
            }

            if (responseData.pageCount) {
                this.pages.length = responseData.pageCount;
            }

            this.dataLoaded = true;
        });
    }

    applyFilter(filterValue: string): void {
        this.codes.filter = filterValue.trim().toLowerCase();
    }

    uploadCodes(): void {
        const dialogRef: MatDialogRef<UploadCodesDialogComponent> = this.dialog.open(UploadCodesDialogComponent, {
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.getCodes(1);
            }
        });
    }

    addCode(): void {
        const dialogRef: MatDialogRef<AddCorporateCodeDialogComponent> = this.dialog.open(AddCorporateCodeDialogComponent, {
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.getCodes(1);
            }
        });
    }

    editCode(code: Code): void {
        const dialogRef: MatDialogRef<AddCorporateCodeDialogComponent> = this.dialog.open(AddCorporateCodeDialogComponent, {
            autoFocus: false,
            panelClass: 'small-dialog',
            data: code
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.getCodes(1);
            }
        });
    }

    deleteCode(code: Code): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: ['DELETE_ITEM'],
            descriptionLinesTranslationParam: [{ item: code.code }],
            showSecondAction: true
        };

        const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.corporateApiService.deleteCode(code.id).subscribe(() => {
                    this.getCodes(1);
                });
            }
        });
    }
}
