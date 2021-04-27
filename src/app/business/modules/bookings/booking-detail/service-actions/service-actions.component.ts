import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CheckinDetailsSendComponent } from '../../../check-ins/checkin-details-send/checkin-details-send.component';
import { LocateCustomerComponent } from '../../../check-ins/locate-customer/locate-customer.component';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { projectConstants } from '../../../../../app.component';
import * as moment from 'moment';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

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
  trackDetail: any = [];
  customerMsg;
  action = '';
  activeDate;
  checkin_date;
  pastDate;
  today;
  location_id;
  serv_id;
  accountid;
  queuejson: any = [];
  queueQryExecuted = false;
  sel_queue_id;
  sel_queue_waitingmins;
  sel_queue_servicetime = '';
  sel_queue_name;
  sel_queue_timecaption;
  sel_queue_indx;
  sel_queue_det;
  sel_queue_personaahead = 0;
  calc_mode;
  availableDates: any = [];
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;

  constructor(
    private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    private provider_shared_functions: ProviderSharedFuctions,
    private dialog: MatDialog,
    private router: Router,
    private snackbarService: SnackbarService,
    public shared_services: SharedServices,
    private dateTimeProcessor: DateTimeProcessor,
    public dialogRef: MatDialogRef<ServiceActionsComponent>
  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.bookingType = params.type;
      this.timeType = JSON.parse(params.timetype);
    });
   }

  ngOnInit(): void {
    this.setActions();
  console.log(this.waitlist_data)
  console.log(this.bookingType)
  console.log(this.timeType)
  this.location_id = this.waitlist_data.queue.location.id;
  this.serv_id = this.waitlist_data.service.id;
  this.accountid = this.waitlist_data.providerAccount.id;

  if (this.timeType === 3) {
    this.pastDate = this.waitlist_data.date;
    this.checkin_date = moment(this.today, 'YYYY-MM-DD HH:mm').format();
} else {
    this.checkin_date = this.waitlist_data.date;
}

  }
  setActions() {
    if(this.bookingType === 'checkin'){
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
      
}else if(this.bookingType === 'appointment'){
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
callingWaitlist() {
    if(this.bookingType == 'checkin'){
        const status = (this.waitlist_data.callingStatus) ? 'Disable' : 'Enable';
    this.provider_services.setCallStatus(this.waitlist_data.ynwUuid, status).subscribe(
        () => {
            // this.dialogRef.close('reload');
        });
    }    
}
changeWaitlistStatus(action) {
    if(this.bookingType == 'checkin'){
        console.log(action)
    if (action !== 'CANCEL') {
        // this.dialogRef.close();
        // this.buttonClicked = true;
    }
    this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, action);
    } else if (this.bookingType == 'appointment') {
        console.log(action)
        if (action !== 'Rejected') {
            // this.buttonClicked = true;
        }
        this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, action, 'appt');
    }

}
changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    if(this.bookingType == 'checkin') {
        this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
        .then(
            result => {
                this.dialogRef.close('reload');
                // this.buttonClicked = false;
            },
            error => {
                // this.buttonClicked = false;
            });
    }else if(this.bookingType == 'appointment') {
        this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data)
        .then(
            result => {
                this.dialogRef.close('reload');
                // this.buttonClicked = false;
            },
            error => {
                // this.buttonClicked = false;
            });
    }
    
}
smsCheckin() {
    // this.dialogRef.close();
    const smsdialogRef = this.dialog.open(CheckinDetailsSendComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
            qdata: this.waitlist_data,
            uuid: this.waitlist_data.ynwUuid,
            chekintype: 'Waitlist'
        }
    });
    smsdialogRef.afterClosed().subscribe(result => {
    });
}

locateCustomer() {
    this.provider_services.getCustomerTrackStatus(this.waitlist_data.ynwUuid).subscribe(data => {
        this.trackDetail = data;
        this.customerMsg = this.locateCustomerMsg(this.trackDetail);
        this.dialogRef.close();
        const locateCustomerdialogRef = this.dialog.open(LocateCustomerComponent, {
            width: '40%',
            panelClass: ['popup-class', 'locatecustomer-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                message: this.customerMsg
            }
        });
        locateCustomerdialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
            }
        });
    },
        error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
}
locateCustomerMsg(details) {
    if (details && details.jaldeeDistance) {
        const distance = details.jaldeeDistance.distance;
        const unit = projectConstants.LIVETRACK_CONST[details.jaldeeDistance.unit];
        const travelTime = details.jaldeelTravelTime.travelTime;
        const hours = Math.floor(travelTime / 60);
        const mode = details.jaldeelTravelTime.travelMode;
        const minutes = travelTime % 60;
        return this.provider_shared_functions.getLiveTrackMessage(distance, unit, hours, minutes, mode);
    }
}

