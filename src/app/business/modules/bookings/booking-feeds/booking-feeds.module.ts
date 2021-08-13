import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { BookingFeedsComponent } from './booking-feeds.component';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';



@NgModule({
  declarations: [BookingFeedsComponent],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule,
    LoadingSpinnerModule
  ],
  exports: [BookingFeedsComponent]
})
export class BookingFeedsModule {
}
