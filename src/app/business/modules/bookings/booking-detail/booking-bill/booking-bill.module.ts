import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { BookingBillComponent } from './booking-bill.component';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';



@NgModule({
  declarations: [BookingBillComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    CapitalizeFirstPipeModule,
    LoadingSpinnerModule
  ],
  exports: [BookingBillComponent]
})
export class BookingBillModule {
}
