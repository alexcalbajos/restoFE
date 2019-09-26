import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ProviderStatusEnum } from '../../../../../enums/provider-status.enum';
import { SessionAddress } from '../../../../../models/address/address.model';
import { City, DeliveryCost } from '../../../../../models/address/city.model';
import { Client } from '../../../../../models/client/client.model';
import { DetailExtra, OrderDetail } from '../../../../../models/order/order.model';
import { ProductCategory } from '../../../../../models/provider/product-category.model';
import { OptionValue, Product, ProductOption } from '../../../../../models/provider/product.model';
import {
    CartProvider, Provider, ProviderCategory, ProviderCategoryDetails, ProviderSortingOption,
    SellingPoint, SellingPointOptionsPair, SellingPointProductsPair
} from '../../../../../models/provider/provider.model';
import {
    EtaChangeDialogComponent
} from '../../../components/eta-change-dialog/eta-change-dialog.component';
import { BrowserService } from '../../helpers/browser.service';
import { StringWrapperService } from '../../helpers/string-wrapper.service';
import { CitiesService } from '../cities/cities.service';
import { ClientService } from '../client/client.service';
import { ProductService } from '../products/product.service';
import { SessionAddressService } from '../session-address/session-address.service';

@Injectable()
export class ProvidersService {
    sortingOptions: Array<ProviderSortingOption> = [
        {
            id: 1,
            name: 'FASTEST',
            sortByForOpen: ['calculatedEta', 'distance'],
            sortingDirectionForOpen: ['asc', 'asc'],
            sortByForLater: ['opensAt'],
            sortingDirectionForLater: ['asc']
        },
        {
            id: 2,
            name: 'BEST_RATING',
            sortByForOpen: ['avg_note', 'calculatedEta', 'distance'],
            sortingDirectionForOpen: ['desc', 'asc', 'asc'],
            sortByForLater: ['avg_note', 'opensAt'],
            sortingDirectionForLater: ['desc', 'asc']
        }
    ];
    providerCategories: Array<ProviderCategoryDetails>;
    _selectedSortingOption: BehaviorSubject<ProviderSortingOption> = new BehaviorSubject<any>({ doNotCache: true });
    selectedSortingOption$: Observable<ProviderSortingOption> = this._selectedSortingOption.asObservable();
    constructor(
        private dialog: MatDialog,
        private sessionAddressService: SessionAddressService,
        private productService: ProductService,
        private citiesService: CitiesService,
        private clientService: ClientService,
        private browserService: BrowserService,
        private stringWrapperService: StringWrapperService) {
        this._selectedSortingOption.next(this.sortingOptions[0]);
    }

    filterProvidersByRange(providersFromResponse: Array<Provider>, sessionAddress: SessionAddress): Array<Provider> {
        const outOfRangeProviders: Array<number> = [];

        providersFromResponse.forEach((providerFromResponse: Provider, index: number) => {
            if (!this.isProviderInRange(sessionAddress.deliveryCity.id, providerFromResponse, this.clientService._client.getValue())) {
                outOfRangeProviders.push(index);
            }
        });

        for (let i: number = outOfRangeProviders.length - 1; i >= 0; i--) {
            providersFromResponse.splice(outOfRangeProviders[i], 1);
        }

        return this.orderProviders(providersFromResponse);
    }

    orderProviders(providers: Array<Provider>): Array<Provider> {
        let open: Array<Provider> = _.filter(providers, { status: ProviderStatusEnum.Open });
        let later: Array<Provider> = _.filter(providers, { status: ProviderStatusEnum.Later });

        const sortingOption: ProviderSortingOption = this._selectedSortingOption.getValue();

        open = _.orderBy(open,
            sortingOption.sortByForOpen,
            sortingOption.sortingDirectionForOpen);

        later = _.orderBy(later,
            sortingOption.sortByForLater,
            sortingOption.sortingDirectionForLater);

        return open.concat(later);
    }

