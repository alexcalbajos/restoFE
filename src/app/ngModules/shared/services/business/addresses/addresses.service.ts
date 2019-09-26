import * as _ from 'lodash';

import { Injectable } from '@angular/core';

import { BaseAddress } from '../../../../../models/address/address.model';

@Injectable()
export class AddressesService {
    composeAddressFromPlace(placeResult: google.maps.places.PlaceResult): BaseAddress {
        const address: BaseAddress = {
            zipcode: '',
            city: '',
            code: '',
            lat: placeResult.geometry.location.lat(),
            lng: placeResult.geometry.location.lng(),
            address: placeResult.formatted_address
        };

        placeResult.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
            if (component.types[0] === 'postal_code') {
                address.zipcode = component.long_name;
            }

            if (component.types[0] === 'locality') {
                address.city = component.long_name;
            }

            if (!address.city && component.types[0] === 'administrative_area_level_2') {
                address.city = component.long_name;
            }

            if (component.types[0] === 'country') {
                address.code = component.short_name;
            }

            if (component.types[0] === 'street_number') {
                address.streetNumber = component.short_name;
            }

            if (component.types[0] === 'route') {
                address.route = component.short_name;
            }
        });

        return address;
    }

    isDeliverable(address: BaseAddress, checkPlace: boolean = false): boolean {
        let validationResult: boolean = true;

        if (!address.zipcode ||
            !address.city ||
            !address.lat ||
            !address.lng) {
            validationResult = false;
        }

        if (!checkPlace || !validationResult) return validationResult;

        if (!address.route ||
            !address.streetNumber) {
            validationResult = false;
        }

        return validationResult;
    }

    getAddressComponent(addressComponents: any, typeKey: string): any {
        const addressComponent: any = _.find(addressComponents, (component: any) =>
            _.some(component.types, (type: any) =>
                type === typeKey
            )
        );

        if (addressComponent) {
            return addressComponent.long_name;
        } else {
            return undefined;
        }
    }
}
