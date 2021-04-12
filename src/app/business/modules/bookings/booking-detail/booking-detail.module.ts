import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { BookingDetailComponent } from '../booking-detail/booking-detail.component';
import { ServiceActionsComponent } from './service-actions/service-actions.component';
import { CustomerBookingDetailsComponent } from './customer-booking-details/customer-booking-details.component';
import { BookingPrescriptionsComponent } from './booking-prescriptions/booking-prescriptions.component';
import { BookingMedicalRecordsComponent } from './booking-medical-records/booking-medical-records.component';



@NgModule({
  declarations: [BookingDetailComponent, ServiceActionsComponent, CustomerBookingDetailsComponent, BookingPrescriptionsComponent, BookingMedicalRecordsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule
  ]
})
export class BookingDetailModule {
}
