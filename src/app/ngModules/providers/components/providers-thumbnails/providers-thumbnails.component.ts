import { untilDestroyed } from 'ngx-take-until-destroy';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { SessionAddress } from '../../../../models/address/address.model';
import { Provider } from '../../../../models/provider/provider.model';
import { ProvidersService } from '../../../shared/services/business/providers/providers.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';

@Component({
    selector: 'ri-providers-thumbnails',
    templateUrl: 'providers-thumbnails.component.html',
    styleUrls: ['providers-thumbnails.component.scss']
})
export class ProvidersThumbnailsComponent implements OnInit, OnDestroy {
    @Input() providers: Array<Provider>;
    cityRoute: string;

    constructor(
        public providersService: ProvidersService,
        public sessionAddressService: SessionAddressService) { }

    ngOnInit(): void {
        this.sessionAddressService.sessionAddress$.pipe(untilDestroyed(this))
            .subscribe((sessionAddress: SessionAddress) => {
                this.cityRoute = sessionAddress.deliveryCity.route_relative;
            });
    }

    ngOnDestroy(): void {/**/ }
}
