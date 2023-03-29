import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewCallComponent } from './view-call.component';
import { RouterModule, Routes } from '@angular/router';
import { BookingMedicalRecordsRXModule } from '../../bookings/booking-medical-records-rx/booking-medical-records-rx.module';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  { path: '', component: ViewCallComponent }
]

@NgModule({
  declarations: [
    ViewCallComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    BookingMedicalRecordsRXModule,
    [RouterModule.forChild(routes)]
  ]
})
export class ViewCallModule { }