    setProviderCategories(providers: Array<Provider>, queryParams: any, params: any): void {
        const categories: any = {};

        providers.forEach((provider: Provider) => {
            provider.provider_categories.forEach((category: ProviderCategory) => {
                if (!categories[category.category.id]) {
                    categories[category.category.id] = {
                        label: this.stringWrapperService.toUpperCaseFirst(category.category.label),
                        numberOfProviders: 1,
                        link: category.category.link.toLowerCase(),
                        id: category.category.id
                    };
                } else {
                    categories[category.category.id].numberOfProviders++;
                }
            });
        });

        const categoriesToArray: Array<ProviderCategoryDetails> = _.values(categories);

        this.setSelectedCategories(categoriesToArray, queryParams, params);

        this.providerCategories = _.orderBy(categoriesToArray, ['selected', 'label'], ['desc', 'asc']);
    }

    filterProvidersByCategories(providers: Array<Provider>, queryParams: any): Array<Provider> {
        const selectedCategories: Array<ProviderCategoryDetails> = _.filter(this.providerCategories, { selected: true });

        if (queryParams.categories && !selectedCategories.length) {
            return [];
        }

        if (!selectedCategories.length) {
            return providers;
        }

        const filteredProviders: Array<Provider> = [];
        providers.forEach((provider: Provider) => {
            provider.provider_categories.forEach((providerCategory: ProviderCategory) => {
                for (const selectedCategory of selectedCategories) {
                    if (_.some(filteredProviders, { id: provider.id })) {
                        break;
                    }

                    if (providerCategory.category.id === selectedCategory.id) {
                        filteredProviders.push(provider);

                        break;
                    }
                }
            });
        });

        return filteredProviders;
    }

    getProductFromOrderDetailAndProvider(orderDetail: OrderDetail, provider: Provider): Product {
        const product: Product = this.getProductFromProvider(provider, orderDetail.product.id);

        if (!product) return;

        product.qty = orderDetail.quantity;
        product.comment = orderDetail.comment;

        product.cartProvider = this.getCartProvider(provider);

        product.options.forEach((productOption: ProductOption) => {
            const details: Array<DetailExtra> = _.filter(orderDetail.extras, { id: productOption.id });

            if (!details.length) return;

            if (productOption.singleChoice) {
                const selectedValue: OptionValue = _.find(productOption.values, { id: details[0].values.id });
                selectedValue.qty = details[0].values.qty;

                productOption.selectedValue = selectedValue;
            } else {
                productOption.selectedValues = [];

                details.forEach((detail: DetailExtra) => {
                    const selectedValue: OptionValue = _.find(productOption.values, { id: detail.values.id });
                    selectedValue.qty = detail.values.qty;

                    productOption.selectedValues.push(selectedValue);
                });
            }
        });

        this.productService.handleProductChange(product);

        return product;
    }

    getCartProvider(provider: Provider): CartProvider {
        return {
            id: provider.id,
            name: provider.name,
            link: provider.link,
            provider_url: provider.provider_url,
            selling_points: provider.selling_points,
            min_order_amount: provider.min_order_amount,
            max_range: provider.max_range,
            estimated_delivery_time: provider.estimated_delivery_time,
            calculatedEta: provider.calculatedEta,
            etaToDisplay: provider.etaToDisplay,
            etaToDisplayParams: provider.etaToDisplayParams,
            status: provider.status,
            opensAt: provider.opensAt,
            distance: provider.distance
        };
    }

    mapProvider(provider: Provider, cityId: number): void {
        if (!provider.providers_web_main) {
            provider.providers_web_main = '/assets/images/no_photo.png';
        }

        provider.avg_note = provider.avg_note ? Math.round(provider.avg_note * 10) : -1;

        this.setDistanceAndClosestSellingPoint(provider);
        this.setEta(provider, cityId);
        this.setStatusAndOpensAtFromSchedule(provider, cityId);
        this.setProductsAvailability(provider);

        provider.absoluteUrl = `${location.protocol}//${location.host}${provider.provider_url.toLowerCase()}`;
    }

