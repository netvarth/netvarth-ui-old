import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { projectConstants } from '../../../app.component';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { Location } from '@angular/common';



@Component({
    selector: 'app-calling-modes',
    templateUrl: './calling-modes.component.html',
    styleUrls: ['./calling-modes.component.css']
})
export class CallingModesComponent implements OnInit, OnDestroy {
    callingModes;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    msg_to_user;
    sms = true;
    email = true;
    pushnotify = true;
    //  disableButton = false;
    api_success = null;
    medialink;
    show_link_only = false;
    showcomm = false;
    chipValue: any;
    videonote = false;
    step = 1;
    busnes_name: any;
    consumer_fname: any;
    consumer_lname: any;
    appt_time: any;
    is_android: boolean;
    is_ios: boolean;
    is_web: boolean;
    meetlink_data: any;
    starting_url: any;
    show_note: boolean;
    customer_label: any;
    serv_name: any;
    date: any;
    time: any;
    location: any;
    jalde_q_id;
    serv_provider: any;
    is_started = false;
    btndisabled = false;
    launch = false;
    settings: any = [];
    showToken = false;
    servDetails: any;
    notSupported: any;
    sendMeetingDetails: any;
    availableMsg: any;
    ph_or_tab_cap: any;
    installed_cap: any;
    reminder_cap: any;
    selectedTime = '1 Minute';
    minute = [
        { value: '1 Minute', viewValue: '1 Minute' },
        { value: '5 Minutes', viewValue: '5 Minutes' },
        { value: '10 Minutes', viewValue: '10 Minutes' },
        { value: '30 Minutes', viewValue: '30 Minutes' },
        { value: '1 Hour', viewValue: '1 Hour' }
    ];
    provider_label: any;
    phNo: any;
    time_min: any;
    data: any;
    waiting_id: any;
    waiting_type: any;
    api_loading = false;
    emailPresent = false;
    user_type = 'me';
    usrSelected = 'me';
    isPrevStep = false;
    serviceProgress = false;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public shared_services: SharedServices,
        private provider_shared_functions: ProviderSharedFuctions,
        private _location: Location,
        private router: Router
    ) {
        this.activateroute.queryParams.subscribe(params => {
            this.waiting_id = params.waiting_id;
            this.waiting_type = params.type;
        });
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.provider_label = this.shared_functions.getTerminologyTerm('provider');
    }
    ngOnInit() {
        if (this.waiting_type === 'checkin') {
            this.getProviderWaitlstById();
        } else {
            this.getProviderApptById();
        }
        this.notSupported = this.shared_functions.getProjectMesssages('TELE_NOT_SUPPORTED');
        this.sendMeetingDetails = this.shared_functions.getProjectMesssages('SENDING_MEET_DETAILS');
        this.availableMsg = this.shared_functions.getProjectMesssages('IS_AVAILABLE');
        this.ph_or_tab_cap = this.shared_functions.getProjectMesssages('PHONE_OR_TAB');
        this.installed_cap = this.shared_functions.getProjectMesssages('IS_INSTALD');
        this.reminder_cap = this.shared_functions.getProjectMesssages('SEND_REMINDER');
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

        this.getProviderSettings();

        // timer
    }
    ngOnDestroy() {
        // this.destroy$.next();
    }
    getProviderSettings() {
        this.provider_services.getWaitlistMgr()
            .subscribe(data => {
                this.settings = data;
                this.showToken = this.settings.showTokenId;
            }, () => {
            });
    }
    selectHeadsup(stp6?) {
        console.log(stp6);
        this.msg_to_user = '';
        // this.getMeetingDetails();
        this.isPrevStep = false;
        this.step = 2;
        if (stp6) {
            this.isPrevStep = true;
        }
        if (this.isPrevStep) {
            if (this.callingModes !== 'Phone') {
                this.msg_to_user = 'Here are the details for how to start the service -\n1. Click on the following link - ' + this.starting_url + '\n2. Wait for your ' + this.provider_label + ' to join';
            } else {
                this.msg_to_user = 'Your ' + this.serv_name + ' with ' + this.busnes_name + ' is on progress';
            }
        } else {
            switch (this.callingModes) {
                case 'WhatsApp':
                    this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.serv_name + ' via WhatsApp with ' + this.busnes_name + ' will begin. Please be ready.\n\nSteps to follow to start the WhatsApp consultation: \n\n1. Wait for your turn.\n\n2. When it is time you will recieve a WhatsApp call from ' + this.busnes_name ;
                  break;
                case 'Phone':
                    this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.serv_name + ' with ' + this.busnes_name + ' will begin.\n\nYou will receive a ' + this.callingModes + ' call from ' + this.busnes_name + '. Please be ready.';
                  break;
                case 'Zoom':
                    this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.serv_name + ' with ' + this.busnes_name + ' will begin. Please be ready.\n\nHere are the details for how to start the service -\n1. Click on the following link - ' + this.starting_url + ' \n2. Wait for your ' + this.provider_label + ' to join';
                  break;
                case 'GoogleMeet':
                    this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.serv_name + ' with ' + this.busnes_name + ' will begin. Please be ready.\n\nHere are the details for how to start the service -\n1. Click on the following link - ' + this.starting_url + '\n2. Wait for your ' + this.provider_label + ' to join';
                  break;
              }
        }
        // if (this.callingModes !== 'Phone') {
        //     if (this.isPrevStep) {
        //         this.msg_to_user = 'Here are the details for how to start the service -\n\n 1. Click on the following link - ' + this.starting_url + ' \n\n 2. Wait for your ' + this.provider_label + ' to join';
        //     } else {
        //         this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.serv_name + ' with ' + this.busnes_name + ' will begin. Please be ready.\n\n Here are the details for how to start the service -\n\n 1. Click on the following link - ' + this.starting_url + ' \n\n 2. Wait for your ' + this.provider_label + ' to join';
        //     }
        // } else {
        //     if (this.isPrevStep) {
        //         this.msg_to_user = 'Your ' + this.serv_name + ' with ' + this.busnes_name + ' is on progress';
        //     } else {
        //         this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.serv_name + ' with ' + this.busnes_name + ' will begin.\n\n You will receive a ' + this.callingModes + ' call from ' + this.busnes_name + ' Please be ready.';
        //     }
        // }
    }
    selectAlrdyWaiting() {
        // if (this.callingModes === 'WhatsApp' && this.data.qdata.service.virtualServiceType === 'videoService') {
        //     this.msg_to_user = 'I am waiting for you to start the video call';
        // } else if (this.data.qdata.service.virtualServiceType === 'audioService') {
        //     this.msg_to_user = 'I am waiting for you to start the audio call';
        // } else {
        //     this.msg_to_user = 'I am waiting for you to start the video call. Here is the meeting details ' + this.temp_msglink;
        // }
    }
    clicktoSend() {
        if (this.waiting_type === 'checkin') {
            this.chkinTeleserviceJoinLink();
        } else {
            this.apptTeleserviceJoinLink();
        }
    }
    selectCompleted() {
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
    sendMessage() {
        console.log(this.isPrevStep);
        const post_data = {
            medium: {
                email: this.email,
                sms: this.sms,
                pushNotification: this.pushnotify
            },
            communicationMessage: this.msg_to_user,
            uuid: [this.waiting_id]
        };
        if (this.waiting_type === 'checkin') {
            this.shared_services.consumerMassCommunication(post_data).
                subscribe(() => {
                    //   this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
                    this.shared_functions.openSnackBar(Messages.PROVIDERTOCONSUMER_NOTE_ADD);
                    if (this.isPrevStep) {
                        this.step = 6;
                    } else {
                        this.step = 1;
                    }
                    setTimeout(() => {
                        this.api_success = '';
                    }, 5000);
                }
                );
        } else {
            this.shared_services.consumerMassCommunicationAppt(post_data).
                subscribe(() => {
                    // this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
                    this.shared_functions.openSnackBar(Messages.PROVIDERTOCONSUMER_NOTE_ADD);
                    if (this.isPrevStep) {
                        this.step = 6;
                    } else {
                        this.step = 1;
                    }
                    setTimeout(() => {
                        this.api_success = '';
                    }, 5000);
                }
                );
        }
    }
    chkinTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.callingModes
        };
        this.shared_services.consumerWtlstTeleserviceWithId(uuid_data, this.waiting_id).
            subscribe((modeData) => {
                this.medialink = modeData;
                // this.msg_to_user = this.medialink.startingUl;
                //  this.api_success = Messages.TELESERVICE_SHARE_LINK.replace('[customer]', this.customer_label);
                setTimeout(() => {
                    this.api_success = '';
                }, 5000);
            });
    }
    apptTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.callingModes
        };
        this.shared_services.consumerApptTeleserviceWithId(uuid_data, this.waiting_id).
            subscribe((modeData) => {
                this.medialink = modeData;
                //  this.msg_to_user = this.medialink.startingUl;
                // this.api_success = Messages.TELESERVICE_SHARE_LINK.replace('[customer]', this.customer_label);
                setTimeout(() => {
                    this.api_success = '';
                }, 5000);
            });
    }
    dataChanged(evt) {
        this.msg_to_user = evt;
    }
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
                    if (action === 'DONE') {
                        this.shared_functions.openSnackBar('Meeting has been ended');
                        this.router.navigate(['provider', 'check-ins']);
                    } else {
                        this.getProviderWaitlstById();
                    }
                }
                );
        } else {
            this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data, true)
                .then(result => {
                    if (action === 'Completed') {
                        this.shared_functions.openSnackBar('Meeting has been ended');
                        this.router.navigate(['provider', 'appointments']);
                    } else {
                        this.getProviderApptById();
                    }
                }
                );
        }
    }

    meetingDetails(stp6?) {
        this.isPrevStep = false;
        if (stp6) {
            this.isPrevStep = true;
        }
        this.getMeetingDetails('me');
        this.step = 4;
    }
    reminder() {
        // this.getMeetingDetails();
        this.msg_to_user = '';
        this.selectHeadsup();
    }
    waitingFor() {
        this.step = 3;
        this.getMeetingDetails();
        this.selectAlrdyWaiting();
    }
    back() {
        this.btndisabled = false;
        if (this.isPrevStep) {
            this.step = 6;
        } else {
            this.step = 1;
        }
        // this._location.back();
    }
    getMeetingDetails(usr_typ?) {
        this.starting_url = '';
        console.log(usr_typ);
        if (this.waiting_type === 'checkin') {
            this.shared_services.getWaitlstMeetingDetails(this.callingModes, this.waiting_id).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    this.starting_url = this.meetlink_data.startingUl;

                    if (usr_typ && usr_typ === 'user') {
                        switch (this.callingModes) {
                            case 'WhatsApp':
                                this.msg_to_user = '1. Wait for your turn\n\n2. When it is time you will recieve a WhatsApp call from ' + this.busnes_name ;
                              break;
                            case 'Phone':
                                this.msg_to_user = 'You will receive a ' + this.callingModes + ' call from ' + this.busnes_name + '. Please be ready';
                              break;
                            case 'Zoom':
                                this.msg_to_user = 'How to start the service:\n\n1. Click on the following link - ' + this.starting_url + '\n\n2. Wait for your ' + this.provider_label + ' to join';
                              break;
                            case 'GoogleMeet':
                                this.msg_to_user = 'How to start the service:\n\n1. Click on the following link - ' + this.starting_url + '\n\n2. Wait for your ' + this.provider_label + ' to join';
                              break;
                          }
                    } else if (usr_typ && usr_typ === 'me') {
                        switch (this.callingModes) {
                            case 'WhatsApp':
                                this.msg_to_user = 'How to start the service:\n\n 1. Click on the following link - ' + this.starting_url + '\n 2. Click on the video icon on the top right of the screen ' ;
                              break;
                            case 'Phone':
                                this.msg_to_user = 'Call to this number ' + this.starting_url;
                              break;
                            case 'Zoom':
                                this.msg_to_user = 'How to start the service:\n\n1. Click on the following link - ' + this.starting_url + '\n2. Join meeting ' ;
                              break;
                            case 'GoogleMeet':
                                this.msg_to_user = 'How to start the service:\n\n1. Click on the following link - ' + this.starting_url + '\n2. Click on join button ' ;
                              break;
                          }
                    }
                });
        } else {
            this.shared_services.getApptMeetingDetails(this.callingModes, this.waiting_id).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    this.starting_url = this.meetlink_data.startingUl;

                    if (usr_typ && usr_typ === 'user') {
                        switch (this.callingModes) {
                            case 'WhatsApp':
                                this.msg_to_user = '1. Wait for your turn\n\n2. When it is time you will recieve a WhatsApp call from ' + this.busnes_name ;
                              break;
                            case 'Phone':
                                this.msg_to_user = 'You will receive a ' + this.callingModes + ' call from ' + this.busnes_name + '. Please be ready';
                              break;
                            case 'Zoom':
                                this.msg_to_user = 'How to start the service:\n\n1. Click on the following link - ' + this.starting_url + '\n\n2. Wait for your ' + this.provider_label + ' to join';
                              break;
                            case 'GoogleMeet':
                                this.msg_to_user = 'How to start the service:\n\n1. Click on the following link - ' + this.starting_url + '\n\n2. Wait for your ' + this.provider_label + ' to join';
                              break;
                          }
                        // if (this.callingModes !== 'Phone') {
                        //     this.msg_to_user = 'How to start the service:\n\n 1. Click on the following link - ' + this.starting_url + '\n 2. Wait for your ' + this.provider_label + ' to join';
                        // } else {
                        //     this.msg_to_user = 'You will receive a ' + this.callingModes + ' call from ' + this.busnes_name + '. Please be ready';
                        // }
                    } else if (usr_typ && usr_typ === 'me') {
                        switch (this.callingModes) {
                            case 'WhatsApp':
                                this.msg_to_user = 'How to start the service:\n\n 1. Click on the following link - ' + this.starting_url + '\n 2. Click on the video icon on the top right corner of the screen to start the video consultation ' ;
                              break;
                            case 'Phone':
                                this.msg_to_user = 'Call to this number ' + this.starting_url;
                              break;
                            case 'Zoom':
                                this.msg_to_user = 'How to start the service:\n\n 1. Click on the following link - ' + this.starting_url + '\n 2. Join meeting ' ;
                              break;
                            case 'GoogleMeet':
                                this.msg_to_user = 'How to start the service:\n\n 1. Click on the following link - ' + this.starting_url + '\n 2. Click on join button ' ;
                              break;
                          }
                    }

                });
        }
    }
    launchWhtsap() {
        if (this.is_web) {
            this.show_note = true;
        }
    }
    shareUrl() {
        this.clicktoSend();
    }
    makeCompleted() {

        if (this.step === 2 || this.step === 4 || this.step === 5) {
            this.step = 1;
        } else if (this.step === 8 || this.step === 7) {
            this.step = 6;
        } else {
            //  this.dialogRef.close('reloadlist');
        }
    }
    asktoLaunch() {
        // this.btndisabled = true;
        // //     this.launch = true;
        // setTimeout(() => {
        //     this.btndisabled = false;
        // }, 100);
        this.getMeetingDetails();
        this.step = 5;
    }
    amReady() {
        this.serviceProgress = false;
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
        this.serviceProgress = true;
        this.step = 6;
    }
    copyInfo() {
        let info;
        if (this.waiting_type === 'checkin') {
            info = document.getElementById('meetinInfochekin');
        } else {
            info = document.getElementById('meetinInfoappt');
        }
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(info);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('Copy');
            this.shared_functions.openSnackBar('Meeting details copied to clipboard');
        }
    }
    handleTimeSelction(obj) {
        this.selectedTime = obj;
        this.selectHeadsup();
    }
    handleUserTypeSelection(obj) {
        this.user_type = obj;
        console.log(this.user_type);
        this.getMeetingDetails(this.user_type);
    }
    copyReminderInfo() {
        const info = document.getElementById('reminderData');
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(info);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('Copy');
            this.shared_functions.openSnackBar('Reminder copied to clipboard');
        }
    }
    copyMeetingDetailsInfo() {
        const info = document.getElementById('meetDetailsData');
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(info);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('Copy');
            this.shared_functions.openSnackBar('Meeting Details copied to clipboard');
        }
    }
    showCustomerRecord(stp6?) {
        this.isPrevStep = false;
        if (stp6) {
            this.isPrevStep = true;
        }
        this.step = 8;
        console.log(this.isPrevStep);
    }
    amNotReady() {
        this.step = 1;
    }
    endmeeting() {
        this.step = 7;
    }
    redirecToPreviousPage() {
       // this._location.back();
         if (this.step === 1) {
            this._location.back();
        } else if (((this.step === 2 || this.step === 4 || this.step === 8) && !this.serviceProgress) || this.step === 6 || this.step === 5) {
            this.serviceProgress = false;
            this.step = 1;
        } else if (this.step === 7 || ((this.step === 2 || this.step === 4 || this.step === 8) && this.serviceProgress)) {
            this.step = 6;
        }
    }
    backtoProgresPage() {
        console.log(this.isPrevStep);
        if (this.isPrevStep) {
            this.step = 6;
        } else {
            this.step = 1;
        }
    }
    gotoUnsuported() {
        if (this.is_web) {
            this.step = 1;
        } else {
            this.step = 6;
        }
    }
    gotoMeetDetails() {
        this.step = 4;
    }
    getProviderWaitlstById() {
        this.provider_services.getProviderWaitlistDetailById(this.waiting_id)
            .subscribe(
                data => {
                    this.data = data;
                    console.log(this.data);
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
                        this.date = this.shared_functions.formatDateDisplay(this.data.date);
                        this.time = this.data.checkInTime;
                        this.location = this.data.queue.location.address;
                        if (this.data.waitlistingFor[0].phoneNo) {
                            this.phNo = this.data.waitlistingFor[0].phoneNo;
                        }
                        if (this.data.calculationMode === 'NoCalc') {
                            this.jalde_q_id = this.data.token;
                        } else {
                            this.jalde_q_id = this.data.appxWaitingTime + ' min';
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
                    this.date = this.shared_functions.formatDateDisplay(this.data.appmtDate);
                    this.time = this.data.appmtTime;
                    this.location = this.data.location.address;
                });
    }
}
