
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpVerifyComponent } from './otp-verify.component';
import { MatButtonModule } from '@angular/material/button';
import { NgOtpInputModule } from 'ng-otp-input';


@NgModule({
  declarations: [
    OtpVerifyComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    NgOtpInputModule
  ],
  exports: [
    OtpVerifyComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class OtpVerifyModule { }
