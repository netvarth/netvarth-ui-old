import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { BookingDashboardComponent } from './booking-dashboard.component';
import { BookingFeedsModule } from './booking-feeds/booking-feeds.module';
import { BooingQuickActionsModule } from './booking-quick-actions/booking-quick-actions.module';
import { UpcomingBookingsModule } from './upcoming-bookings/upcoming-bookings.module';
import { RecordsDatagridModule } from '../records-datagrid/records-datagrid.module';
import { BookingStatsModule } from '../booking-stats/booking-stats.module';
import { BookingDocumentsModule } from '../booking-documents/booking-documents.module';
import { BookingMedicalRecordsModule } from '../booking-medical-records/booking-medical-records.module';
import { BookingPrerscriptionModule } from '../booking-prescriptions/booking-prescriptions.module';
import { BookingDashboardRoutingModule } from './booking-dashboard.routing.module';



@NgModule({
  declarations: [BookingDashboardComponent],
  imports: [
    CommonModule,
    BookingDashboardRoutingModule,
    MatGridListModule,
    UpcomingBookingsModule,
    BooingQuickActionsModule,
    BookingFeedsModule,
    RecordsDatagridModule,
    BookingStatsModule,
    BookingPrerscriptionModule,
    BookingMedicalRecordsModule,
    BookingDocumentsModule
  ],
  exports: [BookingDashboardComponent]

})
export class BookingDashboardModule {
}
