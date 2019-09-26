import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { STATIC_CONFIG, StaticConfig } from '../../../../../_root/static/config';
import { ClientTypeEnum } from '../../../../../enums/client-type.enum';
import { SocGenIds } from '../../../../../enums/soc-gen-ids.enum';
import { AttachedClient, Client } from '../../../../../models/client/client.model';
import { CacheSyncService } from '../../helpers/cache-sync.service';
import { DatesHelperService } from '../../helpers/dates-helper.service';
import { GooglAnalyticsService } from '../../helpers/google-analytics.service';
import { StringWrapperService } from '../../helpers/string-wrapper.service';

@Injectable()
export class ClientService {
    _client: BehaviorSubject<Client> = new BehaviorSubject<any>({ doNotCache: true });
    client$: Observable<Client> = this._client.asObservable();

    constructor(
        private cacheSyncService: CacheSyncService,
        private router: Router,
        private datesHelperService: DatesHelperService,
        private googlAnalyticsService: GooglAnalyticsService,
        private stringWrapperService: StringWrapperService,
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig) { }

    init(): void {
        this.cacheSyncService.add(this.client$, 'client');

        const cachedClient: Client = JSON.parse(localStorage.getItem('client'));
        if (cachedClient &&
            !this.isLoginTokenExpired(cachedClient, this.staticConfig) &&
            !this.isAccountExpired(cachedClient)) {
            this.set(cachedClient);
        }
    }

    set(client: Client): void {
        this._client.next(this.setCustomProperties(client));
    }

    logout(): void {
        this.router.navigate(['/']);
        this.set(undefined);
        this.googlAnalyticsService.empty();
    }

    updateCheckedAttachedClients(checkedAttachedClients: Array<AttachedClient>): void {
        const client: Client = this._client.getValue();

        client.attached_clients.forEach((attachedClient: AttachedClient) => {
            attachedClient.checked = _.some(checkedAttachedClients, { id: attachedClient.id });
        });

        client.selectedAttachedClient = _.filter(client.attached_clients, { checked: true })[0];
        this.set(client);
    }

    isAccountExpired(client: Client): boolean {
        if (!client.account_expiration_date) return false;

        return new Date() > this.datesHelperService.getDateForSafari(client.account_expiration_date);
    }

    private isLoginTokenExpired(client: Client, staticConfig: StaticConfig): boolean {
        return new Date(new Date().getTime() + staticConfig.frontEndBuffer * 1000) >
         new Date(this.datesHelperService.getDateForSafari(client.login_token_expiration_date));
    }

    private setFullName(attachedClient: AttachedClient): void {
        const firstName: string = `${this.stringWrapperService.toUpperCaseFirst(attachedClient.first_name)}`;
        const lastName: string = `${this.stringWrapperService.toUpperCaseFirst(attachedClient.last_name)}`;
        attachedClient.fullName = `${firstName} ${lastName}`;
    }

    private setCustomProperties(client: Client): Client {
        if (client && client.id) {
            client.isCorporate = client.type.id === ClientTypeEnum.Corporate;

            if (client.company && client.company.id) {
                client.isSocGen = _.some(SocGenIds, (id: any) =>
                    client.company.id === (SocGenIds[id] as any)
                );
            } else {
                client.isSocGen = false;
            }

            if (client.attached_clients) {
                if (!client.selectedAttachedClient) {
                    this.setDefaultSelectedAttachedClient(client);
                }

                client.attached_clients.forEach((attachedClient: AttachedClient) => {
                    if (!attachedClient.fullName) {
                        this.setFullName(attachedClient);
                    }
                });
            }
        }

        return client;
    }

    private setDefaultSelectedAttachedClient(client: Client): void {
        const defaultClient: AttachedClient = _.find(client.attached_clients, { id: client.id });
        defaultClient.checked = true;
        client.selectedAttachedClient = defaultClient;
    }
}
