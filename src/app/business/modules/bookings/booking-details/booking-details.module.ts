import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingDetailsComponent } from './booking-details.component';
import { CardModule } from 'primeng/card';
import { DateAsCalendarModule } from '../date-as-calendar/date-as-calendar.module';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    BookingDetailsComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DateAsCalendarModule,
  ],
  exports: [
    BookingDetailsComponent
  ]
})
export class BookingDetailsModule { }
