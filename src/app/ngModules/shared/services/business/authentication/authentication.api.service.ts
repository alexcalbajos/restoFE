import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Authentication } from '../../../../../models/authentication/authentication.model';
import { HttpWrapperService } from '../../helpers/http-wrapper.service';

@Injectable()
export class AuthenticationApiService {
    constructor(private http: HttpWrapperService) { }

    get(key: string, appId: string): Observable<Authentication> {
        const params: any = Object.keys({ key, appId })
            .map((k: any) => `${encodeURIComponent(k)}=${encodeURIComponent({ key, appId }[k])}`)
            .join('&');

        return this.http.post('tokens', params);
    }

    getPublicKey(): Observable<string> {
        return this.http.get('publickey')
            .pipe(map((responseData: any) =>
                responseData.value));
    }
}
