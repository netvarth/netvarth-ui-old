import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommSettingsRoutingModule } from './comm-settings.routing.module';
import { CommSettingsComponent } from './comm-settings.component';
import { VideoSettingsComponent } from './video/video-settings.component';
import { AddVideoCallComponent } from './add-videocall/add-videocall.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule,
        MatSlideToggleModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        BreadCrumbModule,
        CommSettingsRoutingModule
    ],
    declarations: [
        CommSettingsComponent,
        VideoSettingsComponent,
        AddVideoCallComponent
    ],
    exports: [
        CommSettingsComponent
    ]
})
export class CommSettingsModule {}
