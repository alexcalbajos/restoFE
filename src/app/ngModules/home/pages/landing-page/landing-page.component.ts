import * as _ from 'lodash';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { STATIC_CONFIG, StaticConfig } from '../../../../_root/static/config';
import { MessageType } from '../../../../enums/message-type.enum';
import { SessionAddress } from '../../../../models/address/address.model';
import { SpecialCategory } from '../../../../models/provider/special-category.model';
import { CitiesService } from '../../../shared/services/business/cities/cities.service';
import {
    ProvidersApiService
} from '../../../shared/services/business/providers/providers.api.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { AnalyticsService } from '../../../shared/services/helpers/analytics.service';
import { MediaQueryService } from '../../../shared/services/helpers/media-query.service';
import { MetaService } from '../../../shared/services/helpers/meta.service';
import { ScrollService } from '../../../shared/services/helpers/scroll.service';
import { ToasterWrapperService } from '../../../shared/services/helpers/toaster-wrapper.service';
import {
    CategoriesPromoComponent
} from '../../components/categories-promo/categories-promo.component';
import { JumboComponent } from '../../components/jumbo/jumbo.component';

@Component({
    selector: 'ri-landing',
    templateUrl: 'landing-page.component.html',
    styleUrls: ['landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
    @ViewChild('jumbo') jumbo: JumboComponent;
    @ViewChild('categories') categories: CategoriesPromoComponent;

    constructor(
        @Inject(STATIC_CONFIG) private staticConfig: StaticConfig,
        private metaService: MetaService,
        private scrollService: ScrollService,
        private translateService: TranslateService,
        private toasterWrapperService: ToasterWrapperService,
        private citiesService: CitiesService,
        private router: Router,
        private sessionAddressService: SessionAddressService,
        public mediaQueryService: MediaQueryService,
        private providersApiService: ProvidersApiService,
        private analyticsService: AnalyticsService) { }

    ngOnInit(): void {
        this.metaService.setMeta({
            title: 'GENERIC_PAGE_TITLE',
            description: 'GENERIC_PAGE_DESCRIPTION',
            descriptionTranslationParam: { providerName: this.staticConfig.brandName }
        });

        this.analyticsService.dynx_pageType('home');
    }

    specialCategorySelected(specialCategory: SpecialCategory): void {
        const sessionAddress: SessionAddress = this.sessionAddressService._sessionAddress.getValue();

        if (sessionAddress.isDefault) {
            this.jumbo.categoryForPromo = specialCategory;
            this.categories.loading = false;

            this.scrollService.scrollTo('ri-jumbo');

            this.translateService.get(specialCategory.translationKey).subscribe((translatedKey: string) => {
                this.toasterWrapperService.show('CATEGORY_PROMO', MessageType.Warning, { category: translatedKey });
            });

            return;
        }

        this.providersApiService.getCategoryUrlFromKeyword(sessionAddress.deliveryCity.id, specialCategory.apiKey)
            .subscribe((categories: Array<string>) => {
                if (categories.length > 0) {
                    this.router.navigate(
                        [_.find(this.citiesService.allCities, { id: sessionAddress.deliveryCity.id }).route_relative],
                        { queryParams: { categories: categories.join('%') } }
                    );
                } else {
                    this.translateService.get(specialCategory.translationKey).subscribe((translatedKey: string) => {
                        this.toasterWrapperService.show('CATEGORY_PROMO_MISSING', MessageType.Warning, { category: translatedKey });
                    });
                }

                this.jumbo.categoryForPromo = undefined;
                this.categories.loading = false;
            });
    }
}
