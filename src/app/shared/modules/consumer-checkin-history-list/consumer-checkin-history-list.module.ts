import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';

import { PagerModule } from '../../modules/pager/pager.module';
import { ViewBillModule } from '../../modules/view-bill/view-bill.module';

import { ConsumerCheckInHistoryListComponent } from './consumer-checkin-history-list.component';

import { CheckInHistoryServices } from './consumer-checkin-history-list.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        PagerModule,
        ViewBillModule,
    ],
    declarations: [
      ConsumerCheckInHistoryListComponent
    ],
    exports: [
      ConsumerCheckInHistoryListComponent
    ],
    providers: [
      CheckInHistoryServices
    ]
})

export class ConsumerCheckinHistoryListModule {
}
