import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-waitlist-checkin-cancel-popup',
  templateUrl: './provider-waitlist-checkin-cancel-popup.component.html'
})
export class ProviderWaitlistCheckInCancelPopupComponent implements OnInit {

  cancel_cap = Messages.CANCEL_BTN;
  message_cap = Messages.MESSAGE_CAP;
  ok_btn = Messages.OK_BTN;
  select_reason_cap = Messages.POPUP_SELECT_REASON_CAP;
  send_message_cap = Messages.POPUP_SEND_MSG_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  message = [];
  cancel_reasons: any = [];
  customer_label = '';
  checkin_label = '';
  default_message;
  default_message_arr: any = [];
  rep_username;
  rep_service;
  rep_provname;
  cur_msg = '';
  cancel_reasonobj;
  cancel_reason = '';
  cancel_reason_key = '';
  def_msg = '';

  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCheckInCancelPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

  ) {
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
    if (this.data.appt || this.data.type === 'appt') {
      this.checkin_label = 'Reject Appointment';
    } else {
      this.checkin_label = this.cancel_cap + this.sharedfunctionObj.getTerminologyTerm('waitlist');
    }
  }

  ngOnInit() {
    const reasons_list = [];
    const type = this.sharedfunctionObj.getitemFromGroupStorage('pdtyp');
    const reasons = projectConstants.WAITLIST_CANCEL_RESON;
    for (let i = 0; i < reasons.length; i++) {
      if (type !== reasons[i].type) {
        reasons_list.push(reasons[i]);
      }
    }
    this.cancel_reasons = reasons_list;
    if (this.data.isBatch) {
      this.rep_username = 'Batch ' + this.data.batchId;
    } else {
      if (this.data.appt) {
        this.rep_username = this.titleCaseWord(this.data.waitlist.appmtFor[0].firstName) + ' ' + this.titleCaseWord(this.data.waitlist.appmtFor[0].lastName);
      } else {
        this.rep_username = this.titleCaseWord(this.data.waitlist.waitlistingFor[0].firstName) + ' ' + this.titleCaseWord(this.data.waitlist.waitlistingFor[0].lastName);
      }
      this.rep_service = this.titleCaseWord(this.data.waitlist.service.name);
      if (this.data.waitlist.providerAccount) {
        this.rep_provname = this.titleCaseWord(this.data.waitlist.providerAccount.businessName);
      }
    }
    this.getDefaultMessages();
    this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      reason: ['', Validators.compose([Validators.required])],
      message: [''],
      send_message: [{ value: false, disabled: true }]
    });
    if (this.data.isBatch) {
      this.amForm.patchValue({send_message: true});
    }
    this.amForm.get('send_message').valueChanges
      .subscribe(
        data => {
          if (data) {
            this.amForm.controls['message'].enable();
            // this.amForm.addControl('message',
            //   new FormControl(this.replacedMessage(), Validators.compose([Validators.required])));
            // this.amForm.get('message').setValue(this.replacedMessage());
          } else {
            this.amForm.controls['message'].disable();
          }
        }
      );
  }

  onSubmit(form_data) {
    this.resetApiErrors();
    let post_data;
    if (this.data.appt || this.data.type === 'appt') {
      post_data = {
        'rejectReason': form_data.reason
      };
    } else {
      post_data = {
        'cancelReason': form_data.reason
      };
    }
    if (form_data.send_message) {
      if (!form_data.message.replace(/\s/g, '').length) {
        this.api_error = 'Message cannot be empty';
        return;
      }
      post_data['communicationMessage'] = form_data.message;
    }

    if (this.data.isBatch && !post_data['communicationMessage']) {
      this.api_error = 'Message cannot be empty';
      return;
    }

    this.dialogRef.close(post_data);
  }

  selectReason(cancel_reason) {
    this.amForm.get('reason').setValue(cancel_reason.value);
    this.cancel_reasonobj = cancel_reason;
    this.cancel_reason = cancel_reason.title;
    this.cancel_reason_key = cancel_reason.reasonkey;
    this.amForm.controls['send_message'].enable();
    if (this.data.isBatch) {
    } else {
      this.def_msg = this.replacedMessage();
    }
    // if (this.amForm.get('message')) {
    //   this.amForm.get('message').setValue(this.replacedMessage());
    // }
    // if (!this.amForm.controls['send_message'].value) {
    //   this.amForm.controls['message'].disable();
    // }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }

  getDefaultMessages() {
    this.provider_services.getProviderMessages()
      .subscribe(
        (data: any) => {
          this.default_message_arr = data;
          this.default_message = data.cancel || '';
          /*this.cur_msg = this.replacedMessage();
          if (this.amForm.get('reason')) {
           this.amForm.get('reason').setValue(this.cur_msg);
          }*/
        },
        () => {

        }
      );
  }
  replacedMessage() {
    let retmsg = '';
    if (this.cancel_reason_key) {
      retmsg = this.default_message_arr[this.cancel_reason_key];
    }
    // retmsg = this.default_message;
    retmsg = retmsg.replace(/\[username\]/g, this.rep_username);
    retmsg = retmsg.replace(/\[service\]/g, this.rep_service);
    retmsg = retmsg.replace(/\[provider name\]/g, this.rep_provname);
    if (this.cancel_reason && this.cancel_reason !== '') {
      retmsg = retmsg.replace('[reason]', this.cancel_reason);
    }
    return retmsg;
  }
  titleCaseWord(word: string) {
    if (!word) { return word; }
    return word[0].toUpperCase() + word.substr(1);
  }
}
