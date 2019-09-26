import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BaseAddress, ClientAddress } from '../../../../../models/address/address.model';
import { Client } from '../../../../../models/client/client.model';
import {
    AddAddressDialogComponent
} from '../../../components/add-address-dialog/add-address-dialog.component';
import {
    ChangeSelectedAddressDialogComponent
} from '../../../components/change-selected-address-dialog/change-selected-address-dialog.component';
import {
    DeliveryAddressDialogComponent
} from '../../../components/delivery-address-dialog/delivery-address-dialog.component';
import { ClientService } from '../client/client.service';
import { AddressesApiService } from './addresses.api.service';

@Injectable()
export class AddressDialogService {
    constructor(
        private dialog: MatDialog,
        private clientService: ClientService,
        private addressesApiService: AddressesApiService) { }

    changeAddress(allowAdd: boolean = true): Observable<BaseAddress> {
        const _selectedAddress: Subject<BaseAddress> = new Subject<BaseAddress>();

        const client: Client = this.clientService._client.getValue();
        if (client && client.id) {
            this.selectClientAddress(allowAdd).pipe(take(1)).subscribe((clientAddress: ClientAddress) => {
                _selectedAddress.next(clientAddress);
            });
        } else {
            this.changeDeliveryAddress().pipe(take(1)).subscribe((baseAddress: BaseAddress) => {
                _selectedAddress.next(baseAddress);
            });
        }

        return _selectedAddress.asObservable();
    }

    private changeDeliveryAddress(): Observable<BaseAddress> {
        const _dialogCloseResult: Subject<BaseAddress> = new Subject<BaseAddress>();

        const dialogRef: MatDialogRef<any> = this.dialog.open(DeliveryAddressDialogComponent, {
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe((address: BaseAddress) => {
            if (address) {
                _dialogCloseResult.next(address);
            }
        });

        return _dialogCloseResult.asObservable();
    }

    private selectClientAddress(allowAdd: boolean): Observable<ClientAddress> {
        const _dialogCloseResult: Subject<ClientAddress> = new Subject<ClientAddress>();

        this.addressesApiService.getAll()
            .subscribe((addressess: Array<ClientAddress>) => {
                if (addressess.length > 0) {
                    const dialog: MatDialogRef<ChangeSelectedAddressDialogComponent> =
                        this.dialog.open(ChangeSelectedAddressDialogComponent, {
                            data: { addressess, allowAdd }
                        });

                    dialog.afterClosed().subscribe((closeResult: any) => {
                        if (closeResult === 'add') {
                            this.addClientAddress().pipe(take(1)).subscribe((addAddressCloseResult: ClientAddress) => {
                                _dialogCloseResult.next(addAddressCloseResult);
                            });
                        } else if (closeResult && closeResult.id) {
                            _dialogCloseResult.next(closeResult);
                        }
                    });
                } else {
                    this.addClientAddress().pipe(take(1)).subscribe((addAddressCloseResult: ClientAddress) => {
                        _dialogCloseResult.next(addAddressCloseResult);
                    });
                }
            });

        return _dialogCloseResult.asObservable();
    }

    private addClientAddress(): Observable<ClientAddress> {
        const _dialogCloseResult: Subject<ClientAddress> = new Subject<ClientAddress>();

        const dialog: MatDialogRef<AddAddressDialogComponent> = this.dialog.open(AddAddressDialogComponent, {
            autoFocus: false
        });

        dialog.afterClosed().subscribe((addedAddress: ClientAddress) => {
            if (addedAddress) {
                _dialogCloseResult.next(addedAddress);
            }
        });

        return _dialogCloseResult.asObservable();
    }
}
