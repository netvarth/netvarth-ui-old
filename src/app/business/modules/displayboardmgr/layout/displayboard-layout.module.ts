import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { DisplayboardLayoutsRoutingModule } from './displayboard-layout.routing.module';
import { DisplayboardLayoutComponent } from './detail/displayboard-layout';
import { DisplayboardLayoutsComponent } from './displayboard-layouts';
import { DisplayboardLayoutContentComponent } from './content/displayboard-content-component';


@NgModule({
    declarations: [
       DisplayboardLayoutComponent,
       DisplayboardLayoutsComponent,
       DisplayboardLayoutContentComponent
    ],
    imports: [
        DisplayboardLayoutsRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule
    ],
    exports: [DisplayboardLayoutsComponent]
})
export class DisplayboardLayoutModule {}
