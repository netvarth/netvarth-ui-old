import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { BookingCheckinsComponent } from './booking-checkins.component';



@NgModule({
  declarations: [BookingCheckinsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    CapitalizeFirstPipeModule,

  ],
  exports:[BookingCheckinsComponent]
})
export class BookingCheckinsModule {
}
