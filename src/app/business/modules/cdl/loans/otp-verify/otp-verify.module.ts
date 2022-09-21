import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpVerifyComponent } from './otp-verify.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatButtonModule } from '@angular/material/button';



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
  ]
})
export class OtpVerifyModule { }
