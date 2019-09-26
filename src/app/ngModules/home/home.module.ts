import { InlineSVGModule } from 'ng-inline-svg';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { CategoriesPromoComponent } from './components/categories-promo/categories-promo.component';
import { EnterprisePromoComponent } from './components/enterprise-promo/enterprise-promo.component';
import { JumboComponent } from './components/jumbo/jumbo.component';
import { MobileBannerComponent } from './components/mobile-banner/mobile-banner.component';
import { MobilePromoComponent } from './components/mobile-promo/mobile-promo.component';
import { OffersComponent } from './components/offers/offers.component';
import { ThumbnailPromoComponent } from './components/thumbnail-promo/thumbnail-promo.component';
import { HomeRoutingModule } from './home-routing.module';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

@NgModule({
    imports: [
        HomeRoutingModule,
        CommonModule,
        TranslateModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        InlineSVGModule,
        FormsModule,
        NgSelectModule
    ],
    declarations: [
        LandingPageComponent,
        JumboComponent,
        OffersComponent,
        CategoriesPromoComponent,
        MobilePromoComponent,
        EnterprisePromoComponent,
        ThumbnailPromoComponent,
        MobileBannerComponent
    ]
})
export class HomeModule { }
