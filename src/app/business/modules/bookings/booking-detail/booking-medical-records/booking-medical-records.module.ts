import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../../bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { BookingMedicalRecordsComponent } from './booking-medical-records.component';



@NgModule({
  declarations: [BookingMedicalRecordsComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    CapitalizeFirstPipeModule,

  ]
})
export class BookingMedicalRecordsModule {
}
