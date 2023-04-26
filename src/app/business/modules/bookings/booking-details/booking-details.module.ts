import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingDetailsComponent } from './booking-details.component';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [
    BookingDetailsComponent
  ],
  imports: [
    CommonModule,
    CardModule
  ],
  exports: [
    BookingDetailsComponent
  ]
})
export class BookingDetailsModule { }
