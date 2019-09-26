import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';

import { ClientTypeEnum } from '../../../../enums/client-type.enum';
import { Client } from '../../../../models/client/client.model';
import { ClientService } from '../business/client/client.service';
import { GuardBaseService } from './guard-base.service';

@Injectable()
export class AdminGuardService implements CanLoad, CanActivate {
    constructor(
        private guardBaseService: GuardBaseService,
        private clientService: ClientService) { }

    canLoad(): boolean {
        return this.checkAdmin();
    }

    canActivate(): boolean {
        return this.checkAdmin();
    }

    private checkAdmin(): boolean {
        const client: Client = this.clientService._client.getValue();

        if (client.type.id === ClientTypeEnum.Corporate && client.admin === 1) {
            return true;
        } else {
            this.guardBaseService.goBack();

            return false;
        }
    }
}
