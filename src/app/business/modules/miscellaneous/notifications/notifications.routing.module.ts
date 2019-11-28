import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderNotificationsComponent } from './provider-notifications/provider-notifications.component';
import { ConsumerNotificationsComponent } from './consumer/consumer-notifications.component';
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
    { path: '', component: NotificationsComponent},
    { path: 'consumer', component: ConsumerNotificationsComponent},
    { path: 'provider', component: ProviderNotificationsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationsRoutingModule {}
