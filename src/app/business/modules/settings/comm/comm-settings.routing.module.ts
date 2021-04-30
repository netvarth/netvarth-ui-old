import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommSettingsComponent } from './comm-settings.component';
import { JaldeeVideoSettingsComponent } from '../jaldee-video/jaldee-video-settings.component'

const routes: Routes = [
    { path: '', component: CommSettingsComponent },
    { path: 'jaldeevideo', component: JaldeeVideoSettingsComponent },
    { path: 'notifications', loadChildren: () => import('../comm/notifications/notifications.module').then(m => m.NotificationsModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommSettingsRoutingModule { }
