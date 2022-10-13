import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdlComponent } from './cdl.component';
import { RouterModule, Routes } from '@angular/router';
import { OwlModule } from 'ngx-owl-carousel';
import { OtpVerifyModule } from './loans/otp-verify/otp-verify.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
const routes: Routes = [
  { path: '', component: CdlComponent },
  { path: 'loans', loadChildren: () => import('./loans/loans.module').then(m => m.LoansModule) },
  { path: 'loans/:id', loadChildren: () => import('./loans/loan-details/loan-details.module').then(m => m.LoanDetailsModule) },
  { path: 'dealers', loadChildren: () => import('./dealer/dealer.module').then(m => m.DealerModule) },
  { path: 'leads', loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule) }
]

@NgModule({
  declarations: [
    CdlComponent
  ],
  imports: [
    CommonModule,
    OwlModule,
    OtpVerifyModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    CdlComponent
  ]
})
export class CdlModule { }
