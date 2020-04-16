import { NgModule } from '@angular/core';
import { ConsumerAppointmentComponent } from './consumer-appointment.component';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { ConsumerAppointmentRoutingModule } from './consumer-appointment.routing.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CheckinAddMemberModule } from '../../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { OwlModule } from 'ngx-owl-carousel';
//import { ConsumerPaymentComponent } from './payment/payment.component';
//import { ConsumerLiveTrackComponent } from './livetrack/livetrack.component';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';

@NgModule({
    declarations: [
        ConsumerAppointmentComponent,
       // ConsumerPaymentComponent,
       // ConsumerLiveTrackComponent
    ],
    imports: [
        FormMessageDisplayModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CheckinAddMemberModule,
        ConsumerAppointmentRoutingModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        OwlModule,
        BreadCrumbModule
    ],
    exports: [ConsumerAppointmentComponent]
})
export class ConsumerAppointmentModule {}
