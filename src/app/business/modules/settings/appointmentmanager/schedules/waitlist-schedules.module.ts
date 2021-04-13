import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { WaitlistSchedulesComponent } from './list/waitlist-schedules.component';
import { WaitlistSchedulesDetailComponent } from './details/waitlist-schedulesdetail.component';
import { WaitlistSchedulesRoutingModule } from './waitlist-schedules.routing.module';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';

@NgModule({
    imports: [
        CommonModule,
        BreadCrumbModule,
        WaitlistSchedulesRoutingModule,
        LoadingSpinnerModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTimepickerModule,
        CapitalizeFirstPipeModule,
        FormMessageDisplayModule
    ],
    declarations: [
        WaitlistSchedulesComponent,
        WaitlistSchedulesDetailComponent
    ],
    exports: [WaitlistSchedulesComponent]
})
export class WaitlistSchedulesModule {}
