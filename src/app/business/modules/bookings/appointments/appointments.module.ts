import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsComponent } from './appointments.component';
import { RecordsDatagridModule } from '../records-datagrid/records-datagrid.module';
import { AppointmentsRoutingModule } from './appointments.routing.module';

@NgModule({
  declarations: [AppointmentsComponent],
  imports: [
    CommonModule,
    RecordsDatagridModule,
    AppointmentsRoutingModule
  ],
  exports: [AppointmentsComponent]
})
export class AppointmentsModule {
}
