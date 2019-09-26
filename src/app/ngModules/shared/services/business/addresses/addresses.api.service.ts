import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { ClientAddress } from '../../../../../models/address/address.model';
import { GenericResponse } from '../../../../../models/response/generic-response.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';
import { ClientService } from '../client/client.service';

@Injectable()
export class AddressesApiService {
    constructor(
        private client: ClientService,
        private http: HttpWrapperService) { }

    add(params: ClientAddress): Observable<GenericResponse> {
        return this.http.post(`clients/${this.client._client.getValue().id}/addresses.json`, params, true);
    }

    edit(params: ClientAddress): Observable<GenericResponse> {
        return this.http.put(`clients/${this.client._client.getValue().id}/addresses/${params.id}.json`, params, true);
    }

    getAll(): Observable<Array<ClientAddress>> {
        return this.http.get(`clients/${this.client._client.getValue().id}/addresses.json`);
    }

    getLatest(): Observable<ClientAddress> {
        return this.http.get(`addresses/${this.client._client.getValue().id}/last.json`);
    }

    delete(addressId: number): Observable<number> {
        return this.http.delete(`clients/${this.client._client.getValue().id}/addresses/${addressId}.json`);
    }
}
