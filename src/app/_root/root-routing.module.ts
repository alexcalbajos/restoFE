import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuardService } from '../ngModules/shared/services/guards/admin-guard.service';
import {
    CartGuardService
} from '../ngModules/shared/services/guards/cart-guard.service.ts.service';
import { ClientGuardService } from '../ngModules/shared/services/guards/client-guard.service';
import { GlobalPageComponent } from './pages/global/global-page.component';
import {
    PaypalRedirectPageComponent
} from './pages/paypal-redirect-page/paypal-redirect-page.component';
import {
    ResetPasswordPageComponent
} from './pages/reset-password-page/reset-password-page.component';
import { SitemapPageComponent } from './pages/sitemap-page/sitemap-page.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadChildren: 'app/ngModules/home/home.module#HomeModule'
            },
            {
                path: 'static',
                loadChildren: 'app/ngModules/static-pages/static-pages.module#StaticPagesModule'
            },
            {
                path: 'presentation',
                loadChildren: 'app/ngModules/presentation/presentation.module#PresentationModule'
            },
            {
                path: 'client',
                loadChildren: 'app/ngModules/client/client.module#ClientModule',
                canLoad: [ClientGuardService]
            },
            {
                path: 'auth',
                loadChildren: 'app/ngModules/auth/auth.module#AuthModule'
            },
            {
                path: 'providers',
                loadChildren: 'app/ngModules/providers/providers.module#ProvidersModule'
            },
            {
                path: 'checkout',
                loadChildren: 'app/ngModules/checkout/checkout.module#CheckoutModule',
                canLoad: [CartGuardService]
            },
            {
                path: 'corporate',
                loadChildren: 'app/ngModules/corporate/corporate.module#CorporateModule',
                canLoad: [ClientGuardService, AdminGuardService]
            },
            {
                path: 'tracking',
                loadChildren: 'app/ngModules/tracking/tracking.module#TrackingModule'
            },
            {
                path: 'sitemap',
                component: SitemapPageComponent,
                data: { headerClass: 'fixed' }
            },
            {
                path: 'paypal/:status',
                component: PaypalRedirectPageComponent,
                data: { headerClass: 'fixed', footerClass: 'no-margin' },
                canLoad: [ClientGuardService]
            },
            {
                path: 'reset/:token',
                component: ResetPasswordPageComponent,
                data: { headerClass: 'fixed', footerClass: 'no-margin' }
            },
            {
                path: 'global',
                component: GlobalPageComponent
            },
            {
                path: '**',
                redirectTo: '',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [RouterModule]
})
export class RootRoutingModule { }
