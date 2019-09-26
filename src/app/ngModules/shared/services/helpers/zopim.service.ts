import { combineLatest } from 'rxjs';

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Client } from '../../../../models/client/client.model';
import { ClientService } from '../business/client/client.service';

@Injectable()
export class ZopimService {
    constructor(
        private clientService: ClientService,
        private translateService: TranslateService) { }

    openChat(): void {
        if (!(window as any).zE) return;

        this.zopim_api(() => {
            (window as any).$zopim.livechat.window.show();
        });
    }

    setClient(): void {
        this.clientService.client$.subscribe((client: Client) => {
            if (!client || !client.id) {
                return;
            }

            this.zopim_api(() => {
                (window as any).$zopim.livechat.set({
                    name: (`${client.first_name} ${client.last_name}`),
                    email: client.email,
                    phone: client.phone
                });
            });
        });
    }

    setLanguage(language: string): void {
        this.zopim_api(() => {
            (window as any).$zopim.livechat.setLanguage(language);

            this.translateService.get('ZOPIM_CONCIERGE_NAME').subscribe((translation: string) => {
                (window as any).$zopim.livechat.concierge.setName(translation);
            });

            this.translateService.get('ZOPIM_CONCIERGE_TITLE').subscribe((translation: string) => {
                (window as any).$zopim.livechat.concierge.setTitle(translation);
            });

            combineLatest(
                this.translateService.get('ZOPIM_GREETING_ONLINE'),
                this.translateService.get('ZOPIM_GREETING_OFFLINE')
            ).subscribe((data: any) => {
                (window as any).$zopim.livechat.setGreetings({
                    online: data[0],
                    offline: data[1]
                });
            });
        });
    }

    moveChatButton(bottom: number): void {
        const correctedBottom: string = bottom > 15 ? `${bottom}px` : '15px';
        const themeWrapper: HTMLElement = document.querySelector('body');
        themeWrapper.style.setProperty('--zopimBottom', correctedBottom);
    }

    private zopim_api(callback: any): void {
        (window as any).zE(() => {
            (window as any).$zopim(() => {
                callback();
            });
        });
    }
}
