import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
    selector: 'app-booking-history',
    templateUrl: './booking-history.component.html',
    styleUrls: ['./booking-history.component.css']
  
  })
  
export class BookingHistoryComponent implements OnInit {
  bookinghistorydetails;
  appointmentby;
  how: any;
  type:any;
  appointmentbyname: any;
  check_in_statuses = projectConstantsLocal.CHECK_IN_STATUSES;
  booking_history_uuid;
  provider_label: any;
  customer_label: any;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  newTimeDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;

  constructor(
      public dialogRef: MatDialogRef<BookingHistoryComponent>,
      private wordProcessor: WordProcessor,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {

      this.bookinghistorydetails=data.details;
      this.booking_history_uuid = data.uuid
      this.appointmentby=data.appointmentby;
      this.how=data.bookingmode;
      this.type=data.type;
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');

      if(this.appointmentby!='CONSUMER'){
        this.appointmentby=this.customer_label
        this.appointmentbyname=data.providername
      } else {
        this.appointmentby=this.provider_label
        this.appointmentbyname=data.consumername
      }
    }
    ngOnInit() {}
    dismissModal() {
      this.dialogRef.close();
  }
  getformatedTime(time) {
    let timeDate;
    timeDate = time.replace(/\s/, 'T');
    return timeDate;
  }
}