import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsComponent } from './bookings.component';
import { BookingsRoutingModule } from './bookings.routing.module';



@NgModule({
  declarations: [BookingsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule
  ]
})
export class BookingsModule {
}
