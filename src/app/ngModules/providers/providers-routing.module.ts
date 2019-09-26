import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    ProviderDetailsPageComponent
} from './pages/provider-details-page/provider-details-page.component';
import {
    ProvidersListPageComponent
} from './pages/providers-list-page/providers-list-page.component';

const routes: Routes = [
    {
        path: '',
        component: ProvidersListPageComponent,
        data: { headerClass: 'fixed large show-address' }
    },
    {
        path: ':providerCategory',
        component: ProvidersListPageComponent,
        data: { headerClass: 'fixed large show-address' }
    },
    {
        path: ':providerCategory/:providerLink',
        component: ProviderDetailsPageComponent,
        data: { headerClass: 'fixed show-address' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProvidersRoutingModule { }
