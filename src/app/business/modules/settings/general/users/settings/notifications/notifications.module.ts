import { NgModule } from '@angular/core';
import { NotificationsUserComponent } from './notifications.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../../../../shared/pipes/capitalize.module';
const routes: Routes = [
  { path: '', component: NotificationsUserComponent},
  { path: 'consumer', loadChildren: ()=> import('./consumer/consumer-notifications.module').then(m=>m.ConsumerNotificationUserModule)},
  { path: 'provider', loadChildren: ()=> import('./provider/provider-notifications.module').then(m=>m.ProviderNotificationsUserModule)}
];
@NgModule({
  declarations: [
    NotificationsUserComponent
  ],
  imports: [
    [RouterModule.forChild(routes)],
    CommonModule,
    CapitalizeFirstPipeModule
  ],
  exports: [NotificationsUserComponent]
})
export class NotificationUserModule { }
