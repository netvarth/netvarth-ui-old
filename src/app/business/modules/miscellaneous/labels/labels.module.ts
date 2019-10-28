import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { LabelsComponent } from './labels.component';
import { LabelComponent } from './detail/label.component';
import { LabelsRoutingModule } from './labels.routing.module';

@NgModule({
    declarations: [
       LabelsComponent,
       LabelComponent
    ],
    imports: [
        LabelsRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule
    ],
    exports: [LabelsComponent]
})
export class LabelsModule {}
