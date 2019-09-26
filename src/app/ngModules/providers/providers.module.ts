import { InlineSVGModule } from 'ng-inline-svg';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { AllergiesDialogComponent } from './components/allergies-dialog/allergies-dialog.component';
import {
    AttachedClientsDialogComponent
} from './components/attached-clients-dialog/attached-clients-dialog.component';
import { AttachedClientsComponent } from './components/attached-clients/attached-clients.component';
import {
    DifferentProviderDialogComponent
} from './components/different-provider-dialog/different-provider-dialog.component';
import {
    MobileShoppingCartComponent
} from './components/mobile-shopping-cart/mobile-shopping-cart.component';
import {
    OutOfRangeDialogComponent
} from './components/out-of-range-dialog/out-of-range-dialog.component';
import {
    ProductCategoriesComponent
} from './components/product-categories/product-categories.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import {
    ProviderCategoriesSelectionListComponent
} from './components/provider-categories-selection-list/provider-categories-selection-list.component';
import {
    ProviderDetailsDialogComponent
} from './components/provider-details-dialog/provider-details-dialog.component';
import { ProviderHeaderComponent } from './components/provider-header/provider-header.component';
import { ProviderRatingComponent } from './components/provider-rating/provider-rating.component';
import {
    ProviderTitleBarComponent
} from './components/provider-title-bar/provider-title-bar.component';
import {
    ProvidersFiltersDialogComponent
} from './components/providers-filters-dialog/providers-filters-dialog.component';
import {
    ProvidersFiltersComponent
} from './components/providers-filters/providers-filters.component';
import {
    ProvidersSortingComponent
} from './components/providers-sorting/providers-sorting.component';
import {
    ProvidersThumbnailsComponent
} from './components/providers-thumbnails/providers-thumbnails.component';
import {
    ShoppingCartDialogComponent
} from './components/shopping-cart-dialog/shopping-cart-dialog.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import {
    ProviderDetailsPageComponent
} from './pages/provider-details-page/provider-details-page.component';
import {
    ProvidersListPageComponent
} from './pages/providers-list-page/providers-list-page.component';
import { ProvidersRoutingModule } from './providers-routing.module';

@NgModule({
    imports: [
        ProvidersRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MaterialModule,
        TranslateModule,
        SharedModule,
        InlineSVGModule,
        NgSelectModule,
        LazyLoadImageModule
    ],
    declarations: [
        ProvidersListPageComponent,
        ProviderDetailsPageComponent,
        ShoppingCartComponent,
        ProvidersThumbnailsComponent,
        ProductSearchComponent,
        ProviderRatingComponent,
        ProviderHeaderComponent,
        ProductCategoriesComponent,
        ProvidersFiltersComponent,
        ProvidersSortingComponent,
        ProviderTitleBarComponent,
        ProviderDetailsDialogComponent,
        AllergiesDialogComponent,
        DifferentProviderDialogComponent,
        ProductCategoryComponent,
        OutOfRangeDialogComponent,
        ProvidersFiltersDialogComponent,
        ShoppingCartComponent,
        MobileShoppingCartComponent,
        AttachedClientsComponent,
        AttachedClientsDialogComponent,
        ShoppingCartDialogComponent,
        ProviderCategoriesSelectionListComponent
    ],
    entryComponents: [
        DifferentProviderDialogComponent,
        ProviderDetailsDialogComponent,
        AllergiesDialogComponent,
        OutOfRangeDialogComponent,
        ProvidersFiltersDialogComponent,
        AttachedClientsDialogComponent,
        ShoppingCartDialogComponent
    ]
})
export class ProvidersModule { }
