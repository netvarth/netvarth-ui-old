import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../../shared/modules/common/shared.module';
import { DisplayboardQSetComponent } from './displayboard-qset.component';
import { DisplayboardQSetDetailComponent } from './detail/displayboard-qset-detail.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
    declarations: [
        DisplayboardQSetComponent,
        DisplayboardQSetDetailComponent
    ],
    imports: [
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        SharedModule,
        NgxMatSelectSearchModule,
        DragDropModule
    ],
    exports: [DisplayboardQSetComponent, DisplayboardQSetDetailComponent]
})
export class DisplayboardQSetModule { }
