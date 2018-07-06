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
        console.log(data);
        if (data) {
          this.amForm.addControl('message',
          new FormControl('', Validators.compose([Validators.required])));
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
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }



}
