import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { GlobalSettingsComponent } from './global-settings.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { GlobalSettingsRoutingModule } from './global-settings.routing.module';


@NgModule({
    declarations: [
        GlobalSettingsComponent
    ],
    imports: [
        BreadCrumbModule,
        CommonModule,
        GlobalSettingsRoutingModule,
        AngularEditorModule,
        FormsModule,
        MaterialModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule
    ],
    exports: [GlobalSettingsComponent]
})
export class GlobalSettingsModule { }
