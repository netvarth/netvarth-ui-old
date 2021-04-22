import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CheckinDetailsSendComponent } from '../../../check-ins/checkin-details-send/checkin-details-send.component';
import { LocateCustomerComponent } from '../../../check-ins/locate-customer/locate-customer.component';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { projectConstants } from '../../../../../app.component';

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

  constructor(
    private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    private provider_shared_functions: ProviderSharedFuctions,
    private dialog: MatDialog,
    private router: Router,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<ServiceActionsComponent>
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
callingWaitlist() {
    if(this.bookingType == 'checkin'){
        const status = (this.waitlist_data.callingStatus) ? 'Disable' : 'Enable';
    this.provider_services.setCallStatus(this.waitlist_data.ynwUuid, status).subscribe(
        () => {
            // this.dialogRef.close('reload');
        });
    }else if(this.bookingType == 'appointment'){

    }
    
}
changeWaitlistStatus(action) {
    if (action !== 'CANCEL') {
        // this.dialogRef.close();
        // this.buttonClicked = true;
    }
    this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, action);
}
smsCheckin() {
    this.dialogRef.close();
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
changeAppnmtStatus(action) {
    if (action !== 'Rejected') {
        // this.buttonClicked = true;
    }
    this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, action, 'appt');
}
smsApptmnt() {
    this.dialogRef.close();
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
}
