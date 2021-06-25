import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsComponent } from './appointments.component';
import { RecordsDatagridModule } from '../booking-dashboard-admin/records-datagrid/records-datagrid.module';

@NgModule({
  declarations: [AppointmentsComponent],
  imports: [
    CommonModule,
    RecordsDatagridModule
  ],
  exports: [AppointmentsComponent]
})
export class AppointmentsModule {
}
