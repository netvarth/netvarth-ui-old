import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';
import { LicenseComponent } from './license.component';
import { ProviderPaymentHistoryComponent } from '../../../ynw_provider/components/provider-payment-history/provider-payment-history.component';
import { AddonsComponent } from './addons/addons.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { licenseusageComponent } from './licenseusage/licenseusage.component';
import { StatementsComponent } from './statements/statements.component';
import { InvoiceStatusComponent } from './invoicestatus/invoicestatus.component';
import { ViewPrevStatementComponent } from './statements/viewprevstatement.component';
import { PaymentComponent } from './payments/licensepayment.component';
import { AddonDetailComponent } from './addons/addon-detail/addon-detail.component';


const routes: Routes = [
  { path: '', component: LicenseComponent },
  {
    path: '',
    children: [
      {
        path: 'payment/history',
        component: ProviderPaymentHistoryComponent
      },
      {
        path: 'addons',
        component: AddonsComponent
      },
      {
        path: 'keywords',
        component: KeywordsComponent
      },
      {
        path: 'Statements',
        component: StatementsComponent
      },
      {
        path: 'invoicestatus',
        component: InvoiceStatusComponent
      },
      {
        path: 'licenseusage',
        component: licenseusageComponent
      },
      {
        path: 'viewstatement',
        component: ViewPrevStatementComponent
      },
      {
        path: 'payments',
        component: PaymentComponent
      },
      {
        path: 'addon-detail',
        component: AddonDetailComponent
      }
    ]
  },
  {
    path: ':type',
    component: LicenseComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LicenseRoutingModule { }
