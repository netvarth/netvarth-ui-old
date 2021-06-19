import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStatsComponent } from './booking-stats.component';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';

@NgModule({
  declarations: [BookingStatsComponent],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule
  ],
  exports: [BookingStatsComponent]
})
export class BookingStatsModule { }
