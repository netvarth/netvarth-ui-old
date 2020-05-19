import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomViewComponent } from './customview-create/custom-view.component';
import { CustomViewListComponent } from './customview-list/custom-view-list.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomViewRoutingModule } from './customview.routing.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';


@NgModule({
    imports: [
        BreadCrumbModule,
        NgbTimepickerModule,
        FormMessageDisplayModule,
        CapitalizeFirstPipeModule,
        CommonModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        FormsModule,
        MaterialModule,
        NgxMatSelectSearchModule,
        CustomViewRoutingModule,
    ],
    declarations: [
        CustomViewComponent,
        CustomViewListComponent
    ],
    exports: [CustomViewListComponent]
})

export class CustomViewModule { }
