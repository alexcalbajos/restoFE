import * as $ from 'jquery';

import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';

import {
    SessionAddressService
} from '../services/business/session-address/session-address.service';

@Directive({
    selector: '[ri-intl-tel-input]'
})
export class IntlTelInputDirective implements OnInit, AfterViewInit {
    @Input() value: any;

    constructor(
        private sessionAddressService: SessionAddressService,
        private el: ElementRef) { }

    ngOnInit(): void {
        const options: any = {
            initialCountry: this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code,
            formatOnDisplay: false,
            separateDialCode: true,
            preferredCountries: ['fr', 'es']
        };

        ($.fn as any).intlTelInput.loadUtils('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/14.0.6/js/utils.js');
        ($(this.el.nativeElement) as any).intlTelInput(options);
    }

    ngAfterViewInit(): void {
        if (this.value) {
            ($(this.el.nativeElement) as any).intlTelInput('setNumber', `+${this.value}`);
        }
    }

    getNumber(): string {
        return ($(this.el.nativeElement) as any).intlTelInput('getNumber');
    }
}
