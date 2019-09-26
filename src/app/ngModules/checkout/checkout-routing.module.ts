import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartGuardService } from '../shared/services/guards/cart-guard.service.ts.service';
import { ClientGuardService } from '../shared/services/guards/client-guard.service';
import { CheckoutComponent } from './checkout.component';
import {
    CheckoutRegistrationComponent
} from './components/checkout-registration/checkout-registration.component';
import {
    CheckoutValidationComponent
} from './components/checkout-validation/checkout-validation.component';

const routes: Routes = [
    {
        path: '',
        component: CheckoutComponent,
        canLoad: [CartGuardService],
        children: [
            {
                path: 'validation',
                component: CheckoutValidationComponent,
                canActivate: [CartGuardService, ClientGuardService],
                data: { headerClass: 'fixed' }
            },
            {
                path: 'registration',
                component: CheckoutRegistrationComponent,
                canActivate: [CartGuardService],
                data: { headerClass: 'fixed' }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckoutRoutingModule { }
