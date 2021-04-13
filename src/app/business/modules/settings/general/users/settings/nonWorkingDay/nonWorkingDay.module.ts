import { NgModule } from '@angular/core';
import { NonWorkingDayRoutingModule } from './nonWorkingDay.routing.module';
import { BreadCrumbModule } from '../../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { FormMessageDisplayModule } from '../../../../../../../shared/modules/form-message-display/form-message-display.module';
import { NonWorkingDaylistComponent } from './nonWorkingDaylist/nonWorkingDaylist.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../../../shared/modules/common/material.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NonWorkingDaydetailsComponent } from './nonWorkingDaydetails/nonWorkingDaydetails.component';


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
        NonWorkingDaydetailsComponent
    ],
    exports: [NonWorkingDaylistComponent]
})

export class NonWorkingDaymodule { }
