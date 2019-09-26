import {
    Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { City } from '../../../../models/address/city.model';
import { SpecialCategory } from '../../../../models/provider/special-category.model';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';

@Component({
    selector: 'ri-offers',
    templateUrl: 'offers.component.html',
    styleUrls: ['offers.component.scss']
})
export class OffersComponent implements OnInit {
    currentLang: string;
    title: string = 'LATEST_OFFERS';
    desc: string = 'LATEST_OFFERS_TEXT';
    actionText: string = 'VIEW_OUR_OFFERS';
    imageUrl: string = '/assets/images/offers/plate.jpg';
    @Output() readonly specialCategorySelected: EventEmitter<SpecialCategory> = new EventEmitter<SpecialCategory>();

    @ViewChild('image') image: ElementRef;

    constructor(
        private router: Router,
        private renderer2: Renderer2,
        private sessionAddressService: SessionAddressService,
        private translateService: TranslateService) { }

    ngOnInit(): void {
        this.currentLang = this.translateService.currentLang;

        this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
            this.currentLang = langChangeEvent.lang;
        });

        if (this.displayBogof()) {
            this.title = 'BOGOF_TITLE';
            this.desc = 'BOGOF_DESC';
            this.actionText = 'BOGOF_ACTION';
            this.imageUrl = '/assets/images/offers/bogof2.jpg';
        }

        this.renderer2.setStyle(this.image.nativeElement,
            'background', `url("${this.imageUrl}") no-repeat center`);
    }

    action(): void {
        if (this.displayBogof()) {
            this.goToBogofOffers();
        } else {
            this.openForm();
        }
    }

    displayBogof(): boolean {
        const startDate: Date = new Date(2019, 5, 10, 11);
        const deliveryCityName: string = this.sessionAddressService._sessionAddress.getValue().deliveryCity.name;

        return new Date() < startDate &&
            (deliveryCityName === 'Nancy' || deliveryCityName === 'Metz' || deliveryCityName === 'Lyon');
    }

    openForm(): void {
        let url: string;

        switch (this.currentLang) {
            case 'es':
                url = 'https://restoin-france.typeform.com/to/n79f6X';
                break;
            case 'fr':
                url = 'https://restoin-france.typeform.com/to/nqD1PU';
                break;
            default:
                url = 'https://restoin-france.typeform.com/to/JOFKWJ';
                break;
        }

        window.open(url);
    }

    goToBogofOffers(): void {
        const deliveryCity: City = this.sessionAddressService._sessionAddress.getValue().deliveryCity;

        this.router.navigateByUrl(`${deliveryCity.route_relative}/livraison-offerte`);
    }

    goToOffers(): void {
        const apiKey: string = 'offers';
        const translationKey: string = 'LATEST_OFFERS';

        this.specialCategorySelected.emit({ apiKey, translationKey });
    }
}
