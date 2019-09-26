import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientComponent } from './client.component';
import { InfoPageComponent } from './components/info-page/info-page.component';
import { OrdersPageComponent } from './components/orders-page/orders-page.component';

const routes: Routes = [
    {
        path: '',
        component: ClientComponent,
        children: [
            {
                path: '',
                component: InfoPageComponent,
                data: { headerClass: 'fixed', footerClass: 'no-margin' }
            },
            {
                path: 'orders',
                children: [
                    {
                        path: '',
                        component: OrdersPageComponent,
                        data: { headerClass: 'fixed', footerClass: 'no-margin' }
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule { }
