import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';



@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html'
})

export class ViewBillComponent implements OnInit, OnChanges {

  @Input('checkin') checkin;
  @Input('billdata') billdata;
  @Input('prepaymentlog') prepaymentlog;
  @Input() source;

  @Output() makepayment = new EventEmitter<any>();
  @Output() settlebill = new EventEmitter<any>();
  @Output() emailbill = new EventEmitter<any>();
  @Output() updatebill = new EventEmitter<any>();

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  bill_data = null;
  message = '';
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
    public dialogRef: MatDialogRef<ViewBillComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sharedfunctionObj: SharedFunctions,

    ) {



     }

  ngOnInit() {
    this.checkin = this.checkin || null;
    this.bill_data = this.billdata || null;
    this.pre_payment_log = this.prepaymentlog || null;
    this.bill_data.amount_to_pay = this.bill_data.netRate -  this.bill_data.totalAmountPaid;

    if ( !this.checkin) {
      setTimeout(() => {
        this.dialogRef.close('error');
        }, projectConstants.TIMEOUT_DELAY);
    }


    this.bill_load_complete = 1;

    this.dialogRef.backdropClick().subscribe(result => {
      this.dialogRef.close(this.close_msg);
    });
  }

  ngOnChanges() {
    this.checkin = this.checkin || null;
    this.bill_data = this.billdata || null;
    this.pre_payment_log = this.prepaymentlog || null;
  }



  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }



  updateBill() {
    this.updatebill.emit('updateBill');
  }

  makePayment() {
    this.makepayment.emit('makePayment');
  }

  settleBill() {
    this.settlebill.emit('settleBill');
  }

  confirmSettleBill() {
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
      data: {
        'message' : this.sharedfunctionObj.getProjectMesssages('PROVIDER_BILL_SETTLE_CONFIRM')
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      if (result) {
          this.settleBill();
      }
    });
  }

  emailBill() {
    this.emailbill.emit('emailBill');
  }




}


