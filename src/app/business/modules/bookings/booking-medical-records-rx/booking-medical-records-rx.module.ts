import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../bookings.routing.module';
import { BookingMedicalRecordsRXComponent } from './booking-medical-records-rx.component';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [BookingMedicalRecordsRXComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    LoadingSpinnerModule
  ],
  exports: [BookingMedicalRecordsRXComponent]
})
export class BookingMedicalRecordsRXModule {
}
