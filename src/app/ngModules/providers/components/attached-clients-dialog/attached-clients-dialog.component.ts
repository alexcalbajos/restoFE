import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';

import { AttachedClient } from '../../../../models/client/client.model';
import { ClientService } from '../../../shared/services/business/client/client.service';

@Component({
    selector: 'ri-attached-clients-dialog',
    templateUrl: 'attached-clients-dialog.component.html',
    styleUrls: ['attached-clients-dialog.component.scss']
})
export class AttachedClientsDialogComponent implements OnInit {
    attachedClients: Array<AttachedClient>;
    checkedAttachedClients: Array<AttachedClient>;
    displayError: boolean;

    constructor(
        public dialogRef: MatDialogRef<AttachedClientsDialogComponent>,
        private clientService: ClientService) { }

    ngOnInit(): void {
        this.attachedClients = this.clientService._client.getValue().attached_clients;
    }

    applyFilter(filterValue: string): void {
        this.displayError = false;

        this.attachedClients.forEach((attachedClient: AttachedClient) => {
            const option: HTMLElement = document.querySelector(`mat-list-option[data='${attachedClient.id}']`);

            if (!option) return;

            if (!attachedClient.fullName.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())) {
                option.classList.add('hide');
            } else {
                option.classList.remove('hide');
            }
        });
    }

    addClients(clientsList: MatSelectionList): void {
        const checkedAttachedClients: Array<AttachedClient> = clientsList.selectedOptions.selected.map((item: MatListOption) => item.value);

        if (checkedAttachedClients.length > 0) {
            this.clientService.updateCheckedAttachedClients(checkedAttachedClients);
            this.dialogRef.close(true);
        } else {
            this.displayError = true;
        }
    }
}
