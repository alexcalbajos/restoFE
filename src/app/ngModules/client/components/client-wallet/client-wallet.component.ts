import { Component, OnInit } from '@angular/core';

import { Client } from '../../../../models/client/client.model';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';

@Component({
    selector: 'ri-client-wallet',
    templateUrl: 'client-wallet.component.html',
    styleUrls: ['client-wallet.component.scss']
})
export class ClientWalletComponent implements OnInit {
    walletAmount: number;

    constructor(
        private clientApiService: ClientApiService,
        private clientService: ClientService) { }

    ngOnInit(): void {
        this.clientApiService.get(this.clientService._client.getValue().id).subscribe((client: Client) => {
            this.clientService.set(client);
            this.walletAmount = client.wallet_amount;
        });
    }
}
