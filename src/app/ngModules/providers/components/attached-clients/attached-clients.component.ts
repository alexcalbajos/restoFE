import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AttachedClient, Client } from '../../../../models/client/client.model';
import { CartService } from '../../../shared/services/business/cart/cart.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    AttachedClientsDialogComponent
} from '../attached-clients-dialog/attached-clients-dialog.component';

@Component({
    selector: 'ri-attached-clients',
    templateUrl: 'attached-clients.component.html',
    styleUrls: ['attached-clients.component.scss']
})
export class AttachedClientsComponent implements OnInit, OnDestroy {
    checkedAttachedClients: Array<AttachedClient>;
    selectedAttachedClient: AttachedClient;

    constructor(
        private cartService: CartService,
        private dialog: MatDialog,
        private clientService: ClientService) { }

    ngOnInit(): void {
        this.clientService.client$.pipe(untilDestroyed(this)).subscribe((client: Client) => {
            if (client && client.id && client.attached_clients) {
                this.checkedAttachedClients = _.filter(client.attached_clients, { checked: true });
                this.selectedAttachedClient = client.selectedAttachedClient;
            }
        });
    }

    ngOnDestroy(): void {/**/ }

    openDialog(): void {
        const dialog: MatDialogRef<AttachedClientsDialogComponent> = this.dialog.open(AttachedClientsDialogComponent, {
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialog.afterClosed().subscribe(() => {
            this.cartService.removeProductsWithNoAttachedClients();
        });
    }

    changeSelectedAttachedClient(attachedClient: AttachedClient): void {
        this.clientService._client.getValue().selectedAttachedClient = attachedClient;
        this.clientService.set(this.clientService._client.getValue());
    }
}
