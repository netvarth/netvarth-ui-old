import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { projectConstants } from '../../../../app.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { NavigationExtras, Router } from '@angular/router';
import { CheckinDetailsSendComponent } from '../../check-ins/checkin-details-send/checkin-details-send.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../../check-ins/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { ApplyLabelComponent } from '../../check-ins/apply-label/apply-label.component';
import { LocateCustomerComponent } from '../../check-ins/locate-customer/locate-customer.component';
import * as moment from 'moment';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { SharedServices } from '../../../../shared/services/shared-services';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { GalleryImportComponent } from '../../../../shared/modules/gallery/import/gallery-import.component';
import { GalleryService } from '../../../../shared/modules/gallery/galery-service';
import { Subscription } from 'rxjs';
import { Messages } from '../../../../shared/constants/project-messages';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { ListRecordingsDialogComponent } from '../../../../shared/components/list-recordings-dialog/list-recordings-dialog.component';
import { ConfirmBoxComponent } from '../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { VoicecallConfirmBoxComponent } from '../../customers/confirm-box/voicecall-confirm-box.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-appointment-actions',
    templateUrl: './appointment-actions.component.html',
    styleUrls: ['./appointment-actions.component.css']
})
export class AppointmentActionsComponent implements OnInit {
    tooltipcls = '';
    elementType = 'url';
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
    labelMap = {};
    showCall;
    board_count;
    pos = false;
    showBill = false;
    showMsg = false;
    showAttachment = false;
    selectedTime = '';
    holdselectedTime = '';
    sel_checkindate;
    sel_schedule_id;
    servId;
    locId;
    schedules: any = [];
    availableSlots: any = [];
    freeSlots: any = [];
    hold_sel_checkindate;
    apptTime;
    today;
    minDate;
    maxDate;
    server_date;
    dateDisplayFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    loading = false;
    apptDate = '';
    domain;
    customer_label = '';
    showmrrx = false;
    pastDate;
    subdomain;
    availableDates: any = [];
    accountid;
    apiloading = false;
    galleryDialog: any;
    subscription: Subscription;
    checkinsByLabel: any = [];
    labelsforRemove: any = [];
    showApply = false;
    buttonClicked = false;
    accountType: any;
    changeService = true;
    check_in_statuses = projectConstants.CHECK_IN_STATUSES;
    meet_data: any;
    id: any;
    providerMeetingUrl: any;
    active_user: any;
    isUserdisable;
    userid: any;
    user_arr: any;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private provider_services: ProviderServices,
        public dateformat: DateFormatPipe, private dialog: MatDialog,
        private wordProcessor: WordProcessor,
        private lStorageService: LocalStorageService,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService,
        private galleryService: GalleryService,
        private dateTimeProcessor: DateTimeProcessor,
        private provider_shared_functions: ProviderSharedFuctions,
        public shared_services: SharedServices,
        private location: Location,
        public dialogRef: MatDialogRef<AppointmentActionsComponent>) {
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    }
    ngOnInit() {
        this.setMinMaxDate();
        this.getLabel();
        this.apiloading = true;
        this.appt = this.data.checkinData;
        if (!this.data.multiSelection) {
            this.getPos();
            this.setData();
        } else {
            this.showMsg = true;
            this.apiloading = false;
        }
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.accountType = user.accountType;
        this.domain = user.sector;
        this.subdomain = user.subSector;
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.active_user = user.userType;
        console.log(this.active_user)
        this.userid = user.id;
        this.subscription = this.galleryService.getMessage().subscribe(input => {
            if (input && input.uuid) {
                this.shared_services.addProviderAppointmentAttachment(input.uuid, input.value)
                    .subscribe(
                        () => {
                            this.snackbarService.openSnackBar(Messages.ATTACHMENT_SEND, { 'panelClass': 'snackbarnormal' });
                            this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
                        },
                        error => {
                            this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                            this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
                        }
                    );
            }
        });
        if (this.accountType === 'BRANCH') {
            this.getUser();
        }
    }
    getUser() {
        if(this.userid){
            this.provider_services.getUser(this.userid)
            .subscribe((data: any) => {
              this.user_arr = data;
              if( this.user_arr.status === 'ACTIVE'){
                  this.isUserdisable = true
              } else{
                  this.isUserdisable = false
              }
            }
            , error => {
          });
        }   
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    setData() {
        this.holdselectedTime = this.appt.appmtTime;
        if (this.data.timetype === 3) {
            this.pastDate = this.appt.appmtDate;
            this.sel_checkindate = this.hold_sel_checkindate = moment(this.today, 'YYYY-MM-DD HH:mm').format();
        } else {
            this.sel_checkindate = this.hold_sel_checkindate = this.appt.appmtDate;
        }
        this.sel_schedule_id = this.appt.schedule.id;
        this.servId = this.appt.service.id;
        this.locId = this.appt.location.id;
        this.accountid = this.appt.providerAccount.id;
    }
    printAppt() {
        this.dialogRef.close();
        const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
        let bname = '';
        if (bdetails) {
            bname = bdetails.bn || '';
        }
        const fname = (this.appt.appmtFor[0].firstName) ? this.appt.appmtFor[0].firstName : '';
        const lname = (this.appt.appmtFor[0].lastName) ? this.appt.appmtFor[0].lastName : '';
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
            if (fname !== '' || lname !== '') {
                checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + '</td><td>:</td><td>' + fname + ' ' + lname + '</td></tr>';
            } else {
                checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ' Id </td><td>:</td><td>' + this.appt.providerConsumer.jaldeeId + '</td></tr>';
            }
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
        return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
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
    rescheduleActionClicked() {
        this.action = 'reschedule';
    }
    changeSlot() {
        this.action = 'slotChange';
        this.selectedTime = '';
        this.getAppointmentSlots();
        this.getSchedulesbyLocationandServiceIdavailability(this.locId, this.servId, this.accountid);
    }
    goBacktoApptDtls() {
        this.action = 'reschedule';
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
        this.provider_services.getCustomerTrackStatusforAppointment(this.appt.uid).subscribe(data => {
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
    goToCheckinDetails() {
        this.router.navigate(['provider', 'appointments', this.appt.uid], { queryParams: { timetype: this.data.timetype } });
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
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
            this.dialogRef.close();
            if (result === 'reloadlist') { }
        });
    }
    changeWaitlistStatus(action) {
        if (action !== 'Rejected') {
            this.buttonClicked = true;
        }
        this.provider_shared_functions.changeWaitlistStatus(this, this.appt, action, 'appt');
    }
    changeWaitlistservice() {
        this.dialogRef.close();
        this.router.navigate(['provider', 'check-ins', this.appt.uid, 'user'], { queryParams: { source: 'appt' } });
    }
    removeProvider() {
        let msg = '';
        msg = 'Do you want to remove this ' + this.provider_label + '?';
        const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': msg,
                'type': 'yes/no'
            }
        });
        dialogrefd.afterClosed().subscribe(result => {
            if (result) {
                const post_data = {
                    'uid': this.appt.uid,
                    'provider': {
                        'id': this.appt.provider.id
                    },
                };
                this.provider_services.unassignUserAppointment(post_data)
                    .subscribe(
                        data => {
                            this.dialogRef.close('reload');
                        },
                        error => {
                            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            this.dialogRef.close('reload');
                        }
                    );
            }
        });
    }
    changeWaitlistStatusApi(waitlist, action, post_data = {}) {
        this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data)
            .then(
                result => {
                    this.dialogRef.close('reload');
                    this.buttonClicked = false;
                },
                error => {
                    this.buttonClicked = false;
                });
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
                },
                error => {
                    this.setActions();
                });
    }
    setActions() {
        this.apiloading = false;
        if (this.data.timetype !== 3 && this.appt.apptStatus !== 'Completed' && this.appt.apptStatus !== 'Confirmed' && this.appt.apptStatus !== 'blocked' && !this.data.teleservice && this.appt.paymentStatus !== 'FullyRefunded') {
            this.showUndo = true;
        }
        if (this.data.timetype === 1 && this.appt.apptStatus === 'Confirmed' && !this.appt.virtualService && !this.data.teleservice) {
            this.showArrived = true;
        }
        if ((this.appt.apptStatus === 'Arrived' || this.appt.apptStatus === 'Confirmed') && !this.data.teleservice) {
            this.showCancel = true;
        }
        if (this.data.timetype === 1 && this.appt.service.livetrack && this.appt.apptStatus === 'Confirmed' && this.appt.jaldeeApptDistanceTime && this.appt.jaldeeApptDistanceTime.jaldeeDistanceTime && (this.appt.jaldeeStartTimeType === 'ONEHOUR' || this.appt.jaldeeStartTimeType === 'AFTERSTART')) {
            this.trackStatus = true;
        }
        if (this.data.timetype !== 3 && this.appt.apptStatus !== 'Cancelled' && this.appt.apptStatus !== 'Rejected' && (this.appt.providerConsumer.email || this.appt.providerConsumer.phoneNo)) {
            this.showSendDetails = true;
        }
        if (this.appt.providerConsumer.email || (this.appt.providerConsumer.phoneNo && this.appt.providerConsumer.phoneNo !== 'null')) {
            this.showMsg = true;
        }
        if ((this.appt.apptStatus === 'Arrived' || this.appt.apptStatus === 'Confirmed') && this.data.timetype !== 2 && (!this.appt.virtualService) && !this.data.teleservice) {
            this.showStart = true;
        }
        if ((this.data.timetype === 1 || (this.data.timetype === 3 && this.appt.service.virtualCallingModes && this.appt.service.virtualCallingModes[0].callingMode !== 'VideoCall')) && this.appt.virtualService && (this.appt.apptStatus === 'Arrived' || this.appt.apptStatus === 'Confirmed' || this.appt.apptStatus === 'Started') && !this.data.teleservice) {
            this.showTeleserviceStart = true;
        }
        if (this.board_count > 0 && this.data.timetype === 1 && !this.appt.virtualService && (this.appt.apptStatus === 'Confirmed' || this.appt.apptStatus === 'Arrived') && !this.data.teleservice) {
            this.showCall = true;
        }
        if (this.pos && this.appt.apptStatus !== 'blocked' && ((this.appt.apptStatus !== 'Cancelled' && this.appt.apptStatus !== 'Rejected') || ((this.appt.apptStatus === 'Cancelled' || this.appt.apptStatus === 'Rejected') && this.appt.paymentStatus !== 'NotPaid'))) {
            this.showBill = true;
        }
        if (this.data.timetype !== 2 && this.appt.apptStatus !== 'blocked' && (this.appt.apptStatus !== 'Cancelled' && this.appt.apptStatus !== 'Rejected')) {
            this.showmrrx = true;
        }
        if (this.appt.providerConsumer.email || this.appt.providerConsumer.phoneNo) {
            this.showAttachment = true;
        }
        if (this.data.timetype === 3) {
            this.changeService = false;
        }
    }
    getLabel() {
        this.loading = true;
        this.providerLabels = [];
        this.provider_services.getLabelList().subscribe((data: any) => {
            this.providerLabels = data.filter(label => label.status === 'ENABLED');
            this.loading = false;
            if (!this.data.multiSelection) {
                this.labelselection();
            } else {
                this.multipleLabelselection();
            }
        });
    }
    deleteLabel() {
        let ids = [];
        if (this.data.multiSelection) {
            for (let label of this.labelsforRemove) {
                ids = ids.concat(this.checkinsByLabel[label]);
            }
        } else {
            ids.push(this.appt.uid);
        }
        const postData = {
            'labelNames': this.labelsforRemove,
            'uuid': ids
        };
        this.provider_services.deleteLabelFromMultipleAppt(postData).subscribe(data => {
            this.dialogRef.close('reload');
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
                this.labelMap = new Object();
                this.labelMap[data.label] = data.value;
                this.addLabel();
                this.getDisplayname(data.label);
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
        const ids = [];
        if (this.data.multiSelection) {
            for (const checkin of this.appt) {
                ids.push(checkin.uid);
            }
        } else {
            ids.push(this.appt.uid);
        }
        const postData = {
            'labels': this.labelMap,
            'uuid': ids
        };
        this.provider_services.addLabeltoMultipleAppt(postData).subscribe(data => {
            this.dialogRef.close('reload');
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    gotoMeet() {
        this.dialogRef.close();
        const customerDetails = this.appt.appmtFor[0];
        const customerId = customerDetails.id;
        this.provider_services.meetReady(customerId).subscribe(data => {
            this.meet_data = data;
                this.providerMeetingUrl = this.meet_data.providerMeetingUrl;
                  // this.subs.sink = observableInterval(this.refreshTime * 500).subscribe(() => {
                //     this.getMeetingStatus();
                // });
                const retcheckarr = this.providerMeetingUrl.split('/');
                this.id = retcheckarr[4]
                const navigationExtras: NavigationExtras = {
                    queryParams: { custId: customerId }
                };
                 // const path = 'meet/' + this.id ;
                // window.open(path, '_blank');
                this.router.navigate(['meet', this.id], navigationExtras);
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    startVoiceCall() {
        this.closeDialog();
        const customerDetails = this.appt.appmtFor[0];
        const customerId = customerDetails.id;
        this.provider_services.voiceCallReady(customerId).subscribe(data => {
            this.voiceCallConfirm()
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    voiceCallConfirm() {
        const dialogref = this.dialog.open(VoicecallConfirmBoxComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
          disableClose: true,
          data: {
            // profile: this.profile
          }
        });
        dialogref.afterClosed().subscribe(
          result => {
            this.location.back();
            // if (result) {
            // }
          }
        );
      }
      closeDialog() {
        this.dialogRef.close();
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
        this.router.navigate(['provider', 'settings', 'general', 'labels'], { queryParams: { source: 'appt' } });
        this.dialogRef.close();
    }
    goBack() {
        this.action = '';
    }
    callingAppt() {
        const status = (this.appt.callingStatus) ? 'Disable' : 'Enable';
        this.provider_services.setApptCallStatus(this.appt.uid, status).subscribe(
            () => {
                this.dialogRef.close('reload');
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
        },
            error => {
                this.getDisplayboardCount();
            });
    }
    rescheduleAppointment() {
        if (moment(this.sel_checkindate).format('YYYY-MM-DD') === moment(this.server_date).format('YYYY-MM-DD')) {
            this.apptDate = 'Today, ' + this.getSingleTime(this.apptTime['time']);
        } else {
            this.apptDate = moment(this.sel_checkindate).format('DD-MM-YYYY') + ', ' + this.getSingleTime(this.apptTime['time']);
        }
        const data = {
            'uid': this.appt.uid,
            'time': this.apptTime['time'],
            'date': moment(this.sel_checkindate).format('YYYY-MM-DD'),
            'schedule': this.apptTime['scheduleId']
        };
        this.provider_services.rescheduleProviderAppointment(data)
            .subscribe(
                () => {
                    this.snackbarService.openSnackBar('Appointment rescheduled to ' + this.dateformat.transformToMonthlyDate(this.sel_checkindate));
                    this.dialogRef.close('reload');
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    timeSelected(slot) {
        this.apptTime = slot;
        this.selectedTime = slot.time;
    }
    getAppointmentSlots() {
        this.freeSlots = [];
        this.loading = true;
        this.provider_services.getSlotsByLocationServiceandDate(this.locId, this.servId, this.sel_checkindate).subscribe(data => {
            this.schedules = data;
            this.loading = false;
            for (const scheduleSlots of this.schedules) {
                this.availableSlots = scheduleSlots.availableSlots;
                for (const freslot of this.availableSlots) {
                    if (freslot.noOfAvailbleSlots !== '0' && freslot.active) {
                        freslot['scheduleId'] = scheduleSlots['scheduleId'];
                        freslot['displayTime'] = this.getSingleTime(freslot.time);
                        this.freeSlots.push(freslot);
                    }
                }
            }
            this.apptTime = this.freeSlots[0];
        });
    }
    disableMinus() {
        const seldate1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
        const seldate = new Date(seldate2);
        const selecttdate = new Date(seldate.getFullYear() + '-' + this.dateTimeProcessor.addZero(seldate.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(seldate.getDate()));
        const strtDt1 = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
        const strtDt = new Date(strtDt2);
        const startdate = new Date(strtDt.getFullYear() + '-' + this.dateTimeProcessor.addZero(strtDt.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(strtDt.getDate()));
        if (startdate >= selecttdate) {
            return true;
        } else {
            return false;
        }
    }
    calculateDate(days, type) {
        const dte = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
        const newdate = new Date(date);
        const newdate1 = new Date(date);
        newdate.setDate(newdate.getDate() + days);
        const dd = newdate.getDate();
        const mm = newdate.getMonth() + 1;
        const y = newdate.getFullYear();
        const dd1 = newdate1.getDate();
        const mm1 = newdate1.getMonth() + 1;
        const y1 = newdate1.getFullYear();
        const ndate1 = y + '-' + mm + '-' + dd;
        const ndate2 = y1 + '-' + mm1 + '-' + dd1;
        const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
        const ndate3 = moment(ndate2, 'YYYY-MM-DD HH:mm').format();
        const strtDt = new Date(ndate3);
        const nDt = new Date(ndate);
        this.selectedTime = '';
        if (type === 'pre') {
            if (strtDt.getTime() >= nDt.getTime()) {
                this.sel_checkindate = ndate;
                this.getAppointmentSlots();
            }
        } else {
            if (nDt.getTime() >= strtDt.getTime()) {
                this.sel_checkindate = ndate;
                this.getAppointmentSlots();
            }
        }
    }
    setMinMaxDate() {
        this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.today = new Date(this.today);
        this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.minDate = new Date(this.minDate);
        this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
    }
    handleFutureDateChange(e) {
        const tdate = e.targetElement.value;
        const newdate = tdate.split('/').reverse().join('-');
        const futrDte = new Date(newdate);
        const obtmonth = (futrDte.getMonth() + 1);
        let cmonth = '' + obtmonth;
        if (obtmonth < 10) {
            cmonth = '0' + obtmonth;
        }
        const seldate = futrDte.getFullYear() + '-' + cmonth + '-' + futrDte.getDate();
        this.sel_checkindate = seldate;
        this.getAppointmentSlots();
        this.getSchedulesbyLocationandServiceIdavailability(this.locId, this.servId, this.accountid);
    }
    disableButn() {
        if ((moment(this.sel_checkindate).format('YYYY-MM-DD') === this.hold_sel_checkindate && this.selectedTime === this.holdselectedTime) || this.selectedTime === '') {
            return true;
        } else {
            return false;
        }
    }
    close() {
        this.dialogRef.close();
    }
    addLabeltoAppt(label, event) {
        this.showApply = false;
        let labelArr = this.providerLabels.filter(lab => lab.label === label);
        if (this.labelMap[label]) {
            delete this.labelMap[label];
        }
        if (this.labelsforRemove.indexOf(label) !== -1) {
            this.labelsforRemove.splice(this.labelsforRemove.indexOf(label), 1);
        }
        if (event.checked) {
            if (labelArr[0] && labelArr[0].selected) {
            } else {
                this.labelMap[label] = true;
            }
        } else {
            if (labelArr[0] && labelArr[0].selected) {
                this.labelsforRemove.push(label);
            }
        }
        if (Object.keys(this.labelMap).length > 0 || this.labelsforRemove.length > 0) {
            this.showApply = true;
        }
    }
    labelselection() {
        const values = [];
        if (this.appt.label && Object.keys(this.appt.label).length > 0) {
            Object.keys(this.appt.label).forEach(key => {
                values.push(key);
            });
            for (let i = 0; i < this.providerLabels.length; i++) {
                for (let k = 0; k < values.length; k++) {
                    if (this.providerLabels[i].label === values[k]) {
                        this.providerLabels[i].selected = true;
                    }
                }
            }
        }
    }
    multipleLabelselection() {
        let values = [];
        this.checkinsByLabel = [];
        for (let i = 0; i < this.appt.length; i++) {
            if (this.appt[i].label) {
                Object.keys(this.appt[i].label).forEach(key => {
                    values.push(key);
                    if (!this.checkinsByLabel[key]) {
                        this.checkinsByLabel[key] = [];
                    }
                    this.checkinsByLabel[key].push(this.appt[i].uid);
                });
            }
        }
        for (let i = 0; i < this.providerLabels.length; i++) {
            for (let k = 0; k < values.length; k++) {
                const filteredArr = values.filter(value => value === this.providerLabels[i].label);
                if (filteredArr.length === this.appt.length) {
                    this.providerLabels[i].selected = true;
                }
            }
        }
    }
    medicalRecord() {
        this.dialogRef.close();

        let mrId = 0;
        if (this.appt.mrId) {
            mrId = this.appt.mrId;
        }

        const customerDetails = this.appt.appmtFor[0];
        const customerId = customerDetails.id;
        const bookingId = this.appt.uid;
        const bookingType = 'APPT';
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'clinicalnotes'], { queryParams: { 'calledfrom': 'appt' } });

    }
    prescription() {
        this.dialogRef.close();

        let mrId = 0;
        if (this.appt.mrId) {
            mrId = this.appt.mrId;
        }

        const customerDetails = this.appt.appmtFor[0];
        const customerId = customerDetails.id;
        const bookingId = this.appt.uid;
        const bookingType = 'APPT';
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription'], { queryParams: { 'calledfrom': 'appt' } });
    }
    gotoCustomerDetails() {
        this.dialogRef.close();
        this.router.navigate(['/provider/customers/' + this.appt.appmtFor[0].id]);
    }
    addCustomerDetails() {
        this.dialogRef.close();
        let virtualServicemode;
        let virtualServicenumber;
        if (this.appt.virtualService) {
            Object.keys(this.appt.virtualService).forEach(key => {
                virtualServicemode = key;
                virtualServicenumber = this.appt.virtualService[key];
            });
        }
        this.router.navigate(['provider', 'appointments', 'appointment'], { queryParams: { source: 'appt-block', uid: this.appt.uid, virtualServicemode: virtualServicemode, virtualServicenumber: virtualServicenumber, serviceId: this.appt.service.id, apptMode: this.appt.appointmentMode } });
    }
    unBlockAppt() {
        this.provider_services.deleteAppointmentBlock(this.appt.uid)
            .subscribe(
                () => {
                    this.dialogRef.close('reload');
                    this.router.navigate(['provider', 'appointments']);
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    getSchedulesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        if (locid && servid && accountid) {
            _this.shared_services.getProviderAvailableDatessByLocationService(locid, servid, accountid)
                .subscribe((data: any) => {
                    const availables = data.filter(obj => obj.availableSlots);
                    const availDates = availables.map(function (a) { return a.date; });
                    _this.availableDates = availDates.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    });
                });
        }
    }
    dateClass(date: Date): MatCalendarCellCssClasses {
        return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    }
    sendimages() {
        this.galleryDialog = this.dialog.open(GalleryImportComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                source_id: 'attachment',
                uid: this.appt.uid
            }
        });
        this.galleryDialog.afterClosed().subscribe(result => {
            this.dialogRef.close('reload');
        })
    }
    applyLabel() {
        if (Object.keys(this.labelMap).length > 0) {
            this.addLabel();
        }
        if (this.labelsforRemove.length > 0) {
            this.deleteLabel();
        }
    }
    gotoQuestionnaire(booking) {
        this.dialogRef.close();
        const navigationExtras: NavigationExtras = {
            queryParams: {
                uuid: booking.uid,
                type: 'proAppt'
            }
        };
        this.router.navigate(['provider', 'appointments', 'questionnaire'], navigationExtras);
    }
    viewRecordings() {
        this.dialogRef.close();
        const smsdialogRef = this.dialog.open(ListRecordingsDialogComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                recordingUrls: this.appt.s3VideoUrls
            }
        });
        smsdialogRef.afterClosed().subscribe(result => {
        });
    }
    getStatusLabel(status) {
        const label_status = this.wordProcessor.firstToUpper(this.wordProcessor.getTerminologyTerm(status));
        return label_status;
    }
    changeWaitlistStatusAction() {
        this.action = 'status';
    }
    assignMyself() {
        let msg = '';
        msg = 'Are you sure you want to assign this appointment to yourself ?';
        const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': msg,
                'type': 'yes/no'
            }
        });
        dialogrefd.afterClosed().subscribe(result => {
            console.log("Result:",result)
            console.log(this.appt.uid)
                console.log(this.userid)
            if (result) {
                console.log(this.appt.uid)
                console.log(this.userid)
                const post_data = {
                    'uid': this.appt.uid,
                    'provider': {
                        'id': this.userid
                    },
                };
                console.log(post_data)
                this.provider_services.updateUserAppointment(post_data)
                    .subscribe(
                        data => {
                            this.dialogRef.close('reload');
                        },
                        error => {
                            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            this.dialogRef.close('reload');
                        }
                    );
            }
        });
    }
}
