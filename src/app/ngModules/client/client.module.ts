import { InlineSVGModule } from 'ng-inline-svg';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { BickerAnimationComponent } from './components/bicker-animation/bicker-animation.component';
import { ClientAddressesComponent } from './components/client-addresses/client-addresses.component';
import {
    ClientCreditCardsComponent
} from './components/client-credit-cards/client-credit-cards.component';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { ClientPassowrdComponent } from './components/client-password/client-password.component';
import {
    ClientPreferencesComponent
} from './components/client-preferences/client-preferences.component';
import { ClientWalletComponent } from './components/client-wallet/client-wallet.component';
import { InfoPageComponent } from './components/info-page/info-page.component';
import { OrderBoxComponent } from './components/order-box/order-box.component';
import {
    OrderDetailsDialogComponent
} from './components/order-details-dialog/order-details-dialog.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import {
    OrderProblemConfirmDialogComponent
} from './components/order-problem-confirm-dialog/order-problem-confirm-dialog.component';
import {
    OrderProblemDialogComponent
} from './components/order-problem-dialog/order-problem-dialog.component';
import { OrdersPageComponent } from './components/orders-page/orders-page.component';
import {
    RateOrderDialogComponent
} from './components/rate-order-dialog/rate-order-dialog.component';
import { RatingStarsComponent } from './components/rating-starts/rating-starts.component';

library.add(faStar);

@NgModule({
    imports: [
        ClientRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule,
        FlexLayoutModule,
        InlineSVGModule,
        FontAwesomeModule,
        InfiniteScrollModule
    ],
    declarations: [
        ClientComponent,
        InfoPageComponent,
        OrdersPageComponent,
        ClientDetailsComponent,
        ClientPassowrdComponent,
        ClientCreditCardsComponent,
        ClientAddressesComponent,
        ClientWalletComponent,
        ClientPreferencesComponent,
        OrderDetailsComponent,
        RateOrderDialogComponent,
        RatingStarsComponent,
        BickerAnimationComponent,
        OrderProblemDialogComponent,
        OrderProblemConfirmDialogComponent,
        OrderDetailsDialogComponent,
        OrderBoxComponent
    ],
    entryComponents: [
        RateOrderDialogComponent,
        OrderProblemDialogComponent,
        OrderProblemConfirmDialogComponent,
        OrderDetailsDialogComponent
    ]
})
export class ClientModule { }
