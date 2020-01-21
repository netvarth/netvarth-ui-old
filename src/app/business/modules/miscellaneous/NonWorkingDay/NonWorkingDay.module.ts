import { NgModule } from '@angular/core';
import { NonWorkingDayroutingmodule } from './NonWorkingDay.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module'
import { DeclareFunctionStmt } from '@angular/compiler';
import { NonWorkingDaylistcomponent } from './NonWorkingDaylist/NonWorkingDay-list.component';
import { NonWorkingDaydetailscomponent } from './NonWorkingDaydetails/NonWorkingDay-details.component';
import { CommonModule } from '@angular/common';
import {  FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        NonWorkingDayroutingmodule,
        BreadCrumbModule,
        NgbTimepickerModule,
        FormMessageDisplayModule,
        CommonModule,
        ReactiveFormsModule,
        LoadingSpinnerModule,
        FormsModule,
        MaterialModule
    ],
    declarations:[
        NonWorkingDaylistcomponent,
        NonWorkingDaydetailscomponent
    ],
    exports:[NonWorkingDaylistcomponent]
})

export class NonWorkingDaymodule { }
