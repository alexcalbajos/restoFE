import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';

import { ProviderCategoryDetails } from '../../../../models/provider/provider.model';

@Component({
    selector: 'ri-provider-categories-selection-list',
    templateUrl: './provider-categories-selection-list.component.html',
    styleUrls: ['./provider-categories-selection-list.component.scss']
})
export class ProviderCategoriesSelectionListComponent {
    @Input() categories: Array<ProviderCategoryDetails>;
    @Output() readonly selectionChange: EventEmitter<MatSelectionList> = new EventEmitter<MatSelectionList>();

    newSelection(list: MatSelectionList): void {
        this.selectionChange.emit(list);
    }
}
