import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommSettingsComponent } from './comm-settings.component';

const routes: Routes = [
    { path: '', component: CommSettingsComponent },
    { path: 'notifications', loadChildren: () => import('../comm/notifications/notifications.module').then(m => m.NotificationsModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommSettingsRoutingModule { }
