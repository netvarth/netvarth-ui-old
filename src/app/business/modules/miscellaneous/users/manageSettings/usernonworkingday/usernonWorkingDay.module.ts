import { NgModule } from '@angular/core';
import { BreadCrumbModule } from '../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module'
import { DeclareFunctionStmt } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import {  FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../../shared/modules/common/material.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { usernonWorkingDaylistcomponent } from './usernonWorkingDaylist/usernonWorkingDaylist.component';
import { usernonWorkingDaydetailscomponent } from './usernonWorkingDaydetails/usernonWorkingDaydetails.component';
import { usernonWorkingDayroutingmodule } from './usernonWorkingDay.routing.module';

@NgModule({
    imports: [
        usernonWorkingDayroutingmodule,
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
         usernonWorkingDaylistcomponent,
         usernonWorkingDaydetailscomponent
    ],
    exports:[usernonWorkingDaylistcomponent]
})

export class nonWorkingDaymodule { }
