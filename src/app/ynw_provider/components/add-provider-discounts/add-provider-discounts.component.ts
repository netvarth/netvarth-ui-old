import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../app.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-add-discounts',
  templateUrl: './add-provider-discounts.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderDiscountsComponent implements OnInit {

  bill_discount_cap = Messages.BILL_DISCOUNT_CAP;
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
  parent_id;
  valueCaption = 'Enter value *';
  maxDiscountValue;
  maxChars = projectConstants.VALIDATOR_MAX50;
  maxNumbers = projectConstants.VALIDATOR_MAX9;
  curtype = 'Fixed';
  api_loading = true;
  api_loading1 = true;
  disableButton = false;

  constructor(
    public dialogRef: MatDialogRef<AddProviderDiscountsComponent>,
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
    this.maxDiscountValue = projectConstants.PRICE_MAX_VALUE;
  }
  createForm() {
    this.amForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      discValue: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxNumbers)])],
      calculationType: ['Fixed', Validators.compose([Validators.required])]
    });

    if (this.data.type === 'edit') {
      this.updateForm();
    }
    this.api_loading1 = false;
  }
  updateForm() {
    this.amForm.setValue({
      'name': this.data.discount.name || null,
      'description': this.data.discount.description || null,
      'discValue': this.data.discount.discValue || null,
      'calculationType': this.data.discount.calculationType || null,
    });
    this.curtype = this.data.discount.calculationType || 'Fixed';
    if (this.curtype === 'Fixed') {
      this.maxDiscountValue = projectConstants.PRICE_MAX_VALUE;
    } else {
      this.maxDiscountValue = projectConstants.PERC_MAX_VALUE;
    }
  }
  onSubmit(form_data) {

    this.resetApiErrors();

    if (isNaN(form_data.discValue)) {
      if (form_data.calculationType === 'Percentage') {
        this.api_error = 'Please enter a numeric discount percentage value';
      } else {
        this.api_error = 'Please enter a numeric discount value';
      }
      return;
    } else {
      if (form_data.discValue === 0) {
        if (form_data.calculationType === 'Percentage') {
          this.api_error = 'Please enter the discount percentage';
        } else {
          this.api_error = 'Please enter the discount value';
        }
        return;
      }
      if (!form_data.name.replace(/\s/g, '').length) {
        this.api_error = 'Please enter discount name';
        return;
      }
      if (form_data.calculationType === 'Percentage') {
        if (form_data.discValue < 0 || form_data.discValue > 100) {
          this.api_error = 'Discount percentage should be between 0 and 100';
          return;
        }
      }
    }
    if (!isNaN(form_data.description.trim(' '))) {
      this.api_error = 'Please enter a description';
      return;
    }
    const post_data = {
      'name': form_data.name,
      'description': form_data.description,
      'discValue': form_data.discValue,
      'calculationType': form_data.calculationType
    };

    if (this.data.type === 'edit') {
      this.editDiscount(post_data);
    } else if (this.data.type === 'add') {
      post_data['discType'] = 'Predefine';
      this.addDiscount(post_data);
    }
  }
  addDiscount(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    this.provider_services.addDiscount(post_data)
      .subscribe(
        () => {
          this.api_success = this.shared_functions.getProjectMesssages('DISCOUNT_CREATED');
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
  isvalid(evt) {
    return this.shared_functions.isValid(evt);
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  editDiscount(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    post_data.id = this.data.discount.id;
    this.provider_services.editDiscount(post_data)
      .subscribe(
        () => {
          this.api_success = this.shared_functions.getProjectMesssages('DISCOUNT_UPDATED');
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
      this.curtype = typ;
      this.valueCaption = 'Enter value';
      this.maxDiscountValue = projectConstants.PRICE_MAX_VALUE;
    } else {
      this.curtype = typ;
      this.valueCaption = 'Enter percentage value';
      this.maxDiscountValue = projectConstants.PERC_MAX_VALUE;
    }
    // this.inputRef.nativeElement.focus();
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
}
