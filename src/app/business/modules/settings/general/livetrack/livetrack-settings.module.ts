import { NgModule } from '@angular/core';
// import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { LiveTrackSettingsComponent } from './livetrack-settings.component';
import { LiveTrackSettingsRoutingModule } from './livetrack-settings.routing.module';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        BreadCrumbModule,
        // MaterialModule,
        FormsModule,
        CommonModule,
        MatSlideToggleModule,
        LiveTrackSettingsRoutingModule
    ],
    declarations: [
        LiveTrackSettingsComponent
    ],
    exports: [
        LiveTrackSettingsComponent
    ]
})
export class LiveTrackSettingsModule {}
