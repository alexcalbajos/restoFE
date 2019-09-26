// tslint:disable-next-line:comment-type
/// <reference types="@types/googlemaps" />
import * as $ from 'jquery';
import * as _ from 'lodash';

import {
    AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, Output
} from '@angular/core';

import { BaseAddress } from '../../../models/address/address.model';
import { AddressesService } from '../services/business/addresses/addresses.service';
import {
    SessionAddressService
} from '../services/business/session-address/session-address.service';

@Directive({
    selector: '[ri-address-input]'
})
export class AddressInputDirective implements AfterViewInit {
    @Input() value: BaseAddress;
    @Input() appendToBody: boolean;
    @Output() readonly selectedPlaceValidated: EventEmitter<any> = new EventEmitter<any>();
    private selectedPlace: google.maps.places.PlaceResult;

    constructor(
        private el: ElementRef,
        private addressesService: AddressesService,
        private sessionAddressService: SessionAddressService,
        private ngZone: NgZone) { }

    ngAfterViewInit(): void {
        this.setAutocomplete();

        if (this.value) {
            this.setInputValue(this.value);
        }
    }

    validateAddress(forcedValidation: boolean = false): void {
        const geocoder: google.maps.Geocoder = new google.maps.Geocoder();

        geocoder.geocode({
            address: this.el.nativeElement.value
        }, (results: Array<google.maps.GeocoderResult>, status: google.maps.GeocoderStatus) => {
            if (status !== google.maps.GeocoderStatus.OK) {
                this.ngZone.run(() => this.selectedPlaceValidated.emit({ forcedValidation }));
            } else {
                results.forEach((result: google.maps.GeocoderResult) => {
                    const validationResult: any = { forcedValidation };

                    if (this.inputHasValidAddress(result)) {
                        validationResult.selectedPlace = this.selectedPlace;
                    }

                    this.ngZone.run(() => this.selectedPlaceValidated.emit(validationResult));
                });
            }
        });
    }

    setInputValue(baseAddress: BaseAddress): void {
        const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
        const radiusCircle: google.maps.Circle = new google.maps.Circle({
            center: new google.maps.LatLng(baseAddress.lat, baseAddress.lng),
            radius: 1000
        });

        geocoder.geocode({
            address: baseAddress.address,
            bounds: radiusCircle.getBounds()
        }, (results: Array<any>, status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK) {
                this.selectedPlace = results[0];
                this.el.nativeElement.value = results[0].formatted_address;
                this.validateAddress(false);
            }
        });
    }

    private setAutocomplete(): void {
        $('.pac-container.pac-logo').remove();

        const autocomplete: google.maps.places.Autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement);
        const mapCircle: google.maps.Circle = new google.maps.Circle({
            center: new google.maps.LatLng(
                this.sessionAddressService._sessionAddress.getValue().deliveryCity.latitude,
                this.sessionAddressService._sessionAddress.getValue().deliveryCity.longitude),
            radius: this.sessionAddressService._sessionAddress.getValue().deliveryCity.max_delivery_distance * 1000
        });

        autocomplete.setBounds(mapCircle.getBounds());

        setTimeout(() => {
            if (!this.appendToBody) {
                $('.pac-container.pac-logo').insertAfter(this.el.nativeElement);
            }
        }, 1000);

        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            this.selectedPlace = autocomplete.getPlace();
            this.validateAddress();
        });
    }

    private inputHasValidAddress(result: google.maps.GeocoderResult): boolean {
        let validationResult: boolean = false;

        validationResult = result.formatted_address === this.el.nativeElement.value;

        if (!validationResult && this.selectedPlace) {
            validationResult = this.addressesService.getAddressComponent(result.address_components, 'street_number') ===
                this.addressesService.getAddressComponent(this.selectedPlace.address_components, 'street_number');

            validationResult = this.addressesService.getAddressComponent(result.address_components, 'route') ===
                this.addressesService.getAddressComponent(this.selectedPlace.address_components, 'route');

            validationResult = this.addressesService.getAddressComponent(result.address_components, 'locality') ===
                this.addressesService.getAddressComponent(this.selectedPlace.address_components, 'locality');

            validationResult = this.addressesService.getAddressComponent(result.address_components, 'country') ===
                this.addressesService.getAddressComponent(this.selectedPlace.address_components, 'country');

            const resultPostalCode: string = this.addressesService
                .getAddressComponent(result.address_components, 'postal_code');
            const selectedPlaceCode: string = this.addressesService
                .getAddressComponent(this.selectedPlace.address_components, 'postal_code');

            if (!resultPostalCode || !selectedPlaceCode) {
                validationResult = false;
            }
        }

        return validationResult;
    }
}
