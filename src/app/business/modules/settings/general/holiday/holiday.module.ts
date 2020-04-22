import { NgModule } from '@angular/core';
import { HolidayRoutingmModule } from './holiday.routing.module';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HolidayListComponent } from './holiday-list/holiday-list.component';
import { HolidayDetailsComponent } from './holiday-details/holiday-details.component';

@NgModule({
    imports: [
        HolidayRoutingmModule,
        BreadCrumbModule,
        NgbTimepickerModule,
        FormMessageDisplayModule,
        CommonModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        FormsModule,
        MaterialModule
    ],
    declarations: [
        HolidayListComponent,
        HolidayDetailsComponent
    ],
    exports: [HolidayListComponent]
})

export class HolidayModule {}
