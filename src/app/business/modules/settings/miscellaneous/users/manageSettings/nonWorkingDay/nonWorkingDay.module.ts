import { NgModule } from '@angular/core';
import { NonWorkingDayRoutingModule } from './nonWorkingDay.routing.module';
import { BreadCrumbModule } from '../../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { FormMessageDisplayModule } from '../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { } from './nonWorkingDaylist/nonWorkingDaylist.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../../../shared/modules/common/material.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NonWorkingDaylistComponent } from '../../../../general/holiday/holiday-list/holiday-list.component';
import { NonWorkingDayDetailsComponent } from '../../../../general/holiday/holiday-details/holiday-details.component';

@NgModule({
    imports: [
        NonWorkingDayRoutingModule,
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
        NonWorkingDaylistComponent,
        NonWorkingDayDetailsComponent
    ],
    exports: [NonWorkingDaylistComponent]
})

export class NonWorkingDaymodule { }
