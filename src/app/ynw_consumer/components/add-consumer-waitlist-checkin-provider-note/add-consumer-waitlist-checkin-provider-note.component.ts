import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ConsumerServices } from '../../services/consumer-services.service';

@Component({
  selector: 'app-consumer-waitlist-checkin-provider-note',
  templateUrl: './add-consumer-waitlist-checkin-provider-note.component.html'
})

export class AddConsumerWaitlistCheckInProviderNoteComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  checkin_id = null;
  user_id = null;
  message = '';
  source = 'consumer-common';
  constructor(
    public dialogRef: MatDialogRef<AddConsumerWaitlistCheckInProviderNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public consumer_services: ConsumerServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
        this.checkin_id = this.data.checkin_id || null;
        this.user_id = this.data.user_id || null;
        this.message = this.data.message;
        this.source = this.data.source;

        if ( !this.checkin_id && !this.user_id) {
          setTimeout(() => {
            this.dialogRef.close('error');
            }, projectConstants.TIMEOUT_DELAY);
        }
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
      case 'consumer-waitlist' : this.consumerToProviderWaitlistNote(post_data); break;
      case 'consumer-common' : this.consumerToProviderNoteAdd(post_data); break;
    }
  }

  consumerToProviderWaitlistNote(post_data) {
    this.consumer_services.addConsumerWaitlistNote(this.user_id, this.checkin_id, post_data)
    .subscribe(
      data => {
        this.sharedfunctionObj.apiSuccessAutoHide(this, Messages.CONSUMERTOPROVIDER_NOTE_ADD );
        this.dialogRef.close('reloadlist');
      },
      error => {
          this.sharedfunctionObj.apiErrorAutoHide(this, error.error);
      }
    );
  }

  consumerToProviderNoteAdd(post_data) {
    this.consumer_services.addConsumertoProviderNote(this.user_id, post_data)
    .subscribe(
      data => {
        this.sharedfunctionObj.apiSuccessAutoHide(this, Messages.CONSUMERTOPROVIDER_NOTE_ADD );
        this.dialogRef.close('reloadlist');
      },
      error => {
        this.sharedfunctionObj.apiErrorAutoHide(this, error.error);
      }
    );
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }



}


