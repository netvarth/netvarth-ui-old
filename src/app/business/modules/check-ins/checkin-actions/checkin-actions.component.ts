import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../app.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { CheckinDetailsSendComponent } from '../checkin-details-send/checkin-details-send.component';
import { LocateCustomerComponent } from '../locate-customer/locate-customer.component';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { NavigationExtras, Router } from '@angular/router';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { ApplyLabelComponent } from '../apply-label/apply-label.component';
import { SharedServices } from '../../../../shared/services/shared-services';
import * as moment from 'moment';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { GalleryImportComponent } from '../../../../shared/modules/gallery/import/gallery-import.component';
import { GalleryService } from '../../../../shared/modules/gallery/galery-service';
import { Subscription } from 'rxjs';
import { Messages } from '../../../../shared/constants/project-messages';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { ListRecordingsDialogComponent } from '../../../../shared/components/list-recordings-dialog/list-recordings-dialog.component';
import { ConfirmBoxComponent } from '../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';


@Component({
    selector: 'app-checkin-actions',
    templateUrl: './checkin-actions.component.html',
    styleUrls: ['./checkin-actions.component.css']
})
export class CheckinActionsComponent implements OnInit {
    tooltipcls = '';
    elementType = 'url';
    checkin;
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
    domain;
    customer_label = '';
    showmrrx = false;
    loading = false;
    today;
    minDate;
    maxDate;
    server_date;
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
    location_id;
    serv_id;
    checkin_date;
    accountid;
    sel_checkindate;
    hold_sel_checkindate;
    todaydate;
    isFuturedate;
    ddate;
    activeDate;
    ynwUuid;
    showToken;
    dateDisplayFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    pastDate;
    subdomain;
    availableDates: any = [];
    apiloading = false;
    galleryDialog: any;
    subscription: Subscription;
    checkinsByLabel: any = [];
    labelsforRemove: any = [];
    showApply = false;
    buttonClicked = false;
    accountType: any;
    changeService = true;
    userid: any;
    active_user: any;
    check_in_statuses = projectConstants.CHECK_IN_STATUSES;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private provider_services: ProviderServices,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public dateformat: DateFormatPipe, private dialog: MatDialog,
        private provider_shared_functions: ProviderSharedFuctions,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService,
        private lStorageService: LocalStorageService,
        private galleryService: GalleryService,
        private dateTimeProcessor: DateTimeProcessor,
        public dialogRef: MatDialogRef<CheckinActionsComponent>) {
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    }
    ngOnInit() {
        this.apiloading = true;
        this.setMinMaxDate();
        this.checkin = this.data.checkinData;
        if (this.data.type && this.data.type === 'reschedule') {
            this.rescheduleActionClicked();
        } else {
            this.getLabel();
        }
        if (!this.data.multiSelection) {
            this.ynwUuid = this.checkin.ynwUuid;
            this.location_id = this.checkin.queue.location.id;
            this.serv_id = this.checkin.service.id;
            if (this.data.timetype === 3) {
                this.pastDate = this.checkin.date;
                this.checkin_date = moment(this.today, 'YYYY-MM-DD HH:mm').format();
            } else {
                this.checkin_date = this.checkin.date;
            }
            this.accountid = this.checkin.providerAccount.id;
            this.showToken = this.checkin.showToken;
            if (!this.data.type) {
            this.getPos();
            }
        } else {
            this.showMsg = true;
            this.apiloading = false;
        }
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.active_user = user.userType;
        this.userid = user.id
        this.accountType = user.accountType;
        this.domain = user.sector;
        this.subdomain = user.subSector;
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');

        this.subscription = this.galleryService.getMessage().subscribe(input => {
            if (input && input.uuid) {
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
            }
        });
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    printCheckin() {
        this.dialogRef.close();
        this.qrCodegeneration(this.checkin);
        const bprof = this.groupService.getitemFromGroupStorage('ynwbp');
        const bname = bprof.bn;
        const fname = (this.checkin.waitlistingFor[0].firstName) ? this.checkin.waitlistingFor[0].firstName : '';
        const lname = (this.checkin.waitlistingFor[0].lastName) ? this.checkin.waitlistingFor[0].lastName : '';
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
            checkin_html += '<tr><td colspan="3" style="border-bottom: 1px solid #eee;text-align:center;line-height:30px;font-size:1.25rem">' + this.dateformat.transformToDIsplayFormat(this.checkin.date) + '<br/>';
            if (this.checkin.token) {
                checkin_html += 'Token# <span style="font-weight:bold">' + this.checkin.token + '</span>';
            }
            checkin_html += '</td></tr>';
            checkin_html += '<tr><td colspan="3" style="text-align:center">' + bname.charAt(0).toUpperCase() + bname.substring(1) + '</td></tr>';
            checkin_html += '<tr><td colspan="3" style="text-align:center">' + this.checkin.queue.location.place + '</td></tr>';
            checkin_html += '</thead><tbody>';
            if (fname !== '' || lname !== '') {
                checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + '</td><td>:</td><td>' + fname + ' ' + lname + '</td></tr>';
            } else {
                checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ' Id </td><td>:</td><td>' + this.checkin.consumer.jaldeeId + '</td></tr>';
            }
            if (this.checkin.service && this.checkin.service.deptName) {
                checkin_html += '<tr><td width="48%" align="right">Department</td><td>:</td><td>' + this.checkin.service.deptName + '</td></tr>';
            }
            checkin_html += '<tr><td width="48%" align="right">Service</td><td>:</td><td>' + this.checkin.service.name + '</td></tr>';
            if (this.checkin.provider && this.checkin.provider.firstName && this.checkin.provider.lastName) {
                checkin_html += '<tr><td width="48%" align="right">' + this.provider_label.charAt(0).toUpperCase() + this.provider_label.substring(1) + '</td><td>:</td><td>' + this.checkin.provider.firstName.charAt(0).toUpperCase() + this.checkin.provider.firstName.substring(1) + ' ' + this.checkin.provider.lastName + '</td></tr>';
            }
            checkin_html += '<tr><td width="48%" align="right">Queue</td><td>:</td><td>' + this.checkin.queue.name + ' [' + this.checkin.queue.queueStartTime + ' - ' + this.checkin.queue.queueEndTime + ']' + '</td></tr>';
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
    }
    close() {
        this.dialogRef.close();
    }
    rescheduleActionClicked() {
        this.action = 'reschedule';
    }
    setMinMaxDate() {
        this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.today = new Date(this.today);
        this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.minDate = new Date(this.minDate);
        this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
    }
    changeSlot() {
        this.action = 'slotChange';
        // this.selectedTime = '';
        this.activeDate = this.checkin_date;
        this.getQueuesbyLocationandServiceId(this.location_id, this.serv_id, this.checkin_date, this.accountid);
        this.getQueuesbyLocationandServiceIdavailability(this.location_id, this.serv_id, this.accountid);
    }

    getQueuesbyLocationandServiceId(locid, servid, pdate?, accountid?) {
        this.loading = true;
        this.queuejson = [];
        this.queueQryExecuted = false;
        if (locid && servid) {
            this.shared_services.getQueuesbyLocationandServiceId(locid, servid, pdate, accountid)
                .subscribe(data => {
                    this.queuejson = data;
                    this.loading = false;
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
        this.checkin_date = seldate;
        this.getQueuesbyLocationandServiceId(this.location_id, this.serv_id, this.checkin_date, this.accountid);
        this.getQueuesbyLocationandServiceIdavailability(this.location_id, this.serv_id, this.accountid);
    }
    calculateDate(days, type) {
        const dte = this.checkin_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
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
        if (type === 'pre') {
            if (strtDt.getTime() >= nDt.getTime()) {
                this.checkin_date = ndate;
                this.getQueuesbyLocationandServiceId(this.location_id, this.serv_id, this.checkin_date, this.accountid);
            }
        } else {
            if (nDt.getTime() >= strtDt.getTime()) {
                this.checkin_date = ndate;
                this.getQueuesbyLocationandServiceId(this.location_id, this.serv_id, this.checkin_date, this.accountid);
            }
        }
    }
    disableMinus() {
        const seldate1 = this.checkin_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
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
    handleQueueSelection(queue, index) {
        this.sel_queue_indx = index;
        this.sel_queue_id = queue.id;
        this.sel_queue_waitingmins = this.dateTimeProcessor.convertMinutesToHourMinute(queue.queueWaitingTime);
        this.sel_queue_servicetime = queue.serviceTime || '';
        this.sel_queue_name = queue.name;
        this.sel_queue_timecaption = queue.queueSchedule.timeSlots[0]['sTime'] + ' - ' + queue.queueSchedule.timeSlots[0]['eTime'];
        this.sel_queue_personaahead = queue.queueSize;
        // this.queueReloaded = true;
        // if (this.calc_mode === 'Fixed' && queue.timeInterval && queue.timeInterval !== 0) {
        //     this.getAvailableTimeSlots(queue.queueSchedule.timeSlots[0]['sTime'], queue.queueSchedule.timeSlots[0]['eTime'], queue.timeInterval);
        // }
    }
    rescheduleWaitlist() {
        const data = {
            'ynwUuid': this.ynwUuid,
            'queue': this.sel_queue_id,
            'date': this.checkin_date
        };
        this.provider_services.rescheduleConsumerWaitlist(data)
            .subscribe(
                () => {
                    if (this.showToken) {
                        this.snackbarService.openSnackBar('Token rescheduled to ' + this.dateformat.transformToMonthlyDate(this.checkin_date));
                    } else {
                        this.snackbarService.openSnackBar('Check-in rescheduled to ' + this.dateformat.transformToMonthlyDate(this.checkin_date));
                    }
                    this.dialogRef.close('reload');
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    qrCodegeneration(valuetogenerate) {
        this.qr_value = this.path + 'status/' + valuetogenerate.checkinEncId;
        this.showQR = true;
    }
    addConsumerInboxMessage() {
        this.dialogRef.close();
        let checkin = [];
        if (this.data.multiSelection) {
            checkin = this.checkin;
        } else {
            checkin.push(this.checkin);
        }
        this.provider_shared_functions.addConsumerInboxMessage(checkin, this)
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
                qdata: this.checkin,
                uuid: this.checkin.ynwUuid,
                chekintype: 'Waitlist'
            }
        });
        smsdialogRef.afterClosed().subscribe(result => {
        });
    }
    viewRecordings() {
        this.dialogRef.close();
        const smsdialogRef = this.dialog.open(ListRecordingsDialogComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                recordingUrls: this.checkin.s3VideoUrls
            }
        });
        smsdialogRef.afterClosed().subscribe(result => {
        });
    }
    locateCustomer() {
        this.provider_services.getCustomerTrackStatus(this.checkin.ynwUuid).subscribe(data => {
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
    goToCheckinDetails() {
        this.router.navigate(['provider', 'check-ins', this.checkin.ynwUuid], { queryParams: { timetype: this.data.timetype } });
        this.dialogRef.close();
    }
    viewBillPage() {
        if (!this.checkin.parentUuid) {
            this.getBill(this.checkin.ynwUuid);
        } else {
            this.action = 'bill';
        }
    }
    getBill(uuid) {
        this.provider_services.getWaitlistBill(uuid)
            .subscribe(
                data => {
                    this.router.navigate(['provider', 'bill', uuid]);
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
                checkin_id: this.checkin.ynwUuid
            }

        });
        addnotedialogRef.afterClosed().subscribe(result => {
            this.dialogRef.close('reload');
        });
    }
    changeWaitlistStatus(action) {
        if (action !== 'CANCEL') {
            // this.dialogRef.close();
            this.buttonClicked = true;
        }
        this.provider_shared_functions.changeWaitlistStatus(this, this.checkin, action);
    }
    changeWaitlistservice() {
        this.dialogRef.close();
        this.router.navigate(['provider', 'check-ins', this.checkin.ynwUuid, 'user'], { queryParams: { source: 'checkin' } });
    }
    removeProvider() {
        // this.dialogRef.close();
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
                    'ynwUuid': this.checkin.ynwUuid,
                    'provider': {
                        'id': this.checkin.provider.id
                    },
                };
                this.provider_services.unassignUserWaitlist(post_data)
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
        this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
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
        this.provider_services.getDisplayboardsWaitlist()
            .subscribe(
                data => {
                    layout_list = data;
                    this.board_count = layout_list.length;
                    this.setActions();
                },
                error => {
                    this.setActions();
                });
    }
    setActions() {
        this.apiloading = false;
        if (this.data.timetype !== 3 && this.checkin.waitlistStatus !== 'done' && this.checkin.waitlistStatus !== 'checkedIn' && this.checkin.waitlistStatus !== 'blocked' && !this.data.teleservice) {
            this.showUndo = true;
        }
        if (this.data.timetype === 1 && this.checkin.waitlistStatus === 'checkedIn' && Object.keys(this.checkin.virtualService).length === 0 && this.checkin.virtualService.constructor === Object && !this.data.teleservice) {
            this.showArrived = true;
        }
        if ((this.checkin.waitlistStatus === 'arrived' || this.checkin.waitlistStatus === 'checkedIn') && !this.data.teleservice) {
            this.showCancel = true;
        }
        if (this.data.timetype === 1 && this.checkin.service.livetrack && this.checkin.waitlistStatus === 'checkedIn' && this.checkin.jaldeeWaitlistDistanceTime && this.checkin.jaldeeWaitlistDistanceTime.jaldeeDistanceTime && (this.checkin.jaldeeStartTimeType === 'ONEHOUR' || this.checkin.jaldeeStartTimeType === 'AFTERSTART')) {
            this.trackStatus = true;
        }
        if (this.data.timetype !== 3 && this.checkin.waitlistStatus !== 'cancelled' && ((this.checkin.waitlistingFor[0].phoneNo && this.checkin.waitlistingFor[0].phoneNo !== 'null') || this.checkin.waitlistingFor[0].email)) {
            this.showSendDetails = true;
        }
        if ((this.checkin.waitlistingFor[0].phoneNo && this.checkin.waitlistingFor[0].phoneNo !== 'null') || this.checkin.waitlistingFor[0].email) {
            this.showMsg = true;
        }
        if ((this.checkin.waitlistStatus === 'arrived' || this.checkin.waitlistStatus === 'checkedIn') && this.data.timetype !== 2 && (this.checkin.service.serviceType === 'physicalService') && !this.data.teleservice) {
            this.showStart = true;
        }
        if ((this.data.timetype === 1 || (this.data.timetype === 3 && this.checkin.service.virtualCallingModes && this.checkin.service.virtualCallingModes[0].callingMode !== 'VideoCall')) && (this.checkin.service.serviceType === 'virtualService') && (this.checkin.waitlistStatus === 'arrived' || this.checkin.waitlistStatus === 'checkedIn' || this.checkin.waitlistStatus === 'started') && !this.data.teleservice) {
            this.showTeleserviceStart = true;
        }
        if (this.board_count > 0 && this.data.timetype === 1 && !this.checkin.virtualService && (this.checkin.waitlistStatus === 'checkedIn' || this.checkin.waitlistStatus === 'arrived') && !this.data.teleservice) {
            this.showCall = true;
        }
        if (this.pos && this.checkin.waitlistStatus !== 'blocked' && (this.checkin.waitlistStatus !== 'cancelled' || (this.checkin.waitlistStatus === 'cancelled' && this.checkin.paymentStatus !== 'NotPaid'))) {
            this.showBill = true;
        }
        if (this.data.timetype !== 2 && this.checkin.waitlistStatus !== 'cancelled' && this.checkin.waitlistStatus !== 'blocked') {
            this.showmrrx = true;
        }
        if ((this.checkin.waitlistingFor[0].phoneNo && this.checkin.waitlistingFor[0].phoneNo !== 'null') || this.checkin.waitlistingFor[0].email) {
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
            if (!this.data.multiSelection) {
                this.labelselection();
            } else {
                this.multipleLabelselection();
            }
            this.loading = false;
        });
    }
    deleteLabel() {
        // this.provider_services.deleteLabelfromCheckin(checkinId, label).subscribe(data => {
        //     this.dialogRef.close('reload');
        // },
        //     error => {
        //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //     });
        let ids = [];
        // if (this.data.multiSelection) {
        //     ids = this.checkinsByLabel[label];
        // } else {
        //     ids.push(this.checkin.ynwUuid);
        // }
        if (this.data.multiSelection) {
            for (let label of this.labelsforRemove) {
                ids = ids.concat(this.checkinsByLabel[label]);
            }
        } else {
            ids.push(this.checkin.ynwUuid);
        }
        const postData = {
            'labelNames': this.labelsforRemove,
            'uuid': ids
        };
        this.provider_services.deleteLabelFromMultipleCheckin(postData).subscribe(data => {
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
                checkin: this.checkin,
                source: source,
                label: label
            }
        });
        labeldialogRef.afterClosed().subscribe(data => {
            if (data) {
                // setTimeout(() => {
                // this.labels();
                this.labelMap = new Object();
                this.labelMap[data.label] = data.value;
                this.addLabel();
                this.getDisplayname(data.label);
                // }, 500);
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
        // this.provider_services.addLabeltoCheckin(this.checkin.ynwUuid, this.labelMap).subscribe(data => {
        //     this.dialogRef.close('reload');
        // },
        //     error => {
        //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //     });
        const ids = [];
        if (this.data.multiSelection) {
            for (const checkin of this.checkin) {
                ids.push(checkin.ynwUuid);
            }
        } else {
            ids.push(this.checkin.ynwUuid);
        }
        // const postData = {
        //     'labelName': label,
        //     'labelValue': 'true',
        //     'uuid': ids
        // };
        const postData = {
            'labels': this.labelMap,
            'uuid': ids
        };
        this.provider_services.addLabeltoMultipleCheckin(postData).subscribe(data => {
            this.dialogRef.close('reload');
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    applyLabel() {
        if (Object.keys(this.labelMap).length > 0) {
            this.addLabel();
        }
        if (this.labelsforRemove.length > 0) {
            this.deleteLabel();
        }
    }
    labels() {
        for (let i = 0; i < this.providerLabels.length; i++) {
            for (let j = 0; j < this.providerLabels[i].valueSet.length; j++) {
                this.providerLabels[i].valueSet[j].selected = false;
            }
        }
        setTimeout(() => {
            const values = [];
            if (this.checkin.label) {
                for (const value of Object.values(this.checkin.label)) {
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
        this.router.navigate(['provider', 'settings', 'general', 'labels'], { queryParams: { source: 'checkin' } });
        this.dialogRef.close();
    }
    goBack() {
        this.action = '';
    }
    callingWaitlist() {
        const status = (this.checkin.callingStatus) ? 'Disable' : 'Enable';
        this.provider_services.setCallStatus(this.checkin.ynwUuid, status).subscribe(
            () => {
                this.dialogRef.close('reload');
            });
    }
    showCallingModes(modes) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                waiting_id: modes.ynwUuid,
                type: 'checkin'
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
        if (this.checkin.label && Object.keys(this.checkin.label).length > 0) {
            Object.keys(this.checkin.label).forEach(key => {
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
        for (let i = 0; i < this.checkin.length; i++) {
            if (this.checkin[i].label) {
                Object.keys(this.checkin[i].label).forEach(key => {
                    values.push(key);
                    if (!this.checkinsByLabel[key]) {
                        this.checkinsByLabel[key] = [];
                    }
                    this.checkinsByLabel[key].push(this.checkin[i].ynwUuid);
                });
            }
        }
        for (let i = 0; i < this.providerLabels.length; i++) {
            for (let k = 0; k < values.length; k++) {
                const filteredArr = values.filter(value => value === this.providerLabels[i].label);
                if (filteredArr.length === this.checkin.length) {
                    this.providerLabels[i].selected = true;
                }
            }
        }
    }
    medicalRecord() {

        this.dialogRef.close();

        let mrId = 0;
        if (this.checkin.mrId) {
            mrId = this.checkin.mrId;
        }

        const customerDetails = this.checkin.waitlistingFor[0];
        const customerId = customerDetails.id;
        const bookingId = this.checkin.ynwUuid;
        const bookingType = 'TOKEN';
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId], { queryParams: { 'calledfrom': 'waitlist' } });


    }
    prescription() {
        this.dialogRef.close();

        let mrId = 0;
        if (this.checkin.mrId) {
            mrId = this.checkin.mrId;
        }

        const customerDetails = this.checkin.waitlistingFor[0];
        const customerId = customerDetails.id;
        const bookingId = this.checkin.ynwUuid;
        const bookingType = 'TOKEN';
        this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription'], { queryParams: { 'calledfrom': 'waitlist' } });
    }
    gotoCustomerDetails() {
        this.dialogRef.close();
        this.router.navigate(['/provider/customers/' + this.checkin.waitlistingFor[0].id]);
    }
    addCustomerDetails() {
        this.dialogRef.close();
        let virtualServicemode;
        let virtualServicenumber;
        if (this.checkin.virtualService) {
            Object.keys(this.checkin.virtualService).forEach(key => {
                virtualServicemode = key;
                virtualServicenumber = this.checkin.virtualService[key];
            });
        }
        this.router.navigate(['provider', 'check-ins', 'add'], { queryParams: { source: 'waitlist-block', uid: this.checkin.ynwUuid, showtoken: this.showToken, virtualServicemode: virtualServicemode, virtualServicenumber: virtualServicenumber, serviceId: this.checkin.service.id, waitlistMode: this.checkin.waitlistMode } });
        // this.router.navigate(['provider', 'customers', 'add'], { queryParams: { source: 'waitlist-block', uid: this.checkin.ynwUuid } });
    }
    unBlockWaitlist() {
        this.provider_services.deleteWaitlistBlock(this.checkin.ynwUuid)
            .subscribe(
                () => {
                    this.dialogRef.close('reload');
                    this.router.navigate(['provider', 'check-ins']);
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
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
                // accountId:this.checkin.providerAccount.id,
                uid: this.checkin.ynwUuid
            }
        });
        this.galleryDialog.afterClosed().subscribe(result => {
            this.dialogRef.close('reload');
        })
    }
    gotoQuestionnaire(booking) {
        this.dialogRef.close();
        const navigationExtras: NavigationExtras = {
            queryParams: {
                uuid: booking.ynwUuid,
                type: 'proCheckin'
            }
        };
        this.router.navigate(['provider', 'check-ins', 'questionnaire'], navigationExtras);
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
                const post_data = {
                    'ynwUuid': this.checkin.ynwUuid,
                    'provider': {
                        'id': this.userid
                    },
                };
                this.provider_services.updateUserWaitlist(post_data)
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
    changeWaitlistStatusAction() {
        this.action = 'status';
    }
    getStatusLabel(status) {
        const label_status = this.wordProcessor.firstToUpper(this.wordProcessor.getTerminologyTerm(status));
        return label_status;
    }
}
