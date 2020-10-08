import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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

@Component({
    selector: 'app-checkin-actions',
    templateUrl: './checkin-actions.component.html',
    styleUrls: ['./checkin-actions.component.css']
})
export class CheckinActionsComponent implements OnInit {
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
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private shared_functions: SharedFunctions, private provider_services: ProviderServices,
        public dateformat: DateFormatPipe, private dialog: MatDialog,
        private provider_shared_functions: ProviderSharedFuctions,
        public dialogRef: MatDialogRef<CheckinActionsComponent>) {
    }
    ngOnInit() {
        console.log(this.data);
        this.checkin = this.data.checkinData;
        this.getPos();
        this.getLabel();
        this.provider_label = this.shared_functions.getTerminologyTerm('provider');
    }

    printCheckin() {
        this.dialogRef.close();
        this.qrCodegeneration(this.checkin);
        const bprof = this.shared_functions.getitemFromGroupStorage('ynwbp');
        const bname = bprof.bn;
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
            printWindow.document.write('<html><head><title></title>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(checkin_html);
            printWindow.document.write('</body></html>');
            printWindow.moveTo(0, 0);
            printWindow.print();
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
        this.router.navigate(['provider', 'check-ins', this.checkin.ynwUuid]);
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
                    this.dialogRef.close();
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
                });
    }
    setActions() {
        this.trackStatus = false;
        this.showArrived = false;
        this.showUndo = false;
        this.showCancel = false;
        this.showSendDetails = false;
        this.showStart = false;
        this.showTeleserviceStart = false;
        this.showCall = false;
        if (!this.data.multiSelection) {
            if (this.data.timetype !== 3 && this.checkin.waitlistStatus !== 'done' && this.checkin.waitlistStatus !== 'checkedIn') {
                this.showUndo = true;
            }
            if (this.data.timetype === 1 && this.checkin.waitlistStatus === 'checkedIn' && !this.checkin.virtualService) {
                this.showArrived = true;
            }
            if (this.checkin.waitlistStatus === 'arrived' || this.checkin.waitlistStatus === 'checkedIn') {
                this.showCancel = true;
            }
            if (this.data.timetype === 1 && this.checkin.waitlistStatus === 'checkedIn' && this.checkin.jaldeeWaitlistDistanceTime && this.checkin.jaldeeWaitlistDistanceTime.jaldeeDistanceTime && (this.checkin.jaldeeStartTimeType === 'ONEHOUR' || this.checkin.jaldeeStartTimeType === 'AFTERSTART')) {
                this.trackStatus = true;
            }
            if (!this.data.multiSelection && this.data.timetype !== 3 && this.checkin.waitlistStatus !== 'cancelled') {
                this.showSendDetails = true;
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
            if (this.pos && !this.checkin.parentUuid && (this.checkin.waitlistStatus !== 'cancelled' || (this.checkin.waitlistStatus === 'cancelled' && this.checkin.paymentStatus !== 'NotPaid'))) {
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
                checkin: this.checkin,
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
        this.provider_services.addLabeltoCheckin(this.checkin.ynwUuid, this.labelMap).subscribe(data => {
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
        this.router.navigate(['provider', 'settings', 'general', 'labels']);
        this.dialogRef.close();
    }
    goBack() {
        this.action = '';
    }
    callingWaitlist() {
        const status = (this.checkin.callingStatus) ? 'Disable' : 'Enable';
        this.provider_services.setCallStatus(this.checkin.ynwUuid, status).subscribe(
            () => {
                this.dialogRef.close();
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
        });
    }
}

