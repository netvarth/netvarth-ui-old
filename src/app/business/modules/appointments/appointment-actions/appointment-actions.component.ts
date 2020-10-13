import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../app.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { NavigationExtras, Router } from '@angular/router';
import { CheckinDetailsSendComponent } from '../../check-ins/checkin-details-send/checkin-details-send.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../../check-ins/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { ApplyLabelComponent } from '../../check-ins/apply-label/apply-label.component';
import { LocateCustomerComponent } from '../../check-ins/locate-customer/locate-customer.component';

@Component({
  selector: 'app-appointment-actions',
  templateUrl: './appointment-actions.component.html',
  styleUrls: ['./appointment-actions.component.css']
})
export class AppointmentActionsComponent implements OnInit {
  appt;
  provider_label = '';
  qr_value;
  path = projectConstants.PATH;
  showQR = false;
  trackDetail: any = [];
  customerMsg;
  historyCheckins: any = [];
  history_waitlist_count: any = [];
  trackStatus = false;
  showArrived = false;
  showUndo = false;
  showCancel = false;
  showSendDetails = false;
  showStart = false;
  showTeleserviceStart = false;
  action = '';
  providerLabels: any = [];
  labelMap;
  showCall;
  board_count;
  pos = false;
  showBill = false;
  showMsg = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    private shared_functions: SharedFunctions, private provider_services: ProviderServices,
    public dateformat: DateFormatPipe, private dialog: MatDialog,
    private provider_shared_functions: ProviderSharedFuctions,
    public dialogRef: MatDialogRef<AppointmentActionsComponent>) {
  }
  ngOnInit() {
    console.log(JSON.stringify(this.data));
    this.appt = this.data.checkinData;
    this.getPos();
    this.getLabel();
    this.provider_label = this.shared_functions.getTerminologyTerm('provider');
  }

  printAppt() {
    this.dialogRef.close();
    const bdetails = this.shared_functions.getitemFromGroupStorage('ynwbp');
    let bname = '';
    if (bdetails) {
      bname = bdetails.bn || '';
    }
    const _this = this;
    _this.qrCodegeneration(this.appt);
    setTimeout(() => {
      const printContent = document.getElementById('print-section');
      const params = [
        'height=' + screen.height,
        'width=' + screen.width,
        'fullscreen=yes'
      ].join(',');
      const printWindow = window.open('', '', params);
      let checkin_html = '';
      checkin_html += '<table style="width:100%;"><thead>';
      checkin_html += '<tr><td colspan="3" style="border-bottom: 1px solid #eee;text-align:center;line-height:30px;font-size:1.25rem">' + this.dateformat.transformToDIsplayFormat(this.appt.appmtDate) + '<br/>';
      if (this.appt.batchId) {
        checkin_html += 'Batch <span style="font-weight:bold">' + this.appt.batchId + '</span>';
      } else {
        checkin_html += 'Appointment Time <span style="font-weight:bold">' + this.getSingleTime(this.appt.appmtTime) + '</span>';
      }
      checkin_html += '</td></tr>';
      checkin_html += '<tr><td colspan="3" style="text-align:center">' + bname.charAt(0).toUpperCase() + bname.substring(1) + '</td></tr>';
      checkin_html += '<tr><td colspan="3" style="text-align:center">' + this.appt.location.place + '</td></tr>';
      checkin_html += '</thead><tbody>';
      checkin_html += '<tr><td width="48%" align="right">Customer</td><td>:</td><td>' + this.appt.appmtFor[0].firstName + ' ' + this.appt.appmtFor[0].lastName + '</td></tr>';
      if (this.appt.service && this.appt.service.deptName) {
        checkin_html += '<tr><td width="48%" align="right">Department</td><td>:</td><td>' + this.appt.service.deptName + '</td></tr>';
      }
      checkin_html += '<tr><td width="48%" align="right">Service</td><td>:</td><td>' + this.appt.service.name + '</td></tr>';
      if (this.appt.provider && this.appt.provider.firstName && this.appt.provider.lastName) {
        checkin_html += '<tr><td width="48%" align="right">' + this.provider_label.charAt(0).toUpperCase() + this.provider_label.substring(1) + '</td><td>:</td><td>' + this.appt.provider.firstName.charAt(0).toUpperCase() + this.appt.provider.firstName.substring(1) + ' ' + this.appt.provider.lastName + '</td></tr>';
      }
      checkin_html += '<tr><td width="48%" align="right">schedule</td><td>:</td><td>' + this.appt.schedule.name + ' [' + this.appt.schedule.apptSchedule.timeSlots[0].sTime + ' - ' + this.appt.schedule.apptSchedule.timeSlots[0].eTime + ']' + '</td></tr>';
      checkin_html += '<tr><td colspan="3" align="center">' + printContent.innerHTML + '</td></tr>';
      checkin_html += '<tr><td colspan="3" align="center">Scan to know your status or log on to ' + this.qr_value + '</td></tr>';
      checkin_html += '</tbody></table>';
      printWindow.document.write('<html><head><title></title>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(checkin_html);
      printWindow.document.write('</body></html>');
      _this.showQR = false;
      printWindow.moveTo(0, 0);
      printWindow.print();
    });
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.shared_functions.convert24HourtoAmPm(slots[0]);
  }
  qrCodegeneration(valuetogenerate) {
    this.qr_value = this.path + 'status/' + valuetogenerate.appointmentEncId;
    this.showQR = true;
  }
  addConsumerInboxMessage() {
    let checkin = [];
    if (this.data.multiSelection) {
      checkin = this.appt;
    } else {
      checkin.push(this.appt);
    }
    this.dialogRef.close();
    this.provider_shared_functions.addConsumerInboxMessage(checkin, this, 'appt')
      .then(
        () => { },
        () => { }
      );
  }
  smsCheckin() {
    this.dialogRef.close();
    const smsdialogRef = this.dialog.open(CheckinDetailsSendComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        qdata: this.appt,
        uuid: this.appt.uid,
        chekintype: 'appointment'
      }
    });
    smsdialogRef.afterClosed().subscribe(result => {
    });
  }
  locateCustomer() {
    this.dialogRef.close();
    this.provider_services.getCustomerTrackStatus(this.appt.uid).subscribe(data => {
      this.trackDetail = data;
      this.customerMsg = this.locateCustomerMsg(this.trackDetail);
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
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
  goToCheckinDetails() {
    this.router.navigate(['provider', 'appointments', this.appt.uid]);
    this.dialogRef.close();
  }
  viewBillPage() {
    this.provider_services.getWaitlistBill(this.appt.uid)
      .subscribe(
        data => {
          this.router.navigate(['provider', 'bill', this.appt.uid], { queryParams: { source: 'appt' } });
          this.dialogRef.close();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  addProviderNote() {
    this.dialogRef.close();
    const addnotedialogRef = this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin_id: this.appt.uid,
        source: 'appt'
      }
    });
    addnotedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') { }
    });
  }
  changeWaitlistStatus(action) {
    // if (action === 'Rejected') {
    //     this.dialogRef.close();
    // }
    this.provider_shared_functions.changeWaitlistStatus(this, this.appt, action, 'appt');
  }
  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data)
      .then(
        result => {
          this.dialogRef.close();
        }
      );
  }
  getDisplayboardCount() {
    let layout_list: any = [];
    let displayboards: any = [];
    this.provider_services.getDisplayboardsAppointment()
      .subscribe(
        data => {
          displayboards = data;
          layout_list = displayboards.filter(displayboard => !displayboard.isContainer);
          this.board_count = layout_list.length;
          this.setActions();
        });
  }
  setActions() {
    if (!this.data.multiSelection) {
      if (this.data.timetype !== 3 && this.appt.apptStatus !== 'Completed' && this.appt.apptStatus !== 'Confirmed') {
        this.showUndo = true;
      }
      if (this.data.timetype === 1 && this.appt.apptStatus === 'Confirmed' && !this.appt.virtualService) {
        this.showArrived = true;
      }
      if (this.appt.apptStatus === 'Arrived' || this.appt.apptStatus === 'Confirmed') {
        this.showCancel = true;
      }
      if (this.data.timetype === 1 && this.appt.apptStatus === 'Confirmed' && this.appt.jaldeeWaitlistDistanceTime && this.appt.jaldeeWaitlistDistanceTime.jaldeeDistanceTime && (this.appt.jaldeeStartTimeType === 'ONEHOUR' || this.appt.jaldeeStartTimeType === 'AFTERSTART')) {
        this.trackStatus = true;
      }
      if (this.data.timetype !== 3 && this.appt.apptStatus !== 'Cancelled' && this.appt.apptStatus !== 'Rejected' && (this.appt.providerConsumer.email || this.appt.providerConsumer.phoneNo)) {
        this.showSendDetails = true;
      }
      if (this.appt.providerConsumer.email || this.appt.providerConsumer.phoneNo) {
        this.showMsg = true;
      }
      if ((this.appt.apptStatus === 'Arrived' || this.appt.apptStatus === 'Confirmed') && this.data.timetype !== 2 && (!this.appt.virtualService)) {
        this.showStart = true;
      }
      if ((this.data.timetype === 1 || this.data.timetype === 3) && this.appt.virtualService && (this.appt.apptStatus === 'Arrived' || this.appt.apptStatus === 'Confirmed' || this.appt.apptStatus === 'Started')) {
        this.showTeleserviceStart = true;
      }
      if (this.board_count > 0 && this.data.timetype === 1 && !this.appt.virtualService && (this.appt.apptStatus === 'Confirmed' || this.appt.apptStatus === 'Arrived')) {
        this.showCall = true;
      }
      if (this.pos && ((this.appt.apptStatus !== 'Cancelled' && this.appt.apptStatus !== 'Rejected') || ((this.appt.apptStatus === 'cancelled' || this.appt.apptStatus === 'Rejected') && this.appt.paymentStatus !== 'NotPaid'))) {
        this.showBill = true;
      }
    }
  }
  getLabel() {
    this.providerLabels = [];
    this.provider_services.getLabelList().subscribe(data => {
      this.providerLabels = data;
    });
  }
  changeLabelvalue(labelname, value) {
    this.labelMap = new Object();
    this.labelMap[labelname] = value;
    for (let i = 0; i < this.providerLabels.length; i++) {
      for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
        if (this.providerLabels[i].valueSet[j].value === value) {
          if (!this.providerLabels[i].valueSet[j].selected) {
            this.providerLabels[i].valueSet[j].selected = true;
            this.addLabel();
          } else {
            this.providerLabels[i].valueSet[j].selected = false;
            this.deleteLabel(labelname, this.appt.uid);
          }
        } else {
          if (this.providerLabels[i].label === labelname) {
            this.providerLabels[i].valueSet[j].selected = false;
          }
        }
      }
    }
  }
  deleteLabel(label, checkinId) {
    this.provider_services.deleteLabelfromAppointment(checkinId, label).subscribe(data => {
      this.dialogRef.close();
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  addLabelvalue(source, label?) {
    const labeldialogRef = this.dialog.open(ApplyLabelComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        checkin: this.appt,
        source: source,
        label: label
      }
    });
    labeldialogRef.afterClosed().subscribe(data => {
      if (data) {
        setTimeout(() => {
          this.labels();
          this.labelMap = new Object();
          this.labelMap[data.label] = data.value;
          this.addLabel();
          this.getDisplayname(data.label);
        }, 500);
      }
      this.getLabel();
    });
  }
  getDisplayname(label) {
    for (let i = 0; i < this.providerLabels.length; i++) {
      if (this.providerLabels[i].label === label) {
        return this.providerLabels[i].displayName;
      }
    }
  }
  addLabel() {
    this.provider_services.addLabeltoAppointment(this.appt.uid, this.labelMap).subscribe(data => {
      this.dialogRef.close();
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  labels() {
    for (let i = 0; i < this.providerLabels.length; i++) {
      for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
        this.providerLabels[i].valueSet[j].selected = false;
      }
    }
    setTimeout(() => {
      const values = [];
      if (this.appt.label) {
        for (const value of Object.values(this.appt.label)) {
          values.push(value);
        }
        for (let i = 0; i < this.providerLabels.length; i++) {
          for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
            for (let k = 0; k < values.length; k++) {
              if (this.providerLabels[i].valueSet[j].value === values[k]) {
                this.providerLabels[i].valueSet[j].selected = true;
              }
            }
          }
        }
      }
    }, 100);
  }
  showLabels() {
    this.action = 'label';
  }
  gotoLabel() {
    this.router.navigate(['provider', 'settings', 'general', 'labels']);
    this.dialogRef.close();
  }
  goBack() {
    this.action = '';
  }
  callingAppt() {
    const status = (this.appt.callingStatus) ? 'Disable' : 'Enable';
    this.provider_services.setApptCallStatus(this.appt.uid, status).subscribe(
      () => {
        this.dialogRef.close();
      });
  }
  showCallingModes(modes) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        waiting_id: modes.uid,
        type: 'appt'
      }
    };
    this.router.navigate(['provider', 'telehealth'], navigationExtras);
    this.dialogRef.close();
  }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
      this.getDisplayboardCount();
    });
  }
  medicalRecord() {
    this.dialogRef.close();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'customerDetail': JSON.stringify(this.appt.providerConsumer),
        'serviceId': this.appt.service.id,
        'serviceName': this.appt.service.name,
        'booking_type': 'Appointment',
        'booking_date': this.appt.appmtDate,
        'booking_time': this.appt.appmtTime
        // data2 variable used To declare breadcrumbs in License & Invoice ..>Invoice / Statement(@shiva)

      }
    };

     this.router.navigate(['provider', 'medicalrecord'], navigationExtras);
  }
}
