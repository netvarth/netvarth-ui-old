import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';
import { LicenseComponent } from './license.component';
import { ProviderPaymentHistoryComponent } from '../../../ynw_provider/components/provider-payment-history/provider-payment-history.component';
import { AddonsComponent } from './addons/addons.component';
import { KeywordsComponent } from './keywords/keywords.component';

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
