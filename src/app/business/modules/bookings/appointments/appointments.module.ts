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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';

@NgModule({
  declarations: [AppointmentsComponent],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    RecordsDatagridModule,
    BookingCalendarModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    LoadingSpinnerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    CapitalizeFirstPipeModule
  ],
  exports: [AppointmentsComponent]
})
export class AppointmentsModule {
}
