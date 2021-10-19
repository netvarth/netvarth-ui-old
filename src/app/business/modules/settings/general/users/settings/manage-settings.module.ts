import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSettingsComponent } from './manage-settings.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: ManageSettingsComponent },
    { path: 'holidays', loadChildren: () => import('./usernonworkingday/user-nonworkingday-list/user-nonworkingday-list.module').then(m => m.UserNonworkingdayListModule) },
    { path: 'services', loadChildren: () => import('./services/list/user-waitlist-services.module').then(m => m.UserWaitlistServicesModule) },
    { path: 'queues', loadChildren: () => import('./queues/list/waitlist-queues.module').then(m => m.WaitlistQueuesModule) },
    { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationUserModule) },
    { path: 'schedules', loadChildren: () => import('./schedules/list/waitlist-schedules.module').then(m => m.WaitlistuserSchedulesModule) },
    { path: 'bprofile', loadChildren: () => import('./bprofile/buserprofile.module').then(m => m.BuserProfileModule)}
  ];
@NgModule({
    imports: [
        CommonModule,
        // WaitlistQueuesModule,
        // NotificationUserModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        ManageSettingsComponent,
    ],
    exports: [
        ManageSettingsComponent
    ]
})
export class ManageSettingsModule { }
