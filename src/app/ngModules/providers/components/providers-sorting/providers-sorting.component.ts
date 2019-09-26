import { untilDestroyed } from 'ngx-take-until-destroy';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ProviderSortingOption } from '../../../../models/provider/provider.model';
import { ProvidersService } from '../../../shared/services/business/providers/providers.service';

@Component({
    selector: 'ri-providers-sorting',
    templateUrl: 'providers-sorting.component.html',
    styleUrls: ['providers-sorting.component.scss']
})
export class ProvidersSortingComponent implements OnInit, OnDestroy {
    @Input() numberOfProviders: number;
    selectedSortingOption: ProviderSortingOption;

    constructor(public providersService: ProvidersService) { }

    ngOnInit(): void {
        this.providersService.selectedSortingOption$.pipe(untilDestroyed(this))
            .subscribe((providerSortingOption: ProviderSortingOption) => {
                if (providerSortingOption.id) {
                    this.selectedSortingOption = providerSortingOption;
                }
            });
    }

    ngOnDestroy(): void {/**/ }

    sort(): void {
        this.providersService._selectedSortingOption.next(this.selectedSortingOption);
    }
}
