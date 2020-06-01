import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { projectConstants } from '../../../../shared/constants/project-constants';
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
    disableButton = false;
    api_success = null;
    medialink;
    show_link_only = false;
    showcomm = false;
    chipValue: any;
    videonote = false;
    busnes_name: any;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public shared_services: SharedServices,
        private provider_shared_functions: ProviderSharedFuctions,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CallingModesComponent>) {
    }
    ngOnInit() {
        console.log(this.data)
        this.busnes_name = this.data.qdata.providerAccount.businessName;
        for (const i in this.data.modes) {
            this.callingModes = i;
        }
        if (this.data.linkValue) {
            this.show_link_only = true;
            if (this.data.linkValue === 1) {
                this.chkinTeleserviceJoinLink();
            } else {
                this.apptTeleserviceJoinLink();
            }
        } else {
            this.selectHeadsup('heads');
        }
    }
    selectHeadsup(val) {
        this.chipValue = val;
        this.showcomm = true;
        this.videonote = false;
        if (this.callingModes !== 'WhatsApp') {
            this.callingModes = 'Zoom';
        }
        this.msg_to_user = 'You will receive a ' + this.callingModes + ' call from ' + this.busnes_name + ' in 30 seconds';
    }
    selectAlrdyWaiting(val) {
        this.chipValue = val;
        this.showcomm = true;
        this.videonote = false;
        this.msg_to_user =  this.busnes_name + ' is already waiting.Please click the link to join';
    }
    selectStrtVideo(val) {
        this.chipValue = val;
        this.showcomm = false;
        this.videonote = true;
        this.msg_to_user = 'SMS and email notification with your ' + this.callingModes + ' link has been sent.You can click the link to start the service';
       // this.chkinTeleserviceJoinLink();
       // this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
    }
    selectStarted(val) {
        this.chipValue = val;
        this.showcomm = false;
        this.videonote = false;
     //   this.msg_to_user = 'Service Started';
        if (this.data.type === 'checkin') {
            this.changeWaitlistStatus(this.data.qdata, 'STARTED');
        } else {
            this.changeWaitlistStatus(this.data.qdata, 'Started');
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
            uuid: [this.data.uuid]
          };
          this.shared_services.consumerMassCommunication(post_data).
            subscribe(() => {
            //  this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
            //  this.shared_functions.openSnackBar('Message has been sent');
            //   setTimeout(() => {
            //     this.dialogRef.close('reloadlist');
            //   }, projectConstants.TIMEOUT_DELAY);
            }
            //   error => {
            //     this.shared_functions.apiErrorAutoHide(this, error);
            //     this.disableButton = false;
            //   }
            );
            this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
    }
    chkinTeleserviceJoinLink() {
        if (this.callingModes !== 'WhatsApp') {
            this.callingModes = 'Zoom';
        }
        const uuid_data = {
            'mode': this.callingModes
        };
        this.shared_services.consumerWtlstTeleserviceWithId(uuid_data, this.data.uuid).
        subscribe((modeData) => {
            this.medialink = modeData;
            //this.msg_to_user = this.medialink.startingUl;
           // this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
        });
        this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
    }
    apptTeleserviceJoinLink() {
        if (this.callingModes !== 'WhatsApp') {
            this.callingModes = 'Zoom';
        }
        const uuid_data = {
            'mode': this.callingModes
        };
        this.shared_services.consumerApptTeleserviceWithId(uuid_data, this.data.uuid).
        subscribe((modeData) => {
            this.medialink = modeData;
            this.msg_to_user = this.medialink.startingUl;
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
            }
          );
        } else {
            this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data)
      .then(
        result => {
        }
      );
        }
      }
}
