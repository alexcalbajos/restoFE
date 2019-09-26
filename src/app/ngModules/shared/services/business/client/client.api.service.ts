import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Client, Division } from '../../../../../models/client/client.model';
import { ClientsParams } from '../../../../../models/client/clients-params.model';
import { LoginParams } from '../../../../../models/client/login-params.model';
import { PasswordParams } from '../../../../../models/client/password-params.model';
import { RegisterParams } from '../../../../../models/client/register-params.model';
import { ResetPasswordParams } from '../../../../../models/client/reset-password-params.model';
import { GenericResponse } from '../../../../../models/response/generic-response.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';

@Injectable()
export class ClientApiService {
    constructor(private http: HttpWrapperService) { }

    register(params: RegisterParams): Observable<GenericResponse> {
        return this.http.post('clients/registers.json', params, true);
    }

    get(clientId: number): Observable<Client> {
        return this.http.get(`clients/${clientId}.json`).pipe(map((client: Client) => {
            if (!client.phone && client.mobile) {
                client.phone = client.mobile;
            }

            return client;
        }));
    }

    login(params: LoginParams): Observable<GenericResponse> {
        return this.http.post('clients/login.json', params, true);
    }

    loginWithToken(token: string): Observable<GenericResponse> {
        return this.http.get(`login/token/${token}.json`, undefined, true);
    }

    update(params: ClientsParams): Observable<GenericResponse> {
        return this.http.post('clients.json', params, true);
    }

    delete(clientId: number): Observable<any> {
        return this.http.delete(`clients/${clientId}/delete.json`);
    }

    changePassword(params: PasswordParams): Observable<GenericResponse> {
        return this.http.post(`clients/${params.clientId}/password.json`, params, true);
    }

    resetPassword(params: ResetPasswordParams, clientId: number): any {
        return this.http.post(`clients/${clientId}/passwordreset.json`, params, true);
    }

    recoverPassword(email: string, brandId: number): Observable<GenericResponse> {
        const params: HttpParams = new HttpParams()
            .set('login', email)
            .set('brandId', brandId.toString());

        return this.http.get('clients/recovery.json', params, true);
    }

    acceptGdpr(clientId: number): Observable<any> {
        return this.http.post(`clients/${clientId}/accept`);
    }

    getDivisions(): Observable<Array<Division>> {
        return this.http.get('clients/divisions/all.json');
    }
}
