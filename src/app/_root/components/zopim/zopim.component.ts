import { AfterViewInit, Component } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { ZopimService } from '../../../ngModules/shared/services/helpers/zopim.service';

@Component({
    selector: 'ri-zopim',
    templateUrl: 'zopim.component.html',
    styleUrls: ['zopim.component.scss']
})
export class ZopimComponent implements AfterViewInit {
    constructor(
        private translateService: TranslateService,
        private zopimService: ZopimService) { }

    ngAfterViewInit(): void {
        this.zopimService.setClient();

        this.zopimService.setLanguage(this.translateService.currentLang);
        this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
            this.zopimService.setLanguage(langChangeEvent.lang);
        });
    }
}
