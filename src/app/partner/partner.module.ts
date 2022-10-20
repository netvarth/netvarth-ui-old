import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerComponent } from './partner.component';
import { RouterModule, Routes } from '@angular/router';
import { OwlModule } from 'ngx-owl-carousel';
import { HeaderModule } from '../shared/modules/header/header.module';

const routes: Routes = [
  { path: '', component: PartnerComponent },
  { path: 'login', loadChildren: () => import('../partner/login/login.module').then(m => m.LoginModule) },
  { path: 'loans', loadChildren: () => import('./loans/loans.module').then(m => m.LoansModule) },
  { path: 'loans/:id', loadChildren: () => import('./loans/loan-details/loan-details.module').then(m => m.LoanDetailsModule) }

]

@NgModule({
  declarations: [
    PartnerComponent
  ],
  imports: [
    CommonModule,
    OwlModule,
    HeaderModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    PartnerComponent
  ]
})
export class PartnerModule { }
