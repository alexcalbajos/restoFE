import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';

import { Client } from '../../../../models/client/client.model';
import { ClientService } from '../business/client/client.service';
import { GuardBaseService } from './guard-base.service';

@Injectable()
export class ClientGuardService implements CanLoad, CanActivate {
    constructor(
        private guardBaseService: GuardBaseService,
        private clientService: ClientService) { }

    canLoad(): boolean {
        return this.checkClient();
    }

    canActivate(): boolean {
        return this.checkClient();
    }

    private checkClient(): boolean {
        const client: Client = this.clientService._client.getValue();

        if (client && client.id) {
            return true;
        } else {
            this.guardBaseService.goBack();

            return false;
        }
    }
}
