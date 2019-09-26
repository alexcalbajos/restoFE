import { BehaviorSubject, Observable } from 'rxjs';

import { Inject, Injectable } from '@angular/core';

import { STATIC_CONFIG, StaticConfig } from '../../../../../_root/static/config';
import { Authentication } from '../../../../../models/authentication/authentication.model';
import { CacheSyncService } from '../../helpers/cache-sync.service';
import { AuthenticationApiService } from './authentication.api.service';

@Injectable()
export class AuthenticationService {
    _authentication: BehaviorSubject<Authentication> = new BehaviorSubject<any>({ doNotCache: true });
    authentication$: Observable<Authentication> = this._authentication.asObservable();

    constructor(
        private cacheSyncService: CacheSyncService,
        private authenticationApiService: AuthenticationApiService,
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig) { }

    init(): void {
        this.cacheSyncService.add(this.authentication$, 'authentication');

        const cachedAuthentication: Authentication = JSON.parse(localStorage.getItem('authentication'));
        if (!cachedAuthentication || this.isAuthenticationExpired(cachedAuthentication, this.staticConfig)) {
            this.set();
        } else {
            this._authentication.next(cachedAuthentication);
        }
    }

    private set(): void {
        this.authenticationApiService.getPublicKey()
            .subscribe((key: string) => {
                this.authenticationApiService.get(key, this.staticConfig.applicationId)
                    .subscribe((authentication: Authentication) => {
                        authentication.localExpiration = this.getLocalExpirationDate(authentication.expirationSeconds);
                        this._authentication.next(authentication);
                    });
            });
    }

    private isAuthenticationExpired(authentication: Authentication, staticConfig: StaticConfig): boolean {
        return new Date(new Date().getTime() + staticConfig.frontEndBuffer * 1000) > new Date(authentication.localExpiration);
    }

    private getLocalExpirationDate(expirationSeconds: number): string {
        return new Date(new Date().getTime() + expirationSeconds * 1000).toString();
    }
}
