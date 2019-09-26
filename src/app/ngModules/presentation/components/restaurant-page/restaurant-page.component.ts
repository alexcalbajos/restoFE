import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ri-restaurant-page',
    templateUrl: './restaurant-page.component.html',
    styleUrls: ['./restaurant-page.component.scss']
})
export class RestaurantPageComponent implements OnInit {
    currentLang: string;

    constructor(private translateService: TranslateService) { }

    ngOnInit(): void {
        this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
            this.currentLang = langChangeEvent.lang;
        });

        this.currentLang = this.translateService.currentLang;
    }

    openForm(): void {
        let url: string;

        url = this.currentLang === 'es' ?
            'https://docs.google.com/forms/d/e/1FAIpQLSegLGs1-wzE2Rbvv-hT_IG6dIdVIUtpoGs5NTyFCAssW1LR3A/viewform' :
            'https://restoin-france.typeform.com/to/gZPMpJ';

        window.open(url);
    }
}
