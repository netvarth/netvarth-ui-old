import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';

import { ForgotPasswordComponent } from './forgot-password.component';
import { MaterialModule } from '../../modules/common/material.module';
import { OtpFormModule } from '../../modules/otp-form/otp-form.module';
import { SetPasswwordModule } from '../set-password-form/set-password-form.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        OtpFormModule,
        SetPasswwordModule,
        NgxIntlTelInputModule
    ],
    declarations: [
        ForgotPasswordComponent
    ],
    entryComponents: [
        ForgotPasswordComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    exports: [ForgotPasswordComponent]
})
export class ForgotPasswordModule {
}
