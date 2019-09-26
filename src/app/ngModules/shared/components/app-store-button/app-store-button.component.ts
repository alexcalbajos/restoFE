import { Component } from '@angular/core';

import { SessionAddressService } from '../../../shared/services/business/session-address/session-address.service';

@Component({
    selector: 'ri-app-store-button',
    templateUrl: 'app-store-button.component.html',
    styleUrls: ['app-store-button.component.scss']
})
export class AppStoreButtonComponent {
    constructor(private sessionAddressService: SessionAddressService) { }

    openIphone(): void {
        const countryCode: string = this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code;
        window.open(`https://itunes.apple.com/${countryCode}/app/resto-in/id913946533?mt=8`);
    }
}
