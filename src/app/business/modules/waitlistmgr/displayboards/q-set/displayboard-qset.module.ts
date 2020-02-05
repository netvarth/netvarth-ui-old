import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/modules/common/shared.module';
import { DisplayboardQSetComponent } from './displayboard-qset.component';
import { DisplayboardQSetDetailComponent } from './detail/displayboard-qset-detail.component';
import { DisplayboardQSetRoutingModule } from './displayboard-qset.routing.module';
import { MatSelectSearchModule } from '../../../../../shared/components/mat-select-search/mat-select-search/mat-select-search.module';

@NgModule({
    declarations: [
        DisplayboardQSetComponent,
       DisplayboardQSetDetailComponent
    ],
    imports: [
        // DisplayboardQSetRoutingModule,
        BreadCrumbModule,
        MaterialModule,
        FormMessageDisplayModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        SharedModule,
        MatSelectSearchModule
    ],
    exports: [DisplayboardQSetComponent, DisplayboardQSetDetailComponent]
})
export class DisplayboardQSetModule {}
