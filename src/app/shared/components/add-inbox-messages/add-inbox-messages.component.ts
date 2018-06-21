import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';

@Component({
  selector: 'app-add-inbox-messages',
  templateUrl: './add-inbox-messages.component.html'
})

export class AddInboxMessagesComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;

  user_id = null;
  uuid = null;
  message = '';
  source = null;

  title = 'Send Message';
  constructor(
    public dialogRef: MatDialogRef<AddInboxMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,

    ) {

        this.user_id = this.data.user_id || null;
        this.uuid = this.data.uuid || null;
        this.source = this.data.source || null;
        this.title = (this.data.type === 'reply') ? 'Send Reply' : 'Send Message';

     }

  ngOnInit() {
     this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      message: ['', Validators.compose([Validators.required])]
    });
  }
  onSubmit (form_data) {
    const post_data =  {
          communicationMessage: form_data.message
      };

      switch (this.source) {
        case 'provider-waitlist' : this.providerToConsumerWaitlistNote(post_data); break;
        case 'consumer-waitlist' : this.consumerToProviderWaitlistNote(post_data); break;
        case 'consumer-common' : this.consumerToProviderNoteAdd(post_data); break;
        case 'provider-common' : this.providerToConsumerNoteAdd(post_data); break;
      }
  }

  providerToConsumerWaitlistNote(post_data) {

    if (this.uuid !== null) {

      this.shared_services.addProviderWaitlistNote(this.uuid,
        post_data)
        .subscribe(
          data => {
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

  consumerToProviderWaitlistNote(post_data) {
    if (this.uuid !== null) {

      this.shared_services.addConsumerWaitlistNote(this.user_id, this.uuid,
        post_data)
        .subscribe(
          data => {
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

  providerToConsumerNoteAdd(post_data) {
    if (this.user_id !== null) {

      this.shared_services.addProvidertoConsumerNote(this.user_id,
        post_data)
        .subscribe(
          data => {
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
          data => {
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

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}


