import { Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ClientAddress, CorporateAddressParams } from '../../../../../models/address/address.model';
import { CorporateClient } from '../../../../../models/client/client.model';
import { Code } from '../../../../../models/corporate/code.model';
import { GenericResponse } from '../../../../../models/response/generic-response.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';
import { ClientService } from '../client/client.service';

@Injectable()
export class CorporateApiService {
    constructor(
        private clientService: ClientService,
        private http: HttpWrapperService) { }

    getClients(page: number, searchValue?: string): Observable<any> {
        const url: string = `users/${this.clientService._client.getValue().id}/list.json`;
        let params: HttpParams;

        if (searchValue) {
            params = new HttpParams()
                .set('page', page.toString()).set('search', searchValue);
        } else {
            params = new HttpParams()
                .set('page', page.toString());
        }

        return this.http.get(url, params);
    }

    addClient(params: CorporateClient): Observable<GenericResponse> {
        return this.http.post(`users/${this.clientService._client.getValue().id}/new.json`, params, true);
    }

    editClient(clientId: number, params: CorporateClient): Observable<GenericResponse> {
        return this.http.put(`users/${this.clientService._client.getValue().id}/edit/${clientId}.json`, params, true);
    }

    resetClientPassword(clientId: number): Observable<GenericResponse> {
        return this.http.get(`users/${this.clientService._client.getValue().id}/resetpassword/${clientId}.json`);
    }

    deleteClient(clientId: number): Observable<GenericResponse> {
        return this.http.delete(`users/${this.clientService._client.getValue().id}/delete/${clientId}.json`);
    }

    getAddresses(page: number): Observable<ClientAddress> {
        const url: string = `addresses/${this.clientService._client.getValue().id}/list.json`;
        const params: HttpParams = new HttpParams()
            .set('page', page.toString());

        return this.http.get(url, params);
    }

    addAddress(params: CorporateAddressParams): Observable<GenericResponse> {
        return this.http.post(`addresses/${this.clientService._client.getValue().id}/new.json`, params, true);
    }

    editAddress(addressId: number, params: CorporateAddressParams): Observable<GenericResponse> {
        return this.http.put(`addresses/${this.clientService._client.getValue().id}/edit/${addressId}.json`, params, true);
    }

    deleteAddress(addressId: number): Observable<GenericResponse> {
        return this.http.delete(`addresses/${this.clientService._client.getValue().id}/delete/${addressId}.json`);
    }

    getCodes(page: number): Observable<any> {
        const url: string = `codes/${this.clientService._client.getValue().id}/list.json`;
        const params: HttpParams = new HttpParams()
            .set('page', page.toString());

        return this.http.get(url, params);
    }

    uploadCodes(file: File): Observable<GenericResponse> {
        const url: string = `codes/${this.clientService._client.getValue().id}/upload.json`;

        const excel: FormData = new FormData();
        excel.append('excel', file);

        return this.http.post(url, excel, true);
    }

    addCode(params: Code): Observable<GenericResponse> {
        return this.http.post(`codes/${this.clientService._client.getValue().id}/new.json`, params);
    }

    editCode(codeId: number, params: Code): Observable<GenericResponse> {
        return this.http.put(`codes/${this.clientService._client.getValue().id}/edit/${codeId}.json`, params);
    }

    deleteCode(codeId: number): Observable<GenericResponse> {
        return this.http.delete(`codes/${this.clientService._client.getValue().id}/delete/${codeId}.json`);
    }

    getBills(page: number): Observable<any> {
        const url: string = `clients/${this.clientService._client.getValue().id}/bills.json`;
        const params: HttpParams = new HttpParams()
            .set('page', page.toString());

        return this.http.get(url, params);
    }

    getCurrentMonthUrl(month: number): Observable<string> {
        const url: string = `clients/${this.clientService._client.getValue().id}/excel/2018-${month}/0.json`;

        return this.http.get(url);
    }
}
