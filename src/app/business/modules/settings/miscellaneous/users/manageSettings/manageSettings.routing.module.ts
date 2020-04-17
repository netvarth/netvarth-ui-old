import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageSettingsComponent } from './manageSettings.component';

const routes: Routes = [
  { path: '', component: ManageSettingsComponent },
  { path: 'services', loadChildren: () => import('./services/waitlist-services.module').then(m => m.WaitlistServicesModule) },
  { path: 'queues', loadChildren: () => import('./queues/waitlist-queues.module').then(m => m.WaitlistQueuesModule) },
  { path: 'holidays', loadChildren: () => import('./usernonworkingday/usernonWorkingDay.module').then(m => m.NonWorkingDaymodule) },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationUserModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSettingsRoutingModule { }
