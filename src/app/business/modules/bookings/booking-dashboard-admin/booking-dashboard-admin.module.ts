import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../bookings.routing.module';
import { BookingDashboardAdminComponent } from './booking-dashboard-admin.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookingStatsModule } from './booking-stats/booking-stats.module';
import { RecordsDatagridModule } from './records-datagrid/records-datagrid.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [BookingDashboardAdminComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    BookingStatsModule,
    RecordsDatagridModule,
    LoadingSpinnerModule
  ],
  exports: [BookingDashboardAdminComponent]
})
export class BookingDashboardAdminModule { }
