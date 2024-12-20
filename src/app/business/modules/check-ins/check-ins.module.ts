import { NgModule } from '@angular/core';
import { CheckInsComponent } from './check-ins.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from './add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from './provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { AdjustQueueDelayComponent } from './queue-delay/adjust-queue-delay.component';
import { CheckinsRoutingModule } from './check-ins.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { InboxModule } from '../../../shared/modules/inbox/inbox.module';
import { CustomerModule } from '../customer/customer.module';
import { ApplyLabelComponent } from './apply-label/apply-label.component';
import { FormMessageDisplayModule } from '../../../shared/modules/form-message-display/form-message-display.module';
@NgModule({
    imports: [
        CheckinsRoutingModule,
        BreadCrumbModule,
        CommonModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        LoadingSpinnerModule,
        Nl2BrPipeModule,
        InboxModule,
        CustomerModule,
        FormMessageDisplayModule
    ],
    declarations: [
        CheckInsComponent,
        AddProviderWaitlistCheckInProviderNoteComponent,
        ProviderWaitlistCheckInConsumerNoteComponent,
        AdjustQueueDelayComponent,
        ProviderWaitlistCheckInDetailComponent,
        ApplyLabelComponent
    ],
    entryComponents: [
        AddProviderWaitlistCheckInProviderNoteComponent,
        ProviderWaitlistCheckInConsumerNoteComponent,
        AdjustQueueDelayComponent,
        ApplyLabelComponent
    ],
    exports: [CheckInsComponent]
})
export class CheckinsModule { }
