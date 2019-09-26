import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { City } from '../../../../models/address/city.model';
import { CitiesService } from '../../../shared/services/business/cities/cities.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';

@Component({
    selector: 'ri-no-providers-page',
    templateUrl: 'no-providers-page.component.html',
    styleUrls: ['no-providers-page.component.scss']
})
export class NoProvidersPageComponent implements OnInit {
    @HostBinding('class') class: string = 'top-margin-container';
    title: string;
    desc: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public citiesService: CitiesService,
        private sessionAddressService: SessionAddressService) { }

    ngOnInit(): void {
        if (this.activatedRoute.snapshot.queryParams.reason === 'providers-closed') {
            this.title = 'PROVIDERS_UNAVAILABLE_TITLE';
            this.desc = 'PROVIDERS_UNAVAILABLE_DESC';
        } else {
            this.title = 'PROVIDERS_OUT_OF_RANGE_TITLE';
            this.desc = 'PROVIDERS_OUT_OF_RANGE_DESC';
        }
    }

    newCitySelected(city: City): void {
        this.sessionAddressService.set(this.sessionAddressService.composeFromCity(city));
        this.router.navigate([city.route_relative]);
    }
}
