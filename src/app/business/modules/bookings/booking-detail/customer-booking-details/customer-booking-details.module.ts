import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CustomerBookingDetailsComponent } from './customer-booking-details.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomerBookingDetailsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    CapitalizeFirstPipeModule,
    FormsModule
  ],
  exports: [CustomerBookingDetailsComponent]
})
export class CustomerBookingDetailsModule {
}
