import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-add-coupons',
  templateUrl: './add-provider-coupons.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderCouponsComponent implements OnInit {

  billing_coupons_cap = Messages.BILLING_COUPONS_CAP;
  name_mand_cap = Messages.NAME_MAND_CAP;
  type_mand_cap = Messages.TYPE_MAND_CAP;
  fixed_cap = Messages.FIXED_CAP;
  percentage_cap = Messages.PERCENTAGE_CAP;
  description_mand_cap = Messages.DESCRIPTION_MAND_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  valueCaption = 'Enter value *';
  maxChars = projectConstants.VALIDATOR_MAX50;
  maxNumbers = projectConstants.VALIDATOR_MAX9;
  curtype = 'Fixed';
  maxlimit = projectConstants.PRICE_MAX_VALUE;
  api_loading = true;
  api_loading1 = true;
  disableButton = false;

  constructor(
    public dialogRef: MatDialogRef<AddProviderCouponsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
  ) {
  }
  ngOnInit() {
    this.api_loading = false;
    this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      discValue: ['', Validators.compose([Validators.required])],
      calculationType: ['Fixed', Validators.compose([Validators.required])]
    });

    if (this.data.type === 'edit') {
      this.updateForm();
    }
    this.api_loading1 = false;
  }

  updateForm() {
    this.amForm.setValue({
      'name': this.data.coupon.name || null,
      'description': this.data.coupon.description || null,
      'discValue': this.data.coupon.amount || null,
      'calculationType': this.data.coupon.calculationType || null,
    });
    this.curtype = this.data.coupon.calculationType || 'Fixed';
  }
  onSubmit(form_data) {

    this.resetApiErrors();

    if (isNaN(form_data.discValue)) {
      this.api_error = 'Please enter a numeric coupon amount';
      return;
    } else {
      if (form_data.discValue === 0) {
        this.api_error = 'Please enter the coupon value';
        return;
      }
      if (form_data.calculationType === 'Percentage') {
        if (form_data.discValue < 0 || form_data.discValue > 100) {
          this.api_error = 'Coupon percentage should be between 0 and 100';
          return;
        }
      }
    }
    const post_data = {
      'name': form_data.name,
      'description': form_data.description,
      'amount': form_data.discValue,
      'calculationType': form_data.calculationType,
    };

    if (this.data.type === 'edit') {
      this.editCoupon(post_data);
    } else if (this.data.type === 'add') {
      this.addCoupon(post_data);
    }
  }
  addCoupon(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    this.provider_services.addCoupon(post_data)
      .subscribe(
        () => {
          this.api_success = this.shared_functions.getProjectMesssages('COUPON_CREATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }
  editCoupon(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    post_data.id = this.data.coupon.id;
    this.provider_services.editCoupon(post_data)
      .subscribe(
        () => {
          this.api_success = this.shared_functions.getProjectMesssages('COUPON_UPDATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }
  handleTypechange(typ) {
    if (typ === 'Fixed') {
      this.valueCaption = 'Enter value';
      this.maxlimit = 100000;
      this.curtype = typ;
    } else {
      this.maxlimit = 100;
      this.curtype = typ;
      this.valueCaption = 'Enter percentage value';
    }
  }

  isvalid(evt) {
    return this.shared_functions.isValid(evt);
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
