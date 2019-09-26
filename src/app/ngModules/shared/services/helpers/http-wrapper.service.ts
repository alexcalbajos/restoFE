import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';

class ExtraHeader {
    key: string;
    value: string;
}

@Injectable()
export class HttpWrapperService {
    private apiUrl: string;

    constructor(private httpClient: HttpClient) {
        this.apiUrl = `https://${environment.domain}/api/v2/`;
    }

    get(method: string, params?: HttpParams, returnErrors?: boolean): Observable<any> {
        const url: string = `${this.apiUrl}${method}`;

        if (returnErrors) {
            return this.httpClient.get(url, { params });
        } else {
            return this.httpClient.get(url, { params })
                .pipe(map((response: any) => {
                    if (response.data) {
                        return response.data;
                    } else if (response.errors) {
                        throw this.prepareError(response.errors[0]);
                    }
                }));
        }
    }

    post(method: string, params?: any, returnErrors?: boolean, extraHeader?: ExtraHeader): Observable<any> {
        const url: string = `${this.apiUrl}${method}`;

        let options: any = {};
        if (extraHeader) {
            options = {
                headers:
                {
                    [extraHeader.key]: extraHeader.value
                }
            };
        }

        if (returnErrors) {
            return this.httpClient.post(url, params, options);
        } else {
            return this.httpClient.post(url, params, options)
                .pipe(map((response: any) => {
                    if (response.data) {
                        return response.data;
                    } else if (response.errors) {
                        throw this.prepareError(response.errors[0]);
                    }
                }));
        }
    }

    delete(method: string, returnErrors?: boolean): Observable<any> {
        const url: string = `${this.apiUrl}${method}`;

        if (returnErrors) {
            return this.httpClient.delete(url);
        } else {
            return this.httpClient.delete(url)
                .pipe(map((response: any) => {
                    if (response.data) {
                        return response.data;
                    } else if (response.errors) {
                        throw this.prepareError(response.errors[0]);
                    }
                }));
        }
    }

    put(method: string, params?: any, returnErrors?: boolean): Observable<any> {
        const url: string = `${this.apiUrl}${method}`;

        if (returnErrors) {
            return this.httpClient.put(url, params);
        } else {
            return this.httpClient.put(url, params)
                .pipe(map((response: any) => {
                    if (response.data) {
                        return response.data;
                    } else if (response.errors) {
                        throw this.prepareError(response.errors[0]);
                    }
                }));
        }
    }

    private prepareError(error: any): any {
        if (error.message) {
            error.message = `FROM API - ${error.message}`;
        }

        return error;
    }
}
