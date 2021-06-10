import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { BookingDashboardComponent } from './booking-dashboard.component';
import { BookingsDashboardRoutingModule } from './booking-dashboard.routing.module';
import { BookingCalendarModule } from './calendar/calendar.module';
import { UpcomingBookingsModule } from './upcoming-bookings/upcoming-bookings.module';
import { BooingQuickActionsModule } from './booking-quick-actions/booking-quick-actions.module';
import { TodayBookingStatsModule } from './today-booking-stats/today-booking-stats.module';
import { BookingFeedsModule } from './booking-feeds/booking-feeds.module';
import { BookingAppointmentsModule } from './booking-appointments/booking-appointments.module';
import { BookingCheckinsModule } from './booking-checkins/booking-checkins.module';
import { BookingDashboardAdminModule } from './booking-dashboard-admin/booking-dashboard-admin.module';



@NgModule({
  declarations: [BookingDashboardComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    BookingsDashboardRoutingModule,
    BookingCalendarModule,
    UpcomingBookingsModule,
    BooingQuickActionsModule,
    TodayBookingStatsModule,
    BookingFeedsModule,
    BookingAppointmentsModule,
    BookingCheckinsModule,
    BookingDashboardAdminModule
  ],
  exports:[BookingDashboardComponent]

})
export class BookingDashboardModule {
}

