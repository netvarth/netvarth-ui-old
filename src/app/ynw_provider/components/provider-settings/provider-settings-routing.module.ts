import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderSettingsComponent } from './provider-settings.component';
const routes: Routes = [
  { path: '', component: ProviderSettingsComponent },
  {
    path: '',
    children: [
      { path: 'bprofile', loadChildren: () => import('../../../business/modules/bprofile/bprofile.module').then(m => m.BProfileModule)},
      { path: 'pos', loadChildren: () => import('../../../business/modules/pos/pos.module').then(m => m.POSModule)},
      { path: 'miscellaneous', loadChildren: () => import('../../../business/modules/miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule)},
      { path: 'appointmentmanager', loadChildren: () => import('../../../business/modules/appointmentmanager/appointmentmanager.module').then(m => m.AppointmentmanagerModule)},
      { path: 'users', loadChildren: () => import('../../../business/modules/miscellaneous/users/users.module').then(m => m.UsersModule)},
      { path: 'customview', loadChildren: () => import('../../../business/modules/miscellaneous/customview/customview.module').then(m => m.CustomViewmodule)},
      { path: 'home-service', loadChildren: () => import('../../../business/modules/homeservice/homeservice.module').then(m => m.HomeServiceModule)},
      { path: 'q-manager', loadChildren: () => import('../../../business/modules/waitlistmgr/waitlistmgr.module').then(m => m.WaitlistMgrModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderSettingsRoutingModule {
}
