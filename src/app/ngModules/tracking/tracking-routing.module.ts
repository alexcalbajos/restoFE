import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrackingComponent } from './tracking.component';

const routes: Routes = [
    {
        path: '',
        component: TrackingComponent
    },
    {
        path: ':orderId',
        component: TrackingComponent,
        data: { headerClass: 'fixed', footerClass: 'no-margin' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrackingRoutingModule { }
