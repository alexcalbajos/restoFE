import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { MessageType } from '../../../../enums/message-type.enum';
import { Client } from '../../../../models/client/client.model';
import { ConfirmDialogData } from '../../../../models/dialogs/confirm-dialog-data.model';
import {
    ConfirmDialogComponent
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import { LoggerService } from '../../../shared/services/helpers/logger.service';
import { MetaService } from '../../../shared/services/helpers/meta.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-info-page',
    templateUrl: 'info-page.component.html',
    styleUrls: ['info-page.component.scss']
})
export class InfoPageComponent implements OnInit {
    walletContainerLayout: string;
    walletClass: string;

    constructor(
        @Inject(STATIC_CONFIG) public staticConfig: StaticConfig,
        private clientApiService: ClientApiService,
        private metaService: MetaService,
        private clientService: ClientService,
        private loggerService: LoggerService,
        private toasterWrapperService: ToasterWrapperService,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.setWalletContainer();

        this.metaService.setMeta({
            title: 'MY_ACCOUNT',
            description: 'MY_ACCOUNT_DESCRIPTION'
        });
    }

    deleteAccount(): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: ['DROPOUT_FROM_RI_CONFIRMATION'],
            showSecondAction: true
        };

        const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.clientApiService.delete(this.clientService._client.getValue().id).subscribe(() => {
                    this.loggerService.log('Logout From Info Page', MessageType.Warning);
                    this.clientService.logout();
                    this.toasterWrapperService.show('INFO_DELETED', MessageType.Success);
                });
            }
        });
    }

    setWalletContainer(): void {
        const client: Client = this.clientService._client.getValue();

        if (client.isCorporate) {
            this.walletContainerLayout = 'row-reverse';
            this.walletClass = 'invis';
        } else {
            this.walletContainerLayout = 'row';
            this.walletClass = '';
        }
    }
}
