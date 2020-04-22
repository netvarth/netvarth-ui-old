import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommSettingsComponent } from './comm-settings.component';
import { VideoSettingsComponent } from './video/video-settings.component';


const routes: Routes = [
    {path: '', component: CommSettingsComponent},
    {path: 'video', component: VideoSettingsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommSettingsRoutingModule {}
