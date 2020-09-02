
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/modules/common/shared.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConsumerRoutingModule } from './consumer-routing.module';
import { SearchModule } from '../shared/modules/search/search.module';
import { HeaderModule } from '../shared/modules/header/header.module';
import { CheckInModule } from '../shared/modules/check-in/check-in.module';
import { BreadCrumbModule } from '../shared/modules/breadcrumb/breadcrumb.module';
import { AddMemberModule } from '../shared/modules/add-member/add-member.module';
import { PagerModule } from '../shared/modules/pager/pager.module';
import { ConsumerCheckinHistoryListModule } from '../shared/modules/consumer-checkin-history-list/consumer-checkin-history-list.module';
import { InboxModule } from '../shared/modules/inbox/inbox.module';
import { RatingStarModule } from '../shared/modules/ratingstar/ratingstart.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';

import { ConsumerServices } from './services/consumer-services.service';
import { ConsumerDataStorageService } from './services/consumer-datastorage.service';
import { WaitlistDetailResolver } from './services/waitlist-detail-resolver.service';
import { SharedServices } from '../shared/services/shared-services';

import { ConsumerComponent } from './consumer.component';
import { ConsumerHomeComponent } from './components/home/consumer-home.component';
import { WaitlistComponent } from './components/waitlist/waitlist.component';
import { ConfirmBoxComponent } from './shared/component/confirm-box/confirm-box.component';
import { NotificationListBoxComponent } from './shared/component/notification-list-box/notification-list-box.component';
import { MembersComponent } from './components/members/members.component';
import { AddMembersHolderComponent } from './components/add-members-holder/add-members-holder.component';
// import { AddMemberComponent } from './components/add-member/add-member.component';
import { AddManagePrivacyComponent } from './components/add-manage-privacy/add-manage-privacy.component';


import { projectConstants } from '../app.component';
import { CapitalizeFirstPipeModule } from '../shared/pipes/capitalize.module';
import { OwlModule } from 'ngx-owl-carousel';
import { LoadingSpinnerModule } from '../ynw_provider/components/loading-spinner/loading-spinner.module';
import { CheckinAddMemberModule } from '../shared/modules/checkin-add-member/checkin-add-member.module';
import { ConsumerAppointmentModule } from './components/waitlist/appointment/consumer-appointment.module';
import { ConsumerDonationModule } from './components/donations/consumer-donation.module';
import { CheckinDetailComponent } from './components/home/checkindetail.component';
import { ApptDetailComponent } from './components/home/appointmentdetail.component';
import { MeetingDetailsComponent } from './components/meeting-details/meeting-details.component';

@NgModule({
  imports: [
    CapitalizeFirstPipeModule,
    ConsumerRoutingModule,
    CommonModule,
    SearchModule,
    SharedModule,
    HeaderModule,
    CheckInModule,
    OwlModule,
    BreadCrumbModule,
    AddMemberModule,
    PagerModule,
    LoadingSpinnerModule,
    ConsumerCheckinHistoryListModule,
    InboxModule,
    RatingStarModule,
    Nl2BrPipeModule,
    CheckinAddMemberModule,
    LoadingSpinnerModule,
    ConsumerAppointmentModule,
    ConsumerDonationModule
  ],
  declarations: [
    ConsumerComponent,
    ConsumerHomeComponent,
    ConfirmBoxComponent,
    CheckinDetailComponent,
    ApptDetailComponent,
    WaitlistComponent,
    NotificationListBoxComponent,
    MembersComponent,
    AddMembersHolderComponent,
    AddManagePrivacyComponent,
    MeetingDetailsComponent
  ],
  exports: [ConfirmBoxComponent],
  entryComponents: [
    ConfirmBoxComponent,
    NotificationListBoxComponent,
    AddMembersHolderComponent,
    AddManagePrivacyComponent,
    MeetingDetailsComponent
  ],
  providers: [
    SharedServices,
    ConsumerServices,
    ConsumerDataStorageService,
    WaitlistDetailResolver,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS }
  ]
})
export class ConsumerModule { }
