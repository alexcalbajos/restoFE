import { InlineSVGModule } from 'ng-inline-svg';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { EnterprisePageComponent } from './components/enterprise-page/enterprise-page.component';
import { RestaurantPageComponent } from './components/restaurant-page/restaurant-page.component';
import { PresentationRoutingModule } from './presentation-routing.module';
import { PresentationComponent } from './presentation.component';

@NgModule({
    imports: [
        PresentationRoutingModule,
        CommonModule,
        MaterialModule,
        TranslateModule,
        FlexLayoutModule,
        InlineSVGModule,
        SharedModule
    ],
    declarations: [
        PresentationComponent,
        EnterprisePageComponent,
        RestaurantPageComponent
    ]
})
export class PresentationModule { }
