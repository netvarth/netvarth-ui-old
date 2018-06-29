import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';

import { PagerModule } from '../../modules/pager/pager.module';
import { ViewBillModule } from '../../modules/view-bill/view-bill.module';

import { ConsumerCheckInHistoryListComponent } from './components/consumer-checkin-history-list/consumer-checkin-history-list.component';
import { ViewConsumerWaitlistCheckInBillComponent } from './components/consumer-waitlist-view-bill/consumer-waitlist-view-bill.component';
import { ConsumerWaitlistCheckInPaymentComponent } from './components/consumer-waitlist-checkin-payment/consumer-waitlist-checkin-payment.component';

import { CheckInHistoryServices } from './consumer-checkin-history-list.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        PagerModule,
        ViewBillModule,
    ],
    declarations: [
      ConsumerCheckInHistoryListComponent,
      ViewConsumerWaitlistCheckInBillComponent,
      ConsumerWaitlistCheckInPaymentComponent
    ],
    exports: [
      ConsumerCheckInHistoryListComponent
    ],
    entryComponents: [
      ViewConsumerWaitlistCheckInBillComponent,
      ConsumerWaitlistCheckInPaymentComponent
    ],
    providers: [
      CheckInHistoryServices
    ]
})

export class ConsumerCheckinHistoryListModule {
}
