import * as $ from 'jquery';

import { Component, OnInit } from '@angular/core';

import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { ScrollService } from '../../../shared/services/helpers/scroll.service';

@Component({
    selector: 'ri-enterprise-page',
    templateUrl: './enterprise-page.component.html',
    styleUrls: ['./enterprise-page.component.scss']
})
export class EnterprisePageComponent implements OnInit {
    countryCode: string;

    constructor(
        private sessionAddressService: SessionAddressService,
        private scrollService: ScrollService) { }

    ngOnInit(): void {
        this.countryCode = this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code;
    }

    openForm(): void {
        if (this.countryCode === 'es') {
            window.open('https://goo.gl/forms/mArNoNefsbZi6yqd2');
        } else {
            window.open('https://restoin-france.typeform.com/to/mqp3rC');
        }
    }

    openBookMe(): void {
        if (this.countryCode === 'es') {
            window.open('https://angie-resto-in.youcanbook.me/');
        } else {
            window.open('https://alfred-resto-in.youcanbook.me/');
        }
    }

    scrollToSection(sectionId: string): void {
        const header: Element = document.getElementsByTagName('ri-header')[0];
        const section: JQuery = $(`#${sectionId}`);

        if (header && section) {
            const headerHeight: number = header.getBoundingClientRect().height;
            this.scrollService.scrollTo(`#${sectionId}`, undefined, headerHeight);
        }
    }
}
