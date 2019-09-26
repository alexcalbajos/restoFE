import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { SessionAddressService } from '../business/session-address/session-address.service';

@Injectable()
export class TranslationWrapperService {
    constructor(
        private translateService: TranslateService,
        private sessionAddressService: SessionAddressService) { }

    init(): void {
        this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
            localStorage.setItem('lang', JSON.stringify(langChangeEvent.lang));
        });

        this.translateService.setDefaultLang('en');

        const cachedLang: string = JSON.parse(localStorage.getItem('lang'));
        if (cachedLang) {
            this.translateService.use(cachedLang);
        } else {
            this.translateService.use(this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code);
        }
    }
}
