import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import {
    BaseAddress, ClientAddress, SessionAddress
} from '../../../../../models/address/address.model';
import { City } from '../../../../../models/address/city.model';
import { CacheSyncService } from '../../helpers/cache-sync.service';
import { StringWrapperService } from '../../helpers/string-wrapper.service';
import { AddressesService } from '../addresses/addresses.service';
import { CitiesApiService } from '../cities/cities.api.service';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class SessionAddressService {
    _sessionAddress: BehaviorSubject<SessionAddress> = new BehaviorSubject<any>({ doNotCache: true });
    sessionAddress$: Observable<SessionAddress> = this._sessionAddress.asObservable();

    constructor(
        private router: Router,
        private cacheSyncService: CacheSyncService,
        private citiesService: CitiesService,
        private addressesService: AddressesService,
        private citiesApiService: CitiesApiService,
        private stringWrapperService: StringWrapperService) { }

    init(): void {
        this.listenOnNavigation();
        this.cacheSyncService.add(this.sessionAddress$, 'sessionAddress');

        const cachedSessionAddress: SessionAddress = JSON.parse(localStorage.getItem('sessionAddress'));
        if (cachedSessionAddress) {
            this.set(cachedSessionAddress);
        } else {
            let city: City = this.citiesService.getFromUrl(this.router.url);
            if (!city) city = this.citiesService.getDefaultCity();
            this.set(this.composeFromCity(city, true));
        }
    }

    listenOnNavigation(): void {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                const cityFromUrl: City = this.citiesService.getFromUrl(this.router.url);
                if (cityFromUrl && this.isCityChanging(cityFromUrl, this._sessionAddress.getValue())) {
                    this.set(this.composeFromCity(cityFromUrl));
                }
            }
        });
    }

    set(sessionAddress: SessionAddress): void {
        const newCountryCode: string = `.${sessionAddress.deliveryCity.country.code}`;
        if (this.isCountryChanging(newCountryCode)) {
            const oldCountryCode: string = `.${window.location.hostname.split('.').pop()}`;
            this.changeCountry(newCountryCode, oldCountryCode, sessionAddress);

            return;
        }

        this._sessionAddress.next(sessionAddress);
    }

    isCountryChanging(newCountryCode: string): boolean {
        return !window.location.hostname.includes(newCountryCode);
    }

    changeCountry(newCountryCode: string, oldCountryCode: string, sessionAddress: SessionAddress): void {
        const newOrigin: string = window.location.origin.replace(oldCountryCode, newCountryCode);
        location.assign(`${newOrigin}${sessionAddress.deliveryCity.route_relative}`);
        throw new Error('stop thread');
    }

    isCityChanging(cityFromUrl: City, sessionAddress: SessionAddress): boolean {
        return sessionAddress.deliveryCity.id !== cityFromUrl.id;
    }

    composeFromCity(city: City, isDefault: boolean = false): SessionAddress {
        return {
            address: `${city.name}, ${this.stringWrapperService.toUpperCaseFirst(city.country.name)}`,
            city: city.name,
            deliveryCity: city,
            code: city.country.code.toUpperCase(),
            lat: city.latitude,
            lng: city.longitude,
            zipcode: '',
            isDeliverable: false,
            isDefault
        };
    }

    changeSessionAddress(address: BaseAddress): Observable<boolean> {
        const _cityWasChanged: Subject<boolean> = new Subject<boolean>();

        const oldSessionAddress: SessionAddress = _.cloneDeep(this._sessionAddress.getValue());
        this.citiesApiService.getClosest(address.lat, address.lng).subscribe((closestCity: City) => {
            const newSessionAddress: SessionAddress = _.merge(address,
                {
                    deliveryCity: closestCity,
                    isDeliverable: this.addressesService.isDeliverable(address)
                }
            );

            const cityWasChanged: boolean = oldSessionAddress.deliveryCity.id !== newSessionAddress.deliveryCity.id;
            if (cityWasChanged) {
                this.router.navigate([newSessionAddress.deliveryCity.route_relative]).then(() => {
                    this.set(newSessionAddress);
                });
            } else {
                this.set(newSessionAddress);
            }

            _cityWasChanged.next(cityWasChanged);
        });

        return _cityWasChanged.asObservable();
    }

    getAddressForInput(lastAddress: ClientAddress, savedAddresses: Array<ClientAddress>, isCoporate?: boolean): BaseAddress {
        const sessionAddress: SessionAddress = this._sessionAddress.getValue();

        if (sessionAddress.isDefault) {
            if (lastAddress) {
                lastAddress.isSaved = true;
            }

            return lastAddress;
        }

        let savedAddress: ClientAddress = _.find(savedAddresses, { id: sessionAddress.id });
        if (savedAddress) {
            savedAddress.isSaved = true;

            return savedAddress;
        } else {
            savedAddress = _.find(savedAddresses, (address: ClientAddress) =>
                (
                    address.lat.toFixed(2) === sessionAddress.lat.toFixed(2) &&
                    address.lng.toFixed(2) === sessionAddress.lng.toFixed(2) &&
                    address.zipcode === sessionAddress.zipcode &&
                    address.address === sessionAddress.address
                )
            );
        }

        if (savedAddress) {
            savedAddress.isSaved = true;

            return savedAddress;
        }

        if (isCoporate) {
            lastAddress.isSaved = true;

            return lastAddress;
        }

        if (sessionAddress) {
            sessionAddress.isSaved = false;
        }

        return sessionAddress;
    }
}
