import { InlineSVGModule } from 'ng-inline-svg';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import {
    AddCorporateAddressDialogComponent
} from './components/add-corporate-address-dialog/add-corporate-address-dialog.component';
import {
    AddCorporateClientDialogComponent
} from './components/add-corporate-client-dialog/add-corporate-client-dialog.component';
import {
    AddCorporateCodeDialogComponent
} from './components/add-corporate-code-dialog/add-corporate-code-dialog.component';
import {
    CorporateAddressesComponent
} from './components/corporate-addresses/corporate-addresses.component';
import { CorporateBillsComponent } from './components/corporate-bills/corporate-bills.component';
import {
    CorporateClientOrderAmountRowComponent
} from './components/corporate-client-order-amount-row/corporate-client-order-amount-row.component';
import {
    CorporateClientOrderAmountTableComponent
} from './components/corporate-client-order-amount-table/corporate-client-order-amount-table.component';
import {
    CorporateClientsComponent
} from './components/corporate-clients/corporate-clients.component';
import { CorporateCodesComponent } from './components/corporate-codes/corporate-codes.component';
import {
    CorporateScheduleDayComponent
} from './components/corporate-schedule-day/corporate-schedule-day.component';
import {
    CorporateScheduleTableComponent
} from './components/corporate-schedule-table/corporate-schedule-table.component';
import {
    UploadCodesDialogComponent
} from './components/upload-codes-dialog/upload-codes-dialog.component';
import { CorporateRoutingModule } from './corporate-routing.module';
import { CorporateComponent } from './corporate.component';

@NgModule({
    imports: [
        CorporateRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule,
        NgSelectModule,
        InlineSVGModule,
        FlexLayoutModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule
    ],
    declarations: [
        CorporateComponent,
        CorporateClientsComponent,
        CorporateAddressesComponent,
        CorporateCodesComponent,
        CorporateBillsComponent,
        AddCorporateClientDialogComponent,
        AddCorporateAddressDialogComponent,
        AddCorporateCodeDialogComponent,
        UploadCodesDialogComponent,
        CorporateScheduleTableComponent,
        CorporateScheduleDayComponent,
        CorporateClientOrderAmountTableComponent,
        CorporateClientOrderAmountRowComponent
    ],
    entryComponents: [
        AddCorporateClientDialogComponent,
        AddCorporateAddressDialogComponent,
        AddCorporateCodeDialogComponent,
        UploadCodesDialogComponent
    ]
})
export class CorporateModule { }
