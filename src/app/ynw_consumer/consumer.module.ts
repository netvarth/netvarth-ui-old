
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/modules/common/shared.module';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import { ModalGalleryModule } from 'angular-modal-gallery';


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

import {ConsumerServices } from './services/consumer-services.service';
import { ConsumerDataStorageService } from './services/consumer-datastorage.service';
import { WaitlistDetailResolver } from './services/waitlist-detail-resolver.service';
import { SharedServices } from '../shared/services/shared-services';

import {ConsumerComponent} from './consumer.component';
import {ConsumerHomeComponent} from './components/home/consumer-home.component';
import {WaitlistComponent} from './components/waitlist/waitlist.component';
import { ConfirmBoxComponent} from './shared/component/confirm-box/confirm-box.component';
import { NotificationListBoxComponent} from './shared/component/notification-list-box/notification-list-box.component';
import {MembersComponent } from './components/members/members.component';
import { AddMembersHolderComponent } from './components/add-members-holder/add-members-holder.component';
// import { AddMemberComponent } from './components/add-member/add-member.component';

import { projectConstants } from '../shared/constants/project-constants';

@NgModule({
    imports: [
        ConsumerRoutingModule,
        CommonModule,
        SearchModule,
        SharedModule,
        HeaderModule,
        CheckInModule,
        BreadCrumbModule,
        AddMemberModule,
        PagerModule,
        ConsumerCheckinHistoryListModule,
        InboxModule,
        RatingStarModule
    ],
    declarations: [
      ConsumerComponent,
      ConsumerHomeComponent,
      ConfirmBoxComponent,
      WaitlistComponent,
      NotificationListBoxComponent,
      MembersComponent,
      AddMembersHolderComponent
    ],
    exports: [ConfirmBoxComponent],
    entryComponents: [
      ConfirmBoxComponent,
      NotificationListBoxComponent,
      AddMembersHolderComponent
    ],
    providers: [
      SharedServices,
      ConsumerServices,
      ConsumerDataStorageService,
      WaitlistDetailResolver,
      {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: projectConstants.MY_DATE_FORMATS}
    ]
})
export class ConsumerModule {}
