import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from './bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { BookingDetailModule } from './booking-detail/booking-detail.module';
import { BookingDashboardModule } from './booking-dashboard/booking-dashboard.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    BookingDetailModule,
    BookingDashboardModule
  ]
})
export class BookingsModule {
}
