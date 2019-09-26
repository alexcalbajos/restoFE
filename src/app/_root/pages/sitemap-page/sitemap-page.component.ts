import { Component, OnInit } from '@angular/core';

import { SitemapPair } from '../../../models/address/sitemap.model';
import {
    SessionAddressService
} from '../../../ngModules/shared/services/business/session-address/session-address.service';
import {
    StaticPagesApiService
} from '../../../ngModules/shared/services/business/static-pages/static-pages-api.service';
import { MetaService } from '../../../ngModules/shared/services/helpers/meta.service';

@Component({
    selector: 'ri-sitemap-page',
    templateUrl: 'sitemap-page.component.html',
    styleUrls: ['sitemap-page.component.scss']
})
export class SitemapPageComponent implements OnInit {
    sitemapPairs: Array<SitemapPair>;
    dataLoaded: boolean;

    constructor(
        private metaService: MetaService,
        private sessionAddressService: SessionAddressService,
        private staticPagesApiService: StaticPagesApiService) { }

    ngOnInit(): void {
        this.metaService.setMeta({
            title: 'SITEMAP',
            description: 'page.sitemap.description'
        });

        this.staticPagesApiService.getSitemap(this.sessionAddressService._sessionAddress.getValue().deliveryCity.country.id)
            .subscribe((sitemapPairs: Array<SitemapPair>) => {
                this.sitemapPairs = sitemapPairs;
                this.dataLoaded = true;
            });
    }
}
