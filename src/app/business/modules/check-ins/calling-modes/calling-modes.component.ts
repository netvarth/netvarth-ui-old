import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { projectConstants } from '../../../../app.component';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';


@Component({
    selector: 'app-calling-modes',
    templateUrl: './calling-modes.component.html'
})
export class CallingModesComponent implements OnInit {
    callingModes;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    msg_to_user = '';
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
    temp_msglink: string;
    customer_label: any;
    serv_name: any;
    date: any;
    time: any;
    location: any;
    jalde_q_id;
    serv_provider: any;
    is_started = false;
    btndisabled = false;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public shared_services: SharedServices,
        private provider_shared_functions: ProviderSharedFuctions,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CallingModesComponent>) {
            this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    }
    ngOnInit() {
        this.busnes_name = this.data.qdata.providerAccount.businessName;
        if (this.data.type === 'checkin') {
            this.consumer_fname = this.data.qdata.waitlistingFor[0].firstName;
            this.consumer_lname = this.data.qdata.waitlistingFor[0].lastName;
            this.serv_name = this.data.qdata.service.name;
            this.date = this.shared_functions.formatDateDisplay(this.data.qdata.date);
            this.time = this.data.qdata.checkInTime;
            this.serv_provider = this.data.qdata.providerAccount.businessName;
            this.location = this.data.qdata.queue.location.address;
            if (this.data.qdata.calculationMode === 'NoCalc') {
                this.jalde_q_id = this.data.qdata.token;
            } else {
                this.jalde_q_id = this.data.qdata.appxWaitingTime + ' min';
            }
        } else {
            this.consumer_fname = this.data.qdata.appmtFor[0].userName;
            this.serv_name = this.data.qdata.service.name;
            this.date = this.shared_functions.formatDateDisplay(this.data.qdata.appmtDate);
            this.time = this.data.qdata.appmtTime;
            this.serv_provider = this.data.qdata.providerAccount.businessName;
            this.location = this.data.qdata.location.address;
        }
        // tslint:disable-next-line:forin
        for (const i in this.data.modes) {
            this.callingModes = i;
        }
        // if (this.callingModes !== 'WhatsApp') {
        //     this.callingModes = 'Zoom';
        // }
        if (this.data.linkValue) {
            this.show_link_only = true;
            if (this.data.linkValue === 1) {
                this.chkinTeleserviceJoinLink();
            } else {
                this.apptTeleserviceJoinLink();
            }
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
        if (isMobile.Android()) {
            this.is_android = true;
        } else if (isMobile.iOS()) {
            this.is_ios = true;
        } else {
            this.is_web = true;
        }
        this.getMeetingDetails();
    }
    selectHeadsup() {
        if (this.callingModes === 'WhatsApp') {
            // this.msg_to_user = 'You will receive a ' + this.callingModes + ' call from ' + this.busnes_name + ' in 30 seconds';
            this.msg_to_user = 'In one minute, ' + this.busnes_name + ' will be starting a video call for your service. Please be ready';
        } else if (this.callingModes === 'Phone') {
            this.msg_to_user = 'In one minute, ' + this.busnes_name + ' will be starting a audio call for your service. Please be ready';
        } else {
            this.getMeetingDetails();
            // this.msg_to_user = this.busnes_name + ' will be contacting you via ' + this.callingModes + ' .Join the ' + this.callingModes + ' using ' + this.temp_msglink;
            this.msg_to_user = 'In one minute, ' + this.busnes_name + ' will be starting a video call for your service. Please be ready. Here is the link for joining the video call - ' + this.temp_msglink;
        }
    }
    selectAlrdyWaiting() {
        if (this.callingModes === 'WhatsApp') {
         //   this.msg_to_user = this.busnes_name + ' is already waiting';
         this.msg_to_user = 'I am waiting for you to start the video call';
        } else if (this.callingModes === 'Phone') {
            this.msg_to_user = 'I am waiting for you to start the audio call';
        } else {
          //  this.msg_to_user = this.busnes_name + ' is already waiting. Please click the link to join ' + this.temp_msglink;
          this.msg_to_user = 'I am waiting for you to start the video call. Here is the meeting details ' + this.temp_msglink;
        }
    }
    clicktoSend() {
        if (this.data.type === 'checkin') {
            this.chkinTeleserviceJoinLink();
        } else {
            this.apptTeleserviceJoinLink();
        }
    }
    selectCompleted() {
        if (this.data.type === 'checkin') {
            this.changeWaitlistStatus(this.data.qdata, 'DONE');
        } else {
            this.changeWaitlistStatus(this.data.qdata, 'Completed');
        }
    }
    sendMessage() {
        // this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
        const post_data = {
            medium: {
                email: this.email,
                sms: this.sms,
                pushNotification: this.pushnotify
            },
            communicationMessage: this.msg_to_user,
            uuid: [this.data.uuid]
        };
        if ( this.data.type === 'checkin') {
            this.shared_services.consumerMassCommunication(post_data).
            subscribe(() => {
                this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
                this.step = 1;
                setTimeout(() => {
                    this.api_success = '';
                }, 5000);
            }
            );
        } else {
            this.shared_services.consumerMassCommunicationAppt(post_data).
            subscribe(() => {
                this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
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
        this.shared_services.consumerWtlstTeleserviceWithId(uuid_data, this.data.uuid).
            subscribe((modeData) => {
                this.medialink = modeData;
                this.msg_to_user = this.medialink.startingUl;
                this.api_success = Messages.TELESERVICE_SHARE_LINK.replace('[customer]', this.customer_label);
                setTimeout(() => {
                    this.api_success = '';
                }, 5000);
            });
    }
    apptTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.callingModes
        };
        this.shared_services.consumerApptTeleserviceWithId(uuid_data, this.data.uuid).
            subscribe((modeData) => {
                this.medialink = modeData;
                this.msg_to_user = this.medialink.startingUl;
                this.api_success = Messages.TELESERVICE_SHARE_LINK.replace('[customer]', this.customer_label);
                setTimeout(() => {
                    this.api_success = '';
                }, 5000);
            });
    }
    changeWaitlistStatus(qdata, action) {
        qdata.disableStartbtn = true;
        if (this.data.type === 'checkin') {
            this.provider_shared_functions.changeWaitlistStatus(this, qdata, action);
        } else {
            this.provider_shared_functions.changeWaitlistStatus(this, qdata, action, 'appt');
        }
    }
    changeWaitlistStatusApi(waitlist, action, post_data = {}) {
        if (this.data.type === 'checkin') {
            this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
                .then(
                    result => {
                        if (action === 'DONE') {
                              this.dialogRef.close();
                        }
                    }
                );
        } else {
            this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data)
                .then(
                    result => {
                       if (action === 'Completed') {
                         this.dialogRef.close();
                       }
                    }
                );
        }
    }

    meetingDetails() {
        this.step = 4;
        this.getMeetingDetails();
    }
    reminder() {
        this.step = 2;
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
        const uuid_data = {
            'mode': this.callingModes
        };
        if (this.data.type === 'checkin') {
            this.shared_services.getWaitlstMeetingDetails(this.callingModes, this.data.uuid).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    this.starting_url = this.meetlink_data.startingUl;
                    this.temp_msglink = this.meetlink_data.startingUl;
                });
        } else {
            this.shared_services.getApptMeetingDetails(this.callingModes, this.data.uuid).
                subscribe((meetingdata) => {
                    this.meetlink_data = meetingdata;
                    this.starting_url = this.meetlink_data.startingUl;
                    this.temp_msglink = this.meetlink_data.startingUl;
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
        if (this.is_started) {
            this.step = 5;
        } else {
            this.dialogRef.close();
        }
    }
    asktoLaunch() {
        this.btndisabled = true;
        this.getMeetingDetails();
        this.step = 6;
    }
    makeStarted() {
        this.btndisabled = false;
        if (this.data.type === 'checkin') {
            this.changeWaitlistStatus(this.data.qdata, 'STARTED');
            this.step = 1;
            this.is_started = true;
        } else {
            this.changeWaitlistStatus(this.data.qdata, 'Started');
            this.step = 1;
            this.is_started = true;
        }
    }
    copyInfo() {
        let info;
    if (this.data.type === 'checkin') {
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
}
