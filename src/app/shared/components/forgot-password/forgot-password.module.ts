import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { OtpFormModule } from '../../modules/otp-form/otp-form.module';
import { SetPasswwordModule } from '../set-password-form/set-password-form.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        OtpFormModule,
        SetPasswwordModule,
        NgxIntlTelInputModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
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
