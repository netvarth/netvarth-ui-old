import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-inbox-message',
  templateUrl: './add-provider-inbox-message.component.html'
})
export class AddProviderInboxMessageComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  message = [];
  constructor(
    public dialogRef: MatDialogRef<AddProviderInboxMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
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
   const post_data =  {
      'communicationMessage': form_data.message
    };
    this.provider_services.postProviderInboxReply(this.message['owner']['id'],
    post_data)
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
