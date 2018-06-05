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
    },
    {
      label: 'Self Pay',
      value : 'self_pay'
    }
  ];

  pay_data = {
    'uuid': null,
    'acceptPaymentBy': 'cash',
    'amount': 0
  };

  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCheckInPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

  ) {
      this.checkin = this.data.checkin || null;
      this.bill_data = this.data.bill_data || null;


      if ( !this.bill_data) {
        setTimeout(() => {
          this.dialogRef.close('error');
          }, projectConstants.TIMEOUT_DELAY);
      }

      this.pay_data.uuid = this.bill_data.uuid;
      this.pay_data.amount = this.bill_data.netTotal;


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
          this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
    }

  }


}
