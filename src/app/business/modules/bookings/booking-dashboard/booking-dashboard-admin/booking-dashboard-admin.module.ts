import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import { BookingDashboardAdminComponent } from './booking-dashboard-admin.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [BookingDashboardAdminComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [BookingDashboardAdminComponent]
})
export class BookingDashboardAdminModule { }
