import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { MatDialog } from '@angular/material/dialog';
import { TeleServiceConfirmBoxComponent } from './teleservice-confirm-box/teleservice-confirm-box.component';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { TeleServiceShareComponent } from './teleservice-share/teleservice-share.component';
import { Location } from '@angular/common';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { CheckinActionsComponent } from '../check-ins/checkin-actions/checkin-actions.component';
import { AppointmentActionsComponent } from '../appointments/appointment-actions/appointment-actions.component';


@Component({
    selector: 'app-teleservice',
    templateUrl: './teleservice.component.html',
    styleUrls: ['./teleservice.component.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../assets/css/style.bundle.css']
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
    api_loading = true;
    step = 1;
    startTeledialogRef: any;
    consumer_lname: any;
    starting_url: string;
    meetlink_data;
    servStarted = false;
    serv_type: any;
    phoneNumber: any;
    uuid: any;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public shared_services: SharedServices,
        private router: Router, public _location: Location,
        private dialog: MatDialog,
        private provider_shared_functions: ProviderSharedFuctions,
        private wordProcessor: WordProcessor,
        private snackbarService: SnackbarService,
        private groupService: GroupStorageService
    ) {
        this.activateroute.queryParams.subscribe(params => {
            this.waiting_id = params.waiting_id;
            this.waiting_type = params.type;
        });
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
        this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    }
    ngOnInit() {
        this.api_loading = true;
        this.ynwUser = this.groupService.getitemFromGroupStorage('ynw-user');
        if (this.waiting_type === 'checkin') {
            this.getProviderWaitlstById();
        } else {
            this.getProviderApptById();
        }
        this.notSupported = this.wordProcessor.getProjectMesssages('TELE_NOT_SUPPORTED');
        this.availableMsg = this.wordProcessor.getProjectMesssages('IS_AVAILABLE');
        this.ph_or_tab_cap = this.wordProcessor.getProjectMesssages('PHONE_OR_TAB');
        this.installed_cap = this.wordProcessor.getProjectMesssages('IS_INSTALD');

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
                    this.uuid = this.data.ynwUuid;
                    console.log(this.data);
                    if (this.data.waitlistStatus === 'started') {
                        this.servStarted = true;
                    } else {
                        this.servStarted = false;
                    }
                    this.callingModes = this.data.service.virtualCallingModes[0].callingMode;
                    this.serv_type = this.data.service.virtualServiceType;
                    if (this.data.provider) {
                        this.busnes_name = this.data.provider.firstName + ' ' + this.data.provider.lastName;
                    } else {
                        this.busnes_name = this.data.providerAccount.businessName;
                    }
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
                    this.api_loading = false;
                });
    }
    getProviderApptById() {
        this.provider_services.getAppointmentById(this.waiting_id)
            .subscribe(
                data => {
                    this.data = data;
                    console.log(this.data);
                    this.uuid = this.data.uid;
                    if (this.data.apptStatus === 'Started') {
                        this.servStarted = true;
                    } else {
                        this.servStarted = false;
                    }
                    this.callingModes = this.data.service.virtualCallingModes[0].callingMode;
                    this.serv_type = this.data.service.virtualServiceType;
                    if (this.data.provider) {
                        this.busnes_name = this.data.provider.firstName + ' ' + this.data.provider.lastName;
                    } else {
                        this.busnes_name = this.data.providerAccount.businessName;
                    }
                    //  this.busnes_name = this.data.providerAccount.businessName;
                    this.serv_name = this.data.service.name;
                    this.servDetails = this.data.service;
                    this.phoneNumber = this.servDetails.virtualCallingModes[0].value;

                    this.getMeetingDetails();
                    if (this.data.providerConsumer.email) {
                        this.emailPresent = true;
                    }
                    // this.apptTeleserviceJoinLink();
                    this.consumer_fname = this.data.appmtFor[0].userName;
                    this.api_loading = false;
                });
    }

    // Back btn navigation
    redirecToPreviousPage() {
        // if (this.step === 1) {
        if (this.callingModes === 'VideoCall') {
            if (this.waiting_type === 'appt') {
                this.router.navigate(['provider', 'appointments']);
            } else {
                this.router.navigate(['provider', 'check-ins']);
            }

        } else {
            this._location.back();
        }

        // }
        // const navigationExtras: NavigationExtras = {
        //     queryParams: {
        //         servStatus: this.servStarted
        //     }
        // };
        // if (this.waiting_type === 'checkin') {
        //     if (this.servStarted) {
        //         this.router.navigate(['provider', 'check-ins'], navigationExtras);
        //     } else {
        //         this.router.navigate(['provider', 'check-ins']);
        //     }
        // } else {
        //     if (this.servStarted) {
        //         this.router.navigate(['provider', 'appointments'], navigationExtras);
        //     } else {
        //         this.router.navigate(['provider', 'appointments']);
        //     }
        // }
    }

    // Asking to start the meeting
    asktoLaunch() {
        this.startTeledialogRef = this.dialog.open(TeleServiceConfirmBoxComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                message: 'Are you ready to start',
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
                    if (this.waiting_type === 'checkin') {
                        if (this.data.waitlistStatus !== 'started') {
                            this.changeWaitlistStatus(this.data, 'STARTED');
                        } else if (this.data.waitlistStatus === 'started') {
                            this.snackbarService.openSnackBar('Service already started!');
                            this.servStarted = true;
                        }
                        // this.chkinTeleserviceJoinLink();
                    } else {
                        if (this.data.apptStatus !== 'Started') {
                            this.changeWaitlistStatus(this.data, 'Started');
                        } else if (this.data.apptStatus === 'Started') {
                            this.snackbarService.openSnackBar('Service already started!');
                            this.servStarted = true;
                        }
                        //  this.apptTeleserviceJoinLink();
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
                    console.log(meetingdata);
                    this.meetlink_data = meetingdata;
                    if (this.callingModes === 'VideoCall') {
                        this.starting_url = this.meetlink_data.joiningUrl;
                    } else {
                        this.starting_url = this.meetlink_data.startingUl;
                    }
                });
        } else {
            this.shared_services.getApptMeetingDetails(this.callingModes, this.waiting_id).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    if (this.callingModes === 'VideoCall') {
                        this.starting_url = this.meetlink_data.joiningUrl;
                    } else {
                        this.starting_url = this.meetlink_data.startingUl;
                    }

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
        this.api_loading = true;
        if (this.waiting_type === 'checkin') {
            this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data, true)
                .then(result => {
                    if (result) {
                        // this.servStarted = true;
                        if (action === 'DONE') {
                            this.snackbarService.openSnackBar('Meeting has been ended');
                            this.router.navigate(['provider', 'check-ins']);
                        } else {
                            // console.log(this.starting_url);
                            this.chkinTeleserviceJoinLink();
                            // if (this.callingModes !== 'VideoCall') {
                            // const path = this.callingModes === 'Phone' ? 'tel:' + this.starting_url : this.starting_url;
                            // window.open(path, '_blank');
                            // this.shared_functions.openWindow(path);
                            // } else {
                            if (this.callingModes === 'VideoCall') {
                                // const usertype = this.shared_functions.isBusinessOwner('returntyp')
                                // console.log(usertype)
                                // const startIndex = this.starting_url.lastIndexOf('/');
                                // const videoId = this.starting_url.substring((startIndex + 1), this.starting_url.length);
                                // const navigationExtras: NavigationExtras = {
                                //     queryParams: {
                                //       uu_id: this.uuid,
                                //       type: usertype
                                //     }
                                //   };
                                //   console.log(navigationExtras)
                                console.log(this.uuid);
                                this.router.navigate(['meeting', 'provider', this.uuid], { replaceUrl: true });
                            } else {
                                this.getProviderWaitlstById();
                            }

                        }
                    }
                }, error => {
                    this.api_loading = false;
                }
                );
        } else {
            console.log(action);
            this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data, true)
                .then(result => {
                    if (result) {
                        if (action === 'Completed') {
                            this.snackbarService.openSnackBar('Meeting has been ended');
                            this.router.navigate(['provider', 'appointments']);
                        } else {
                            this.apptTeleserviceJoinLink();
                            // if (this.callingModes !== 'VideoCall') {
                            // const path = this.callingModes === 'Phone' ? 'tel:' + this.starting_url : this.starting_url;
                            // window.open(path, '_blank');
                            // this.shared_functions.openWindow(path);
                            // } else
                            if (this.callingModes === 'VideoCall') {
                                // const usertype = this.shared_functions.isBusinessOwner('returntyp')
                                // console.log(usertype)
                                // const startIndex = this.starting_url.lastIndexOf('/');
                                // const videoId = this.starting_url.substring((startIndex + 1), this.starting_url.length);
                                // const navigationExtras: NavigationExtras = {
                                //     queryParams: {
                                //       uu_id: this.uuid,
                                //       type: usertype
                                //     }
                                //   };
                                this.router.navigate(['meeting', 'provider', this.uuid], { replaceUrl: true });
                                // this.shared_services.getVideoIdForService(waitlist.uid, 'provider').subscribe(
                                //     (videoId: any) => {
                                //         this.router.navigate(['provider', 'video', videoId]);
                                //     }
                                // );
                            } else {
                                this.getProviderApptById();
                            }

                        }
                    }
                }, error => {
                    this.api_loading = false;
                });
        }
    }

    // Asking to end the meeting
    endmeeting() {
        this.startTeledialogRef = this.dialog.open(TeleServiceConfirmBoxComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                message: 'Have you completed the',
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
                        this.changeWaitlistStatus(this.data, 'DONE');
                        this.redirecToPreviousPage();
                    } else {
                        this.changeWaitlistStatus(this.data, 'Completed');
                        this.redirecToPreviousPage();
                    }
                }
            }
        });
    }
    relauchMeeting(startingUrl) {
        // const usertype = this.shared_functions.isBusinessOwner('returntyp')
        // console.log(usertype)
        // const startIndex = startingUrl.lastIndexOf('/');
        // const videoId = startingUrl.substring((startIndex + 1), startingUrl.length);
        // const navigationExtras: NavigationExtras = {
        //     queryParams: {
        //       uu_id: this.uuid,
        //       type: usertype
        //     }
        //   };
        // this.router.navigate(['meeting', this.phoneNumber, videoId], navigationExtras);
        this.router.navigate(['meeting', 'provider', this.uuid]);
    }
    // Sending rest API to consumer and provider about service starting
    chkinTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.callingModes,
            'recipients': ['PROVIDER', 'CONSUMER']
        };
        this.shared_services.consumerWtlstTeleserviceWithId(uuid_data, this.waiting_id).
            subscribe((modeData) => {
            });
    }
    apptTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.callingModes,
            'recipients': ['PROVIDER', 'CONSUMER']
        };
        this.shared_services.consumerApptTeleserviceWithId(uuid_data, this.waiting_id).
            subscribe((modeData) => {
            });
    }

    // Reminder popup
    reminder() {
        let consumer;
        if (this.waiting_type === 'checkin') {
            consumer = this.data.consumer;
        } else {
            consumer = this.data.providerConsumer;
        }
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
                busnsName: this.busnes_name,
                status: this.servStarted,
                consumerDetails: consumer
            }
        });
        this.startTeledialogRef.afterClosed().subscribe(result => {

        });
    }

    // Meeting detail popup
    meetingDetails() {
        let consumer;
        if (this.waiting_type === 'checkin') {
            consumer = this.data.consumer;
        } else {
            consumer = this.data.providerConsumer;
        }
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
                busnsName: this.busnes_name,
                token: this.data.token,
                checkInTime: this.data.checkInTime,
                consumerDetails: consumer
            }
        });
        this.startTeledialogRef.afterClosed().subscribe(result => {
        });
    }
    shareBookingActions() {
        if (this.waiting_type === 'checkin') {
            const type = this.groupService.getitemFromGroupStorage('pdtyp');
            const actiondialogRef = this.dialog.open(CheckinActionsComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
                disableClose: true,
                data: {
                    checkinData: this.data,
                    timetype: type,
                    multiSelection: false,
                    status: status,
                    teleservice: true
                }
            });
            actiondialogRef.afterClosed().subscribe(data => {
            });
        } else {
            const type = this.groupService.getitemFromGroupStorage('apptType');
            const actiondialogRef = this.dialog.open(AppointmentActionsComponent, {
                width: '50%',
                panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
                disableClose: true,
                data: {
                    checkinData: this.data,
                    timetype: type,
                    multiSelection: false,
                    status: status,
                    teleservice: true
                }
            });
            actiondialogRef.afterClosed().subscribe(data => {
            });
        }
    }
    getAge(age) {
        age = age.split(',');
        return age[0];
    }
}
