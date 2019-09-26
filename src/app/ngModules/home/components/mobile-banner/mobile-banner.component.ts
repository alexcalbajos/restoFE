import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';

@Component({
    selector: 'ri-mobile-banner',
    templateUrl: 'mobile-banner.component.html',
    styleUrls: ['mobile-banner.component.scss']
})
export class MobileBannerComponent implements OnInit, AfterViewInit, OnDestroy {
    isAndroid: boolean;
    isIos: boolean;
    closed: boolean;

    constructor(private sessionAddressService: SessionAddressService) { }

    ngOnInit(): void {
        this.closed = JSON.parse(localStorage.getItem('mobileBannerClosed'));

        if (this.closed) return;

        if (navigator.userAgent.match(/Android/i)) {
            this.isAndroid = true;
        }

        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            this.isIos = true;
        }
    }

    ngAfterViewInit(): void {
        if (this.closed) return;

        const container: HTMLElement = document.querySelector('ri-mobile-banner .banner-container');

        if (container) {
            this.moveHeader(container.getBoundingClientRect().height);
        }
    }

    ngOnDestroy(): void {
        this.moveHeader(0);
    }

    install(): void {
        if (this.isAndroid) {
            this.openAndroid();
        }

        if (this.isIos) {
            this.openIphone();
        }

        this.close();
    }

    openAndroid(): void {
        window.open('https://play.google.com/store/apps/details?id=com.ri.restoin');
    }

    openIphone(): void {
        const countryCode: string = this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.code;
        window.open(`https://itunes.apple.com/${countryCode}/app/resto-in/id913946533?mt=8`);
    }

    close(): void {
        localStorage.setItem('mobileBannerClosed', 'true');
        this.moveHeader(0);
        this.closed = true;
    }

    moveHeader(top: number): void {
        const themeWrapper: HTMLElement = document.querySelector('body');
        themeWrapper.style.setProperty('--headerTop', `${top}px`);
    }
}
