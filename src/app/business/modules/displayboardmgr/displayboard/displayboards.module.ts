import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { DisplayboardDetailComponent } from './detail/displayboard-detail';
import { DisplayboardListComponent } from './displayboard-list';
import { DisplayboardsRoutingModule } from './displayboards.routing.module';

@NgModule({
    declarations: [
       DisplayboardListComponent,
       DisplayboardDetailComponent
    ],
    imports: [
        DisplayboardsRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule
    ],
    exports: [DisplayboardListComponent]
})
export class DisplayboardsModule {}
