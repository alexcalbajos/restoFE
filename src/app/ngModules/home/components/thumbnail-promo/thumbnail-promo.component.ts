import { Component, OnInit } from '@angular/core';

import { SessionAddress } from '../../../../models/address/address.model';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';

@Component({
    selector: 'ri-thumbnail-promo',
    templateUrl: 'thumbnail-promo.component.html',
    styleUrls: ['thumbnail-promo.component.scss']
})
export class ThumbnailPromoComponent implements OnInit {
    countryCode: string;

    constructor(private sessionAddressService: SessionAddressService) { }

    ngOnInit(): void {
        const sessionAddress: SessionAddress = this.sessionAddressService._sessionAddress.getValue();
        this.countryCode = sessionAddress.deliveryCity.country.code;
    }

    openWindow(url: string): void {
        window.open(url);
    }

    becomeCourier(): void {
        let url: string;

        url = this.countryCode === 'es' ?
            'https://restoin-france.typeform.com/to/zwTnO4' :
            'https://restoin-france.typeform.com/to/YDLeVi';

        window.open(url);
    }

    becomePartner(): void {
        let url: string;

        url = this.countryCode === 'es' ?
            'https://docs.google.com/forms/d/e/1FAIpQLSegLGs1-wzE2Rbvv-hT_IG6dIdVIUtpoGs5NTyFCAssW1LR3A/viewform' :
            'https://restoin-france.typeform.com/to/gZPMpJ';

        window.open(url);
    }
}
