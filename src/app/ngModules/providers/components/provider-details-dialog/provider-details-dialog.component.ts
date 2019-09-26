import * as _ from 'lodash';

import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Provider, SellingPoint } from '../../../../models/provider/provider.model';
import { AddressesService } from '../../../shared/services/business/addresses/addresses.service';

@Component({
    selector: 'ri-provider-details-dialog',
    templateUrl: 'provider-details-dialog.component.html',
    styleUrls: ['provider-details-dialog.component.scss']
})
export class ProviderDetailsDialogComponent implements OnInit {
    address: string;
    city: string;
    postalCode: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public provider: Provider,
        private addressesService: AddressesService,
        private ngZone: NgZone,
        public dialogRef: MatDialogRef<ProviderDetailsDialogComponent>) { }

    ngOnInit(): void {
        const closestSellingPoint: SellingPoint = _.find(this.provider.selling_points, { isClosest: true });
        this.address = closestSellingPoint.address;

        const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: closestSellingPoint.address,
            location: new google.maps.LatLng(closestSellingPoint.latitude, closestSellingPoint.longitude)
        }, (results: Array<any>, status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK) {
                this.ngZone.run(() => {
                    this.postalCode = this.addressesService.getAddressComponent(results[0].address_components, 'postal_code');
                    this.city = this.addressesService.getAddressComponent(results[0].address_components, 'locality');
                });
            }
        });
    }
}
