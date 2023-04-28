import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingActionsComponent } from './booking-actions.component';
import { BookingDetailsSendModule } from '../booking-details-send/booking-details-send.modules';



@NgModule({
  declarations: [
    BookingActionsComponent
  ],
  imports: [
    CommonModule,
    BookingDetailsSendModule
  ],
  exports: [
    BookingActionsComponent
  ]
})
export class BookingActionsModule { }
