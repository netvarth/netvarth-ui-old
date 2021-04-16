import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { BookingDashboardComponent } from './booking-dashboard.component';
import { BookingsDashboardRoutingModule } from './booking-dashboard.routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { UpcomingBookingsComponent } from './upcoming-bookings/upcoming-bookings.component';
import { BookingQuickActionsComponent } from './booking-quick-actions/booking-quick-actions.component';
import { BookingFeedsComponent } from './booking-feeds/booking-feeds.component';
import { TodayBookingStatsComponent } from './today-booking-stats/today-booking-stats.component';



@NgModule({
  declarations: [BookingDashboardComponent, CalendarComponent, UpcomingBookingsComponent, BookingQuickActionsComponent, BookingFeedsComponent, TodayBookingStatsComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    BookingsDashboardRoutingModule
  ],
  exports:[BookingDashboardComponent]

})
export class BookingDashboardModule {
}

