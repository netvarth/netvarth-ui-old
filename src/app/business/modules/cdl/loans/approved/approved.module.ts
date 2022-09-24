import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovedComponent } from './approved.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { OtpVerifyModule } from '../otp-verify/otp-verify.module';

const routes: Routes = [
  { path: '', component: ApprovedComponent }
]

@NgModule({
  declarations: [
    ApprovedComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    OtpVerifyModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    ApprovedComponent
  ]
})
export class ApprovedModule { }
