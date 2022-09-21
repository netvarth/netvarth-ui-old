import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdlComponent } from './cdl.component';
import { RouterModule, Routes } from '@angular/router';
import { OwlModule } from 'ngx-owl-carousel';
import { OtpVerifyModule } from './loans/otp-verify/otp-verify.module';

const routes: Routes = [
  { path: '', component: CdlComponent },
  { path: 'loans', loadChildren: () => import('./loans/loans.module').then(m => m.LoansModule) }
]

@NgModule({
  declarations: [
    CdlComponent
  ],
  imports: [
    CommonModule,
    OwlModule,
    OtpVerifyModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    CdlComponent
  ]
})
export class CdlModule { }
