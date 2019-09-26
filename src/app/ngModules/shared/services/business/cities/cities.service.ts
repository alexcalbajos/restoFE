import * as _ from 'lodash';

import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { STATIC_CITIES } from '../../../../../_root/static/cities';
import { City } from '../../../../../models/address/city.model';
import { CitiesApiService } from './cities.api.service';

@Injectable()
export class CitiesService {
    allCities: Array<City>;

    constructor(
        private router: Router,
        private citiesApiService: CitiesApiService,
        @Inject(STATIC_CITIES) private staticCities: Array<City>) {
        this.allCities = this.staticCities;
        this.buildDeliveryRoutes();

        this.citiesApiService.getAll().subscribe((cities: any) => {
            this.allCities = cities;
        });
    }

    getFromUrl(url: string): City {
        let cityFromUrl: City;

        this.allCities.forEach((city: City) => {
            if (url.includes(city.route_relative)) {
                cityFromUrl = city;
            }
        });

        return cityFromUrl;
    }

    getDefaultCity(): City {
        if (window.location.hostname.includes('.es')) {
            return _.find(this.allCities, { name: 'Barcelona' });
        }

        if (window.location.hostname.includes('.fr')) {
            return _.find(this.allCities, { name: 'Paris' });
        }
    }

    private buildDeliveryRoutes(): void {
        this.allCities.forEach((city: City) => {
            const childrenNumber: number = this.router.config[0].children.length;

            this.router.config[0].children.splice(childrenNumber - 1, 0, {
                path: city.route_relative.replace('/', ''),
                loadChildren: 'app/ngModules/providers/providers.module#ProvidersModule'
            });
        });
    }
}
