import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { BookingAppointmentsComponent } from './booking-appointments.component';



@NgModule({
  declarations: [BookingAppointmentsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    CapitalizeFirstPipeModule,

  ],
  exports:[BookingAppointmentsComponent]
})
export class BookingAppointmentsModule {
}
