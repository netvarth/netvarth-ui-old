import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
import { ProviderRefundComponent } from '../../../ynw_provider/components/provider-refund/provider-refund.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';



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
  item_service_gst = '';
  Pipe_disp_date = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;

  constructor(
    public dialogRef: MatDialogRef<ViewBillComponent>,
    public dialogrefundRef: MatDialogRef<ProviderRefundComponent>,
    private dialog: MatDialog,
    public provider_services: ProviderServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sharedfunctionObj: SharedFunctions,
    public shareServicesobj: SharedServices

    ) {



     }

  ngOnInit() {
    this.getTaxDetails();
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

  getTaxDetails() {
    return new Promise((resolve, reject) => {
      this.shareServicesobj.getTaxpercentage()
      .subscribe(
        data => {
          this.item_service_tax = data['taxPercentage'];
          this.item_service_gst = data['gstNumber'];
          if (this.item_service_gst !== '' && this.item_service_gst !== undefined && this.item_service_gst !== null) {
            this.item_service_gst = '(' + this.item_service_gst + ')';
          }
          resolve();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});

          reject(error);
        }
      );
    });

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

  showRefund(payment) {

   const dialogrefundRef = this.dialog.open(ProviderRefundComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      data: {
        payment_det: payment
      }
    });

    dialogrefundRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getPrePaymentDetails();
      }
    });
  }

  getPrePaymentDetails() {
    this.shareServicesobj.getPaymentDetail(this.checkin.ynwUuid, 'provider')
      .subscribe(
        data => {
          this.pre_payment_log = data;
          console.log('payment log', this.pre_payment_log);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );

  }
  stringtoDate(dt) {
    let dtsarr;
    if (dt) {
      // const dts = new Date(dt);
      dtsarr = dt.split(' ');
      const dtarr = dtsarr[0].split('-');
      return dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
    } else {
      return;
    }
  }

}


