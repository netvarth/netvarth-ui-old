import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { InboxServices } from '../../modules/inbox/inbox.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-inbox-message',
  templateUrl: './inbox-message.component.html'
})
export class InboxMessageComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  message = [];
  constructor(
    public dialogRef: MatDialogRef<InboxMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public inbox_services: InboxServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
        this.message = this.data.message;
        if ( !this.message['owner']['id']) {
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
  const usertype = this.sharedfunctionObj.isBusinessOwner('returntyp');
   const post_data =  {
      'communicationMessage': form_data.message
    };
    this.inbox_services.postInboxReply(this.message['owner']['id'],
    post_data, usertype)
    .subscribe(
      data => {
        this.api_success = Messages.MESSAGE_SENT;
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
