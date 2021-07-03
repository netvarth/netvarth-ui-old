import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { BookingFeedsComponent } from './booking-feeds.component';



@NgModule({
  declarations: [BookingFeedsComponent],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule
  ],
  exports: [BookingFeedsComponent]
})
export class BookingFeedsModule {
}
