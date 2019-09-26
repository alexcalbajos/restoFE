import { Observable, of } from 'rxjs';

import { Inject, Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';

import { STATIC_EN } from '../static/en';
import { STATIC_ES } from '../static/es';
import { STATIC_FR } from '../static/fr';

@Injectable()
export class TranslateLoaderService implements TranslateLoader {
    private translations: any = {
        en: {},
        es: {},
        fr: {}
    };

    constructor(
        @Inject(STATIC_EN) private staticEn: any,
        @Inject(STATIC_ES) private staticEs: any,
        @Inject(STATIC_FR) private staticFr: any) {
        this.translations.en = this.staticEn;
        this.translations.es = this.staticEs;
        this.translations.fr = this.staticFr;
    }

    getTranslation(lang: string): Observable<any> {
        return of(this.translations[lang]);
    }
}

export function CustomTranslateLoader(en: string, es: string, fr: string): TranslateLoaderService {
    return new TranslateLoaderService(en, es, fr);
}
