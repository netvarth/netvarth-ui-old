import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-search-provider-customer',
  templateUrl: './search-provider-customer.component.html'
})
export class SearchProviderCustomerComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  tday = new Date();
  source  = null;

  customer_label = '';
  create_new = false;
  form_data = null;

  constructor(
    public dialogRef: MatDialogRef<SearchProviderCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
    ) {
      this.source = this.data.source;
      this.customer_label = this.shared_functions.getTerminologyTerm('customer');
     }

  ngOnInit() {
     this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      mobile_number: ['', Validators.compose([Validators.required,  Validators.maxLength(10),
        Validators.minLength(10), Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])],
      first_last_name: ['', Validators.compose([Validators.required])]
      });

  }

  searchCustomer(form_data) {
    this.resetApiErrors();
    this.form_data = null;
    this.create_new = false;

    const post_data = {
      'firstName-eq' : form_data.first_last_name,
      'primaryMobileNo-eq' : form_data.mobile_number
    };
    this.provider_services.getCustomer(post_data)
    .subscribe(
      (data: any) => {
        if (data.length === 0) {
          if (this.source === 'createCustomer') {
            const return_data = {
              'message': 'noCustomer',
              'data': form_data
            };
            this.dialogRef.close(return_data);
          } else if (this.source === 'providerCheckin') {
            this.form_data = form_data;
            this.create_new = true;
          }

        } else {
          if (this.source === 'createCustomer') {
            this.shared_functions.apiErrorAutoHide(this, Messages.CUSTOMER_SEARCH_EXIST);
          }  else if (this.source === 'providerCheckin') {
            const return_data = {
              'message': 'haveCustomer',
              'data': data[0]
            };
            this.dialogRef.close(return_data);
          }
        }
      },
      error => {
        this.shared_functions.apiErrorAutoHide(this, error);
      }
    );
  }

  createNew() {

    const return_data = {
      'message': 'noCustomer',
      'data': this.form_data
    };
    this.dialogRef.close(return_data);
  }

  resetApiErrors () {
    this.create_new = false;
    this.api_error = null;
    this.api_success = null;
  }
}
