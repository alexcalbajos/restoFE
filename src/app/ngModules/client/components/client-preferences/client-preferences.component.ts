import { Component, Inject, OnInit } from '@angular/core';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { MessageType } from '../../../../enums/message-type.enum';
import { Client } from '../../../../models/client/client.model';
import { ClientsParams } from '../../../../models/client/clients-params.model';
import { GenericResponse } from '../../../../models/response/generic-response.model';
import { ClientApiService } from '../../../shared/services/business/client/client.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';

@Component({
    selector: 'ri-client-preferences',
    templateUrl: 'client-preferences.component.html',
    styleUrls: ['client-preferences.component.scss']
})
export class ClientPreferencesComponent implements OnInit {
    newsletter: boolean;
    sms: boolean;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private sessionAddressService: SessionAddressService,
        private clientApiService: ClientApiService,
        private toasterWrapperService: ToasterWrapperService,
        private clientService: ClientService) { }

    ngOnInit(): void {
        this.setValues(this.clientService._client.getValue());
    }

    setValues(client: Client): void {
        this.newsletter = client.newsletter;
        this.sms = client.sms;
    }

    save(): void {
        this.clientApiService.update(this.getRequestParams()).subscribe((clientsResponse: GenericResponse) => {
            if (clientsResponse.errors) {
                this.toasterWrapperService.show('WE_ARE_SORRY', MessageType.Error);
            } else {
                this.clientApiService.get(this.clientService._client.getValue().id).subscribe((client: Client) => {
                    this.setValues(client);
                    this.clientService.set(client);
                    this.toasterWrapperService.show('INFO_UPDATED', MessageType.Success);
                });
            }
        });
    }

    private getRequestParams(): ClientsParams {
        const client: Client = this.clientService._client.getValue();

        return {
            clientId: client.id,
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email,
            phone: client.phone,
            gdpr_accept: client.gdpr_accept,
            brandId: this.staticConfig.brandId,
            cityId: this.sessionAddressService._sessionAddress.getValue().deliveryCity.id,
            sms: this.sms,
            news: this.newsletter
        };
    }
}
