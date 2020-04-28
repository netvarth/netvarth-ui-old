import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';

import { ForgotPasswordComponent } from './forgot-password.component';
import { MaterialModule } from '../../modules/common/material.module';
import { OtpFormModule } from '../../modules/otp-form/otp-form.module';
import { SetPasswwordModule } from '../set-password-form/set-password-form.module';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        OtpFormModule,
        SetPasswwordModule
    ],
    declarations: [
        ForgotPasswordComponent
    ],
    entryComponents: [
        ForgotPasswordComponent
    ],
    exports: [ForgotPasswordComponent]
})
export class ForgotPasswordModule {
}
