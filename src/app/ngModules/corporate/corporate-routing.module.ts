import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    CorporateAddressesComponent
} from './components/corporate-addresses/corporate-addresses.component';
import { CorporateBillsComponent } from './components/corporate-bills/corporate-bills.component';
import {
    CorporateClientsComponent
} from './components/corporate-clients/corporate-clients.component';
import { CorporateCodesComponent } from './components/corporate-codes/corporate-codes.component';
import { CorporateComponent } from './corporate.component';

const routes: Routes = [
    {
        path: '',
        component: CorporateComponent,
        children: [
            {
                path: '',
                redirectTo: 'clients',
                pathMatch: 'full'
            },
            {
                path: 'clients',
                component: CorporateClientsComponent,
                data: { headerClass: 'fixed', footerClass: 'no-margin' }
            },
            {
                path: 'addresses',
                component: CorporateAddressesComponent,
                data: { headerClass: 'fixed', footerClass: 'no-margin' }
            },
            {
                path: 'codes',
                component: CorporateCodesComponent,
                data: { headerClass: 'fixed', footerClass: 'no-margin' }
            },
            {
                path: 'bills',
                component: CorporateBillsComponent,
                data: { headerClass: 'fixed', footerClass: 'no-margin' }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CorporateRoutingModule { }
