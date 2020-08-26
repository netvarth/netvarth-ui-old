import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { projectConstants } from '../../../../app.component';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
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
        { value: '2 Minute', viewValue: '2 Minute' },
        { value: '3 Minute', viewValue: '3 Minute' }
    ];
    provider_label: any;
    phNo: any;
    time_min: any;
    data: any;
    waiting_id: any;
    waiting_type: any;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public shared_services: SharedServices,
        private provider_shared_functions: ProviderSharedFuctions,
        private _location: Location,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        // public dialogRef: MatDialogRef<CallingModesComponent>
        ) {
            // this.activateroute.queryParams.subscribe(qparams => {
            //     console.log(qparams);
            //     this.waiting_id = qparams.id;
            //     this.waiting_type = qparams.type;
            //   });
            this.activateroute.queryParams.subscribe(params => {
                console.log(params);
                this.waiting_id = params.waiting_id;
                this.waiting_type = params.type;
              });
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.provider_label = this.shared_functions.getTerminologyTerm('provider');
    }
    ngOnInit() {
          if (this.waiting_type === 'checkin') {
              this.provider_services.getProviderWaitlistDetailById(this.waiting_id)
            .subscribe(
              data => {
                  this.data = data;
                  console.log(this.data);
                  this.callingModes = this.data.service.virtualCallingModes[0].callingMode;
                  this.busnes_name = this.data.providerAccount.businessName;
                  this.serv_name = this.data.service.name;
                  this.servDetails = this.data.service;
                  this.getMeetingDetails();
                  if (this.waiting_type === 'checkin') {
                    this.chkinTeleserviceJoinLink();
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
          } else {
            this.provider_services.getAppointmentById(this.waiting_id)
            .subscribe(
              data => {
                this.data = data;
                console.log(this.data);
                this.callingModes = this.data.service.virtualCallingModes[0].callingMode;
                this.busnes_name = this.data.providerAccount.businessName;
                this.serv_name = this.data.service.name;
                this.servDetails = this.data.service;
                this.getMeetingDetails();
                this.apptTeleserviceJoinLink();
                this.consumer_fname = this.data.appmtFor[0].userName;
                this.date = this.shared_functions.formatDateDisplay(this.data.appmtDate);
                this.time = this.data.appmtTime;
                this.location = this.data.location.address;
              });
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
    selectHeadsup() {
        this.msg_to_user = '';
       // this.getMeetingDetails();
        this.step = 2;
        this.msg_to_user = 'In ' + this.selectedTime + ', your ' + this.serv_name + ' with ' + this.busnes_name + ' will begin. Please be ready.\n\n Here are the details for how to start the service -\n\n 1. Click on the following link - ' + this.starting_url + ' \n\n 2. Waiting for your ' + this.provider_label + ' to join';
        console.log(this.msg_to_user);
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
        // if (this.data.type === 'checkin') {
        //     if (this.data.qdata.waitlistStatus === 'started') {
        //         this.changeWaitlistStatus(this.data.qdata, 'DONE');
        //         this.dialogRef.close('reloadlist');
        //     } else {
        //         this.changeWaitlistStatus(this.data.qdata, 'STARTED');
        //     }
        // } else {
        //     if (this.data.qdata.apptStatus === 'Started') {
        //         this.changeWaitlistStatus(this.data.qdata, 'Completed');
        //         this.dialogRef.close('reloadlist');
        //     } else {
        //         this.changeWaitlistStatus(this.data.qdata, 'Started');
        //     }
        // }
        if (this.waiting_type === 'checkin') {
            this.changeWaitlistStatus(this.data, 'DONE');
            this.redirecToPreviousPage();
      } else {
            this.changeWaitlistStatus(this.data, 'Completed');
            this.redirecToPreviousPage();
      }
    }
    sendMessage() {
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
                    this.step = 1;
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
                    this.step = 1;
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
                .then(
                    result => {
                        if (action === 'DONE') {
                           //  this.dialogRef.close('reloadlist');
                        }
                        if (action === 'STARTED') {
                            // if (this.data.action === 'normalStart') {
                            //     // this.dialogRef.close('reloadlist');
                            // } else {
                            //     this.changeWaitlistStatus(this.data.qdata, 'DONE');
                            // }
                        }
                    }
                );
        } else {
            this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data, true)
                .then(
                    result => {
                        if (action === 'Completed') {
                            // this.dialogRef.close('reloadlist');
                        }
                        if (action === 'Started') {
                            // if (this.data.action === 'normalStart') {
                            //     //     this.dialogRef.close('reloadlist');
                            // } else {
                            //     this.changeWaitlistStatus(this.data.qdata, 'Completed');
                            // }
                        }
                    }
                );
        }
    }

    meetingDetails() {
        this.getMeetingDetails();
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
        this.step = 1;
    }
    getMeetingDetails() {
        this.starting_url = '';
        // const uuid_data = {
        //     'mode': this.callingModes
        // };
        console.log(this.callingModes);
        console.log(this.waiting_id);
        if (this.waiting_type === 'checkin') {
            this.shared_services.getWaitlstMeetingDetails(this.callingModes, this.waiting_id).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    this.starting_url = this.meetlink_data.startingUl;
                    this.msg_to_user = 'How to start the service:\n\n 1. Click on the following link - ' + this.starting_url + '\n 2. Wait for your ' + this.provider_label + ' to join';
                });
        } else {
            this.shared_services.getApptMeetingDetails(this.callingModes, this.waiting_id).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    this.starting_url = this.meetlink_data.startingUl;
                    this.msg_to_user = 'How to start the service:\n\n 1. Click on the following link - ' + this.starting_url + '\n 2. Wait for your ' + this.provider_label + ' to join';
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
        if (this.waiting_type === 'checkin') {
            if (this.data.waitlistStatus !== 'started') {
                this.changeWaitlistStatus(this.data, 'STARTED');
            }
        } else {
            if (this.data.apptStatus === 'Started') {
                this.changeWaitlistStatus(this.data, 'Started');
            }
        }
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
    showCustomerRecord() {
        this.step = 6;
    }
    amNotReady() {
        this.step = 1;
    }
    endmeeting() {
        this.step = 7;
    }
    redirecToPreviousPage() {
        this._location.back();
    }
}
