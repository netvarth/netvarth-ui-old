import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { BookingDashboardComponent } from './booking-dashboard.component';
import { UpcomingBookingsModule } from '../upcoming-bookings/upcoming-bookings.module';
import { RecordsDatagridModule } from '../records-datagrid/records-datagrid.module';
import { BookingStatsModule } from '../booking-stats/booking-stats.module';
import { BookingDocumentsModule } from '../booking-documents/booking-documents.module';
import { BookingMedicalRecordsModule } from '../booking-medical-records/booking-medical-records.module';
import { BookingPrerscriptionModule } from '../booking-prescriptions/booking-prescriptions.module';
import { BookingDashboardRoutingModule } from './booking-dashboard.routing.module';
import { BookingFeedsModule } from '../booking-feeds/booking-feeds.module';
import { BookingQuickActionsModule } from '../booking-quick-actions/booking-quick-actions.module';



@NgModule({
  declarations: [BookingDashboardComponent],
  imports: [
    CommonModule,
    BookingDashboardRoutingModule,
    MatGridListModule,
    UpcomingBookingsModule,
    BookingQuickActionsModule,
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
