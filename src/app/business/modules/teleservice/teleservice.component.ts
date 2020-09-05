import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { TeleServiceConfirmBoxComponent } from './teleservice-confirm-box/teleservice-confirm-box.component';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { TeleServiceShareComponent } from './teleservice-share/teleservice-share.component';


@Component({
    selector: 'app-teleservice',
    templateUrl: './teleservice.component.html',
    styleUrls: ['./teleservice.component.css']
})
export class TeleServiceComponent implements OnInit {
    customer_label: any;
    provider_label: any;
    ynwUser: any;
    waiting_id: any;
    waiting_type: any;
    notSupported: any;
    availableMsg: any;
    ph_or_tab_cap: any;
    installed_cap: any;
    is_android: boolean;
    is_ios: boolean;
    is_web = false;
    data;
    callingModes: any;
    busnes_name: any;
    serv_name: any;
    servDetails: any;
    emailPresent: boolean;
    consumer_fname: any;
    phNo: any;
    api_loading = false;
    step = 1;
    startTeledialogRef: any;
    consumer_lname: any;
    starting_url: string;
    meetlink_data;
    servStarted = false;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public shared_services: SharedServices,
        private _location: Location,
        private router: Router,
        private dialog: MatDialog,
        private provider_shared_functions: ProviderSharedFuctions,
    ) {
        this.activateroute.queryParams.subscribe(params => {
            this.waiting_id = params.waiting_id;
            this.waiting_type = params.type;
        });
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.provider_label = this.shared_functions.getTerminologyTerm('provider');
    }
    ngOnInit() {
        this.ynwUser = this.shared_functions.getitemFromGroupStorage('ynw-user');
        if (this.waiting_type === 'checkin') {
            this.getProviderWaitlstById();
        } else {
            this.getProviderApptById();
        }
        this.notSupported = this.shared_functions.getProjectMesssages('TELE_NOT_SUPPORTED');
        this.availableMsg = this.shared_functions.getProjectMesssages('IS_AVAILABLE');
        this.ph_or_tab_cap = this.shared_functions.getProjectMesssages('PHONE_OR_TAB');
        this.installed_cap = this.shared_functions.getProjectMesssages('IS_INSTALD');

        // checking the device
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
        if (isMobile.Android()) {
            this.is_android = true;
        } else if (isMobile.iOS()) {
            this.is_ios = true;
        } else {
            this.is_web = true;
        }
    }

    // For getting the details of checkin/appt data by Id
    getProviderWaitlstById() {
        this.provider_services.getProviderWaitlistDetailById(this.waiting_id)
            .subscribe(
                data => {
                    this.data = data;
                    console.log(this.data);
                    if (this.data.waitlistStatus === 'started') {
                        this.servStarted = true;
                    } else {
                        this.servStarted = false;
                    }
                    this.callingModes = this.data.service.virtualCallingModes[0].callingMode;
                    this.busnes_name = this.data.providerAccount.businessName;
                    this.serv_name = this.data.service.name;
                    this.servDetails = this.data.service;
                    if (this.data.waitlistingFor[0].email) {
                        this.emailPresent = true;
                    }
                    this.getMeetingDetails();
                    if (this.waiting_type === 'checkin') {
                      //  this.chkinTeleserviceJoinLink();
                        this.consumer_fname = this.data.waitlistingFor[0].firstName;
                        this.consumer_lname = this.data.waitlistingFor[0].lastName;
                        if (this.data.waitlistingFor[0].phoneNo) {
                            this.phNo = this.data.waitlistingFor[0].phoneNo;
                        }
                    }
                });
    }
    getProviderApptById() {
        this.provider_services.getAppointmentById(this.waiting_id)
            .subscribe(
                data => {
                    this.data = data;
                    console.log(this.data);
                    if (this.data.apptStatus === 'Started') {
                        this.servStarted = true;
                    } else {
                        this.servStarted = false;
                    }
                    this.callingModes = this.data.service.virtualCallingModes[0].callingMode;
                    this.busnes_name = this.data.providerAccount.businessName;
                    this.serv_name = this.data.service.name;
                    this.servDetails = this.data.service;
                    if (this.data.providerConsumer.email) {
                        this.emailPresent = true;
                    }
                    this.getMeetingDetails();
                   // this.apptTeleserviceJoinLink();
                    this.consumer_fname = this.data.appmtFor[0].userName;
                });
    }

    // Back btn navigation
    redirecToPreviousPage() {
        if (this.step === 1) {
            this._location.back();
        }
    }

    // Asking to start the meeting
    asktoLaunch() {
        this.startTeledialogRef = this.dialog.open(TeleServiceConfirmBoxComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                message: 'Are you ready to start ?',
                serviceDetail: this.servDetails,
                consumerName: this.consumer_fname,
                custmerLabel: this.customer_label,
                readymsg: 'teleserviceStart',
                meetingLink: this.starting_url,
                app: this.callingModes
            }
        });
        this.startTeledialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result === 'started') {
                    this.servStarted = true;
                    if (this.waiting_type === 'checkin') {
                        if (this.data.waitlistStatus !== 'started') {
                            this.changeWaitlistStatus(this.data, 'STARTED');
                        } else if (this.data.waitlistStatus === 'started') {
                            this.shared_functions.openSnackBar('Service already started!');
                        }
                         this.chkinTeleserviceJoinLink();
                    } else {
                        if (this.data.apptStatus !== 'Started') {
                            this.changeWaitlistStatus(this.data, 'Started');
                        } else if (this.data.apptStatus === 'Started') {
                            this.shared_functions.openSnackBar('Service already started!');
                        }
                            this.apptTeleserviceJoinLink();
                    }
                }
            }
        });
    }

    // For getting meeting link from rest(GET URL)
    getMeetingDetails() {
        this.starting_url = '';
        if (this.waiting_type === 'checkin') {
            this.shared_services.getWaitlstMeetingDetails(this.callingModes, this.waiting_id).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    this.starting_url = this.meetlink_data.startingUl;
                });
        } else {
            this.shared_services.getApptMeetingDetails(this.callingModes, this.waiting_id).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    this.starting_url = this.meetlink_data.startingUl;

                });
        }
    }

    // changing status to start/complete
    changeWaitlistStatus(qdata, action) {
        qdata.disableStartbtn = true;
        if (this.waiting_type === 'checkin') {
            this.provider_shared_functions.changeWaitlistStatus(this, qdata, action);
        } else {
            this.provider_shared_functions.changeWaitlistStatus(this, qdata, action, 'appt');
        }
    }
    changeWaitlistStatusApi(waitlist, action, post_data = {}) {
        if (this.waiting_type === 'checkin') {
            this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data, true)
                .then(result => {
                    console.log(result);
                    if (result) {
                        if (action === 'DONE') {
                            this.shared_functions.openSnackBar('Meeting has been ended');
                            this.router.navigate(['provider', 'check-ins']);
                        } else {
                            this.getProviderWaitlstById();
                        }
                    }
                }
                );
        } else {
            this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data, true)
                .then(result => {
                    console.log(result);
                    if (result) {
                        if (action === 'Completed') {
                            this.shared_functions.openSnackBar('Meeting has been ended');
                            this.router.navigate(['provider', 'appointments']);
                        } else {
                            this.getProviderApptById();
                        }
                    }
                }
                );
        }
    }

    // Asking to end the meeting
    endmeeting() {
        this.startTeledialogRef = this.dialog.open(TeleServiceConfirmBoxComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                message: 'Have you completed the service?',
                serviceDetail: this.servDetails,
                consumerName: this.consumer_fname,
                custmerLabel: this.customer_label,
                endmsg: 'teleserviceEnd',
                app: this.callingModes
            }
        });
        this.startTeledialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result === 'completed') {
                    if (this.waiting_type === 'checkin') {
                        if (this.data.waitlistStatus === 'started') {
                            this.changeWaitlistStatus(this.data, 'DONE');
                        } else {
                            this.changeWaitlistStatus(this.data, 'STARTED');
                            setTimeout(() => {
                                this.changeWaitlistStatus(this.data, 'DONE');
                            }, 300);
                        }
                        this.redirecToPreviousPage();
                    } else {
                        if (this.data.apptStatus === 'Started') {
                            this.changeWaitlistStatus(this.data, 'Completed');
                        } else {
                            this.changeWaitlistStatus(this.data, 'Started');
                            setTimeout(() => {
                                this.changeWaitlistStatus(this.data, 'Completed');
                            }, 300);
                        }
                        this.redirecToPreviousPage();
                    }
                }
            }
        });
    }

    // Sending rest API to consumer and provider about service starting
    chkinTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.callingModes
        };
        this.shared_services.consumerWtlstTeleserviceWithId(uuid_data, this.waiting_id).
            subscribe((modeData) => {
            });
    }
    apptTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.callingModes
        };
        this.shared_services.consumerApptTeleserviceWithId(uuid_data, this.waiting_id).
            subscribe((modeData) => {
            });
    }

    // Reminder popup
    reminder() {
        this.startTeledialogRef = this.dialog.open(TeleServiceShareComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'popup-class'],
            disableClose: true,
            data: {
                serviceDetail: this.servDetails,
                consumerName: this.consumer_fname,
                custmerLabel: this.customer_label,
                providerLabel: this.provider_label,
                reminder: 'reminder',
                meetingLink: this.starting_url,
                app: this.callingModes,
                waitingId: this.waiting_id,
                waitingType: this.waiting_type,
                busnsName : this.busnes_name,
                status: this.servStarted
            }
        });
        this.startTeledialogRef.afterClosed().subscribe(result => {

        });
    }

    // Meeting detail popup
    meetingDetails() {
        this.startTeledialogRef = this.dialog.open(TeleServiceShareComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'popup-class'],
            disableClose: true,
            data: {
                serviceDetail: this.servDetails,
                consumerName: this.consumer_fname,
                custmerLabel: this.customer_label,
                providerLabel: this.provider_label,
                meetingDetail: 'meetingdetails',
                meetingLink: this.starting_url,
                app: this.callingModes,
                waitingId: this.waiting_id,
                waitingType: this.waiting_type,
                busnsName : this.busnes_name,
                token: this.data.token,
                checkInTime: this.data.checkInTime
            }
        });
        this.startTeledialogRef.afterClosed().subscribe(result => {

        });
    }
}
