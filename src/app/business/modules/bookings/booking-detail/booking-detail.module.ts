import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from '../bookings.routing.module';
import {MatGridListModule} from '@angular/material/grid-list';
import { BookingDetailComponent } from '../booking-detail/booking-detail.component';
import { ServiceActionModule } from './service-actions/service-actions.module';
import { CustomerBookingDetailsModule } from './customer-booking-details/customer-booking-details.module';
import { BookingPrerscriptionModule } from './booking-prescriptions/booking-prescriptions.module';
import { BookingMedicalRecordsModule } from './booking-medical-records/booking-medical-records.module';
import { BookingDocumentsModule } from './booking-documents/booking-documents.module';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { BookingBillModule } from './booking-bill/booking-bill.module';
import { QuestionnaireModule } from '../../../../shared/components/questionnaire/questionnaire.module';
import { InboxListModule } from '../../inbox-list/inbox-list.module';
import { BookingPrivateNotesModule } from './booking-private-notes/booking-private-notes.module';



@NgModule({
  declarations: [BookingDetailComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    MatGridListModule,
    ServiceActionModule,
    CustomerBookingDetailsModule,
    BookingPrerscriptionModule,
    BookingMedicalRecordsModule,
    BookingDocumentsModule,
    LoadingSpinnerModule,
    BookingBillModule,
    QuestionnaireModule,
    InboxListModule,
    BookingPrivateNotesModule
  ],
  exports:[BookingDetailComponent]
})
export class BookingDetailModule {
}
