import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingActionsComponent } from './booking-actions.component';
import { BookingDetailsSendModule } from '../booking-details-send/booking-details-send.modules';
import { BookingActionsPopupModule } from '../booking-actions-popup/booking-actions-popup.module';



@NgModule({
  declarations: [
    BookingActionsComponent
  ],
  imports: [
    CommonModule,
    BookingDetailsSendModule,
    BookingActionsPopupModule
  ],
  exports: [
    BookingActionsComponent
  ]
})
export class BookingActionsModule { }
