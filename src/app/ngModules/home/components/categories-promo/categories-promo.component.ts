import { Component, EventEmitter, Output } from '@angular/core';

import { SpecialCategory } from '../../../../models/provider/special-category.model';

@Component({
    selector: 'ri-categories-promo',
    templateUrl: 'categories-promo.component.html',
    styleUrls: ['categories-promo.component.scss']
})
export class CategoriesPromoComponent {
    loading: boolean;
    loadingCategoryKey: string;
    @Output() readonly specialCategorySelected: EventEmitter<SpecialCategory> = new EventEmitter<SpecialCategory>();

    goToCategory(specialCategory: SpecialCategory): void {
        this.loading = true;
        this.loadingCategoryKey = specialCategory.apiKey;

        this.specialCategorySelected.emit(specialCategory);
    }

    fade(apiKey: string): boolean {
        return this.loading && this.loadingCategoryKey === apiKey;
    }
}
