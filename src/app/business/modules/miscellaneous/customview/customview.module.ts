import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module'
import { DeclareFunctionStmt } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import {  FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomViewComponent } from './customview-create/custom-view.component';
import { CustomViewListComponent } from './customview-list/custom-view-list.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomViewroutingmodule } from './customview.routing.module';

@NgModule({
    imports: [
        BreadCrumbModule,
        NgbTimepickerModule,
        FormMessageDisplayModule,
        CommonModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        FormsModule,
        MaterialModule,
        NgxMatSelectSearchModule,
        CustomViewroutingmodule,
    ],
    declarations:[
        CustomViewComponent,
        CustomViewListComponent
    ],
    exports:[CustomViewListComponent]
})

export class CustomViewmodule { }
