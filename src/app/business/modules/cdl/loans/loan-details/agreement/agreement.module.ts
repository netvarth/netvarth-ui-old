import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from './agreement.component';
import { OtpVerifyModule } from './otp-verify/otp-verify.module';
import { MatDialogModule } from '@angular/material/dialog';



const routes: Routes = [
  { path: '', component: AgreementComponent }
]


@NgModule({
  declarations: [AgreementComponent],
  imports: [
    CommonModule,
    OtpVerifyModule,
    MatDialogModule,
    [RouterModule.forChild(routes)]
  ]
})
export class AgreementModule { }
