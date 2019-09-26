import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MessageType } from '../../../../enums/message-type.enum';
import { ClientAddress } from '../../../../models/address/address.model';
import { ConfirmDialogData } from '../../../../models/dialogs/confirm-dialog-data.model';
import {
    AddressesApiService
} from '../../../shared/services/business/addresses/addresses.api.service';
import { ToasterWrapperService } from '../../services/helpers/toaster-wrapper.service';
import { AddAddressDialogComponent } from '../add-address-dialog/add-address-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'ri-address-box',
    templateUrl: 'address-box.component.html',
    styleUrls: ['address-box.component.scss']
})
export class AddressBoxComponent {
    @Input() address: ClientAddress;
    @Input() allowEdit: boolean;
    @Output() readonly addressEdited: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private toasterWrapperService: ToasterWrapperService,
        private dialog: MatDialog,
        private addressesApiService: AddressesApiService) { }

    delete(): void {
        const confirmDialogData: ConfirmDialogData = {
            descriptionLines: ['DELETE_ADDRESS_NEW'],
            descriptionLinesTranslationParam: [{ item: this.address.address }],
            showSecondAction: true
        };

        const dialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
            data: confirmDialogData,
            autoFocus: false,
            panelClass: 'small-dialog'
        });

        dialogRef.afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.addressesApiService.delete(this.address.id).subscribe(() => {
                    this.addressEdited.emit();
                    this.toasterWrapperService.show('ADDRESS_DELETED', MessageType.Success);
                });
            }
        });
    }

    edit(): void {
        const dialog: MatDialogRef<AddAddressDialogComponent> = this.dialog.open(AddAddressDialogComponent, {
            autoFocus: false,
            data: this.address
        });

        dialog.afterClosed().subscribe((addedAddress: ClientAddress) => {
            if (addedAddress) {
                this.addressEdited.emit();
            }
        });
    }
}
