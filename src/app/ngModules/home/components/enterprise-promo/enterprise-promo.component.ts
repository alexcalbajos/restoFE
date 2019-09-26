import { Component, Inject } from '@angular/core';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';

@Component({
    selector: 'ri-enterprise-promo',
    templateUrl: 'enterprise-promo.component.html',
    styleUrls: ['enterprise-promo.component.scss']
})
export class EnterprisePromoComponent {
    constructor(@Inject(STATIC_CONFIG) public staticConfig: StaticConfig) { }
}
