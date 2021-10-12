import { NgModule } from '@angular/core';
import { CommSettingsComponent } from './comm-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UpdateNotificationModule } from './update-notification/update-notification.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
const routes: Routes = [
    { path: '', component: CommSettingsComponent },
    { path: 'jaldeevideo', loadChildren: ()=> import('../jaldee-video/jaldee-video-settings.module').then(m=>m.JaldeeVideoSettingsModule) },
    { path: 'notifications', loadChildren: () => import('../comm/notifications/notifications.module').then(m => m.NotificationsModule) }
];
@NgModule({
    imports: [
        CommonModule,
        MatSlideToggleModule,
        MatTooltipModule,
        CapitalizeFirstPipeModule,
        FormsModule,
        UpdateNotificationModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        CommSettingsComponent
    ],
    exports: [
        CommSettingsComponent
    ]
})
export class CommSettingsModule {}
