import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommSettingsComponent } from './comm-settings.component';
import { VideoSettingsComponent } from './video/video-settings.component';
import { AddVideoCallComponent } from './add-videocall/add-videocall.component';

const routes: Routes = [
    {path: '', component: CommSettingsComponent},
    {path: 'video', component: VideoSettingsComponent},
    {path: 'video/:id', component: AddVideoCallComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommSettingsRoutingModule {}
