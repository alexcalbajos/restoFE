import { InlineSVGModule } from 'ng-inline-svg';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { AuthButtonsComponent } from './components/auth-buttons/auth-buttons.component';
import { AuthContainerComponent } from './components/auth-container/auth-container.component';
import {
    InitialEmailFormComponent
} from './components/initial-email-form/initial-email-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

@NgModule({
    imports: [
        AuthRoutingModule,
        CommonModule,
        SharedModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule,
        FlexLayoutModule,
        InlineSVGModule,
        NgSelectModule
    ],
    declarations: [
        AuthComponent,
        AuthContainerComponent,
        InitialEmailFormComponent,
        LoginFormComponent,
        RegisterFormComponent,
        AuthButtonsComponent
    ],
    exports: [
        AuthContainerComponent,
        InitialEmailFormComponent,
        LoginFormComponent,
        RegisterFormComponent,
        AuthButtonsComponent
    ]
})
export class AuthModule { }
