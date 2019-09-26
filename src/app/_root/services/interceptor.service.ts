import * as Bowser from 'bowser';
import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { MessageType } from '../../enums/message-type.enum';
import { Authentication } from '../../models/authentication/authentication.model';
import { Client } from '../../models/client/client.model';
import {
    AuthenticationService
} from '../../ngModules/shared/services/business/authentication/authentication.service';
import { ClientService } from '../../ngModules/shared/services/business/client/client.service';
import { LoggerService } from '../../ngModules/shared/services/helpers/logger.service';
import { STATIC_CONFIG, StaticConfig } from '../static/config';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    private accessToken: string = '';
    private loginToken: string = '';
    private channel: string = '';

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private loggerService: LoggerService,
        private authenticationService: AuthenticationService,
        private clientService: ClientService) {
        this.setChannel();
        this.setUpSubsciptions();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request.body || request.body.channel !== 'slack') {
            request = request.clone({
                setHeaders: this.getHeaders(request)
            });
        }

        return next.handle(request);
    }

    private getHeaders(request: HttpRequest<any>): any {
        const headers: any = {
            Authorization: this.getAuthorization(),
            'x-channel': this.channel,
            'x-access-token': this.accessToken,
            'x-client-token': this.loginToken
        };

        if (!request.url.includes('upload.json')) {
            headers['Content-Type'] = this.getContentType(request.url);
        }

        return headers;
    }

    private getAuthorization(): string {
        if (!this.staticConfig.authorization) {
            this.loggerService.log('No Auth', MessageType.Warning, true);
        }

        return this.staticConfig ? this.staticConfig.authorization : '';
    }

    private getContentType(url: string): string {
        return url.includes('.json') ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded';
    }

    private setChannel(): void {
        this.channel = Bowser.parse(window.navigator.userAgent).platform.type === 'mobile' ? 'web-mobile-client' : 'web-client';
    }

    private setUpSubsciptions(): void {
        this.authenticationService.authentication$.subscribe((authentication: Authentication) => {
            this.accessToken = authentication && authentication.accessToken ? authentication.accessToken : '';
        });

        this.clientService.client$.subscribe((client: Client) => {
            this.loginToken = client && client.login_token ? client.login_token : '';
        });
    }
}
