import { NgModule } from '@angular/core';
import { nonWorkingDayroutingmodule } from './nonWorkingDay.routing.module';
import { BreadCrumbModule } from '../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { FormMessageDisplayModule } from '../../../../../../shared/modules/form-message-display/form-message-display.module'
import { DeclareFunctionStmt } from '@angular/compiler';
import { nonWorkingDaylistcomponent } from './nonWorkingDaylist/nonWorkingDaylist.component';
import { nonWorkingDaydetailscomponent } from './nonWorkingDaydetails/nonWorkingDaydetails.component';
import { CommonModule } from '@angular/common';
import {  FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../../shared/modules/common/material.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        nonWorkingDayroutingmodule,
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
        nonWorkingDaylistcomponent,
        nonWorkingDaydetailscomponent
    ],
    exports:[nonWorkingDaylistcomponent]
})

export class nonWorkingDaymodule { }
