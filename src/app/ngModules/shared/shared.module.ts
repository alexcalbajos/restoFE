import { InlineSVGModule } from 'ng-inline-svg';

import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../material/material.module';
import {
    AddAddressDialogComponent
} from './components/add-address-dialog/add-address-dialog.component';
import { AddAddressFormComponent } from './components/add-address-form/add-address-form.component';
import {
    AddCreditCardDialogComponent
} from './components/add-credit-card-dialog/add-credit-card-dialog.component';
import { AddressBoxComponent } from './components/address-box/address-box.component';
import {
    AgmInfoWindowContentComponent
} from './components/agm-info-window-content/agm-info-window-content.component';
import { AgmMapComponent } from './components/agm-map/agm-map.component';
import { AppStoreButtonComponent } from './components/app-store-button/app-store-button.component';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import {
    ChangeSelectedAddressDialogComponent
} from './components/change-selected-address-dialog/change-selected-address-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CreditCardBoxComponent } from './components/credit-card-box/credit-card-box.component';
import {
    DeliveryAddressDialogComponent
} from './components/delivery-address-dialog/delivery-address-dialog.component';
import { DisabledProductComponent } from './components/disabled-product/disabled-product.component';
import { DropinFormComponent } from './components/dropin-form/dropin-form.component';
import {
    EtaChangeDialogComponent
} from './components/eta-change-dialog/eta-change-dialog.component';
import {
    GooglePlayButtonComponent
} from './components/google-play-button/google-play-button.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import {
    ProviderEtaLabelComponent
} from './components/provider-eta-label/provider-eta-label.component';
import { QuantityInputComponent } from './components/quantity-input/quantity-input.component';
import { AddressInputDirective } from './directives/address-input.directive';
import { CustomDataDirective } from './directives/custom-data.directive';
import { IntlTelInputDirective } from './directives/intl-tel-input.directive';
import { ScrollAnchorDirective } from './directives/scroll-anchor.directive';
import { AddressDialogService } from './services/business/addresses/address-dialog.service';
import { AddressesApiService } from './services/business/addresses/addresses.api.service';
import { AddressesService } from './services/business/addresses/addresses.service';
import {
    AuthenticationApiService
} from './services/business/authentication/authentication.api.service';
import { AuthenticationService } from './services/business/authentication/authentication.service';
import { CartService } from './services/business/cart/cart.service';
import { CheckoutApiService } from './services/business/checkout/checkout.api.service';
import { CheckoutService } from './services/business/checkout/checkout.service';
import { CitiesApiService } from './services/business/cities/cities.api.service';
import { CitiesService } from './services/business/cities/cities.service';
import { ClientApiService } from './services/business/client/client.api.service';
import { ClientService } from './services/business/client/client.service';
import { CorporateApiService } from './services/business/corporate/corporate.api.service';
import {
    DeliveryHoursApiService
} from './services/business/delivery-hours/delivery-hours.api.service';
import { DeliveryHoursService } from './services/business/delivery-hours/delivery-hours.service';
import {
    NotificationsApiService
} from './services/business/notifications/notifications.api.service';
import { OrdersApiService } from './services/business/orders/orders.api.service';
import { OrdersService } from './services/business/orders/orders.service';
import { PaymentsApiService } from './services/business/payment/payments.api.service';
import { PaymentsService } from './services/business/payment/payments.service';
import { ProductDialogService } from './services/business/products/product-dialog.service';
import { ProductService } from './services/business/products/product.service';
import { ProvidersApiService } from './services/business/providers/providers.api.service';
import { ProvidersService } from './services/business/providers/providers.service';
import { SessionAddressService } from './services/business/session-address/session-address.service';
import { StaticPagesApiService } from './services/business/static-pages/static-pages-api.service';
import { AdminGuardService } from './services/guards/admin-guard.service';
import { CartGuardService } from './services/guards/cart-guard.service.ts.service';
import { ClientGuardService } from './services/guards/client-guard.service';
import { GuardBaseService } from './services/guards/guard-base.service';
import { AnalyticsService } from './services/helpers/analytics.service';
import { BingTagService } from './services/helpers/bing-tag.service';
import { BraintreeService } from './services/helpers/braintree.service';
import { BrowserService } from './services/helpers/browser.service';
import { CacheSyncService } from './services/helpers/cache-sync.service';
import { DatesHelperService } from './services/helpers/dates-helper.service';
import { DropinService } from './services/helpers/dropin.service';
import { FormValidationService } from './services/helpers/form-validation.service';
import { GooglAnalyticsService } from './services/helpers/google-analytics.service';
import { HistoryService } from './services/helpers/history.service';
import { HttpWrapperService } from './services/helpers/http-wrapper.service';
import { LoggerService } from './services/helpers/logger.service';
import { MediaQueryService } from './services/helpers/media-query.service';
import { MetaService } from './services/helpers/meta.service';
import { ScrollService } from './services/helpers/scroll.service';
import { StringWrapperService } from './services/helpers/string-wrapper.service';
import { ToasterWrapperService } from './services/helpers/toaster-wrapper.service';
import { TranslationWrapperService } from './services/helpers/translation-wrapper.service';
import { YahooTagService } from './services/helpers/yahoo-tag.service';
import { ZopimService } from './services/helpers/zopim.service';

