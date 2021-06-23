import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { BookingDashboardComponent } from './booking-dashboard.component';
import { BookingFeedsModule } from './booking-feeds/booking-feeds.module';
import { BooingQuickActionsModule } from './booking-quick-actions/booking-quick-actions.module';
import { BookingCalendarModule } from './calendar/calendar.module';
import { UpcomingBookingsModule } from './upcoming-bookings/upcoming-bookings.module';
import { RecordsDatagridModule } from '../booking-dashboard-admin/records-datagrid/records-datagrid.module';
import { BookingStatsModule } from '../booking-dashboard-admin/booking-stats/booking-stats.module';



@NgModule({
  declarations: [BookingDashboardComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    BookingCalendarModule,
    UpcomingBookingsModule,
    BooingQuickActionsModule,
    BookingFeedsModule,
    RecordsDatagridModule,
    BookingStatsModule
  ],
  exports: [BookingDashboardComponent]

})
export class BookingDashboardModule {
}
