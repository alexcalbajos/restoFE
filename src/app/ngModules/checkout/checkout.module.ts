import { InlineSVGModule } from 'ng-inline-svg';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

import { AuthModule } from '../auth/auth.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import {
    ChangeDeliveryHoursDialogComponent
} from './components/change-delivery-hours-dialog/change-delivery-hours-dialog.component';
import {
    ChangePromoCodeComponent
} from './components/change-promo-code/change-promo-code.component';
import {
    ChangeSelectedPaymentDialogComponent
} from './components/change-selected-payment-dialog/change-selected-payment-dialog.component';
import {
    CheckoutAddressesComponent
} from './components/checkout-addresses/checkout-addresses.component';
import {
    CheckoutCartActionsComponent
} from './components/checkout-cart-actions/checkout-cart-actions.component';
import {
    CheckoutCartDialogComponent
} from './components/checkout-cart-dialog/checkout-cart-dialog.component';
import { CheckoutCartComponent } from './components/checkout-cart/checkout-cart.component';
import {
    CheckoutMobileSummaryComponent
} from './components/checkout-mobile-summary/checkout-mobile-summary.component';
import {
    CheckoutPaymentOptionsComponent
} from './components/checkout-payment-options/checkout-payment-options.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import {
    CheckoutRegistrationComponent
} from './components/checkout-registration/checkout-registration.component';
import {
    CheckoutValidationComponent
} from './components/checkout-validation/checkout-validation.component';
import { CheckoutWalletComponent } from './components/checkout-wallet/checkout-wallet.component';
import { CutleryComponent } from './components/cutlery/cutlery.component';
import { DeliveryHoursComponent } from './components/delivery-hours/delivery-hours.component';
import {
    DeviceDataWrapperComponent
} from './components/device-data-wrapper/device-data-wrapper.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { PromoCodeComponent } from './components/promo-code/promo-code.component';
import {
    ThreeDSecureDialogComponent
} from './components/three-d-secure-dialog/three-d-secure-dialog.component';

@NgModule({
    imports: [
        CheckoutRoutingModule,
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        TranslateModule,
        InlineSVGModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgSelectModule,
        AuthModule
    ],
    declarations: [
        CheckoutComponent,
        CheckoutRegistrationComponent,
        CheckoutValidationComponent,
        CheckoutAddressesComponent,
        CheckoutPaymentComponent,
        CheckoutPaymentOptionsComponent,
        ChangeSelectedPaymentDialogComponent,
        PaymentMethodsComponent,
        DeliveryHoursComponent,
        PromoCodeComponent,
        CutleryComponent,
        ChangeDeliveryHoursDialogComponent,
        ChangePromoCodeComponent,
        CheckoutCartComponent,
        ThreeDSecureDialogComponent,
        CheckoutWalletComponent,
        CheckoutCartDialogComponent,
        CheckoutCartActionsComponent,
        DeviceDataWrapperComponent,
        CheckoutMobileSummaryComponent
    ],
    entryComponents: [
        ChangeSelectedPaymentDialogComponent,
        ChangeDeliveryHoursDialogComponent,
        ChangePromoCodeComponent,
        ThreeDSecureDialogComponent,
        CheckoutCartDialogComponent
    ]
})
export class CheckoutModule { }
