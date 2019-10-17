import { NgModule } from '@angular/core';
import { DisplayboardLabelsComponent } from './displayboard-labels';
import { DisplayboardLabelComponent } from './detail/displayboard-label';
import { DisplayboardLabelsRoutingModule } from './displayboard-labels.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
       DisplayboardLabelsComponent,
       DisplayboardLabelComponent
    ],
    imports: [
        DisplayboardLabelsRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule
    ],
    exports: [DisplayboardLabelsComponent]
})
export class DisplayboardLabelsModule {}
