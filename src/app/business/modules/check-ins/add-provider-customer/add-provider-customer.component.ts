import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';

@Component({
  selector: 'app-provider-add-customer',
  templateUrl: './add-provider-customer.component.html'
})
export class AddProviderCustomerComponent implements OnInit {

  create_cap = Messages.CREATE_CAP;
  mobile_cap = Messages.MOBILE_CAP;
  f_name_cap = Messages.F_NAME_CAP;
  l_name_cap = Messages.L_NAME_CAP;
  email_cap = Messages.EMAIL_ID_CAP;
  gender_cap = Messages.GENDER_CAP;
  male_cap = Messages.MALE_CAP;
  female_cap = Messages.FEMALE_CAP;
  dob_cap = Messages.DOB_CAP;
  adrress_cap = Messages.ADDRESS_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  step = 1;
  tday = new Date();
  minday = new Date(1900, 0, 1);
  search_data = null;
  disableButton = false;
  api_loading = true;
  customer_label = '';

  constructor(
    public dialogRef: MatDialogRef<AddProviderCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
  ) {
    this.search_data = this.data.search_data;
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    if (this.data.message === 'newCustomer') {
      this.amForm = this.fb.group({
        first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        email_id: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
        dob: [''],
        gender: [''],
        address: ['']
      });
    } else {
      this.amForm = this.fb.group({
        mobile_number: ['', Validators.compose([Validators.required, Validators.maxLength(10),
        Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
        first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        email_id: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
        dob: [''],
        gender: [''],
        address: ['']
      });
      this.amForm.get('mobile_number').setValue(this.search_data.mobile_number);
      this.amForm.get('first_name').setValue(this.search_data.first_last_name);
    }
    this.api_loading = false;
  }


  onSubmit(form_data) {
    this.disableButton = true;

    const post_data = {
      'userProfile': {
        'firstName': form_data.first_name,
        'lastName': form_data.last_name,
        'dob': form_data.dob,
        'gender': form_data.gender,
        'email': form_data.email_id,
        'primaryMobileNo': form_data.mobile_number,
        'address': form_data.address,
      }
    };

    this.provider_services.createProviderCustomer(post_data)
      .subscribe(
        data => {
          this.shared_functions.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
          const user_data = { 'id': data, 'userProfile': post_data.userProfile };
          setTimeout(() => {
            this.dialogRef.close({ message: 'reloadlist', data: user_data });
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.disableButton = false;
        });
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  onFieldBlur(key) {
    this.amForm.get(key).setValue(this.toCamelCase(this.amForm.get(key).value));
  }
  toCamelCase(word) {
    if (word) {
      return this.shared_functions.toCamelCase(word);
    } else {
      return word;
    }
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
}
