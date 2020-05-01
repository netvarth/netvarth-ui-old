import { NgModule } from '@angular/core';
import { ConsumerCheckinComponent } from './consumer-checkin.component';
import { FormMessageDisplayModule } from '../../../../shared/modules/form-message-display/form-message-display.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/common/material.module';
import { ConsumerCheckinRoutingModule } from './consumer-checkin.routing.module';
import { LoadingSpinnerModule } from '../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CheckinAddMemberModule } from '../../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { OwlModule } from 'ngx-owl-carousel';
import { ConsumerPaymentComponent } from './payment/payment.component';
import { ConsumerLiveTrackComponent } from './livetrack/livetrack.component';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { ConsumerCheckinHistoryComponent } from './history/checkin-history.component';

@NgModule({
    declarations: [
        ConsumerCheckinComponent,
        ConsumerPaymentComponent,
        ConsumerLiveTrackComponent,
        ConsumerCheckinHistoryComponent
    ],
    imports: [
        FormMessageDisplayModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CheckinAddMemberModule,
        ConsumerCheckinRoutingModule,
        LoadingSpinnerModule,
        CapitalizeFirstPipeModule,
        Nl2BrPipeModule,
        OwlModule,
        BreadCrumbModule,
    ],
    exports: [ConsumerCheckinComponent]
})
export class ConsumerCheckinModule {}
