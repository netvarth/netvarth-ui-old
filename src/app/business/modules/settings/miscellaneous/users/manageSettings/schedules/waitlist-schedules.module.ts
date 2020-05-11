import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from '../../../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { WaitlistuserSchedulesComponent } from './list/waitlist-schedules.component';
import { WaitlistuserSchedulesDetailComponent } from './details/waitlist-schedulesdetail.component';
import { WaitlistuserSchedulesRoutingModule } from './waitlist-schedules.routing.module';
import { LoadingSpinnerModule } from '../../../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../../../shared/modules/common/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../../../shared/modules/form-message-display/form-message-display.module';

@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        WaitlistuserSchedulesRoutingModule,
        LoadingSpinnerModule,
        MaterialModule,
        ReactiveFormsModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule
    ],
    declarations: [
        WaitlistuserSchedulesComponent,
        WaitlistuserSchedulesDetailComponent
    ],
    exports: [WaitlistuserSchedulesComponent]
})
export class WaitlistuserSchedulesModule {}
