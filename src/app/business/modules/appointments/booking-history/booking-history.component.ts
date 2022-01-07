import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  booking_history_uuid;
  constructor(
      public dialogRef: MatDialogRef<BookingHistoryComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {

      this.bookinghistorydetails=data.details;
      this.booking_history_uuid = data.uuid
      this.appointmentby=data.appointmentby;
      this.how=data.bookingmode;
      this.type=data.type;
      if(this.appointmentby!='CONSUMER'){
        this.appointmentbyname=data.providername
      } else {
        this.appointmentbyname=data.consumername
      }
    }
    ngOnInit() {}
    dismissModal() {
      this.dialogRef.close();
  }
  
}