import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveTrackSettingsComponent } from './livetrack-settings.component';

const routes: Routes = [
    { path: '', component: LiveTrackSettingsComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LiveTrackSettingsRoutingModule {}
