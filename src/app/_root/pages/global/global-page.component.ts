import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ri-global-page',
    templateUrl: 'global-page.component.html',
    styleUrls: ['global-page.component.scss']
})

export class GlobalPageComponent implements OnInit {
    ngOnInit(): void {
        navigator.languages.forEach((language: string) => {
            if (language.includes('fr')) {
                this.goToCountry('.fr');
            } else if (language.includes('es')) {
                this.goToCountry('.es');
            }
        });
    }

    goToCountry(url: string): void {
        const newLocation: string = window.location.origin.replace('.com', url);
        location.assign(newLocation);
    }
}
