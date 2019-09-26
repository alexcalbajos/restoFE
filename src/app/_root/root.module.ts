import { InlineSVGModule } from 'ng-inline-svg';

import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { ErrorHandler, Inject, LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { environment } from '../../environments/environment';
import { MaterialModule } from '../ngModules/material/material.module';
import { SharedModule } from '../ngModules/shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';
import { GdprDialogComponent } from './components/gdpr-dialog/gdpr-dialog.component';
import { ZopimComponent } from './components/zopim/zopim.component';
import { GlobalPageComponent } from './pages/global/global-page.component';
import {
    PaypalRedirectPageComponent
} from './pages/paypal-redirect-page/paypal-redirect-page.component';
import {
    ResetPasswordPageComponent
} from './pages/reset-password-page/reset-password-page.component';
import { RootPageComponent } from './pages/root-page/root-page.component';
import { SitemapPageComponent } from './pages/sitemap-page/sitemap-page.component';
import { RootRoutingModule } from './root-routing.module';
import { CustomErrorHandlerService } from './services/custom-error-handler.service';
import { InterceptorService } from './services/interceptor.service';
import { CustomTranslateLoader, TranslateLoaderService } from './services/translate-loader.service';
import { STATIC_API, static_api } from './static/api';
import { STATIC_CITIES, static_cities } from './static/cities';
import { STATIC_CONFIG, static_config } from './static/config';
import { STATIC_EN, static_en } from './static/en';
import { STATIC_ES, static_es } from './static/es';
import { STATIC_FR, static_fr } from './static/fr';
import { STATIC_VERSION, static_version } from './static/version';

registerLocaleData(localeFr);

@NgModule({
    imports: [
        RootRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule,
        SharedModule.forRoot(),
        InlineSVGModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: CustomTranslateLoader,
                deps: [[new Inject(STATIC_EN)], [new Inject(STATIC_ES)], [new Inject(STATIC_FR)]]
            }
        }),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
    ],
    declarations: [
        RootPageComponent,
        PaypalRedirectPageComponent,
        FooterComponent,
        GdprDialogComponent,
        SitemapPageComponent,
        ResetPasswordPageComponent,
        ZopimComponent,
        GlobalPageComponent
    ],
    entryComponents: [
        GdprDialogComponent
    ],
    bootstrap: [
        RootPageComponent
    ],
    providers: [
        TranslateLoaderService,
        {
            provide: ErrorHandler,
            useClass: CustomErrorHandlerService
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        },
        {
            provide: LOCALE_ID, useValue: 'fr-FR'
        },
        {
            provide: STATIC_API, useValue: static_api
        },
        {
            provide: STATIC_CONFIG, useValue: static_config
        },
        {
            provide: STATIC_CITIES, useValue: static_cities
        },
        {
            provide: STATIC_EN, useValue: static_en
        },
        {
            provide: STATIC_ES, useValue: static_es
        },
        {
            provide: STATIC_FR, useValue: static_fr
        },
        {
            provide: STATIC_VERSION, useValue: static_version
        },
        {
            provide: FirestoreSettingsToken, useValue: {}
        }
    ]
})
export class RootModule { }
