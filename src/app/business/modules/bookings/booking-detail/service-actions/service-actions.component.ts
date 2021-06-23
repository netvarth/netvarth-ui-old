import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProviderSharedFuctions } from '../../../../../ynw_provider/shared/functions/provider-shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { MatDialog } from '@angular/material/dialog';
import { CheckinDetailsSendComponent } from '../../../check-ins/checkin-details-send/checkin-details-send.component';
import { LocateCustomerComponent } from '../../../check-ins/locate-customer/locate-customer.component';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { projectConstants } from '../../../../../app.component';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { CheckinActionsComponent } from '../../../check-ins/checkin-actions/checkin-actions.component';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { AppointmentActionsComponent } from '../../../appointments/appointment-actions/appointment-actions.component';
import { Subscription } from 'rxjs';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { GalleryImportComponent } from '../../../../../shared/modules/gallery/import/gallery-import.component';
import { Messages } from '../../../../../shared/constants/project-messages';
import { GalleryService } from '../../../../../shared/modules/gallery/galery-service';
import { ConfirmBoxComponent } from '../../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format/date-format.pipe';

@Component({
    selector: 'app-service-actions',
    templateUrl: './service-actions.component.html',
    styleUrls: ['./service-actions.component.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
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
    showComplete = false;
    showMsg = false;
    board_count;
    pos = false;
    showBill = false;
    showAttachment = false;
    showCall;
    showmrrx = false;
    showAssign = false;
    trackDetail: any = [];
    customerMsg;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    subscription: Subscription;
    gallerySubscription: Subscription;
    active_user;
    customer_label: any;
    provider_label: any;
    qr_value;
    path = projectConstants.PATH;
    showQR = false;
    elementType = 'url';
    isUserdisable = false;
    @ViewChild('closebutton') closebutton;
    constructor(private groupService: GroupStorageService,
        private activated_route: ActivatedRoute,
        private provider_services: ProviderServices,
        private provider_shared_functions: ProviderSharedFuctions,
        private dialog: MatDialog,
        private router: Router,
        private snackbarService: SnackbarService,
        public shared_services: SharedServices,
        private dateTimeProcessor: DateTimeProcessor,
        private sharedFunctions: SharedFunctions,
        private wordProcessor: WordProcessor,
        private galleryService: GalleryService,
        public dateformat: DateFormatPipe
    ) {
        this.activated_route.queryParams.subscribe(params => {
            this.bookingType = params.type;
            this.timeType = JSON.parse(params.timetype);
        });
        this.subscription = this.sharedFunctions.getMessage().subscribe((message) => {
            switch (message.type) {
                case 'statuschange':
                    this.setActions();
                    break;
            }
        });
        this.gallerySubscription = this.galleryService.getMessage().subscribe(input => {
            if (input && input.uuid) {
                if (this.bookingType === 'checkin') {
                    this.shared_services.addProviderWaitlistAttachment(input.uuid, input.value)
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
                } else {
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
            }
        });
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.gallerySubscription) {
            this.gallerySubscription.unsubscribe();
        }
    }
    ngOnInit(): void {
        this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.setActions();
    }
    setActions() {
        if (this.bookingType === 'checkin') {
            if (this.timeType !== 3 && this.waitlist_data.waitlistStatus !== 'done' && this.waitlist_data.waitlistStatus !== 'checkedIn' && this.waitlist_data.waitlistStatus !== 'blocked') {
                this.showUndo = true;
            }
            if (this.timeType === 1 && this.waitlist_data.waitlistStatus === 'checkedIn' && Object.keys(this.waitlist_data.virtualService).length === 0 && this.waitlist_data.virtualService.constructor === Object) {
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
            if ((this.waitlist_data.waitlistStatus == 'started' || this.waitlist_data.waitlistStatus == 'arrived' || this.waitlist_data.waitlistStatus == 'checkedIn') && this.timeType !== 2) {
                this.showComplete = true;
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
            if (this.waitlist_data.waitlistStatus !== 'blocked' && (this.waitlist_data.waitlistingFor[0].phoneNo && this.waitlist_data.waitlistingFor[0].phoneNo !== 'null') || this.waitlist_data.waitlistingFor[0].email) {
                this.showAttachment = true;
            }
            if (this.active_user.accountType == 'BRANCH' && (this.waitlist_data.waitlistStatus === 'arrived' || this.waitlist_data.waitlistStatus === 'checkedIn')) {
                this.showAssign = true;
                this.getUser();
            }
        } else {
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
            if (this.timeType !== 3 && this.waitlist_data.apptStatus !== 'Cancelled' && this.waitlist_data.apptStatus !== 'Rejected' && this.waitlist_data.providerConsumer && (this.waitlist_data.providerConsumer.email || this.waitlist_data.providerConsumer.phoneNo)) {
                this.showSendDetails = true;
            }
            if (this.waitlist_data.providerConsumer.email || this.waitlist_data.providerConsumer.phoneNo) {
                this.showMsg = true;
            }
            if ((this.waitlist_data.apptStatus === 'Arrived' || this.waitlist_data.apptStatus === 'Confirmed') && this.timeType !== 2 && (!this.waitlist_data.virtualService)) {
                this.showStart = true;
            }
            if ((this.waitlist_data.apptStatus == 'Started' || this.waitlist_data.apptStatus == 'Arrived' || this.waitlist_data.apptStatus == 'Confirmed') && this.timeType !== 2) {
                this.showComplete = true;
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
            if (this.active_user.accountType == 'BRANCH' && (this.waitlist_data.apptStatus === 'Arrived' || this.waitlist_data.apptStatus === 'Confirmed')) {
                this.showAssign = true;
                this.getUser();
            }
        }
    }
    callingWaitlist() {
        if (this.bookingType == 'checkin') {
            const status = (this.waitlist_data.callingStatus) ? 'Disable' : 'Enable';
            this.provider_services.setCallStatus(this.waitlist_data.ynwUuid, status).subscribe(
                () => {

                });
        } else {
            this.callingAppt();
        }
    }
    changeWaitlistStatus(action) {
        if (this.bookingType == 'checkin') {
            this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, action);
        } else if (this.bookingType == 'appointment') {
            if (action === 'STARTED') {
                action = 'Started';
            }
            if (action === 'CANCEL') {
                action = 'Cancelled';
            }
            if (action === 'REPORT') {
                action = 'Arrived';
            }
            if (action === 'DONE') {
                action = 'Completed';
            }
            if (action === 'CHECK_IN') {
                action = 'Confirmed';
            }
            this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, action, 'appt');
        }
    }
    changeWaitlistStatusApi(waitlist, action, post_data = {}) {
        if (this.bookingType == 'checkin') {
            this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
                .then(
                    result => {
                        this.sharedFunctions.sendMessage({ type: 'statuschange' });
                    },
                    error => {

                    });
        } else if (this.bookingType == 'appointment') {
            this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data)
                .then(
                    result => {
                        this.sharedFunctions.sendMessage({ type: 'statuschange' });
                    },
                    error => {
                    });
        }
    }
    smsCheckin() {
        const smsdialogRef = this.dialog.open(CheckinDetailsSendComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                qdata: this.waitlist_data,
                uuid: (this.bookingType == 'checkin') ? this.waitlist_data.ynwUuid : this.waitlist_data.uid,
                chekintype: (this.bookingType == 'checkin') ? 'Waitlist' : 'appointment'
            }
        });
        smsdialogRef.afterClosed().subscribe(result => {
        });
    }
    locateCustomer() {
        if (this.bookingType == 'checkin') {
            this.provider_services.getCustomerTrackStatus(this.waitlist_data.ynwUuid).subscribe(data => {
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
        } else {
            this.provider_services.getCustomerTrackStatusforAppointment(this.waitlist_data.uid).subscribe(data => {
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
            });
    }
    smsApptmnt() {
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
        if (this.bookingType == 'checkin') {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    waiting_id: modes.ynwUuid,
                    type: 'checkin'
                }
            };
            this.router.navigate(['provider', 'telehealth'], navigationExtras);
        } else if (this.bookingType == 'appointment') {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    waiting_id: modes.uid,
                    type: 'appt'
                }
            };
            this.router.navigate(['provider', 'telehealth'], navigationExtras);
        }
    }
    witlistRescheduleActionClicked() {
        const actiondialogRef = this.dialog.open(CheckinActionsComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
            disableClose: true,
            data: {
                checkinData: this.waitlist_data,
                timetype: this.timeType,
                type: 'reschedule'
            }
        });
        actiondialogRef.afterClosed().subscribe(data => {
            this.sharedFunctions.sendMessage({ type: 'statuschange' });
        });
    }
    apptRescheduleActionClicked() {
        const actiondialogRef = this.dialog.open(AppointmentActionsComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
            disableClose: true,
            data: {
                checkinData: this.waitlist_data,
                timetype: this.timeType,
                type: 'reschedule'
            }
        });
        actiondialogRef.afterClosed().subscribe(data => {
            this.sharedFunctions.sendMessage({ type: 'statuschange' });
        });
    }
    unBlockWaitlist() {
        this.provider_services.deleteWaitlistBlock(this.waitlist_data.ynwUuid)
            .subscribe(
                () => {
                    this.router.navigate(['provider', 'check-ins']);
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    sendimages() {
        const galleryDialog = this.dialog.open(GalleryImportComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                source_id: 'attachment',
                uid: (this.bookingType === 'checkin') ? this.waitlist_data.ynwUuid : this.waitlist_data.uid
            }
        });
        galleryDialog.afterClosed().subscribe(result => {
        })
    }
    printCheckin() {
        if (this.bookingType == 'checkin') {
            this.qrCodegeneration(this.waitlist_data);
            const bprof = this.groupService.getitemFromGroupStorage('ynwbp');
            const bname = bprof.bn;
            const fname = (this.waitlist_data.waitlistingFor[0].firstName) ? this.waitlist_data.waitlistingFor[0].firstName : '';
            const lname = (this.waitlist_data.waitlistingFor[0].lastName) ? this.waitlist_data.waitlistingFor[0].lastName : '';
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
                checkin_html += '<tr><td colspan="3" style="border-bottom: 1px solid #eee;text-align:center;line-height:30px;font-size:1.25rem">' + this.dateformat.transformToDIsplayFormat(this.waitlist_data.date) + '<br/>';
                if (this.waitlist_data.token) {
                    checkin_html += 'Token# <span style="font-weight:bold">' + this.waitlist_data.token + '</span>';
                }
                checkin_html += '</td></tr>';
                checkin_html += '<tr><td colspan="3" style="text-align:center">' + bname.charAt(0).toUpperCase() + bname.substring(1) + '</td></tr>';
                checkin_html += '<tr><td colspan="3" style="text-align:center">' + this.waitlist_data.queue.location.place + '</td></tr>';
                checkin_html += '</thead><tbody>';
                if (fname !== '' || lname !== '') {
                    checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + '</td><td>:</td><td>' + fname + ' ' + lname + '</td></tr>';
                } else {
                    checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ' Id </td><td>:</td><td>' + this.waitlist_data.consumer.jaldeeId + '</td></tr>';
                }
                if (this.waitlist_data.service && this.waitlist_data.service.deptName) {
                    checkin_html += '<tr><td width="48%" align="right">Department</td><td>:</td><td>' + this.waitlist_data.service.deptName + '</td></tr>';
                }
                checkin_html += '<tr><td width="48%" align="right">Service</td><td>:</td><td>' + this.waitlist_data.service.name + '</td></tr>';
                if (this.waitlist_data.provider && this.waitlist_data.provider.firstName && this.waitlist_data.provider.lastName) {
                    checkin_html += '<tr><td width="48%" align="right">' + this.provider_label.charAt(0).toUpperCase() + this.provider_label.substring(1) + '</td><td>:</td><td>' + this.waitlist_data.provider.firstName.charAt(0).toUpperCase() + this.waitlist_data.provider.firstName.substring(1) + ' ' + this.waitlist_data.provider.lastName + '</td></tr>';
                }
                checkin_html += '<tr><td width="48%" align="right">Queue</td><td>:</td><td>' + this.waitlist_data.queue.name + ' [' + this.waitlist_data.queue.queueStartTime + ' - ' + this.waitlist_data.queue.queueEndTime + ']' + '</td></tr>';
                checkin_html += '<tr><td colspan="3" align="center">' + printContent.innerHTML + '</td></tr>';
                checkin_html += '<tr><td colspan="3" align="center">Scan to know your status or log on to ' + this.qr_value + '</td></tr>';
                checkin_html += '</tbody></table>';
                printWindow.document.write('<html><head><title></title>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(checkin_html);
                printWindow.document.write('</body></html>');
                printWindow.moveTo(0, 0);
                printWindow.print();
            });
        } else {
            this.printAppt();
        }
    }
    printAppt() {
        const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
        let bname = '';
        if (bdetails) {
            bname = bdetails.bn || '';
        }
        const fname = (this.waitlist_data.appmtFor[0].firstName) ? this.waitlist_data.appmtFor[0].firstName : '';
        const lname = (this.waitlist_data.appmtFor[0].lastName) ? this.waitlist_data.appmtFor[0].lastName : '';
        const _this = this;
        _this.qrCodegeneration(this.waitlist_data);
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
            checkin_html += '<tr><td colspan="3" style="border-bottom: 1px solid #eee;text-align:center;line-height:30px;font-size:1.25rem">' + this.dateformat.transformToDIsplayFormat(this.waitlist_data.appmtDate) + '<br/>';
            if (this.waitlist_data.batchId) {
                checkin_html += 'Batch <span style="font-weight:bold">' + this.waitlist_data.batchId + '</span>';
            } else {
                checkin_html += 'Appointment Time <span style="font-weight:bold">' + this.getSingleTime(this.waitlist_data.appmtTime) + '</span>';
            }
            checkin_html += '</td></tr>';
            checkin_html += '<tr><td colspan="3" style="text-align:center">' + bname.charAt(0).toUpperCase() + bname.substring(1) + '</td></tr>';
            checkin_html += '<tr><td colspan="3" style="text-align:center">' + this.waitlist_data.location.place + '</td></tr>';
            checkin_html += '</thead><tbody>';
            if (fname !== '' || lname !== '') {
                checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + '</td><td>:</td><td>' + fname + ' ' + lname + '</td></tr>';
            } else {
                checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ' Id </td><td>:</td><td>' + this.waitlist_data.providerConsumer.jaldeeId + '</td></tr>';
            }
            if (this.waitlist_data.service && this.waitlist_data.service.deptName) {
                checkin_html += '<tr><td width="48%" align="right">Department</td><td>:</td><td>' + this.waitlist_data.service.deptName + '</td></tr>';
            }
            checkin_html += '<tr><td width="48%" align="right">Service</td><td>:</td><td>' + this.waitlist_data.service.name + '</td></tr>';
            if (this.waitlist_data.provider && this.waitlist_data.provider.firstName && this.waitlist_data.provider.lastName) {
                checkin_html += '<tr><td width="48%" align="right">' + this.provider_label.charAt(0).toUpperCase() + this.provider_label.substring(1) + '</td><td>:</td><td>' + this.waitlist_data.provider.firstName.charAt(0).toUpperCase() + this.waitlist_data.provider.firstName.substring(1) + ' ' + this.waitlist_data.provider.lastName + '</td></tr>';
            }
            checkin_html += '<tr><td width="48%" align="right">schedule</td><td>:</td><td>' + this.waitlist_data.schedule.name + ' [' + this.waitlist_data.schedule.apptSchedule.timeSlots[0].sTime + ' - ' + this.waitlist_data.schedule.apptSchedule.timeSlots[0].eTime + ']' + '</td></tr>';
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
        this.qr_value = this.path + 'status/' + valuetogenerate.checkinEncId;
        this.showQR = true;
    }
    changeWaitlistservice() {
        if (this.bookingType == 'checkin') {
            this.router.navigate(['provider', 'check-ins', this.waitlist_data.ynwUuid, 'user'], { queryParams: { source: 'checkin' } });
        } else {
            this.router.navigate(['provider', 'check-ins', this.waitlist_data.uid, 'user'], { queryParams: { source: 'appt' } });
        }
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
                if (this.bookingType == 'checkin') {
                    const post_data = {
                        'ynwUuid': this.waitlist_data.ynwUuid,
                        'provider': {
                            'id': this.waitlist_data.provider.id
                        },
                    };
                    this.provider_services.unassignUserWaitlist(post_data)
                        .subscribe(
                            data => {
                                this.sharedFunctions.sendMessage({ type: 'statuschange' });
                                this.closebutton.nativeElement.click();
                            },
                            error => {
                                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            }
                        );
                } else {
                    const post_data = {
                        'uid': this.waitlist_data.uid,
                        'provider': {
                            'id': this.waitlist_data.provider.id
                        },
                    };
                    this.provider_services.unassignUserAppointment(post_data)
                        .subscribe(
                            data => {
                                this.sharedFunctions.sendMessage({ type: 'statuschange' });
                                this.closebutton.nativeElement.click();
                            },
                            error => {
                                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            }
                        );
                }
            }
        });
    }
    assignMyself() {
        let msg = '';
        msg = 'Are you sure you want to assign this token to yourself ?';
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
                if (this.bookingType == 'checkin') {
                    const post_data = {
                        'ynwUuid': this.waitlist_data.ynwUuid,
                        'provider': {
                            'id': this.active_user.id
                        },
                    };
                    this.provider_services.updateUserWaitlist(post_data)
                        .subscribe(
                            data => {
                                this.sharedFunctions.sendMessage({ type: 'statuschange' });
                                this.closebutton.nativeElement.click();
                            },
                            error => {
                                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            }
                        );
                } else {
                    const post_data = {
                        'uid': this.waitlist_data.uid,
                        'provider': {
                            'id': this.active_user.id
                        },
                    };
                    this.provider_services.updateUserAppointment(post_data)
                        .subscribe(
                            data => {
                                this.sharedFunctions.sendMessage({ type: 'statuschange' });
                                this.closebutton.nativeElement.click();
                            },
                            error => {
                                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                            }
                        );
                }
            }
        });
    }
    getUser() {
        if (this.active_user.id) {
            this.provider_services.getUser(this.active_user.id)
                .subscribe((data: any) => {
                    if (data.status === 'ACTIVE') {
                        this.isUserdisable = true
                    } else {
                        this.isUserdisable = false
                    }
                }, error => {
                });
        }
    }
}
