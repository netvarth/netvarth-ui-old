import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderSettingsComponent } from './provider-settings.component';
const routes: Routes = [
  { path: '', component: ProviderSettingsComponent },
  {
    path: '',
    children: [
      { path: 'bprofile', loadChildren: '../../../business/modules/bprofile/bprofile.module#BProfileModule'},
      { path: 'pos', loadChildren: '../../../business/modules/pos/pos.module#POSModule'},
      { path: 'miscellaneous', loadChildren: '../../../business/modules/miscellaneous/miscellaneous.module#MiscellaneousModule'},
      { path: 'users', loadChildren: '../../../business/modules/miscellaneous/users/users.module#UsersModule'},
      { path: 'home-service', loadChildren: '../../../business/modules/homeservice/homeservice.module#HomeServiceModule'},
      { path: 'q-manager', loadChildren: '../../../business/modules/waitlistmgr/waitlistmgr.module#WaitlistMgrModule' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderSettingsRoutingModule {
}
