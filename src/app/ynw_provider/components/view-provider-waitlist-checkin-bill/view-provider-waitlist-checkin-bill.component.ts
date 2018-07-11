import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';


@Component({
  selector: 'app-provider-waitlist-checkin-bill',
  templateUrl: './view-provider-waitlist-checkin-bill.component.html'
})

export class ViewProviderWaitlistCheckInBillComponent implements OnInit {


  @ViewChild('itemservicesearch') item_service_search;

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  checkin = null;
  bill_data = null;
  message = '';
  source = 'add';
  today = new Date();
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  timeFormat = 'h:mm a';
  services: any = [];
  coupons: any = [];
  discounts: any = [];
  items: any = [];
  pre_payment_log: any = [];
  close_msg = 'close';

  selectedItems = [];
  cart = {
    'items': [],
    'prepayment_amount' : 0,
    'sub_total': 0,
    'discount': null,
    'coupon': null,
    'total': 0
  };
  bill_load_complete = 0;
  item_service_tax: any = 0;

  constructor(
    public dialogRef: MatDialogRef<ViewProviderWaitlistCheckInBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
        this.checkin = this.data.checkin || null;
        this.bill_data = this.data.bill_data || null;

        this.bill_data.amount_to_pay = this.bill_data.netRate -  this.bill_data.totalAmountPaid;

        if ( !this.checkin) {
          setTimeout(() => {
            this.dialogRef.close('error');
            }, projectConstants.TIMEOUT_DELAY);
        }


        this.bill_load_complete = 1;
        this.getPrePaymentDetails();

     }

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(result => {
      this.dialogRef.close(this.close_msg);
    });
  }




  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

  getWaitlistBill(checkin) {
    this.provider_services.getWaitlistBill(checkin.ynwUuid)
    .subscribe(
      data => {
        this.bill_data = data;
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
      },
      () => {
      }
    );
  }

  getPrePaymentDetails() {
    this.provider_services.getPaymentDetail(this.checkin.ynwUuid)
    .subscribe(
      data => {
        this.pre_payment_log = data;
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  updateBill(e) {
    this.dialogRef.close('updateBill');
  }

  makePayment(e) {
    this.dialogRef.close('makePayment');
  }

  settleBill(e) {
    this.provider_services.settleWaitlistBill(this.checkin.ynwUuid)
    .subscribe(
      data => {
        this.getWaitlistBill(this.checkin);
        this.close_msg = 'reloadlist';
        this.sharedfunctionObj.openSnackBar(Messages.PROVIDER_BILL_SETTLE);
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  emailBill(e) {
    this.provider_services.emailWaitlistBill(this.checkin.ynwUuid)
    .subscribe(
      data => {
        this.sharedfunctionObj.openSnackBar(Messages.PROVIDER_BILL_EMAIL);
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }




}


