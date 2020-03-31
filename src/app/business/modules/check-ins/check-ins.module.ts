import { NgModule } from '@angular/core';
import { CheckInsComponent } from './check-ins.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from './add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from './provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { AdjustQueueDelayComponent } from './queue-delay/adjust-queue-delay.component';
import { AdjustqueueDelayComponent } from './adjustqueue-delay/adjustqueue-delay.component';
import { LocateCustomerComponent } from './locate-customer/locate-customer.component';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProviderCheckinComponent } from './check-in/provider-checkin.component';
import { CheckinAddMemberModule } from '../../../shared/modules/checkin-add-member/checkin-add-member.module';
import { OwlModule } from 'ngx-owl-carousel';
import { CustomViewComponent } from './custom-view/custom-view.component';
import { ProviderCreateCheckinComponent } from './check-in/provider-create-checkin/provider-create-checkin.component';
import { CustomViewListComponent } from './custom-view-list/custom-view-list.component';


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
        FormMessageDisplayModule,
        CheckinAddMemberModule,
        NgbModule,
        OwlModule
    ],
    declarations: [
        CheckInsComponent,
        ProviderCheckinComponent,
        ProviderCreateCheckinComponent,
        AddProviderWaitlistCheckInProviderNoteComponent,
        ProviderWaitlistCheckInConsumerNoteComponent,
        AdjustQueueDelayComponent,
        AdjustqueueDelayComponent,
        LocateCustomerComponent,
        ProviderWaitlistCheckInDetailComponent,
        ApplyLabelComponent,
        CustomViewComponent,
        CustomViewListComponent
    ],
    entryComponents: [
        AddProviderWaitlistCheckInProviderNoteComponent,
        ProviderWaitlistCheckInConsumerNoteComponent,
        AdjustQueueDelayComponent,
        LocateCustomerComponent,
        ApplyLabelComponent
    ],
    exports: [CheckInsComponent]
})
export class CheckinsModule { }
