import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FormMessageDisplayModule } from '../../shared/modules/form-message-display/form-message-display.module';
import { LoadingSpinnerModule } from '../../shared/modules/loading-spinner/loading-spinner.module';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { OtpFormModule } from '../../shared/modules/otp-form/otp-form.module';
import { SetPasswwordModule } from '../../shared/components/set-password-form/set-password-form.module';
import { ForgotPasswordModule } from '../../shared/components/forgot-password/forgot-password.module';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    FormMessageDisplayModule,
    LoadingSpinnerModule,
    MatInputModule,
    MatDialogModule,
    OtpFormModule,
    SetPasswwordModule,
    ForgotPasswordModule
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
