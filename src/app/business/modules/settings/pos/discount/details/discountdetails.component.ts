import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './discountdetails.component.html'
})
export class DiscountDetailsComponent implements OnInit {
  bill_discount_cap = Messages.BILL_DISCOUNT_CAP;
  name_mand_cap = Messages.NAME_MAND_CAP;
  discount_pl_holdr = Messages.DISCOUNT_NAME_CAP;
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
  breadcrumbs_init = [

    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Billing/POS',
      url: '/provider/settings/pos'
    },
    {
      title: 'Discounts',
      url: '/provider/settings/pos/discount'
    }

  ];
  breadcrumbs = this.breadcrumbs_init;
  customer_label;
  discount_id;
  action;
  discount: any;
  discountname: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    public shared_functions: SharedFunctions,
    private sharedfunctionObj: SharedFunctions,
  ) {
    this.activated_route.params.subscribe(
      (params) => {
        this.discount_id = params.id;
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
        console.log(this.discount_id);
        if (this.discount_id) {
          if (this.discount_id === 'add') {
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
              breadcrumbs.push(e);
            });
            breadcrumbs.push({
              title: 'Add'
            });
            this.breadcrumbs = breadcrumbs;
            this.action = 'add';
            this.createForm();
          } else {
            this.activated_route.queryParams.subscribe(
              (qParams) => {
                this.action = qParams.action;
                this.getdiscount(this.discount_id).then(
                  (item) => {
                    this.discount = item;
                    this.discountname = this.discount.name;
                    if (this.action === 'edit') {
                      const breadcrumbs = [];
                      this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                      });
                      breadcrumbs.push({
                        title: this.discountname
                      });
                      this.breadcrumbs = breadcrumbs;
                      this.createForm();
                    }
                  }
                );
              }
            );
          }
          this.api_loading = false;
        }
      }
    );
  }

  ngOnInit() {
    this.api_loading = false;
    this.maxDiscountValue = projectConstants.PRICE_MAX_VALUE;
  }
  createForm() {
    this.amForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      description: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_ALPHANUMERIC_DOT), Validators.maxLength(this.maxChars)])],
      discValue: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
      calculationType: ['Fixed', Validators.compose([Validators.required])]
    });

    if (this.action === 'edit') {
      this.updateForm();
    }
    this.api_loading1 = false;
  }
  updateForm() {
    this.amForm.setValue({
      'name': this.discount.name || null,
      'description': this.discount.description || null,
      'discValue': this.discount.discValue || null,
      'calculationType': this.discount.calculationType || null,
    });
    this.curtype = this.discount.calculationType || 'Fixed';
    if (this.curtype === 'Fixed') {
      this.maxDiscountValue = projectConstants.PRICE_MAX_VALUE;
    } else {
      this.maxDiscountValue = projectConstants.PERC_MAX_VALUE;
    }
  }
  onCancel() {
    this.router.navigate(['provider', 'settings', 'pos', 'discount']);
    this.api_loading = false;
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
          // this.api_error = 'Discount percentage should be between 0 and 100';
          this.api_error = this.sharedfunctionObj.openSnackBar('Discount percentage should be between 0 and 100', { 'panelClass': 'snackbarerror' });
          console.log(this.api_error);
          return;
        }
      }

    }
    if (!isNaN(form_data.description.trim(' '))) {
      // this.api_error = 'Please enter a description';
      this.api_error = this.sharedfunctionObj.openSnackBar('Please enter a valid description', { 'panelClass': 'snackbarerror' });
      return;
    }
    const post_data = {
      'name': form_data.name,
      'description': form_data.description,
      'discValue': form_data.discValue,
      'calculationType': form_data.calculationType
    };

    if (this.action === 'edit') {
      this.editDiscount(post_data);
    } else if (this.action === 'add') {
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
          // this.api_success = this.shared_functions.getProjectMesssages('DISCOUNT_CREATED');
          this.api_success = this.sharedfunctionObj.openSnackBar(Messages.DISCOUNT_CREATED);
          this.api_loading = false;
          this.router.navigate(['provider', 'settings', 'pos', 'discount']);
        },
        error => {
          // this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
    post_data.id = this.discount.id;
    this.provider_services.editDiscount(post_data)
      .subscribe(
        () => {
          // this.api_success = this.shared_functions.getProjectMesssages('DISCOUNT_UPDATED');
          this.api_success = this.sharedfunctionObj.openSnackBar(Messages.DISCOUNT_UPDATED);
          this.api_loading = false;
          this.router.navigate(['provider', 'settings', 'pos', 'discount']);
        },
        error => {
          // this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
  getdiscount(discountId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getProviderDiscounts(discountId)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }
}
