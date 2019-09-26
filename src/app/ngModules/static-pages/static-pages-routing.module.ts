import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutUsPageComponent } from './components/about-us-page/about-us-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { FaqPageComponent } from './components/faq-page/faq-page.component';
import {
    NoProvidersPageComponent
} from './components/no-providers-page/no-providers-page.component';
import { PrivacyPageComponent } from './components/privacy-page/privacy-page.component';
import { TermsPageComponent } from './components/terms-page/terms-page.component';
import { StaticPagesComponent } from './static-pages.component';

const routes: Routes = [
    {
        path: '',
        component: StaticPagesComponent,
        children: [
            {
                path: 'terms',
                component: TermsPageComponent,
                data: { headerClass: 'fixed' }
            },
            {
                path: 'privacy',
                component: PrivacyPageComponent,
                data: { headerClass: 'fixed' }
            },
            {
                path: 'faq',
                component: FaqPageComponent,
                data: { headerClass: 'fixed' }
            },
            {
                path: 'about',
                component: AboutUsPageComponent,
                data: { headerClass: 'fixed' }
            },
            {
                path: 'contact',
                component: ContactPageComponent,
                data: { headerClass: 'fixed', footerClass: 'no-margin' }
            },
            {
                path: 'no-providers',
                component: NoProvidersPageComponent,
                data: { headerClass: 'fixed', footerClass: 'no-margin' }
            }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StaticPagesRoutingModule { }
