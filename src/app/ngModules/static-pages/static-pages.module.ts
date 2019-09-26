import { InlineSVGModule } from 'ng-inline-svg';
import { Nl2BrPipeModule } from 'nl2br-pipe';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../material/material.module';
import { AboutUsPageComponent } from './components/about-us-page/about-us-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { FaqPageComponent } from './components/faq-page/faq-page.component';
import { LegalComponent } from './components/legal/legal.component';
import {
    NoProvidersPageComponent
} from './components/no-providers-page/no-providers-page.component';
import { PressPageComponent } from './components/press-page/press-page.component';
import { PrivacyPageComponent } from './components/privacy-page/privacy-page.component';
import { TermsPageComponent } from './components/terms-page/terms-page.component';
import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { StaticPagesComponent } from './static-pages.component';

@NgModule({
    imports: [
        StaticPagesRoutingModule,
        CommonModule,
        MaterialModule,
        TranslateModule,
        FlexLayoutModule,
        Nl2BrPipeModule,
        InlineSVGModule
    ],
    declarations: [
        FaqPageComponent,
        PrivacyPageComponent,
        TermsPageComponent,
        PressPageComponent,
        StaticPagesComponent,
        AboutUsPageComponent,
        LegalComponent,
        ContactPageComponent,
        NoProvidersPageComponent
    ]
})
export class StaticPagesModule { }
