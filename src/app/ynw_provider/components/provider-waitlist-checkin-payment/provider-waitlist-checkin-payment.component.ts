import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';


@Component({
  selector: 'app-provider-waitlist-checkin-payment',
  templateUrl: './provider-waitlist-checkin-payment.component.html'
})

export class ProviderWaitlistCheckInPaymentComponent implements OnInit {

  checkin = null;
  bill_data = null;
  payment_options = [
    {
      label: 'Cash',
      value : 'cash'
    },
    {
      label: 'Other',
      value : 'other'
    }
  ];

  pay_data = {
    'uuid': null,
    'acceptPaymentBy': 'cash',
    'amount': 0
  };

  amount_to_pay = 0;

  customer_label = '';

  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCheckInPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

  ) {
      this.checkin = this.data.checkin || null;
      this.bill_data = this.data.bill_data || null;

      console.log(this.bill_data);
      if ( !this.bill_data) {
        setTimeout(() => {
          this.dialogRef.close('error');
          }, projectConstants.TIMEOUT_DELAY);
      }

      this.pay_data.uuid = this.bill_data.uuid;
      this.pay_data.amount = this.bill_data.netRate - this.bill_data.totalAmountPaid;
      this.pay_data.amount = this.sharedfunctionObj.roundToTwoDecimel(this.pay_data.amount); // for only two decimal
      this.pay_data.amount  = (this.pay_data.amount > 0) ? this.pay_data.amount : 0;
      this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
      this.getPaymentSettings();
       console.log(this.pay_data.amount.toFixed(2));
      // console.log(Math.round(this.pay_data.amount * 100) / 100);
    }

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(result => {
      this.dialogRef.close();
    });
  }

  makePayment() {
    if ( this.pay_data.uuid != null &&
    this.pay_data.acceptPaymentBy != null &&
    this.pay_data.amount !== 0) {
      this.provider_services.acceptPayment(this.pay_data)
      .subscribe(
        data => {
          if (this.pay_data.acceptPaymentBy === 'self_pay') {

            this.sharedfunctionObj.openSnackBar(Messages.PROVIDER_BILL_PAYMENT_SELFPAY);

          } else {
            this.sharedfunctionObj.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);

          }

          this.dialogRef.close('reloadlist');
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );
    }

  }

  checkAmount(evt) {
  //  console.log(evt.which);
    if (evt.which !== 8 && evt.which !== 0 &&
      ((evt.which < 48 || evt.which > 57) &&
      (evt.which < 96 || evt.which > 105) && (evt.which !== 110) ) ||
      isNaN(this.amount_to_pay) || this.amount_to_pay < 0) {
      event.preventDefault();
    }
  }

  getPaymentSettings() {

    this.provider_services.getPaymentSettings()
    .subscribe(
      (data: any) => {
        if (data.payUVerified || data.payTmVerified) {
          this.payment_options.push(
            {
              label: 'Self Pay',
              value : 'self_pay'
            });
        }
      },
      error => {

      });
  }

}
