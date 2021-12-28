import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../../../../src/app/shared/constants/project-constants';
import { WordProcessor } from '../../../shared/services/word-processor.service';
@Component({
    selector: 'app-booking-history',
    templateUrl: './booking-history.component.html',
    styleUrls: ['./booking-history.component.css']
  
  })
  
export class BookingHistoryComponent implements OnInit {
  bookinghistorydetails;
  booking_stat;
  appointmentby;
  type:any;
  appointmentbyname: any;
  booking_history_uuid;
  intStat: any;
  provider_label = '';
  customer_label = '';
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  newTimeDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;
  check_in_statuses = projectConstantsLocal.CHECK_IN_STATUSES;
  constructor(
      public dialogRef: MatDialogRef<BookingHistoryComponent>,
      private wordProcessor: WordProcessor,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      this.bookinghistorydetails=data.details;
      this.booking_history_uuid = data.uuid
      this.appointmentby=data.appointmentby;
      this.type=data.type;
      // for (const stat of this.booking_stat) {
      //   if (this.intStat.indexOf(stat.changeStatus) === ) {
      //     this.intStat.push(stat.changeMode);
      //   }
      // }
      // if(this.appointmentby!='CONSUMER'){
      //   this.appointmentbyname=data.providername
      // } else {
      //   this.appointmentbyname=data.consumername
      // }
    }
    ngOnInit() {
      this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
      this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    }
    dismissModal() {
      this.dialogRef.close();
  }
  getformatedTime(time) {
    let timeDate;
    timeDate = time.replace(/\s/, 'T');
    return timeDate;
   
  }
  
}