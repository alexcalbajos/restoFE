import { Component, Inject, OnInit } from '@angular/core';

import {
    SessionAddressService
} from '../../../ngModules/shared/services/business/session-address/session-address.service';
import { STATIC_CONFIG, StaticConfig } from '../../static/config';

@Component({
    selector: 'ri-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss']
})
export class FooterComponent implements OnInit {
    countryCode: string;

    constructor(
        @Inject(STATIC_CONFIG) public staticConfig: StaticConfig,
        private sessionAddressService: SessionAddressService) { }

    ngOnInit(): void {
        this.countryCode = this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code;
    }

    openTwitter(): void {
        if (this.countryCode === 'es') {
            window.open('https://twitter.com/restoin_es?lang=en');

        } else {
            window.open('https://twitter.com/Resto_in');
        }
    }

    openFacebook(): void {
        window.open(`https://www.facebook.com/restoin.${this.countryCode}`);
    }

    openInstagram(): void {
        window.open(`https://www.instagram.com/restoin_${this.countryCode}`);
    }

    openWindow(url: string): void {
        window.open(url);
    }
}
