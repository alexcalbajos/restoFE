import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TrackingRoutingModule } from './tracking-routing.module';
import { TrackingComponent } from './tracking.component';

@NgModule({
    imports: [
        TrackingRoutingModule,
        CommonModule,
        SharedModule
    ],
    declarations: [
        TrackingComponent
    ]
})
export class TrackingModule { }
