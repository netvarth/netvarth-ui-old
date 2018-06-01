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
  provid = null;
  message = '';
  source = 'add';
  constructor(
    public dialogRef: MatDialogRef<AddInboxMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
        this.provid = this.data.providerid || null;
        this.message = this.data.message;
        this.source = this.data.source;

        if ( !this.provid) {
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
    this.shared_services.addConsumertoProviderNote(this.provid,
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
  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}


