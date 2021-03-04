import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsComponent } from './bookings.component';
import { BookingsRoutingModule } from './bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';



@NgModule({
  declarations: [BookingsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule
  ]
})
export class BookingsModule {
}
