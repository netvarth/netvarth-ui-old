import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStatsComponent } from './booking-stats.component';

@NgModule({
  declarations: [BookingStatsComponent],
  imports: [
    CommonModule
  ],
  exports: [BookingStatsComponent]
})
export class BookingStatsModule { }