const sharedElements: Array<any> = [
    ConfirmDialogComponent,
    HeaderComponent,
    QuantityInputComponent,
    CartProductComponent,
    ScrollAnchorDirective,
    CustomDataDirective,
    IntlTelInputDirective,
    AddressInputDirective,
    CreditCardBoxComponent,
    AddCreditCardDialogComponent,
    DropinFormComponent,
    AddAddressDialogComponent,
    AddAddressFormComponent,
    AddressBoxComponent,
    AppStoreButtonComponent,
    GooglePlayButtonComponent,
    ProductDialogComponent,
    ChangeSelectedAddressDialogComponent,
    DeliveryAddressDialogComponent,
    DisabledProductComponent,
    AgmMapComponent,
    AgmInfoWindowContentComponent,
    ProviderEtaLabelComponent,
    EtaChangeDialogComponent
];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        AgmCoreModule.forRoot({ clientId: 'gme-restoin' }),
        MaterialModule,
        FlexLayoutModule,
        InlineSVGModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        ConfirmDialogComponent,
        AddCreditCardDialogComponent,
        AddAddressDialogComponent,
        ProductDialogComponent,
        ChangeSelectedAddressDialogComponent,
        DeliveryAddressDialogComponent,
        EtaChangeDialogComponent
    ],
    declarations: sharedElements,
    exports: sharedElements
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                FormValidationService,
                ScrollService,
                CacheSyncService,
                GooglAnalyticsService,
                ToasterWrapperService,
                CacheSyncService,
                StringWrapperService,
                MetaService,
                LoggerService,
                HistoryService,
                ProvidersApiService,
                ProvidersService,
                AddressesApiService,
                AddressesService,
                AuthenticationApiService,
                AuthenticationService,
                ClientApiService,
                ClientService,
                CitiesApiService,
                CitiesService,
                SessionAddressService,
                CartService,
                PaymentsApiService,
                PaymentsService,
                BraintreeService,
                DropinService,
                DeliveryHoursApiService,
                DeliveryHoursService,
                CheckoutService,
                CheckoutApiService,
                ProductService,
                OrdersApiService,
                CorporateApiService,
                HttpWrapperService,
                ProductDialogService,
                MediaQueryService,
                AnalyticsService,
                StaticPagesApiService,
                AddressDialogService,
                ZopimService,
                OrdersService,
                NotificationsApiService,
                BrowserService,
                AdminGuardService,
                CartGuardService,
                ClientGuardService,
                GuardBaseService,
                TranslationWrapperService,
                DatesHelperService,
                YahooTagService,
                BingTagService
            ]
        };
    }
}
