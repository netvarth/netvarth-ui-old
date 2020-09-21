import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { projectConstants } from '../../../../../../app.component';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { ActivatedRoute, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-pos-coupondetail',
  templateUrl: './pos-coupondetail.component.html'
})
export class PosCouponDetailComponent implements OnInit {

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
  valueCaption = 'Enter value';
  maxChars = projectConstantsLocal.VALIDATOR_MAX50;
  maxNumbers = projectConstantsLocal.VALIDATOR_MAX6;
  curtype = 'Fixed';
  maxlimit = projectConstants.PRICE_MAX_VALUE;
  api_loading = true;
  api_loading1 = true;
  disableButton = false;
  breadcrumbs_init = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'Jaldee Billing',
      url: '/provider/settings/pos'
    },
    {
      title: 'Coupons',
      url: '/provider/settings/pos/coupon'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  customer_label;
  coupon_id;
  action;
  coupon: any;
  cupen_name: any;
  couponcaption = 'Add Coupon';

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
        this.coupon_id = params.id;
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
        if (this.coupon_id) {
          if (this.coupon_id === 'add') {
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
                this.getCoupon(this.coupon_id).then(
                  (item) => {
                    this.coupon = item;
                    this.cupen_name = this.coupon.name;
                    if (this.action === 'edit') {
                      const breadcrumbs = [];
                      this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                      });
                      breadcrumbs.push({
                        title: this.cupen_name
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
  }

  createForm() {
    this.amForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      coupValue: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
      calculationType: ['Fixed', Validators.compose([Validators.required])]
    });

    if (this.action === 'edit') {
      this.couponcaption = 'Edit Coupon';
      this.updateForm();
    }
    this.api_loading1 = false;
  }

  updateForm() {
    this.amForm.setValue({
      'name': this.coupon.name || null,
      'description': this.coupon.description || null,
      'coupValue': this.coupon.amount || null,
      'calculationType': this.coupon.calculationType || null,
    });
    this.curtype = this.coupon.calculationType || 'Fixed';
  }

  getCoupon(couponId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getProviderCoupons(couponId)
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
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
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
  onCancel() {
    this.router.navigate(['provider', 'settings', 'pos', 'coupon']);
    this.api_loading = false;
  }
  onSubmit(form_data) {

    this.resetApiErrors();

    if (isNaN(form_data.coupValue)) {
      this.api_error = 'Please enter a numeric coupon amount';
      return;
    } else {
      if (form_data.coupValue === 0) {
        this.api_error = 'Please enter the coupon value';
        return;
      }
      if (form_data.calculationType === 'Percentage') {
        if (form_data.coupValue < 0 || form_data.coupValue > 100) {
          this.api_error = this.sharedfunctionObj.openSnackBar('Discount percentage should be between 0 and 100', { 'panelClass': 'snackbarerror' });
          return;
        }
      }
    }
    if (!isNaN(form_data.description.trim(' '))) {
      this.api_error = this.sharedfunctionObj.openSnackBar('Please enter a valid description', { 'panelClass': 'snackbarerror' });
      return;
    }
    const post_data = {
      'name': form_data.name,
      'description': form_data.description,
      'amount': form_data.coupValue,
      'calculationType': form_data.calculationType,
    };
    if (this.action === 'edit') {
      this.editCoupon(post_data);
    } else if (this.action === 'add') {
      this.addCoupon(post_data);
    }
  }

  editCoupon(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    post_data.id = this.coupon.id;
    this.provider_services.editCoupon(post_data)
      .subscribe(
        () => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('COUPON_UPDATED'));
          this.api_loading = false;
          this.router.navigate(['provider', 'settings', 'pos', 'coupon']);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }

  addCoupon(post_data) {
    this.disableButton = true;
    this.api_loading = true;
    this.provider_services.addCoupon(post_data)
      .subscribe(
        () => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('COUPON_CREATED'));
          this.api_loading = false;
          this.router.navigate(['provider', 'settings', 'pos', 'coupon']);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
          this.disableButton = false;
        }
      );
  }
  redirecToJaldeeBilling() {
    this.router.navigate(['provider', 'settings' , 'pos' , 'coupon']);
  }
}
