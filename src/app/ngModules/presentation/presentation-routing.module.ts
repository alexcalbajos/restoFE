import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EnterprisePageComponent } from './components/enterprise-page/enterprise-page.component';
import { RestaurantPageComponent } from './components/restaurant-page/restaurant-page.component';
import { PresentationComponent } from './presentation.component';

const routes: Routes = [
    {
        path: '',
        component: PresentationComponent,
        children:
            [
                {
                    path: 'enterprise',
                    component: EnterprisePageComponent,
                    data: { headerClass: 'fixed' }
                },
                {
                    path: 'restaurant',
                    component: RestaurantPageComponent,
                    data: { headerClass: 'fixed' }
                }
            ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PresentationRoutingModule { }
