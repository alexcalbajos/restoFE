import * as $ from 'jquery';
import * as _ from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs';

import {
    AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output,
    Renderer2, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';

import { MqAlias } from '../../../../enums/media-query-alias.enum';
import {
    BaseAddress, ClientAddress, SessionAddress
} from '../../../../models/address/address.model';
import { City } from '../../../../models/address/city.model';
import { Client } from '../../../../models/client/client.model';
import { SpecialCategory } from '../../../../models/provider/special-category.model';
import { AddressInputDirective } from '../../../shared/directives/address-input.directive';
import {
    AddressesApiService
} from '../../../shared/services/business/addresses/addresses.api.service';
import { AddressesService } from '../../../shared/services/business/addresses/addresses.service';
import { CitiesApiService } from '../../../shared/services/business/cities/cities.api.service';
import { ClientService } from '../../../shared/services/business/client/client.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { MediaQueryService } from '../../../shared/services/helpers/media-query.service';
import { YahooTagService } from '../../../shared/services/helpers/yahoo-tag.service';

@Component({
    selector: 'ri-jumbo',
    templateUrl: 'jumbo.component.html',
    styleUrls: ['jumbo.component.scss']
})
export class JumboComponent implements OnInit, OnDestroy, AfterViewInit {
    addressIsFixed: boolean;
    invalidAddress: boolean;
    selectedAddress: BaseAddress;
    clientAddresses: Array<ClientAddress>;
    client: Client;
    showSelect: boolean;
    closeSelectSubscription: Subscription;
    openSelectSubscription: Subscription;
    categoryForPromo: SpecialCategory;
    @Output() readonly specialCategorySelected: EventEmitter<SpecialCategory> = new EventEmitter<SpecialCategory>();

    @ViewChild(AddressInputDirective) addressInput: AddressInputDirective;
    @ViewChild('select') select: NgSelectComponent;
    @ViewChild('toggleIcon') toggleIcon: ElementRef;

    constructor(
        private mediaQueryService: MediaQueryService,
        private sessionAddressService: SessionAddressService,
        private clientService: ClientService,
        private router: Router,
        private renderer2: Renderer2,
        private citiesApiService: CitiesApiService,
        private addressesApiService: AddressesApiService,
        private yahooTagService: YahooTagService,
        private addressesService: AddressesService) { }

    ngOnInit(): void {
        this.clientService.client$.pipe(untilDestroyed(this)).subscribe((client: Client) => {
            this.client = client;

            if (this.client && this.client.id) {
                this.addressesApiService.getAll().subscribe((clientAddresses: Array<ClientAddress>) => {
                    this.clientAddresses = clientAddresses;
                    this.setSelectedAddress();
                });
            } else {
                this.clientAddresses = [];
                const sessionAddress: SessionAddress = this.sessionAddressService._sessionAddress.getValue();
                this.selectedAddress = sessionAddress.isDefault ? undefined : sessionAddress;
            }
        });
    }

    ngAfterViewInit(): void {
        if (this.selectedAddress) {
            this.addressInput.setInputValue(this.selectedAddress);
        }

        this.clientService.client$.pipe(untilDestroyed(this)).subscribe((client: Client) => {
            if (client && client.id && !client.isCorporate) {
                this.closeSelectSubscription = this.select.closeEvent.subscribe(() => {
                    this.renderer2.removeClass(this.toggleIcon.nativeElement, 'reverse');

                    setTimeout(() => {
                        this.showSelect = false;
                    }, 100);
                });

                this.openSelectSubscription = this.select.openEvent.subscribe(() => {
                    this.renderer2.addClass(this.toggleIcon.nativeElement, 'reverse');

                    setTimeout(() => {
                        this.showSelect = true;
                    }, 100);
                });
            } else {
                if (this.closeSelectSubscription) {
                    this.closeSelectSubscription.unsubscribe();
                }

                if (this.openSelectSubscription) {
                    this.openSelectSubscription.unsubscribe();
                }
            }
        });
    }

    ngOnDestroy(): void {/**/ }

    @HostListener('window:scroll') toggleFixedInput(): void {
        const addressContainerSibling: Element = $('#AddressContainerSibling')[0];
        const secondaryHeader: JQuery = $('ri-header#SecondaryHeader');

        if (!addressContainerSibling || !secondaryHeader) return;

        const containerTopLimit: number = addressContainerSibling.getBoundingClientRect().bottom;

        if (containerTopLimit <= 0) {
            this.addressIsFixed = true;
            secondaryHeader.addClass('fixed');
            this.handleAddressContainer(true);
        } else if (this.addressIsFixed && containerTopLimit > 0) {
            this.addressIsFixed = false;
            secondaryHeader.addClass('temp');
            this.handleAddressContainer(false);
            setTimeout(() => {
                secondaryHeader.removeClass('fixed');
                secondaryHeader.removeClass('temp');
            }, 400);
        }
    }

    showProviders(): void {
        if (this.client && this.client.isCorporate) {
            this.handleSelectedAddress(this.selectedAddress);
        } else {
            this.addressInput.validateAddress(true);
        }

        this.yahooTagService.interestedUser();
    }

    selectedPlaceValidated(result: any): void {
        if (!result.forcedValidation) return;

        if (result.selectedPlace) {
            const address: BaseAddress = this.addressesService.composeAddressFromPlace(result.selectedPlace);
            this.handleSelectedAddress(address);
        } else {
            this.invalidAddress = true;
        }
    }

    toggleSelect(): void {
        if (!this.showSelect) {
            this.select.open();
        }
    }

    private handleSelectedAddress(address: BaseAddress): void {
        this.citiesApiService.getClosest(address.lat, address.lng).subscribe((closestCity: City) => {
            const sessionAddress: SessionAddress = _.merge(address,
                {
                    deliveryCity: closestCity,
                    isDeliverable: this.addressesService.isDeliverable(address)
                }
            );
            this.sessionAddressService.set(sessionAddress);

            if (this.categoryForPromo) {
                this.specialCategorySelected.emit(this.categoryForPromo);
            } else {
                this.router.navigate([closestCity.route_relative]);
            }

        });
    }

    private handleAddressContainer(fix: boolean): void {
        const address: JQuery = $('#AddressContainer');
        const pac: JQuery = $('.pac-container.pac-logo');

        if (fix) {
            if (this.mediaQueryService._mediaChange.getValue().value < MqAlias.Md) return;

            address.addClass('fixed');
            pac.addClass('fixed');
        } else {
            address.removeClass('fixed');
            pac.removeClass('fixed');
        }
    }

    private setSelectedAddress(): void {
        this.addressesApiService.getLatest().subscribe((lastAddress: ClientAddress) => {
            const addressForInput: BaseAddress =
                this.sessionAddressService.getAddressForInput(lastAddress, this.clientAddresses, this.client.isCorporate);

            if (!addressForInput) return;

            this.selectedAddress = addressForInput;

            if (!this.client.isCorporate) {
                this.addressInput.setInputValue(this.selectedAddress);
            }
        });
    }
}
