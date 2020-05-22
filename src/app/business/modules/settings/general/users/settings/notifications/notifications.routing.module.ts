import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderNotificationUserComponent } from './provider/provider-notifications.component';
import { ConsumerNotificationUserComponent } from './consumer/consumer-notifications.component';
import { NotificationsUserComponent } from './notifications.component';

const routes: Routes = [
    { path: '', component: NotificationsUserComponent},
    { path: 'consumer', component: ConsumerNotificationUserComponent},
    { path: 'provider', component: ProviderNotificationUserComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationsRoutingUserModule {}
