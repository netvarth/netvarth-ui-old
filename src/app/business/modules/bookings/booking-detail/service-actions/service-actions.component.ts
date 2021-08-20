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
import { DateFormatPipe } from '../../../../../shared/pipes/date-format/date-format.pipe';
import { TeleServiceConfirmBoxComponent } from '../../../teleservice/teleservice-confirm-box/teleservice-confirm-box.component';
import { TeleServiceShareComponent } from '../../../teleservice/teleservice-share/teleservice-share.component';
import { ActionsPopupComponent } from '../../actions-popup/actions-popup.component';
import { ListRecordingsDialogComponent } from '../../../../../shared/components/list-recordings-dialog/list-recordings-dialog.component';

@Component({
    selector: 'app-service-actions',
    templateUrl: './service-actions.component.html',
    styleUrls: ['./service-actions.component.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class ServiceActionsComponent implements OnInit {
    @Input() waitlist_data;
    @Input() showToken;
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
    showInProgress = false;
    board_count;
    pos = false;
    showBill = false;
    showCall;
    showmrrx = false;
    showAssign = false;
    showAssignMyself = false;
    showUnassign = false;
    showAssignTeam = false;
    showAssignLocation = false;
    showChangeTeam = false;
    showUnassignTeam = false;
    trackDetail: any = [];
    customerMsg;
    newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
    subscription: Subscription;
    active_user;
    customer_label: any;
    provider_label: any;
    qr_value;
    path = projectConstants.PATH;
    showQR = false;
    elementType = 'url';
    isUserdisable = false;
    @ViewChild('closebutton') closebutton;
    starting_url = '';
    meetlink_data;
    servStarted = false;
    is_web = false;
    notSupported;
    busnes_name = '';
    showMoreActions = false;
    groups: any = [];
    showStatusChange = false;
    showFirstSection = false;
    locations: any = [];
    users: any = [];
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
        public dateformat: DateFormatPipe
    ) {
        this.activated_route.queryParams.subscribe(params => {
            this.bookingType = params.type;
            this.timeType = JSON.parse(params.timetype);
        });
        this.subscription = this.sharedFunctions.getMessage().subscribe((message) => {
            switch (message.type) {
                case 'reload':
                    this.setActions();
                    break;
            }
        });
        this.notSupported = this.wordProcessor.getProjectMesssages('TELE_NOT_SUPPORTED');
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    ngOnInit(): void {
        this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
        if (this.active_user.accountType === 'BRANCH') {
            this.getUser();
        } else {
            this.setActions();
        }
        const isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        if (!isMobile.Android() && !isMobile.iOS()) {
            this.is_web = true;
        }
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        if (this.waitlist_data.provider) {
            this.busnes_name = (this.waitlist_data.provider.businessName) ? this.waitlist_data.provider.businessName : this.waitlist_data.provider.firstName + ' ' + this.waitlist_data.provider.lastName;
        } else {
            this.busnes_name = this.waitlist_data.providerAccount.businessName;
        }
    }
    setActions() {
        if (this.bookingType === 'checkin') {
            if (this.timeType === 1 && this.waitlist_data.service.livetrack && this.waitlist_data.waitlistStatus === 'checkedIn' && this.waitlist_data.jaldeeWaitlistDistanceTime && this.waitlist_data.jaldeeWaitlistDistanceTime.jaldeeDistanceTime && (this.waitlist_data.jaldeeStartTimeType === 'ONEHOUR' || this.waitlist_data.jaldeeStartTimeType === 'AFTERSTART')) {
                this.trackStatus = true;
            }
            if (this.timeType !== 3 && this.waitlist_data.waitlistStatus !== 'cancelled' && ((this.waitlist_data.waitlistingFor[0].phoneNo && this.waitlist_data.waitlistingFor[0].phoneNo !== 'null') || this.waitlist_data.waitlistingFor[0].email)) {
                this.showSendDetails = true;
            }
            if ((this.waitlist_data.waitlistStatus === 'arrived' || this.waitlist_data.waitlistStatus === 'checkedIn') && this.timeType !== 2 && (!this.waitlist_data.service.virtualCallingModes)) {
                this.showStart = true;
            }
            if ((this.timeType === 1 || this.timeType === 3) && this.waitlist_data.service.virtualCallingModes && (this.waitlist_data.waitlistStatus === 'arrived' || this.waitlist_data.waitlistStatus === 'checkedIn' || this.waitlist_data.waitlistStatus === 'started')) {
                this.showTeleserviceStart = true;
                if (this.waitlist_data.waitlistStatus === 'started') {
                    this.servStarted = true;
                } else {
                    this.servStarted = false;
                }
                if (this.is_web && this.waitlist_data.waitlistStatus != 'started' && this.waitlist_data.service.virtualCallingModes && this.waitlist_data.service.virtualCallingModes[0] && (this.waitlist_data.service.virtualCallingModes[0].callingMode === 'WhatsApp' || this.waitlist_data.service.virtualCallingModes[0].callingMode === 'Phone')) {
                    this.showInProgress = true;
                }
            }
            if (this.board_count > 0 && this.timeType === 1 && !this.waitlist_data.service.virtualCallingModes && (this.waitlist_data.waitlistStatus === 'checkedIn' || this.waitlist_data.waitlistStatus === 'arrived')) {
                this.showCall = true;
            }
            if (this.active_user.accountType == 'BRANCH' && (this.waitlist_data.waitlistStatus === 'arrived' || this.waitlist_data.waitlistStatus === 'checkedIn')) {
                if (this.active_user && this.active_user.userType == 1 && !this.waitlist_data.provider && this.waitlist_data.queue.provider.id === 0 && this.isUserdisable) {
                    this.showAssignMyself = true;
                }
                if (this.waitlist_data.queue.provider.id === 0 && this.waitlist_data.provider) {
                    this.showUnassign = true;
                }
                if (this.waitlist_data.queue.provider.id === 0 && this.users.length > 1) {
                    this.showAssign = true;
                }
                if (this.groups.length > 0 && this.waitlist_data.teamId === 0 && this.waitlist_data.queue.provider.id === 0) {
                    this.showAssignTeam = true;
                }
                if (this.waitlist_data.queue.provider.id === 0 && this.locations.length > 1) {
                    this.showAssignLocation = true;
                }
                if (this.waitlist_data.queue.provider.id === 0 && this.waitlist_data.teamId !== 0 && this.groups.length > 1) {
                    this.showChangeTeam = true;
                }
                if (this.waitlist_data.queue.provider.id === 0 && this.groups.length > 0 && this.waitlist_data.teamId !== 0) {
                    this.showUnassignTeam = true;
                }
            }
            if (this.waitlist_data.waitlistStatus !== 'blocked' && this.waitlist_data.waitlistStatus !== 'done') {
                this.showStatusChange = true;
            }
            if (this.showAssign || this.showAssignMyself || this.showUnassign || this.showAssignTeam || this.showUnassignTeam || this.showChangeTeam || this.showAssignLocation || this.waitlist_data.waitlistStatus === 'blocked' || this.showStatusChange || this.showTeleserviceStart) {
                this.showFirstSection = true;
            } else {
                this.showMoreActions = true;
            }
        } else {
            if (this.timeType === 1 && this.waitlist_data.service.livetrack && this.waitlist_data.apptStatus === 'Confirmed' && this.waitlist_data.jaldeeApptDistanceTime && this.waitlist_data.jaldeeApptDistanceTime.jaldeeDistanceTime && (this.waitlist_data.jaldeeStartTimeType === 'ONEHOUR' || this.waitlist_data.jaldeeStartTimeType === 'AFTERSTART')) {
                this.trackStatus = true;
            }
            if (this.timeType !== 3 && this.waitlist_data.apptStatus !== 'Cancelled' && this.waitlist_data.apptStatus !== 'Rejected' && this.waitlist_data.providerConsumer && (this.waitlist_data.providerConsumer.email || this.waitlist_data.providerConsumer.phoneNo)) {
                this.showSendDetails = true;
            }
            if ((this.waitlist_data.apptStatus === 'Arrived' || this.waitlist_data.apptStatus === 'Confirmed') && this.timeType !== 2 && (!this.waitlist_data.service.virtualCallingModes)) {
                this.showStart = true;
            }
            if ((this.timeType === 1 || this.timeType === 3) && this.waitlist_data.service.virtualCallingModes && (this.waitlist_data.apptStatus === 'Arrived' || this.waitlist_data.apptStatus === 'Confirmed' || this.waitlist_data.apptStatus === 'Started')) {
                this.showTeleserviceStart = true;
                if (this.waitlist_data.apptStatus === 'Started') {
                    this.servStarted = true;
                } else {
                    this.servStarted = false;
                }
                if (this.is_web && this.waitlist_data.apptStatus != 'Started' && this.waitlist_data.service.virtualCallingModes && this.waitlist_data.service.virtualCallingModes[0] && (this.waitlist_data.service.virtualCallingModes[0].callingMode === 'WhatsApp' || this.waitlist_data.service.virtualCallingModes[0].callingMode === 'Phone')) {
                    this.showInProgress = true;
                }
            }
            if (this.board_count > 0 && this.timeType === 1 && !this.waitlist_data.service.virtualCallingModes && (this.waitlist_data.apptStatus === 'Confirmed' || this.waitlist_data.apptStatus === 'Arrived')) {
                this.showCall = true;
            }
            if (this.active_user.accountType == 'BRANCH' && (this.waitlist_data.apptStatus === 'Arrived' || this.waitlist_data.apptStatus === 'Confirmed')) {
                if (this.active_user && this.active_user.userType == 1 && !this.waitlist_data.provider && this.waitlist_data.schedule.provider.id === 0 && this.isUserdisable) {
                    this.showAssignMyself = true;
                }
                if (this.waitlist_data.schedule.provider.id === 0 && this.waitlist_data.provider) {
                    this.showUnassign = true;
                }
                if (this.waitlist_data.schedule.provider.id === 0 && this.users.length > 1) {
                    this.showAssign = true;
                }
                if (this.groups.length > 0 && this.waitlist_data.teamId === 0 && this.waitlist_data.schedule.provider.id === 0) {
                    this.showAssignTeam = true;
                }
                if (this.waitlist_data.schedule.provider.id === 0 && this.locations.length > 1) {
                    this.showAssignLocation = true;
                }
                if (this.waitlist_data.schedule.provider.id === 0 && this.waitlist_data.teamId !== 0 && this.groups.length > 1) {
                    this.showChangeTeam = true;
                }
                if (this.waitlist_data.schedule.provider.id === 0 && this.groups.length > 0 && this.waitlist_data.teamId != 0) {
                    this.showUnassignTeam = true;
                }
            }
            if (this.waitlist_data.apptStatus !== 'blocked' && this.waitlist_data.apptStatus !== 'Completed') {
                this.showStatusChange = true;
            }
            if (this.showAssign || this.showAssignMyself || this.showUnassign || this.showAssignTeam || this.showUnassignTeam || this.showChangeTeam || this.showAssignLocation || this.waitlist_data.apptStatus === 'blocked' || this.showStatusChange || this.showTeleserviceStart) {
                this.showFirstSection = true;
            } else {
                this.showMoreActions = true;
            }
        }
        if (this.showTeleserviceStart) {
            this.getMeetingDetails();
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
    endmeeting() {
        let consumerName;
        if (this.bookingType == 'checkin') {
            consumerName = this.waitlist_data.waitlistingFor[0].firstName + ' ' + this.waitlist_data.waitlistingFor[0].lastName;
        } else {
            consumerName = this.waitlist_data.appmtFor[0].firstName + ' ' + this.waitlist_data.appmtFor[0].lastName;
        }
        const startTeledialogRef = this.dialog.open(TeleServiceConfirmBoxComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                message: 'Have you completed the',
                serviceDetail: this.waitlist_data.service,
                consumerName: consumerName,
                custmerLabel: this.customer_label,
                endmsg: 'teleserviceEnd',
                app: this.waitlist_data.service.virtualCallingModes[0].callingMode
            }
        });
        startTeledialogRef.afterClosed().subscribe(result => {
            if (result && result === 'completed') {
                this.changeWaitlistStatus('DONE');
            }
        });
    }
    changeWaitlistStatus(action) {
        if (this.bookingType == 'checkin') {
            this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, action);
        } else if (this.bookingType == 'appointment') {
            if (action === 'STARTED') {
                action = 'Started';
            }
            if (action === 'DONE') {
                action = 'Completed';
            }
            this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, action, 'appt');
        }
    }
    changeWaitlistStatusApi(waitlist, action, post_data = {}) {
        if (this.bookingType == 'checkin') {
            this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data, this.showTeleserviceStart)
                .then(
                    result => {
                        if (result) {
                            if (this.showTeleserviceStart) {
                                if (action === 'DONE') {
                                    this.snackbarService.openSnackBar('Meeting has been ended');
                                    this.sharedFunctions.sendMessage({ type: 'reload' });
                                } else {
                                    this.chkinTeleserviceJoinLink();
                                    if (this.waitlist_data.service.virtualCallingModes[0].callingMode === 'VideoCall') {
                                        this.router.navigate(['meeting', 'provider', this.waitlist_data.ynwUuid], { replaceUrl: true });
                                    } else {
                                        this.sharedFunctions.sendMessage({ type: 'reload' });
                                    }
                                }
                            } else {
                                this.sharedFunctions.sendMessage({ type: 'reload' });
                            }
                        }
                    },
                    error => {
                    });
        } else if (this.bookingType == 'appointment') {
            this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data, this.showTeleserviceStart)
                .then(
                    result => {
                        if (result) {
                            if (this.showTeleserviceStart) {
                                if (action === 'Completed') {
                                    this.snackbarService.openSnackBar('Meeting has been ended');
                                    this.sharedFunctions.sendMessage({ type: 'reload' });
                                } else {
                                    this.apptTeleserviceJoinLink();
                                    if (this.waitlist_data.service.virtualCallingModes[0].callingMode === 'VideoCall') {
                                        this.router.navigate(['meeting', 'provider', this.waitlist_data.uid], { replaceUrl: true });
                                    } else {
                                        this.sharedFunctions.sendMessage({ type: 'reload' });
                                    }
                                }
                            } else {
                                this.sharedFunctions.sendMessage({ type: 'reload' });
                            }
                        }
                    },
                    error => {
                    });
        }
    }  // Sending rest API to consumer and provider about service starting
    chkinTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.waitlist_data.service.virtualCallingModes[0].callingMode,
            'recipients': ['PROVIDER', 'CONSUMER']
        };
        this.shared_services.consumerWtlstTeleserviceWithId(uuid_data, this.waitlist_data.ynwUuid).
            subscribe((modeData) => {
            });
    }
    apptTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.waitlist_data.service.virtualCallingModes[0].callingMode,
            'recipients': ['PROVIDER', 'CONSUMER']
        };
        this.shared_services.consumerApptTeleserviceWithId(uuid_data, this.waitlist_data.uid).
            subscribe((modeData) => {
            });
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

    asktoLaunch() {
        if (!this.servStarted) {
            let consumerName;
            if (this.bookingType == 'checkin') {
                consumerName = this.waitlist_data.waitlistingFor[0].firstName + ' ' + this.waitlist_data.waitlistingFor[0].lastName;
            } else {
                consumerName = this.waitlist_data.appmtFor[0].firstName + ' ' + this.waitlist_data.appmtFor[0].lastName;
            }
            const startTeledialogRef = this.dialog.open(TeleServiceConfirmBoxComponent, {
                width: '50%',
                panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
                disableClose: true,
                data: {
                    message: 'Are you ready to start',
                    serviceDetail: this.waitlist_data.service,
                    consumerName: consumerName,
                    custmerLabel: this.customer_label,
                    readymsg: 'teleserviceStart',
                    meetingLink: this.starting_url,
                    app: this.waitlist_data.service.virtualCallingModes[0].callingMode
                }
            });
            startTeledialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result === 'started') {
                        if (this.bookingType == 'checkin') {
                            if (this.waitlist_data.waitlistStatus !== 'started') {
                                this.changeWaitlistStatus('STARTED');
                            } else if (this.waitlist_data.waitlistStatus === 'started') {
                                this.snackbarService.openSnackBar('Service already started!');
                                this.servStarted = true;
                            }
                        } else {
                            if (this.waitlist_data.apptStatus !== 'Started') {
                                this.changeWaitlistStatus('Started');
                            } else if (this.waitlist_data.apptStatus === 'Started') {
                                this.snackbarService.openSnackBar('Service already started!');
                                this.servStarted = true;
                            }
                        }
                    }
                }
            });
        } else {
            if (this.waitlist_data.service.virtualCallingModes[0].callingMode === 'VideoCall') {
                const uuid = (this.bookingType == 'checkin') ? this.waitlist_data.ynwUuid : this.waitlist_data.uid;
                this.router.navigate(['meeting', 'provider', uuid]);
            }
            if (this.waitlist_data.service.virtualCallingModes[0].callingMode !== 'Phone' && this.waitlist_data.service.virtualCallingModes[0].callingMode !== 'VideoCall') {
                window.open(this.starting_url, '_blank');
            }
            if (this.waitlist_data.service.virtualCallingModes[0].callingMode === 'Phone') {
                window.open('tel:' + this.starting_url, '_blank');
            }
        }
    }
    getMeetingDetails() {
        this.starting_url = '';
        if (this.bookingType === 'checkin') {
            this.shared_services.getWaitlstMeetingDetails(this.waitlist_data.service.virtualCallingModes[0].callingMode, this.waitlist_data.ynwUuid).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    if (this.waitlist_data.service.virtualCallingModes[0].callingMode === 'VideoCall') {
                        this.starting_url = this.meetlink_data.joiningUrl;
                    } else {
                        this.starting_url = this.meetlink_data.startingUl;
                    }
                });
        } else {
            this.shared_services.getApptMeetingDetails(this.waitlist_data.service.virtualCallingModes[0].callingMode, this.waitlist_data.uid).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    if (this.waitlist_data.service.virtualCallingModes[0].callingMode === 'VideoCall') {
                        this.starting_url = this.meetlink_data.joiningUrl;
                    } else {
                        this.starting_url = this.meetlink_data.startingUl;
                    }

                });
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
            this.sharedFunctions.sendMessage({ type: 'reload' });
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
            this.sharedFunctions.sendMessage({ type: 'reload' });
        });
    }
    unBlockWaitlist() {
        if (this.bookingType === 'checkin') {
            this.provider_services.deleteWaitlistBlock(this.waitlist_data.ynwUuid)
                .subscribe(
                    () => {
                        this.router.navigate(['provider', 'check-ins']);
                    },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        } else {
            this.provider_services.deleteAppointmentBlock(this.waitlist_data.uid)
                .subscribe(
                    () => {
                        this.router.navigate(['provider', 'appointments']);
                    },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        }
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
    getUser() {
        if (this.active_user.id) {
            this.provider_services.getUser(this.active_user.id)
                .subscribe((data: any) => {
                    this.users = data;
                    if (data.status === 'ACTIVE') {
                        this.isUserdisable = true
                    } else {
                        this.isUserdisable = false
                    }
                    this.getUserTeams();
                }, error => {
                });
        }
    }
    sendReminderorMeetingDetails(source) {
        let consumer;
        let consumerName;
        if (this.bookingType === 'checkin') {
            consumer = this.waitlist_data.consumer;
            consumerName = this.waitlist_data.waitlistingFor[0].firstName + ' ' + this.waitlist_data.waitlistingFor[0].lastName;
        } else {
            consumer = this.waitlist_data.providerConsumer;
            consumerName = this.waitlist_data.appmtFor[0].firstName + ' ' + this.waitlist_data.appmtFor[0].lastName;
        }
        let postData = {
            serviceDetail: this.waitlist_data.service,
            consumerName: consumerName,
            custmerLabel: this.customer_label,
            providerLabel: this.provider_label,
            meetingLink: this.starting_url,
            app: this.waitlist_data.service.virtualCallingModes[0].callingMode,
            waitingId: (this.bookingType === 'checkin') ? this.waitlist_data.ynwUuid : this.waitlist_data.uid,
            waitingType: this.bookingType,
            busnsName: this.busnes_name,
            consumerDetails: consumer
        };
        if (source === 'reminder') {
            postData['reminder'] = 'reminder';
            postData['status'] = this.servStarted;
        } else {
            postData['token'] = this.waitlist_data.token;
            postData['checkInTime'] = this.waitlist_data.checkInTime;
            postData['meetingDetail'] = 'meetingdetails';
        }
        const startTeledialogRef = this.dialog.open(TeleServiceShareComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'popup-class'],
            disableClose: true,
            data: postData
        });
        startTeledialogRef.afterClosed().subscribe(result => {
        });
    }
    showActions() {
        this.showMoreActions = !this.showMoreActions;
    }
    showActionsPopup(source) {
        this.dialog.open(ActionsPopupComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
            disableClose: true,
            data: {
                bookingType: this.bookingType,
                waitlist_data: this.waitlist_data,
                source: source,
                timeType: this.timeType,
                is_web: this.is_web,
                showAssign: this.showAssign,
                showUnassign: this.showUnassign,
                showAssignTeam: this.showAssignTeam,
                showAssignMyself: this.showAssignMyself,
                showAssignLocation: this.showAssignLocation,
                showChangeTeam: this.showChangeTeam,
                showUnassignTeam: this.showUnassignTeam
            }
        });
    }
    getUserTeams() {
        this.provider_services.getTeamGroup().subscribe((data: any) => {
            this.groups = data;
            this.getProviderLocation();
        });
    }
    addCustomerDetails() {
        let virtualServicemode;
        let virtualServicenumber;
        if (this.waitlist_data.virtualService) {
            Object.keys(this.waitlist_data.virtualService).forEach(key => {
                virtualServicemode = key;
                virtualServicenumber = this.waitlist_data.virtualService[key];
            });
        }
        if (this.bookingType == 'checkin') {
            this.router.navigate(['provider', 'check-ins', 'add'], { queryParams: { source: 'waitlist-block', uid: this.waitlist_data.ynwUuid, showtoken: this.showToken, virtualServicemode: virtualServicemode, virtualServicenumber: virtualServicenumber, serviceId: this.waitlist_data.service.id, waitlistMode: this.waitlist_data.waitlistMode } });
        } else {
            this.router.navigate(['provider', 'appointments', 'appointment'], { queryParams: { source: 'appt-block', uid: this.waitlist_data.uid, virtualServicemode: virtualServicemode, virtualServicenumber: virtualServicenumber, serviceId: this.waitlist_data.service.id, apptMode: this.waitlist_data.appointmentMode } });
        }
    }
    getProviderLocation() {
        this.provider_services.getProviderLocations()
            .subscribe(
                (data: any) => {
                    this.locations = data;
                    this.setActions();
                });
    }
    showLabels() {
        if (this.bookingType === 'checkin') {
            const actiondialogRef = this.dialog.open(CheckinActionsComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
                disableClose: true,
                data: {
                    checkinData: this.waitlist_data,
                    timetype: this.timeType,
                    type: 'label'
                }
            });
            actiondialogRef.afterClosed().subscribe(data => {
                this.sharedFunctions.sendMessage({ type: 'reload' });
            });
        } else {
            const actiondialogRef = this.dialog.open(AppointmentActionsComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
                disableClose: true,
                data: {
                    checkinData: this.waitlist_data,
                    timetype: this.timeType,
                    type: 'label'
                }
            });
            actiondialogRef.afterClosed().subscribe(data => {
                this.sharedFunctions.sendMessage({ type: 'reload' });
            });
        }
    }
    viewRecordings() {
        const smsdialogRef = this.dialog.open(ListRecordingsDialogComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: {
                recordingUrls: this.waitlist_data.s3VideoUrls
            }
        });
        smsdialogRef.afterClosed().subscribe(result => {
        });
    }
}
