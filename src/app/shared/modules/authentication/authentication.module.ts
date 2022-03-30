import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationComponent } from './authentication.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [
    AuthenticationComponent
  ],
  imports: [
    CommonModule,
    NgxIntlTelInputModule,
    LoadingSpinnerModule,
    FormsModule,
    MatButtonModule,
    NgOtpInputModule
  ],
  exports: [
    AuthenticationComponent
  ]
})
export class AuthenticationModule { }
