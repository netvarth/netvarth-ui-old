import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustTemplate4Component } from './cust-template4.component';
import { HeaderModule } from '../../../shared/modules/header/header.module';
import { SafeHtmlModule } from '../../../shared/pipes/safe-html/safehtml.module';
import { RouterModule, Routes } from '@angular/router';
import { ConsDepartmentsModule } from '../../cons-departments/cons-departments.module';
import { PictureGalleryModule } from '../../picture-gallery/picture-gallery.module';
import { OnlineUsersModule } from '../../online-users/online-users.module';
import { OrdersModule } from '../../orders/orders.module';
import { CardModule } from '../../../shared/components/card/card.module';
import { ServiceDisplayModule } from '../../service-display/service-display.module';
import { AppointmentServicesModule } from '../../appointment-services/appointment-services.module';
import { DonationServicesModule } from '../../donation-services/donation-services.module';
import { CheckinServicesModule } from '../../checkin-services/checkin-services.module';
import { BookingService } from '../../../shared/services/booking-service';
import { MatDialogModule } from '@angular/material/dialog';
import { AddInboxMessagesModule } from '../../../shared/components/add-inbox-messages/add-inbox-messages.module';
import { MatButtonModule } from '@angular/material/button';
import { RecentNewsModule } from '../../recent-news/recent-news.module';

const routes: Routes = [
  { path: '', component: CustTemplate4Component }
];

@NgModule({
  declarations: [
    CustTemplate4Component
  ],
  imports: [
    CommonModule,
    HeaderModule,
    SafeHtmlModule,
    CardModule,
    OrdersModule,
    ServiceDisplayModule,
    ConsDepartmentsModule,
    PictureGalleryModule,
    OnlineUsersModule,
    AppointmentServicesModule,
    DonationServicesModule,
    CheckinServicesModule,
    MatDialogModule,
    MatButtonModule,
    AddInboxMessagesModule,
    RecentNewsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    CustTemplate4Component
  ],
  providers: [BookingService]
})
export class CustTemplate4Module { }
