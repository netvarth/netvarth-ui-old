import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { CalendarComponent } from './calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    CapitalizeFirstPipeModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })

  ],
  exports:[CalendarComponent]
})
export class BookingCalendarModule {
}
