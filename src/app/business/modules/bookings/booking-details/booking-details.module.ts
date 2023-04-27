import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingDetailsComponent } from './booking-details.component';
import { CardModule } from 'primeng/card';
import { DateAsCalendarModule } from '../date-as-calendar/date-as-calendar.module';



@NgModule({
  declarations: [
    BookingDetailsComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    DateAsCalendarModule,
  ],
  exports: [
    BookingDetailsComponent
  ]
})
export class BookingDetailsModule { }
