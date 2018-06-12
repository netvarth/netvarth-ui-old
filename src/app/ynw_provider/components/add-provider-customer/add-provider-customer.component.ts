import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-add-customer',
  templateUrl: './add-provider-customer.component.html'
})
export class AddProviderCustomerComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  step = 1;
  tday = new Date();

  constructor(
    public dialogRef: MatDialogRef<AddProviderCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
    ) {

     }

  ngOnInit() {
     this.createForm(this.step);
  }
  createForm(step) {
    this.step = step;
    switch (step) {

      case 1:     this.amForm = this.fb.group({
                  mobile_number: ['', Validators.compose([Validators.required,  Validators.maxLength(10),
                    Validators.minLength(10), Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])],
                  first_last_name: ['', Validators.compose([Validators.required])]
                  }); break;
      case 2:
      this.amForm.addControl('first_name', new FormControl('', Validators.compose([Validators.required])));
        this.amForm.addControl('last_name', new FormControl('', Validators.compose([Validators.required])));
        this.amForm.addControl('email_id', new FormControl('', Validators.compose([Validators.required, Validators.email])));
        this.amForm.addControl('dob', new FormControl('', Validators.compose([Validators.required])));
        this.amForm.addControl('gender', new FormControl('male', Validators.compose([Validators.required])));
        this.amForm.addControl('address', new FormControl(''));

        this.amForm.get('last_name').setValue(this.amForm.get('first_last_name').value);
        this.amForm.get('first_name').setValue(this.amForm.get('first_last_name').value);
        this.amForm.removeControl('first_last_name');
      }

  }

  searchCustomer(form_data) {
    const post_data = {
      'firstName-eq' : form_data.first_last_name,
      'primaryMobileNo-eq' : form_data.mobile_number
    };
    this.provider_services.getCustomer(post_data)
    .subscribe(
      (data: any) => {
        if (data.length === 0) {
          this.createForm(2);
        } else {
          this.shared_functions.apiErrorAutoHide(this, Messages.CUSTOMER_SEARCH_EXIST);
        }
      },
      error => {
        this.shared_functions.apiErrorAutoHide(this, error);
      }
    );
  }

  onSubmit (form_data) {

    const post_data = {
      'userProfile': {
        'firstName': form_data.first_name,
        'lastName': form_data.last_name,
        'dob': form_data.dob,
        'gender': form_data.gender,
        'email': form_data.email_id,
        'primaryMobileNo': form_data.mobile_number,
        'address': form_data.address,
    }};

    this.provider_services.createProviderCustomer(post_data)
    .subscribe(
      data => {
        this.shared_functions.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
        setTimeout( () => {
          this.dialogRef.close('reloadlist');
        } , projectConstants.TIMEOUT_DELAY);
      },
      error => {

      });
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}
