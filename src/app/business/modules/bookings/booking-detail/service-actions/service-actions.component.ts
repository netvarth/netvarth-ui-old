import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-actions',
  templateUrl: './service-actions.component.html',
  styleUrls: ['./service-actions.component.css','../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class ServiceActionsComponent implements OnInit {
  @Input() waitlist_data;
  bookingType;
  timeType;
  trackStatus = false;
  showArrived = false;
  showUndo = false;
  showCancel = false;
  showSendDetails = false;
  showStart = false;
  showTeleserviceStart = false;
  showMsg = false;
  board_count;
  pos = false;
  showBill = false;
  showAttachment = false;
  showCall;
  showmrrx = false;

  constructor(
    private activated_route: ActivatedRoute

  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.bookingType = params.type;
      this.timeType = params.timetype;
    });
   }

  ngOnInit(): void {
    this.setActions();
  console.log(this.waitlist_data)
  console.log(this.bookingType)
  console.log(this.timeType)

  }
  setActions() {
    if(this.bookingType == 'checkin'){

          // this.apiloading = false;
    if (this.timeType !== 3 && this.waitlist_data.waitlistStatus !== 'done' && this.waitlist_data.waitlistStatus !== 'checkedIn' && this.waitlist_data.waitlistStatus !== 'blocked') {
        this.showUndo = true;
    }
    if (this.timeType === 1 && this.waitlist_data.waitlistStatus === 'checkedIn' && !this.waitlist_data.virtualService) {
        this.showArrived = true;
    }
    if (this.waitlist_data.waitlistStatus === 'arrived' || this.waitlist_data.waitlistStatus === 'checkedIn') {
        this.showCancel = true;
    }
    if (this.timeType === 1 && this.waitlist_data.service.livetrack && this.waitlist_data.waitlistStatus === 'checkedIn' && this.waitlist_data.jaldeeWaitlistDistanceTime && this.waitlist_data.jaldeeWaitlistDistanceTime.jaldeeDistanceTime && (this.waitlist_data.jaldeeStartTimeType === 'ONEHOUR' || this.waitlist_data.jaldeeStartTimeType === 'AFTERSTART')) {
        this.trackStatus = true;
    }
    if (this.timeType !== 3 && this.waitlist_data.waitlistStatus !== 'cancelled' && ((this.waitlist_data.waitlistingFor[0].phoneNo && this.waitlist_data.waitlistingFor[0].phoneNo !== 'null') || this.waitlist_data.waitlistingFor[0].email)) {
        this.showSendDetails = true;
    }
    if ((this.waitlist_data.waitlistingFor[0].phoneNo && this.waitlist_data.waitlistingFor[0].phoneNo !== 'null') || this.waitlist_data.waitlistingFor[0].email) {
        this.showMsg = true;
    }
    if ((this.waitlist_data.waitlistStatus === 'arrived' || this.waitlist_data.waitlistStatus === 'checkedIn') && this.timeType !== 2 && (!this.waitlist_data.virtualService)) {
        this.showStart = true;
    }
    if ((this.timeType === 1 || this.timeType === 3) && this.waitlist_data.virtualService && (this.waitlist_data.waitlistStatus === 'arrived' || this.waitlist_data.waitlistStatus === 'checkedIn' || this.waitlist_data.waitlistStatus === 'started')) {
        this.showTeleserviceStart = true;
    }
    if (this.board_count > 0 && this.timeType === 1 && !this.waitlist_data.virtualService && (this.waitlist_data.waitlistStatus === 'checkedIn' || this.waitlist_data.waitlistStatus === 'arrived')) {
        this.showCall = true;
    }
    if (this.pos && this.waitlist_data.waitlistStatus !== 'blocked' && (this.waitlist_data.waitlistStatus !== 'cancelled' || (this.waitlist_data.waitlistStatus === 'cancelled' && this.waitlist_data.paymentStatus !== 'NotPaid'))) {
        this.showBill = true;
    }
    if (this.timeType !== 2 && this.waitlist_data.waitlistStatus !== 'cancelled' && this.waitlist_data.waitlistStatus !== 'blocked') {
        this.showmrrx = true;
    }
    if ((this.waitlist_data.waitlistingFor[0].phoneNo && this.waitlist_data.waitlistingFor[0].phoneNo !== 'null') || this.waitlist_data.waitlistingFor[0].email) {
        this.showAttachment = true;
    }
      
}else if(this.bookingType == 'appointment'){
        // this.apiloading = false;
        if (this.timeType !== 3 && this.waitlist_data.apptStatus !== 'Completed' && this.waitlist_data.apptStatus !== 'Confirmed' && this.waitlist_data.apptStatus !== 'blocked') {
            this.showUndo = true;
        }
        if (this.timeType === 1 && this.waitlist_data.apptStatus === 'Confirmed' && !this.waitlist_data.virtualService) {
            this.showArrived = true;
        }
        if (this.waitlist_data.apptStatus === 'Arrived' || this.waitlist_data.apptStatus === 'Confirmed') {
            this.showCancel = true;
        }
        if (this.timeType === 1 && this.waitlist_data.service.livetrack && this.waitlist_data.apptStatus === 'Confirmed' && this.waitlist_data.jaldeeApptDistanceTime && this.waitlist_data.jaldeeApptDistanceTime.jaldeeDistanceTime && (this.waitlist_data.jaldeeStartTimeType === 'ONEHOUR' || this.waitlist_data.jaldeeStartTimeType === 'AFTERSTART')) {
            this.trackStatus = true;
        }
        if (this.timeType !== 3 && this.waitlist_data.apptStatus !== 'Cancelled' && this.waitlist_data.apptStatus !== 'Rejected' && (this.waitlist_data.providerConsumer.email || this.waitlist_data.providerConsumer.phoneNo)) {
            this.showSendDetails = true;
        }
        if (this.waitlist_data.providerConsumer.email || this.waitlist_data.providerConsumer.phoneNo) {
            this.showMsg = true;
        }
        if ((this.waitlist_data.apptStatus === 'Arrived' || this.waitlist_data.apptStatus === 'Confirmed') && this.timeType !== 2 && (!this.waitlist_data.virtualService)) {
            this.showStart = true;
        }
        if ((this.timeType === 1 || this.timeType === 3) && this.waitlist_data.virtualService && (this.waitlist_data.apptStatus === 'Arrived' || this.waitlist_data.apptStatus === 'Confirmed' || this.waitlist_data.apptStatus === 'Started')) {
            this.showTeleserviceStart = true;
        }
        if (this.board_count > 0 && this.timeType === 1 && !this.waitlist_data.virtualService && (this.waitlist_data.apptStatus === 'Confirmed' || this.waitlist_data.apptStatus === 'Arrived')) {
            this.showCall = true;
        }
        if (this.pos && this.waitlist_data.apptStatus !== 'blocked' && ((this.waitlist_data.apptStatus !== 'Cancelled' && this.waitlist_data.apptStatus !== 'Rejected') || ((this.waitlist_data.apptStatus === 'Cancelled' || this.waitlist_data.apptStatus === 'Rejected') && this.waitlist_data.paymentStatus !== 'NotPaid'))) {
            this.showBill = true;
        }
        if (this.timeType !== 2 && this.waitlist_data.apptStatus !== 'blocked' && (this.waitlist_data.apptStatus !== 'Cancelled' && this.waitlist_data.apptStatus !== 'Rejected')) {
            this.showmrrx = true;
        }
        if (this.waitlist_data.providerConsumer.email || this.waitlist_data.providerConsumer.phoneNo) {
            this.showAttachment = true;
        }
      }
    
}


}