    isProviderInRange(cityId: number, provider: CartProvider, client: Client): boolean {
        if (client && client.id && client.delivery_range) {
            return provider.distance <= client.delivery_range;
        }

        if (client && client.id && client.company && client.company.delivery_range) {
            return provider.distance <= client.company.delivery_range;
        }

        if (provider.max_range) {
            return provider.distance <= provider.max_range;
        }

        return provider.distance <= _.find(this.citiesService.allCities, { id: cityId }).max_delivery_distance;
    }

    setLastProviderEta(provider: Provider): void {
        localStorage.setItem('lastProvider', JSON.stringify(
            {
                id: provider.id,
                estimated_delivery_time: provider.estimated_delivery_time
            }
        ));
    }

    checkLastProviderEta(updatedProvider: Provider): void {
        const lastProvider: Provider = JSON.parse(localStorage.getItem('lastProvider'));

        if (lastProvider && lastProvider.id === updatedProvider.id &&
            lastProvider.estimated_delivery_time < updatedProvider.estimated_delivery_time) {
            this.dialog.open(EtaChangeDialogComponent, {
                autoFocus: false,
                data: updatedProvider,
                disableClose: true
            });
        }

        this.setLastProviderEta(updatedProvider);
    }

    private setStatusAndOpensAtFromSchedule(provider: Provider, cityId: number): void {
        if (provider.status === ProviderStatusEnum.Closed) return;

        let status: number;
        let nextStart: any;

        const deliveryCity: City = _.find(this.citiesService.allCities, { id: cityId });

        let now: Date;
        now = this.browserService.isIE() ?
            new Date() :
            new Date(new Date().toLocaleString('en-Us', { timeZone: deliveryCity.timezone }));

        provider.schedules_hours.hours.forEach((hour: any) => {
            const startHour: number = hour.start.split(':')[0];
            const startMinutes: number = hour.start.split(':')[1];
            const start: Date =
                new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinutes, 0);

            const endHour: number = hour.end.split(':')[0];
            const endMinutes: number = hour.end.split(':')[1];
            const end: Date =
                new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinutes, 0);

            if (!nextStart && now < start) {
                nextStart = start;
            }

            if (now >= start && now <= end) {
                status = ProviderStatusEnum.Open;
            }
        });

        if (!status) {
            status = (!nextStart) ? ProviderStatusEnum.Closed : ProviderStatusEnum.Later;
        }

        if (!this.determineAnySellingPointOpen(provider)) {
            status = ProviderStatusEnum.Closed;
        }

        if (nextStart) {
            provider.opensAt = nextStart;
        }

        provider.status = status;
    }

    private setDistanceAndClosestSellingPoint(provider: CartProvider): void {
        const sessionAddress: SessionAddress = this.sessionAddressService._sessionAddress.getValue();
        let closestSellingPointId: number;
        let distance: number = -1;

        provider.selling_points.forEach((sellingPoint: SellingPoint) => {
            const newDistance: number = this.calculateDistance(
                sellingPoint.latitude, sellingPoint.longitude,
                sessionAddress.lat, sessionAddress.lng);

            if (distance === -1 || distance > newDistance) {
                distance = newDistance;
                closestSellingPointId = sellingPoint.id;
            }
        });

        provider.selling_points.forEach((sellingPoint: SellingPoint) => {
            sellingPoint.isClosest = sellingPoint.id === closestSellingPointId;
        });

        provider.distance = distance;
    }

    private setEta(provider: Provider, cityId: number): void {
        let deliveryTime: number = 0;

        const deliveryCity: City = _.find(this.citiesService.allCities, { id: cityId });

        deliveryCity.delivery_costs.forEach((deliveryCost: DeliveryCost) => {
            if (deliveryCost.km_start <= provider.distance && deliveryCost.km_end >= provider.distance) {
                if (deliveryTime === 0 || deliveryCost.delivery_time < deliveryTime) {
                    deliveryTime = deliveryCost.delivery_time;
                }
            }
        });

        provider.calculatedEta = Math.round((provider.estimated_delivery_time + deliveryTime) / 5) * 5;

        if (provider.calculatedEta > 120 && provider.calculatedEta <= 720) {
            const hours: number = Math.round(provider.calculatedEta / 60);
            provider.etaToDisplay = 'HOURS';
            provider.etaToDisplayParams = { hrs: `${hours}-${hours + 1}` };
        } else if (provider.calculatedEta > 720) {
            const days: number = Math.round(provider.calculatedEta / 60 / 24);
            provider.etaToDisplay = days === 1 ? 'DAY' : 'DAYS';
            provider.etaToDisplayParams = { days };
        } else {
            provider.etaToDisplay = 'MINUTES';
            provider.etaToDisplayParams = { mins: `${provider.calculatedEta - 5}-${provider.calculatedEta + 5}` };
        }
    }

    private setProductsAvailability(provider: Provider): void {
        if (!provider.categories) return;

        const closestSellingPoint: SellingPoint = _.find(provider.selling_points, { isClosest: true });

        let unavailableProducts: Array<number> = [];
        let unavailableOptions: Array<number> = [];

        if (provider.unavailable_products) {
            const closestSellingPointProductsPair: SellingPointProductsPair =
                _.find(provider.unavailable_products, { sellingPointId: closestSellingPoint.id });

            if (closestSellingPointProductsPair) {
                unavailableProducts = closestSellingPointProductsPair.products;
            }
        }

        if (provider.unavailable_options) {
            const closestSellingPointOptionsPair: SellingPointOptionsPair =
                _.find(provider.unavailable_options, { sellingPointId: closestSellingPoint.id });

            if (closestSellingPointOptionsPair) {
                unavailableOptions = closestSellingPointOptionsPair.options;
            }
        }

        provider.categories.forEach((category: ProductCategory) => {
            category.products.forEach((product: Product) => {
                product.isAvailable = unavailableProducts.indexOf(product.id) === -1;

                product.options.forEach((option: ProductOption) => {
                    option.values.forEach((value: OptionValue) => {
                        value.isAvailable = unavailableOptions.indexOf(value.id) === -1;
                    });

                    option.isAvailable = _.filter(option.values, { isAvailable: true }).length > 0;
                });
            });
        });

        provider.categories.forEach((category: ProductCategory) => {
            category.hasAvailableProducts = _.filter(category.products, { isAvailable: true }).length > 0;
        });
    }

    private getProductFromProvider(provider: Provider, productId: number): Product {
        let result: any;

        provider.categories.forEach((productCategory: ProductCategory) => {
            productCategory.products.forEach((product: Product) => {
                if (product.id === productId) {
                    result = product;
                }
            });
        });

        return result;
    }

    private setSelectedCategories(providerCategories: Array<ProviderCategoryDetails>, queryParams: any, params: any): void {
        let categoryLinksFromUrl: Array<string> = [];

        if (queryParams.categories) {
            categoryLinksFromUrl = queryParams.categories.split('%');
        }

        if (params.providerCategory) {
            categoryLinksFromUrl.push(params.providerCategory);
        }

        if (categoryLinksFromUrl.length < 1) return;

        providerCategories.forEach((category: ProviderCategoryDetails) => {
            category.selected = false;

            for (const categoryLink of categoryLinksFromUrl) {
                if (categoryLink.toLowerCase() === category.link.toLowerCase()) {
                    category.selected = true;

                    break;
                }
            }
        });
    }

    private determineAnySellingPointOpen(provider: Provider): any {
        return _.find(provider.selling_points, (sellingPoint: SellingPoint) =>
            sellingPoint.next_delivery
        );
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const radlat1: number = Math.PI * lat1 / 180;
        const radlat2: number = Math.PI * lat2 / 180;
        const theta: number = lon1 - lon2;
        const radtheta: number = Math.PI * theta / 180;
        let dist: number = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;

        return Math.round(dist * 100) / 100;
    }
}
