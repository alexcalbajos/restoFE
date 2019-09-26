import { untilDestroyed } from 'ngx-take-until-destroy';

import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';

import { ProviderSortingOption } from '../../../../models/provider/provider.model';
import { ProvidersService } from '../../../shared/services/business/providers/providers.service';
import { ZopimService } from '../../../shared/services/helpers/zopim.service';

@Component({
    selector: 'ri-providers-filters-dialog',
    templateUrl: 'providers-filters-dialog.component.html',
    styleUrls: ['providers-filters-dialog.component.scss']
})
export class ProvidersFiltersDialogComponent implements OnInit, OnDestroy, AfterViewInit {
    selectedSortingOption: ProviderSortingOption;
    selectedCategoriesList: MatSelectionList;
    @ViewChild('buttonsRow') buttonsRow: ElementRef;

    constructor(
        private zopimService: ZopimService,
        public providersService: ProvidersService,
        public dialogRef: MatDialogRef<ProvidersFiltersDialogComponent>) { }

    ngOnInit(): void {
        this.providersService.selectedSortingOption$.pipe(untilDestroyed(this))
            .subscribe((providerSortingOption: ProviderSortingOption) => {
                if (providerSortingOption.id) {
                    this.selectedSortingOption = providerSortingOption;
                }
            });
    }

    ngAfterViewInit(): void {
        this.zopimService.moveChatButton(this.buttonsRow.nativeElement.offsetHeight);
    }

    ngOnDestroy(): void {
        this.zopimService.moveChatButton(0);
    }

    applyFilters(): void {
        if (this.selectedSortingOption) {
            this.providersService._selectedSortingOption.next(this.selectedSortingOption);
        }

        this.dialogRef.close(this.selectedCategoriesList);
    }

    newSelection(list: MatSelectionList): void {
        this.selectedCategoriesList = list;
    }
}
