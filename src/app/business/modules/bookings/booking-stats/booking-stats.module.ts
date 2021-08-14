import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStatsComponent } from './booking-stats.component';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { OwlModule } from 'ngx-owl-carousel';

@NgModule({
  declarations: [BookingStatsComponent],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule,
    OwlModule
  ],
  exports: [BookingStatsComponent]
})
export class BookingStatsModule { }
