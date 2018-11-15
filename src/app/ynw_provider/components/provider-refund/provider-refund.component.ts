import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-refund',
  templateUrl: './provider-refund.component.html'
})
export class ProviderRefundComponent implements OnInit {

  refund_cap = Messages.REFUND_CAP;
  refundable_cap = Messages.REFUNDABLE_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  mode_cap = Messages.MODE_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  amt_want_to_refund = Messages.AMT_WANT_TO_REFUND;
  please_wait_cap = Messages.PLEASE_WAIT;
  amForm: FormGroup;
  api_error = null;
  api_success = null;

  obtainedaddons = false;
  upgradableaddons: any = [];
  selected_addon = '';
  selected_addondesc = '';
  orgpayMode = '';
  refpayAmt = 0;
  refpayMode = '';
  loading = false;
  payment_options = [
    {
      label: 'Cash',
      value: 'cash',
      enabled: false
    },
    {
      label: 'Online',
      value: 'online',
      enabled: false
    },
    {
      label: 'Other',
      value: 'other',
      enabled: false
    }
  ];
  file_error_msg = '';
  constructor(
    public dialogRef: MatDialogRef<ProviderRefundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

  ) {
    console.log('in-data', data);
  }

  ngOnInit() {
    this.refpayAmt = parseFloat(this.data.payment_det.refundableAmount);
    this.orgpayMode = this.data.payment_det.acceptPaymentBy;
    if (this.orgpayMode === 'online') {
      this.payment_options[0].enabled = true;
      this.payment_options[1].enabled = true;
      this.payment_options[2].enabled = true;
      this.refpayMode = this.payment_options[0].value;
    } else if (this.orgpayMode === 'cash' || this.orgpayMode === 'other') {
      this.refpayMode = this.payment_options[0].value;
      this.payment_options[0].enabled = true;
      this.payment_options[1].enabled = false;
      this.payment_options[2].enabled = true;
    }
  }
  confirmRefund() {
    this.resetApiErrors();
    const refamt = this.refpayAmt;
    if (this.refpayAmt.toString().trim() === '0' || this.refpayAmt.toString().trim() === '') {
      this.api_error = 'Please enter a valid amount';
    } else if (isNaN(this.refpayAmt)) {
      this.api_error = 'Please enter a valid amount';
    } else {
      if (this.refpayAmt === 0) {
        this.api_error = 'Please enter the amount to be refunded';
      } else if (this.refpayAmt > this.data.payment_det.refundableAmount) {
        this.api_error = 'Sorry! Amount being refunded is greater than the refundable amount';
      } else {
        this.loading = true;
        const post_data = {
          'refundAmount': this.refpayAmt,
          'paymentReferenceId': this.data.payment_det.paymentRefId,
          'refundBy': this.refpayMode
        };
        this.provider_services.refundBill(post_data)
          .subscribe(data => {
            console.log('refund return', data);
            if (data && data['response'] === 'Success') {
              this.api_success = 'Refunded done successfully';
              setTimeout(() => {
                this.dialogRef.close('reloadlist');
              }, projectConstants.TIMEOUT_DELAY);
            } else {
              this.loading = false;
              this.api_error = this.sharedfunctionObj.getProjectErrorMesssages(data['response']);
            }
          }, error => {
            this.api_error = this.sharedfunctionObj.getProjectErrorMesssages(error);
            this.loading = false;
          });
      }
    }
  }


  getUpgradableaddonPackages() {
    this.provider_services.getUpgradableAddonPackages()
      .subscribe((data: any) => {

        this.upgradableaddons = [];

        for (const metric of data) {
          for (const addon of metric.addons) {
            this.upgradableaddons.push(addon);
          }
        }
        this.obtainedaddons = true;
      });
  }
  createForm() {
    this.amForm = this.fb.group({
      addons_selpackage: ['', Validators.compose([Validators.required])]
    });
  }
  onSubmit(form_data) {
    this.resetApiErrors();
    if (this.selected_addon) {
      this.provider_services.addAddonPackage(this.selected_addon)
        .subscribe(data => {
          this.api_success = this.sharedfunctionObj.getProjectMesssages('ADDON_ADDED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
          error => {
            // this.api_error = this.sharedfunctionObj.apiErrorAutoHide(this, error);
            this.sharedfunctionObj.apiErrorAutoHide(this, error);
          }
        );
    }
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }

}
