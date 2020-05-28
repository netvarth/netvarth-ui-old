import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { SharedServices } from '../../../../shared/services/shared-services';

@Component({
    selector: 'app-calling-modes',
    templateUrl: './calling-modes.component.html'
})
export class CallingModesComponent implements OnInit {
    callingModes;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    msg_to_user = 'Provider will start teleservice in 30 minutes from';
    sms = true;
    email = true;
    pushnotify = true;
    disableButton = false;
    api_success = null;
    medialink;
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        public shared_services: SharedServices,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CallingModesComponent>) {
    }
    ngOnInit() {
        for (const i in this.data.modes) {
            this.callingModes = i;
        }
        this.selectHeadsup();
    }
    selectHeadsup() {
        this.msg_to_user = 'Provider will start ' + this.callingModes + ' call in 30 minutes from';
    }
    selectAlrdyWaiting() {
        this.createTeleserviceJoinLink();
    }
    selectStrtVideo() {
        this.createTeleserviceJoinLink();
    }
    selectStarted() {
        this.msg_to_user = 'Service Started';
    }
    sendMessage() {
        const post_data = {
            medium: {
              email: this.email,
              sms: this.sms,
              pushNotification: this.pushnotify
            },
            communicationMessage: this.msg_to_user,
            consumerId: [this.data.uuid]
          };
          this.shared_services.consumerMassCommunicationWithId(post_data).
            subscribe(() => {
              this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            },
              error => {
                this.shared_functions.apiErrorAutoHide(this, error);
                this.disableButton = false;
              }
            );
    }
    createTeleserviceJoinLink() {
        const uuid_data = {
            'mode': this.callingModes
        };
        this.shared_services.consumerTeleserviceWithId(uuid_data, this.data.uuid).
        subscribe((modeData) => {
            this.medialink = modeData;
            this.msg_to_user = this.medialink.startingUl;
        });
    }
}
