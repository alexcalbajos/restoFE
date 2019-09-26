import { Component, Inject, OnInit } from '@angular/core';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { FormValidationService } from '../../../shared/services/helpers/form-validation.service';
import { ZopimService } from '../../../shared/services/helpers/zopim.service';

@Component({
    selector: 'ri-contact-page',
    templateUrl: 'contact-page.component.html',
    styleUrls: ['contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {
    mail: string;

    constructor(
        @Inject(STATIC_CONFIG) public staticConfig: StaticConfig,
        public zopimService: ZopimService,
        public formValidationService: FormValidationService,
        private sessionAddressService: SessionAddressService) { }

    ngOnInit(): void {
        const countryCode: string = this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code;
        this.mail = countryCode === 'es' ? this.staticConfig.esMail : this.staticConfig.frMail;
    }
}
