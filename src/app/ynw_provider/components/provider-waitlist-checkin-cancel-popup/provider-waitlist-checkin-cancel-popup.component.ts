import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-waitlist-checkin-cancel-popup',
  templateUrl: './provider-waitlist-checkin-cancel-popup.component.html'
})
export class ProviderWaitlistCheckInCancelPopupComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  message = [];
  cancel_reasons = projectConstants.WAITLIST_CANCEL_RESON;

  customer_label = '';
  checkin_label = '';
  default_message;
  rep_username;
  rep_service;
  rep_provname;
  cur_msg = '';
  cancel_reason = '';

  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCheckInCancelPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
      this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
      this.checkin_label = this.sharedfunctionObj.getTerminologyTerm('waitlist');
     }

  ngOnInit() {
    console.log('passed in', this.data);
    this.rep_username = this.titleCaseWord(this.data.waitlist.waitlistingFor[0].firstName) + ' ' + this.titleCaseWord(this.data.waitlist.waitlistingFor[0].lastName);
    this.rep_service = this.titleCaseWord(this.data.waitlist.service.name);
    this.rep_provname = this.titleCaseWord(this.data.waitlist.provider.businessName);
    console.log('obtained', this.rep_username, this.rep_service, this.rep_provname);
    this.getDefaultMessages();
     this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      reason : ['', Validators.compose([Validators.required])],
      send_message: [false]
    });
    this.amForm.get('send_message').valueChanges
    .subscribe(
      data => {
        // console.log(data);
        if (data) {
          this.amForm.addControl('message',
          new FormControl(this.replacedMessage(), Validators.compose([Validators.required])));
          // this.amForm.get('message').setValue(this.replacedMessage());
        } else {
          this.amForm.removeControl('message');
        }
      }
    );
  }

  onSubmit (form_data) {
   const post_data =  {
      'cancelReason': form_data.reason
    };
    if (form_data.send_message) {
      post_data['communicationMessage'] = form_data.message;
    }

    this.dialogRef.close(post_data);
  }

  selectReason(cancel_reason) {
    this.amForm.get('reason').setValue(cancel_reason.value);
    this.cancel_reason = cancel_reason.title;
    if (this.amForm.get('message')) {
      this.amForm.get('message').setValue(this.replacedMessage());
    }
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

  getDefaultMessages () {
    this.provider_services.getProviderMessages()
    .subscribe(
      (data: any) => {
       this.default_message = data.cancel || '';
       // console.log('defmsg', this.default_message);
       /*this.cur_msg = this.replacedMessage();
       console.log('rep-msg', this.cur_msg);
       if (this.amForm.get('reason')) {
        this.amForm.get('reason').setValue(this.cur_msg);
       }*/
      },
      error => {

      }
    );
  }
  replacedMessage() {
    let retmsg = this.default_message;
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
