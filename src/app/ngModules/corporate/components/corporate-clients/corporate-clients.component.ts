import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CorporateClient, Division } from '../../../../models/client/client.model';
import { ConfirmDialogData } from '../../../../models/dialogs/confirm-dialog-data.model';
import {
    ConfirmDialogComponent
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    CorporateApiService
} from '../../../shared/services/business/corporate/corporate.api.service';
import { DatesHelperService } from '../../../shared/services/helpers/dates-helper.service';
import {
    AddCorporateClientDialogComponent
} from '../add-corporate-client-dialog/add-corporate-client-dialog.component';

@Component({
    selector: 'ri-corporate-clients',
    templateUrl: 'corporate-clients.component.html',
    styleUrls: ['corporate-clients.component.scss']
})
export class CorporateClientsComponent implements OnInit {
    clients: MatTableDataSource<CorporateClient>;
    selectedClient: CorporateClient;
    activePage: number;
    pages: Array<any> = [];
    displayedColumns: Array<string> = [
        'select', 'first_name', 'last_name', 'email', 'phone', 'account_expiration_date'
    ];
    dataLoaded: boolean;
    inputTimeout: any;
    divisions: Array<Division>;

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private datesHelperService: DatesHelperService,
        private dialog: MatDialog,
        private clientService: ClientService,
        private clientApiService: ClientApiService,
        private corporateApiService: CorporateApiService) { }

    ngOnInit(): void {
        this.getClients(1);

        if (this.clientService._client.getValue().isSocGen) {
            this.clientApiService.getDivisions().subscribe((divisions: Array<Division>) => {
                this.divisions = divisions;
            });
        }
    }

    getClients(page: number, searchValue?: string): void {
        this.activePage = page;
        this.dataLoaded = false;
        this.selectedClient = undefined;

        this.corporateApiService.getClients(page, searchValue).subscribe((responseData: any) => {
            if (responseData.users.length) {

                responseData.users.forEach((client: CorporateClient) => {
                    this.datesHelperService.clearInvalidDate(client, 'account_expiration_date');
                });

                this.clients = new MatTableDataSource(responseData.users);
                this.clients.sort = this.sort;
            } else {
                this.clients = new MatTableDataSource([]);
            }

            if (responseData.pageCount) {
                this.pages.length = responseData.pageCount;
            }

            this.dataLoaded = true;
        });
    }

    applyFilter(filterValue: string): void {
        clearTimeout(this.inputTimeout);

        this.inputTimeout = setTimeout(() => {
            this.getClients(1, filterValue);
        }, 1000);
    }

    addClient(): void {
        const dialogRef: MatDialogRef<AddCorporateClientDialogComponent> = this.dialog.open(AddCorporateClientDialogComponent, {
            autoFocus: false,
            data: { divisions: this.divisions }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.getClients(1);
            }
        });
    }

    editClient(): void {
        const dialogRef: MatDialogRef<AddCorporateClientDialogComponent> = this.dialog.open(AddCorporateClientDialogComponent, {
            data: { divisions: this.divisions, client: this.selectedClient },
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.getClients(1);
            }
        });
    }

    deleteClient(): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: ['DELETE_ITEM'],
            descriptionLinesTranslationParam: [{ item: `${this.selectedClient.first_name} ${this.selectedClient.last_name}` }],
            showSecondAction: true
        };

        const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.corporateApiService.deleteClient(this.selectedClient.id).subscribe(() => {
                    this.getClients(1);
                });
            }
        });
    }

    changePassword(): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: ['RESTORE_PASSWORD'],
            descriptionLinesTranslationParam: [{ client: `${this.selectedClient.first_name} ${this.selectedClient.last_name}` }],
            showSecondAction: true
        };

        const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.corporateApiService.resetClientPassword(this.selectedClient.id).subscribe(() => {
                    this.getClients(1);
                });
            }
        });
    }
}
