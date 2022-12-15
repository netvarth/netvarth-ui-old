import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdlComponent } from './cdl.component';
import { RouterModule, Routes } from '@angular/router';
import { OwlModule } from 'ngx-owl-carousel';
import { OtpVerifyModule } from './loans/otp-verify/otp-verify.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';

const routes: Routes = [
  { path: '', component: CdlComponent },
  { path: 'loans', loadChildren: () => import('./loans/loans.module').then(m => m.LoansModule) },
  { path: 'loans/:id', loadChildren: () => import('./loans/loan-details/loan-details.module').then(m => m.LoanDetailsModule) },
  { path: 'report', loadChildren: () => import('./loans/loan-details/view-report/view-report.module').then(m => m.ViewReportModule) },
  { path: 'kycdoc/:id', loadChildren: () => import('./loans/loan-details/kyc-doc/kyc-doc.module').then(m => m.KycDocModule) },
  { path: 'loandetailsdoc/:id', loadChildren: () => import('./loans/loan-details/loan-details-doc/loan-details-doc.module').then(m => m.LoanDetailsDocModule) },
  { path: 'dealers', loadChildren: () => import('./dealer/dealer.module').then(m => m.DealerModule) },
  { path: 'leads', loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule) },
  { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'emicalci', loadChildren: () => import('./emi-calci/emi-calci.module').then(m => m.EmiCalciModule) },
  { path: 'schemes', loadChildren: () => import('./schemes/schemes.module').then(m => m.SchemesModule) }


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
    ButtonModule,
    CarouselModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    ChartModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    CdlComponent
  ]
})
export class CdlModule { }