unBlockAppt() {
    this.provider_services.deleteAppointmentBlock(this.waitlist_data.uid)
        .subscribe(
            () => {
                this.dialogRef.close('reload');
                this.router.navigate(['provider', 'appointments']);
            },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
}
callingAppt() {
    const status = (this.waitlist_data.callingStatus) ? 'Disable' : 'Enable';
    this.provider_services.setApptCallStatus(this.waitlist_data.uid, status).subscribe(
        () => {
            this.dialogRef.close('reload');
        });
}
smsApptmnt() {
    // this.dialogRef.close();
    const smsdialogRef = this.dialog.open(CheckinDetailsSendComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
            qdata: this.waitlist_data,
            uuid: this.waitlist_data.uid,
            chekintype: 'appointment'
        }
    });
    smsdialogRef.afterClosed().subscribe(result => {
    });
}
locateApptCustomer() {
    this.dialogRef.close();
    this.provider_services.getCustomerTrackStatusforAppointment(this.waitlist_data.uid).subscribe(data => {
        this.trackDetail = data;
        this.customerMsg = this.locateApptCustomerMsg(this.trackDetail);
        const locateCustomerdialogRef = this.dialog.open(LocateCustomerComponent, {
            width: '40%',
            panelClass: ['popup-class', 'locatecustomer-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                message: this.customerMsg
            }
        });
        locateCustomerdialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
            }
        });
    },
        error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
}
locateApptCustomerMsg(details) {
    if (details && details.jaldeeDistance) {
        const distance = details.jaldeeDistance.distance;
        const unit = projectConstants.LIVETRACK_CONST[details.jaldeeDistance.unit];
        const travelTime = details.jaldeelTravelTime.travelTime;
        const hours = Math.floor(travelTime / 60);
        const mode = details.jaldeelTravelTime.travelMode;
        const minutes = travelTime % 60;
        return this.provider_shared_functions.getLiveTrackMessage(distance, unit, hours, minutes, mode);
    }
}
showCallingModes(modes) {
    if(this.bookingType == 'checkin') {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                waiting_id: modes.ynwUuid,
                type: 'checkin'
            }
        };
        this.router.navigate(['provider', 'telehealth'], navigationExtras);
        // this.dialogRef.close();
    }else if(this.bookingType == 'appointment'){
        const navigationExtras: NavigationExtras = {
            queryParams: {
                waiting_id: modes.uid,
                type: 'appt'
            }
        };
        this.router.navigate(['provider', 'telehealth'], navigationExtras);
        // this.dialogRef.close();
    }
}
 rescheduleActionClicked() {
        this.action = 'reschedule';
    }

    changeSlot() {
        this.action = 'slotChange';
        // this.selectedTime = '';
        this.activeDate = this.checkin_date;
        this.getQueuesbyLocationandServiceId(this.location_id, this.serv_id, this.checkin_date, this.accountid);
        this.getQueuesbyLocationandServiceIdavailability(this.location_id, this.serv_id, this.accountid);
    }

    getQueuesbyLocationandServiceId(locid, servid, pdate?, accountid?) {
        // this.loading = true;
        this.queuejson = [];
        this.queueQryExecuted = false;
        if (locid && servid) {
            this.shared_services.getQueuesbyLocationandServiceId(locid, servid, pdate, accountid)
                .subscribe(data => {
                    this.queuejson = data;
                    // this.loading = false;
                    this.queueQryExecuted = true;
                    if (this.queuejson.length > 0) {
                        let selindx = 0;
                        for (let i = 0; i < this.queuejson.length; i++) {
                            if (this.queuejson[i]['queueWaitingTime'] !== undefined) {
                                selindx = i;
                            }
                        }
                        this.sel_queue_id = this.queuejson[selindx].id;
                        this.sel_queue_indx = selindx;
                        this.sel_queue_waitingmins = this.dateTimeProcessor.convertMinutesToHourMinute(this.queuejson[selindx].queueWaitingTime);
                        this.sel_queue_servicetime = this.queuejson[selindx].serviceTime || '';
                        this.sel_queue_name = this.queuejson[selindx].name;
                        this.sel_queue_personaahead = this.queuejson[this.sel_queue_indx].queueSize;
                        this.calc_mode = this.queuejson[this.sel_queue_indx].calculationMode;

                    } else {
                        this.sel_queue_indx = -1;
                        this.sel_queue_id = 0;
                        this.sel_queue_waitingmins = 0;
                        this.sel_queue_servicetime = '';
                        this.sel_queue_name = '';
                        this.sel_queue_timecaption = '';
                        this.sel_queue_personaahead = 0;
                    }
                });
        }
    }
    getQueuesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        if (locid && servid && accountid) {
            _this.shared_services.getQueuesbyLocationandServiceIdAvailableDates(locid, servid, accountid)
                .subscribe((data: any) => {
                    const availables = data.filter(obj => obj.isAvailable);
                    const availDates = availables.map(function (a) { return a.date; });
                    _this.availableDates = availDates.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    });
                });
        }
    }
}
