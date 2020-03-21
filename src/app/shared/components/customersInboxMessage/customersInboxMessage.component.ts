import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';


@Component({
    selector:'app-customersInboxMessage',
    templateUrl:'./customersInboxMessage.component.html'
})
export class customersInboxMessageComponent implements OnInit{
    amForm: FormGroup;
    api_error = null;
    api_success = null;
    cancel_btn_cap = Messages.CANCEL_BTN;
    send_btn_cap = Messages.SEND_BTN;
    user_id = null;
    uuid = null;
    message = '';
    source = null;
    message_label = null;
    api_loading = true;
    terminologies = null;
    receiver_name = null;
    caption;
    disableButton = false;
    title = 'Send Message';
    selectedMessage = {
      files: [],
      base64: [],
      caption: []
    };
    showCaptionBox: any = {};
    activeImageCaption: any = [];
    sms = true;
    email = true;
    pushnotify = true;
    typeOfMsg;
    constructor(
      public dialogRef: MatDialogRef<customersInboxMessageComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      public fed_service: FormMessageDisplayService,
      public shared_services: SharedServices,
      public sharedfunctionObj: SharedFunctions,
      public common_datastorage: CommonDataStorageService
    ) {
      this.typeOfMsg = this.data.typeOfMsg;
      this.user_id = this.data.user_id || null;
      this.uuid = this.data.uuid || null;
      this.source = this.data.source || null;
      this.receiver_name = this.data.name || null;
      this.terminologies = data.terminologies;
      if (this.data.caption) {
        this.caption = this.data.caption;
      } else {
        this.caption = 'Send Message';
      }
      this.title = (this.data.type === 'reply') ? 'Send Reply' : this.caption;
      if (!data.terminologies &&
        (this.source === 'consumer-waitlist' ||
          this.source === 'consumer-common')) {
        this.gets3curl()
          .then(
            () => {
              this.setLabel();
            },
            () => {
              this.setLabel();
            }
          );
      } else {
        this.setLabel();
      }
    }
    ngOnInit() {
      this.createForm();
    }
    ngOnDestroy() {
    }
    gets3curl() {
      return new Promise((resolve, reject) => {
        this.sharedfunctionObj.getS3Url('provider')
          .then(
            res => {
              let UTCstring = null;
              UTCstring = this.sharedfunctionObj.getCurrentUTCdatetimestring();
              this.shared_services.getbusinessprofiledetails_json(this.data.user_id, res, 'terminologies', UTCstring)
                .subscribe(termi => {
                  this.terminologies = termi;
                  resolve();
                },
                  () => {
                    reject();
                  });
            },
            () => {
              reject();
            }
          );
      });
    }
    setLabel() {
      this.api_loading = false;
      let provider_label = this.receiver_name;
      let consumer_label = this.receiver_name;
      if (!provider_label) {
        provider_label = (this.terminologies && this.terminologies['provider']) ? this.terminologies['provider'] : 'provider';
      }
      if (!consumer_label) {
        consumer_label = (this.terminologies && this.terminologies['customer']) ? this.terminologies['customer'] : 'customer';
      }
      switch (this.source) {
        case 'provider-waitlist': this.message_label = 'Message to ' + consumer_label; break;
        case 'consumer-waitlist': this.message_label = 'Message to ' + provider_label; break;
        case 'consumer-common': this.message_label = 'Message to ' + provider_label; break;
        case 'provider-common': this.message_label = 'Message to ' + consumer_label; break;
      }
    }
    createForm() {
      this.amForm = this.fb.group({
        message: ['', Validators.compose([Validators.required])]
      });
    }
    onSubmit(form_data) {}
    // //   this.resetApiErrors();
    //   const blankvalidate = projectConstants.VALIDATOR_BLANK;
    //   if (blankvalidate.test(form_data.message)) {
    //     this.api_error = this.sharedfunctionObj.getProjectMesssages('MSG_ERROR');
    //   } else {
    //     if (this.typeOfMsg === 'multiple') {
    //       const post_data = {
    //         medium: {
    //           email: this.email,
    //           sms: this.sms,
    //           pushNotification: this.pushnotify
    //         },
    //         communicationMessage: form_data.message,
    //         uuid: this.uuid
    //       };
    //       this.shared_services.consumerMassCommunication(post_data).
    //         subscribe(() => {
    //           this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
    //           setTimeout(() => {
    //             this.dialogRef.close('reloadlist');
    //           }, projectConstants.TIMEOUT_DELAY);
    //         },
    //           error => {
    //             this.sharedfunctionObj.apiErrorAutoHide(this, error);
    //             this.disableButton = false;
    //           }
    //         );
    //     } else {
    //       const post_data = {
    //         communicationMessage: form_data.message
    //       };
    //       switch (this.source) {
    //         case 'provider-waitlist': this.providerToConsumerWaitlistNote(post_data); break;
    //         case 'consumer-waitlist': this.consumerToProviderWaitlistNote(post_data); break;
    //         case 'consumer-common': this.consumerToProviderNoteAdd(post_data); break;
    //         case 'provider-common': this.providerToConsumerNoteAdd(post_data); break;
    //       }
    //     }
    //   }
    // }
}