import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-waitlist-cancel-popup',
  templateUrl: './provider-waitlist-cancel-popup.component.html'
})
export class ProviderWaitlistCancelPopupComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  message = [];
  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCancelPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

    ) {

     }

  ngOnInit() {
     this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      reason : ['', Validators.compose([Validators.required])],
      send_message: [false],
      message: ['', Validators.compose([Validators.required])]
    });
  }

  onSubmit (form_data) {
   const post_data =  {
      'communicationMessage': form_data.message
    };

  }


  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }



}
