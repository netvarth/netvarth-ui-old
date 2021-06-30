import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsComponent } from './appointments.component';
import { RecordsDatagridModule } from '../records-datagrid/records-datagrid.module';
import { AppointmentsRoutingModule } from './appointments.routing.module';
import { BookingCalendarModule } from '../calendar/calendar.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [AppointmentsComponent],
  imports: [
    CommonModule,
    RecordsDatagridModule,
    AppointmentsRoutingModule,
    BookingCalendarModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    LoadingSpinnerModule
  ],
  exports: [AppointmentsComponent]
})
export class AppointmentsModule {
}
