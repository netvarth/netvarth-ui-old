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
declare let cordova: any;
import { SharedServices } from '../../../../shared/services/shared-services';
import * as moment from 'moment';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';


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
    labelMap;
    showCall;
    board_count;
    pos = false;
    showBill = false;
    showMsg = false;
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
    pastDate;
    subdomain;
    availableDates: any = [];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private shared_functions: SharedFunctions, private provider_services: ProviderServices,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        public dateformat: DateFormatPipe, private dialog: MatDialog,
        private provider_shared_functions: ProviderSharedFuctions,
        public dialogRef: MatDialogRef<CheckinActionsComponent>) {
        this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    }
    ngOnInit() {
        console.log(this.data);
        this.setMinMaxDate();
        this.checkin = this.data.checkinData;
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
            this.getPos();
            this.getLabel();
        } else {
            this.showMsg = true;
        }
        this.provider_label = this.shared_functions.getTerminologyTerm('provider');
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.subdomain = user.subSector;
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    }

    printCheckin() {
        this.dialogRef.close();
        this.qrCodegeneration(this.checkin);
        const bprof = this.shared_functions.getitemFromGroupStorage('ynwbp');
        const bname = bprof.bn;
        setTimeout(() => {
            const printContent = document.getElementById('print-section');
            // const params = [
            //     'height=' + screen.height,
            //     'width=' + screen.width,
            //     'fullscreen=yes'
            // ].join(',');
            // const printWindow = window.open('', '', params);
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
            checkin_html += '<tr><td width="48%" align="right">Customer</td><td>:</td><td>' + this.checkin.waitlistingFor[0].firstName + ' ' + this.checkin.waitlistingFor[0].lastName + '</td></tr>';
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
            // printWindow.document.write('<html><head><title></title>');
            // printWindow.document.write('</head><body >');
            // printWindow.document.write(checkin_html);
            // printWindow.document.write('</body></html>');
            this.showQR = false;
            // printWindow.moveTo(0, 0);
            // printWindow.print();
            cordova.plugins.printer.print(checkin_html);
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
        this.queuejson = [];
        this.queueQryExecuted = false;
        if (locid && servid) {
            this.shared_services.getQueuesbyLocationandServiceId(locid, servid, pdate, accountid)
                .subscribe(data => {
                    this.queuejson = data;
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
                        this.sel_queue_waitingmins = this.sharedFunctionobj.convertMinutesToHourMinute(this.queuejson[selindx].queueWaitingTime);
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
        const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
        const date2 = new Date(dt2);
        const dte0 = this.checkin_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
        const datee2 = new Date(dte2);
        if (datee2.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
            this.isFuturedate = true;
        } else {
            this.isFuturedate = false;
        }
        this.handleFuturetoggle();
        this.getQueuesbyLocationandServiceId(this.location_id, this.serv_id, this.checkin_date, this.accountid);
        this.getQueuesbyLocationandServiceIdavailability(this.location_id, this.serv_id, this.accountid);
    }
    handleFuturetoggle() {
        // this.showfuturediv = !this.showfuturediv;
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
        const selecttdate = new Date(seldate.getFullYear() + '-' + this.shared_functions.addZero(seldate.getMonth() + 1) + '-' + this.shared_functions.addZero(seldate.getDate()));
        const strtDt1 = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
        const strtDt = new Date(strtDt2);
        const startdate = new Date(strtDt.getFullYear() + '-' + this.shared_functions.addZero(strtDt.getMonth() + 1) + '-' + this.shared_functions.addZero(strtDt.getDate()));
        if (startdate >= selecttdate) {
            return true;
        } else {
            return false;
        }
    }
    handleQueueSelection(queue, index) {
        this.sel_queue_indx = index;
        this.sel_queue_id = queue.id;
        this.sel_queue_waitingmins = this.sharedFunctionobj.convertMinutesToHourMinute(queue.queueWaitingTime);
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
        // this.checkin_date = moment(this.checkin_date).format('DD-MM-YYYY')
        const data = {
            'ynwUuid': this.ynwUuid,
            'queue': this.sel_queue_id,
            'date': this.checkin_date
        };
        this.provider_services.rescheduleConsumerWaitlist(data)
            .subscribe(
                () => {
                    if (this.showToken) {
                        this.shared_functions.openSnackBar('Token rescheduled to ' + moment(this.checkin_date).format('DD-MM-YYYY'));
                    } else {
                        this.shared_functions.openSnackBar('Check-in rescheduled to ' + this.checkin_date, this.sel_queue_timecaption);
                    }
                    this.dialogRef.close('reload');
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
        this.router.navigate(['provider', 'check-ins', this.checkin.ynwUuid], { queryParams: { timetype: this.data.timetype } });
        this.dialogRef.close();
    }
    viewBillPage() {
        this.provider_services.getWaitlistBill(this.checkin.ynwUuid)
            .subscribe(
                data => {
                    this.router.navigate(['provider', 'bill', this.checkin.ynwUuid]);
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
                checkin_id: this.checkin.ynwUuid
            }
        });
        addnotedialogRef.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
            }
        });
    }
    changeWaitlistStatus(action) {
        // if (action === 'CANCEL') {
        //     this.dialogRef.close();
        // }
        this.provider_shared_functions.changeWaitlistStatus(this, this.checkin, action);
    }
    changeWaitlistStatusApi(waitlist, action, post_data = {}) {
        this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
            .then(
                result => {
                    this.dialogRef.close('reload');
                }
            );
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
        if (this.data.timetype !== 3 && this.checkin.waitlistStatus !== 'done' && this.checkin.waitlistStatus !== 'checkedIn' && this.checkin.waitlistStatus !== 'blocked') {
            this.showUndo = true;
        }
        if (this.data.timetype === 1 && this.checkin.waitlistStatus === 'checkedIn' && !this.checkin.virtualService) {
            this.showArrived = true;
        }
        if (this.checkin.waitlistStatus === 'arrived' || this.checkin.waitlistStatus === 'checkedIn') {
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
        if ((this.checkin.waitlistStatus === 'arrived' || this.checkin.waitlistStatus === 'checkedIn') && this.data.timetype !== 2 && (!this.checkin.virtualService)) {
            this.showStart = true;
        }
        if ((this.data.timetype === 1 || this.data.timetype === 3) && this.checkin.virtualService && (this.checkin.waitlistStatus === 'arrived' || this.checkin.waitlistStatus === 'checkedIn' || this.checkin.waitlistStatus === 'started')) {
            this.showTeleserviceStart = true;
        }
        if (this.board_count > 0 && this.data.timetype === 1 && !this.checkin.virtualService && (this.checkin.waitlistStatus === 'checkedIn' || this.checkin.waitlistStatus === 'arrived')) {
            this.showCall = true;
        }
        if (this.pos && this.checkin.waitlistStatus !== 'blocked' && !this.checkin.parentUuid && (this.checkin.waitlistStatus !== 'cancelled' || (this.checkin.waitlistStatus === 'cancelled' && this.checkin.paymentStatus !== 'NotPaid'))) {
            this.showBill = true;
        }
        if (this.data.timetype !== 2 && this.checkin.waitlistStatus !== 'cancelled' && this.checkin.waitlistStatus !== 'blocked') {
            this.showmrrx = true;
        }
    }
    getLabel() {
        this.loading = true;
        this.providerLabels = [];
        this.provider_services.getLabelList().subscribe((data: any) => {
            this.providerLabels = data.filter(label => label.status === 'ENABLED');
            this.labelselection();
            this.loading = false;
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
                        this.deleteLabel(labelname, this.checkin.ynwUuid);
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
        this.provider_services.deleteLabelfromCheckin(checkinId, label).subscribe(data => {
            this.dialogRef.close('reload');
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
        this.provider_services.addLabeltoCheckin(this.checkin.ynwUuid, this.labelMap).subscribe(data => {
            this.dialogRef.close('reload');
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
        this.labelMap = new Object();
        if (event.checked) {
            this.labelMap[label] = true;
            this.addLabel();
        } else {
            this.deleteLabel(label, this.checkin.ynwUuid);
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
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'view' }
        };
        this.router.navigate(['/provider/customers/' + this.checkin.waitlistingFor[0].id], navigationExtras);
    }
    addCustomerDetails() {
        this.dialogRef.close();
        this.router.navigate(['provider', 'customers', 'add'], { queryParams: { source: 'waitlist-block', uid: this.checkin.ynwUuid } });
    }
    unBlockWaitlist() {
        this.provider_services.deleteWaitlistBlock(this.checkin.ynwUuid)
            .subscribe(
                () => {
                    this.dialogRef.close('reload');
                    this.router.navigate(['provider', 'check-ins']);
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    getQueuesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        _this.shared_services.getQueuesbyLocationandServiceIdAvailableDates(locid, servid, accountid)
            .subscribe((data: any) => {
                const availables = data.filter(obj => obj.isAvailable);
                const availDates = availables.map(function (a) { return a.date; });
                _this.availableDates = availDates.filter(function (elem, index, self) {
                    return index === self.indexOf(elem);
                });
            });
    }
    dateClass(date: Date): MatCalendarCellCssClasses {
        return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    }
}
