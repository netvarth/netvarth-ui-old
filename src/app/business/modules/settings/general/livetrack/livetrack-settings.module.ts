import { NgModule } from '@angular/core';
import { LiveTrackSettingsComponent } from './livetrack-settings.component';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    { path: '', component: LiveTrackSettingsComponent}
];
@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        FormsModule,
        CommonModule,
        MatSlideToggleModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        LiveTrackSettingsComponent
    ],
    exports: [
        LiveTrackSettingsComponent
    ]
})
export class LiveTrackSettingsModule {}
