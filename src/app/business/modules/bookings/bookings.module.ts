import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from './bookings.routing.module';
import { BookingDetailModule } from './booking-detail/booking-detail.module';
import { BookingsComponent } from './bookings.component';
import { BookingDashboardAdminModule } from './booking-dashboard-admin/booking-dashboard-admin.module';
import { BookingDashboardModule } from './booking-dashboard/booking-dashboard.module';



@NgModule({
  declarations: [BookingsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    BookingDetailModule,
    BookingDashboardAdminModule,
    BookingDashboardModule
  ],
  exports: [BookingsComponent]
})
export class BookingsModule {
}
