import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderSettingsComponent } from './provider-settings.component';
const routes: Routes = [
  { path: '', component: ProviderSettingsComponent },
  {
    path: '',
    children: [
      { path: 'bprofile', loadChildren: () => import('../../../business/modules/settings/bprofile/bprofile.module').then(m => m.BProfileModule) },
      { path: 'donationmanager', loadChildren: () => import('../../../business/modules/settings/donationmanager/donation-mgr.module').then(m => m.DonationMgrModule) },
      { path: 'pos', loadChildren: () => import('../../../business/modules/settings/pos/pos.module').then(m => m.POSModule) },
      { path: 'miscellaneous', loadChildren: () => import('../../../business/modules/settings/miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule) },
      { path: 'general', loadChildren: () => import('../../../business/modules/settings/general/general-settings.module').then(m => m.GeneralSettingsModule) },
      { path: 'jaldee-integration', loadChildren: () => import('../../../business/modules/settings/integration/integration-settings.module').then(m => m.IntegrationSettingsModule) },
      { path: 'payments', loadChildren: () => import('../../../business/modules/settings/payments/payment-settings.module').then(m => m.PaymentSettingsModule) },
      { path: 'customers', loadChildren: () => import('../../../business/modules/settings/customers/customers-settings.module').then(m => m.CustomersSettingsModule) },
      { path: 'comm', loadChildren: () => import('../../../business/modules/settings/comm/comm-settings.module').then(m => m.CommSettingsModule) },
      { path: 'appointmentmanager', loadChildren: () => import('../../../business/modules/settings/appointmentmanager/appointmentmanager.module').then(m => m.AppointmentmanagerModule) },
      { path: 'users', loadChildren: () => import('../../../business/modules/settings/miscellaneous/users/users.module').then(m => m.UsersModule) },
      { path: 'home-service', loadChildren: () => import('../../../business/modules/homeservice/homeservice.module').then(m => m.HomeServiceModule) },
      { path: 'q-manager', loadChildren: () => import('../../../business/modules/settings/waitlistmgr/waitlistmgr.module').then(m => m.WaitlistMgrModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderSettingsRoutingModule {
}
