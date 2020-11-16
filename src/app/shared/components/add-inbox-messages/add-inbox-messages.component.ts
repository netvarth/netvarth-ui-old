import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';
import { projectConstantsLocal } from '../../constants/project-constants';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { MatDialog } from '@angular/material/dialog';
import { AddproviderAddonComponent } from '../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
@Component({
  selector: 'app-add-inbox-messages',
  templateUrl: './add-inbox-messages.component.html'
})
export class AddInboxMessagesComponent implements OnInit, OnDestroy {
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
  type;
  email_id: any;
  phone: any;
  SEND_MESSAGE = '';
  customer_label = '';
  phone_history: any;
  smsCredits: any;
  smsWarnMsg: string;
  is_smsLow = false;
  corpSettings: any;
  addondialogRef: any;
  constructor(
    public dialogRef: MatDialogRef<AddInboxMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    public common_datastorage: CommonDataStorageService,
    public provider_services: ProviderServices,
    private provider_servicesobj: ProviderServices,
    private dialog: MatDialog
  ) {
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
    this.typeOfMsg = this.data.typeOfMsg;
    this.user_id = this.data.user_id || null;
    this.uuid = this.data.uuid || null;
    this.email_id = this.data.email;
    this.phone = this.data.phone;
    this.phone_history = this.data.phone_history;
    this.source = this.data.source || null;
    this.receiver_name = this.data.name || null;
    this.terminologies = data.terminologies;
    if (this.source !== 'customer-list') {
      if (this.uuid && this.uuid.indexOf('appt') >= 0 || this.data.appt === 'appt') {
        this.type = 'appt';
      } else {
        this.type = 'wl';
      }
    }
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
    console.log('Inside add Inbox');
    this.SEND_MESSAGE = Messages.SEND_MESSAGE.replace('[customer]', this.customer_label);
    this.createForm();
    if (this.source === 'provider-waitlist') {
      this.getSMSCredits();
    }
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
      case 'provider-waitlist-inbox': this.message_label = 'Message to ' + consumer_label; break;
      case 'consumer-waitlist': this.message_label = 'Message to ' + provider_label; break;
      case 'consumer-common': this.message_label = 'Message to ' + provider_label; break;
      case 'provider-common': this.message_label = 'Message to ' + consumer_label; break;
      case 'customer-list': this.message_label = 'Message to ' + consumer_label; break;
    }
  }
  createForm() {
    this.amForm = this.fb.group({
      message: ['', Validators.compose([Validators.required])]
    });
  }
  onSubmit(form_data) {
    this.resetApiErrors();
    const blankvalidate = projectConstantsLocal.VALIDATOR_BLANK;
    if (blankvalidate.test(form_data.message)) {
      this.api_error = this.sharedfunctionObj.getProjectMesssages('MSG_ERROR');
    } else {
      if (this.typeOfMsg === 'multiple') {
        if (this.data.source === 'customer-list') {
          const post_data = {
            medium: {
              email: this.email,
              sms: this.sms,
              pushNotification: this.pushnotify
            },
            communicationMessage: form_data.message,
            consumerId: this.uuid
          };
          this.shared_services.consumerMassCommunicationWithId(post_data).
            subscribe(() => {
              this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            },
              error => {
                this.sharedfunctionObj.apiErrorAutoHide(this, error);
                this.disableButton = false;
              }
            );
        } else {
          const post_data = {
            medium: {
              email: this.email,
              sms: this.sms,
              pushNotification: this.pushnotify
            },
            communicationMessage: form_data.message,
            uuid: this.uuid
          };
          if (this.type === 'appt') {
            this.shared_services.consumerMassCommunicationAppt(post_data).
              subscribe(() => {
                this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
                setTimeout(() => {
                  this.dialogRef.close('reloadlist');
                }, projectConstants.TIMEOUT_DELAY);
              },
                error => {
                  this.sharedfunctionObj.apiErrorAutoHide(this, error);
                  this.disableButton = false;
                }
              );
          } else {
            this.shared_services.consumerMassCommunication(post_data).
              subscribe(() => {
                this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
                setTimeout(() => {
                  this.dialogRef.close('reloadlist');
                }, projectConstants.TIMEOUT_DELAY);
              },
                error => {
                  this.sharedfunctionObj.apiErrorAutoHide(this, error);
                  this.disableButton = false;
                }
              );
          }
        }

      } else {
        if (this.data.source === 'customer-list') {
          const post_data = {
            medium: {
              email: this.email,
              sms: this.sms,
              pushNotification: this.pushnotify
            },
            communicationMessage: form_data.message,
            consumerId: [this.uuid]
          };
          this.shared_services.consumerMassCommunicationWithId(post_data).
            subscribe(() => {
              this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            },
              error => {
                this.sharedfunctionObj.apiErrorAutoHide(this, error);
                this.disableButton = false;
              }
            );
        } else {
          const post_data = {
            communicationMessage: form_data.message
          };
          switch (this.source) {
            case 'provider-waitlist': this.providerToConsumerWaitlistNote(post_data); break;
            case 'provider-waitlist-inbox': this.providerToConsumerWaitlistNote(post_data); break;
            case 'consumer-waitlist': this.consumerToProviderWaitlistNote(post_data); break;
            case 'consumer-common': this.consumerToProviderNoteAdd(post_data); break;
            case 'provider-common': this.providerToConsumerNoteAdd(post_data); break;
          }
        }
      }
    }
  }
  providerToConsumerWaitlistNote(post_data) {
    this.disableButton = true;
    if (this.uuid !== null) {
      const dataToSend: FormData = new FormData();
      dataToSend.append('message', post_data.communicationMessage);
      const captions = {};
      let i = 0;
      if (this.selectedMessage) {
        for (const pic of this.selectedMessage.files) {
          dataToSend.append('attachments', pic, pic['name']);
          captions[i] = 'caption';
          i++;
        }
      }
      const foruuid = [];
      foruuid.push(this.uuid);
      const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
      dataToSend.append('captions', blobPropdata);
      const postdata = {
        medium: {
          email: this.email,
          sms: this.sms,
          pushNotification: this.pushnotify
        },
        communicationMessage: post_data.communicationMessage,
        uuid: foruuid
      };
      if (this.type === 'appt') {
        if (this.selectedMessage.files.length === 0) {
          this.shared_services.consumerMassCommunicationAppt(postdata).
          subscribe(() => {
            this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
            error => {
              this.sharedfunctionObj.apiErrorAutoHide(this, error);
              this.disableButton = false;
            }
          );
        } else {
        this.shared_services.addProviderAppointmentNote(this.uuid, dataToSend)
          .subscribe(
            () => {
              this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.sharedfunctionObj.apiErrorAutoHide(this, error);
              this.disableButton = false;
            }
          );
        }
      } else {
        if (this.selectedMessage.files.length === 0) {
          this.shared_services.consumerMassCommunication(postdata).
          subscribe(() => {
            this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
            error => {
              this.sharedfunctionObj.apiErrorAutoHide(this, error);
              this.disableButton = false;
            }
          );
        } else {
        this.shared_services.addProviderWaitlistNote(this.uuid, dataToSend)
          .subscribe(
            () => {
              this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.sharedfunctionObj.apiErrorAutoHide(this, error);
              this.disableButton = false;
            }
          );
      }
      }
    }
  }
  consumerToProviderWaitlistNote(post_data) {
    if (this.uuid !== null) {
      const dataToSend: FormData = new FormData();
      dataToSend.append('message', post_data.communicationMessage);
      const captions = {};
      let i = 0;
      if (this.selectedMessage) {
        for (const pic of this.selectedMessage.files) {
          dataToSend.append('attachments', pic, pic['name']);
          captions[i] = 'caption';
          i++;
        }
      }
      const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
      dataToSend.append('captions', blobPropdata);
      if (this.type === 'appt') {
        this.shared_services.addConsumerAppointmentNote(this.user_id, this.uuid,
          dataToSend)
          .subscribe(
            () => {
              this.api_success = Messages.CONSUMERTOPROVIDER_NOTE_ADD;
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.sharedfunctionObj.apiErrorAutoHide(this, error);
            }
          );
      } else {
        this.shared_services.addConsumerWaitlistNote(this.user_id, this.uuid,
          dataToSend)
          .subscribe(
            () => {
              this.api_success = Messages.CONSUMERTOPROVIDER_NOTE_ADD;
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            },
            error => {
              this.sharedfunctionObj.apiErrorAutoHide(this, error);
            }
          );
      }
    }
  }
  providerToConsumerNoteAdd(post_data) {
    if (this.user_id !== null) {
      this.shared_services.addProvidertoConsumerNote(this.user_id,
        post_data)
        .subscribe(
          () => {
            this.api_success = Messages.PROVIDERTOCONSUMER_NOTE_ADD;
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.sharedfunctionObj.apiErrorAutoHide(this, error);
          }
        );
    }
  }
  consumerToProviderNoteAdd(post_data) {
    if (this.user_id) {
      this.shared_services.addConsumertoProviderNote(this.user_id,
        post_data)
        .subscribe(
          () => {
            this.api_success = Messages.CONSUMERTOPROVIDER_NOTE_ADD;
            setTimeout(() => {
              this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.sharedfunctionObj.apiErrorAutoHide(this, error);
          }
        );
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.sharedfunctionObj.apiErrorAutoHide(this, 'Selected image type not supported');
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.sharedfunctionObj.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
    if (this.showCaptionBox && this.showCaptionBox[index]) {
      delete this.showCaptionBox[index];
      delete this.activeImageCaption[index];
    }
  }
  captionMenuClicked(index) {
    if (!this.activeImageCaption) {
      this.activeImageCaption = {};
      this.activeImageCaption[index] = '';
    }
    if (!this.showCaptionBox) {
      this.showCaptionBox = {};
    }
    this.showCaptionBox[index] = true;
  }
  closeCaptionMenu(index) {
    if (this.showCaptionBox && this.showCaptionBox[index]) {
      delete this.activeImageCaption[index];
      this.showCaptionBox[index] = false;
    }
  }

  getSMSCredits() {
    this.provider_services.getSMSCredits().subscribe(data => {
        this.smsCredits = data;
        if (this.smsCredits < 5) {
          this.is_smsLow = true;
          this.smsWarnMsg = 'Your SMS credits are low, Please upgrade';
          this.getLicenseCorpSettings();
        } else {
          this.is_smsLow = false;
        }
    });
  }
  getLicenseCorpSettings() {
    this.provider_servicesobj.getLicenseCorpSettings().subscribe(
        (data: any) => {
            this.corpSettings = data;
        }
    );
}
  gotoSmsAddon() {
    this.dialogRef.close();
    if (this.corpSettings && this.corpSettings.isCentralised) {
      this.sharedfunctionObj.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
  } else {
      this.addondialogRef = this.dialog.open(AddproviderAddonComponent, {
          width: '50%',
          data: {
              type: 'addons'
          },
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true
      });
      this.addondialogRef.afterClosed().subscribe(result => {
        if (result) {
         this.getSMSCredits();
        }
      });
  }
  }
}
