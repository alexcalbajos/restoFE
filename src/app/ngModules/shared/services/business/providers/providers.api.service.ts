import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Client } from '../../../../../models/client/client.model';
import { FilteredResults } from '../../../../../models/provider/filtered-results.model';
import { Provider } from '../../../../../models/provider/provider.model';
import { GenericResponse } from '../../../../../models/response/generic-response.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';
import { ClientService } from '../client/client.service';
import { ProvidersService } from './providers.service';

@Injectable()
export class ProvidersApiService {
    constructor(
        private http: HttpWrapperService,
        private clientService: ClientService,
        private providersService: ProvidersService) { }

    get(providerLink: string, cityId: number, brandId: number): Observable<GenericResponse> {
        const url: string = `providers/link/${providerLink}/market.json`;
        const params: HttpParams = new HttpParams()
            .set('brandId', brandId.toString())
            .set('cityId', cityId.toString());

        return this.http.get(url, params, true).pipe(map((genericResponse: GenericResponse) => {
            if (genericResponse.data) {
                if (!genericResponse.data.selling_points || !genericResponse.data.selling_points.length) {
                    genericResponse.errors = ['No selling points'];
                    delete genericResponse.data;
                } else {
                    this.providersService.mapProvider(genericResponse.data, cityId);
                }
            }

            return genericResponse;
        }));
    }

    getAll(cityId: number): Observable<Array<Provider>> {
        let params: HttpParams;
        const client: Client = this.clientService._client.getValue();

        if (client && client.id) {
            params = new HttpParams()
                .set('cityId', cityId.toString())
                .set('clientId', client.id.toString());
        } else {
            params = new HttpParams()
                .set('cityId', cityId.toString());
        }

        return this.http.get('providers/market.json', params).pipe(map((providers: Array<Provider>) => {
            providers.forEach((provider: Provider) => {
                this.providersService.mapProvider(provider, cityId);
            });

            return providers;
        }));
    }

    getFilteredResults(cityId: number, keyword: string): Observable<Array<FilteredResults>> {
        const params: HttpParams = new HttpParams()
            .set('cityId', cityId.toString())
            .set('keyword', keyword.toString());

        return this.http.get('search/market.json', params);
    }

    getCategoryUrlFromKeyword(cityId: number, keyword: string): Observable<Array<string>> {
        const params: HttpParams = new HttpParams()
            .set('cityId', cityId.toString())
            .set('keyword', keyword.toString());

        return this.http.get('categories/special.json', params);
    }
}
