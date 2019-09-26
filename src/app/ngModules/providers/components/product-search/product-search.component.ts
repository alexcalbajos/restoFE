import { Subscription } from 'rxjs';

import { Provider } from '@angular/compiler/src/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FilteredResults } from '../../../../models/provider/filtered-results.model';
import {
    ProvidersApiService
} from '../../../shared/services/business/providers/providers.api.service';
import {
    SessionAddressService
} from '../../../shared/services/business/session-address/session-address.service';
import { GooglAnalyticsService } from '../../../shared/services/helpers/google-analytics.service';

@Component({
    selector: 'ri-product-search',
    templateUrl: 'product-search.component.html',
    styleUrls: ['product-search.component.scss']
})
export class ProductSearchComponent {
    filteredResults: Array<FilteredResults>;
    subscription: Subscription;
    showSpinner: boolean;

    constructor(
        private router: Router,
        private googlAnalyticsService: GooglAnalyticsService,
        private providersApiService: ProvidersApiService,
        private sessionAddressService: SessionAddressService) { }

    search(search: string): void {
        this.showSpinner = true;

        this.filteredResults = [];

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if (search.length < 3) {
            this.showSpinner = false;

            return;
        }

        this.subscription = this.providersApiService
            .getFilteredResults(this.sessionAddressService._sessionAddress.getValue().deliveryCity.id, search)
            .subscribe((filteredResults: Array<Provider>) => {
                if (filteredResults && filteredResults.length) {
                    this.filteredResults = this.mapFilteredResults(filteredResults);
                    this.googlAnalyticsService.pushEvent('SearchOK');
                } else {
                    this.filteredResults = [{
                        type: 'no-result'
                    }];
                }

                this.showSpinner = false;
            });
    }

    goToProduct(url: string): void {
        if (!url) return;

        this.router.navigateByUrl(url);
    }

    private mapFilteredResults(filteredResultsFromResponse: any): Array<FilteredResults> {
        const mappedFilteredResults: Array<FilteredResults> = [];

        if (!filteredResultsFromResponse) return mappedFilteredResults;

        filteredResultsFromResponse.forEach((provider: any) => {
            const providerResult: any = {
                type: 'provider',
                img: provider.logo_app_list,
                name: provider.name,
                url: provider.provider_url
            };

            if (provider.products_searched) {
                providerResult.numberOfProducts = provider.products_searched.length;
            }

            mappedFilteredResults.push(providerResult);

            if (provider.products_searched) {
                provider.products_searched.forEach((product: any) => {
                    const productResult: any = {
                        type: 'product',
                        name: product.name,
                        price: product.final_price,
                        url: provider.provider_url
                    };

                    mappedFilteredResults.push(productResult);
                });
            }
        });

        return mappedFilteredResults;
    }
}
