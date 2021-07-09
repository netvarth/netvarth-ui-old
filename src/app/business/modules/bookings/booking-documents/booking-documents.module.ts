import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { BookingDocumentsComponent } from './booking-documents.component';
import { BookingDocumentsRoutingModule } from './booking-documents.routing.module';



@NgModule({
  declarations: [BookingDocumentsComponent],
  imports: [
    CommonModule,
    BookingDocumentsRoutingModule,
    MatGridListModule,
    CapitalizeFirstPipeModule
  ],
  exports: [BookingDocumentsComponent]
})
export class BookingDocumentsModule {
}
