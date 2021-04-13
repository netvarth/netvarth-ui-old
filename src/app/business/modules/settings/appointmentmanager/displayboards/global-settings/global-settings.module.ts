import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { GlobalSettingsComponent } from './global-settings.component';
import { GlobalSettingsRoutingModule } from './global-settings.routing.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
    declarations: [
        GlobalSettingsComponent
    ],
    imports: [
        BreadCrumbModule,
        CommonModule,
        GlobalSettingsRoutingModule,
        FormsModule,
        CKEditorModule,
        MaterialModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule
    ],
    exports: [GlobalSettingsComponent]
})
export class GlobalSettingsModule { }
