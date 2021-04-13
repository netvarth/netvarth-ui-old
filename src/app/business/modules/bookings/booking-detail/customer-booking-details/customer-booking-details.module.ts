import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CustomerBookingDetailsComponent } from './customer-booking-details.component';



@NgModule({
  declarations: [CustomerBookingDetailsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    CapitalizeFirstPipeModule,

  ],
  exports:[CustomerBookingDetailsComponent]
})
export class CustomerBookingDetailsModule {
}
