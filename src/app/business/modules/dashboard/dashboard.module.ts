import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CheckInsDashboardComponent } from './check-ins/check-ins.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../../../ynw_provider/components/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../../../ynw_provider/components/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { AdjustQueueDelayComponent } from '../../../ynw_provider/components/adjust-queue-delay/adjust-queue-delay.component';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { ProviderWaitlistCheckInDetailComponent } from '../../../ynw_provider/components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { InboxModule } from '../../../shared/modules/inbox/inbox.module';
import { CustomerModule } from '../customer/customer.module';
import { ApplyLabelComponent } from './apply-label/apply-label.component';
// import { ProviderWaitlistCheckInDetailComponent } from '../../../ynw_provider/components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';

@NgModule({
    imports: [
        DashboardRoutingModule,
        BreadCrumbModule,
        CommonModule,
        SharedModule,
        CapitalizeFirstPipeModule,
        PagerModule,
        LoadingSpinnerModule,
        Nl2BrPipeModule,
        InboxModule,
        CustomerModule
    ],
    declarations: [
        DashboardComponent,
        CheckInsDashboardComponent,
        AddProviderWaitlistCheckInProviderNoteComponent,
        ProviderWaitlistCheckInConsumerNoteComponent,
        // ProviderWaitlistCheckInDetailComponent,
        AdjustQueueDelayComponent,
        ProviderWaitlistCheckInDetailComponent,
        ApplyLabelComponent
    ],
    entryComponents: [
        AddProviderWaitlistCheckInProviderNoteComponent,
        ProviderWaitlistCheckInConsumerNoteComponent,
        AdjustQueueDelayComponent
    ],
    exports: [DashboardComponent]
})
export class DashboardModule { }
