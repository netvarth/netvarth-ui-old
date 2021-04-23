import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import { BookingMedicalRecordsComponent } from './booking-medical-records.component';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [BookingMedicalRecordsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    LoadingSpinnerModule
  ],
  exports: [BookingMedicalRecordsComponent]
})
export class BookingMedicalRecordsModule {
}
