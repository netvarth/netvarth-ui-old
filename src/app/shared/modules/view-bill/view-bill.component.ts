import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
import { ProviderRefundComponent } from '../../../ynw_provider/components/provider-refund/provider-refund.component';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html'
})
export class ViewBillComponent implements OnInit, OnChanges {
  // tslint:disable-next-line:no-input-rename
  @Input('checkin') checkin;
  // tslint:disable-next-line:no-input-rename
  @Input('billdata') billdata;
  // tslint:disable-next-line:no-input-rename
  @Input('prepaymentlog') prepaymentlog;
  @Input() source;
  @Output() settlebill = new EventEmitter<any>();
  @Output() emailbill = new EventEmitter<any>();
  @Output() updatebill = new EventEmitter<any>();
  bill_cap = Messages.BILL_CAPTION;
  customer_cap = Messages.CUSTOMER_CAP;
  date_cap = Messages.DATE_CAP;
  time_cap = Messages.TIME_CAP;
  bill_no_cap = Messages.BILL_NO_CAP;
  gstin_cap = Messages.GSTIN_CAP;
  qty_cap = Messages.QTY_CAP;
  discount_cap = Messages.DISCOUNT_CAP;
  coupon_cap = Messages.COUPON_CAP;
  sub_tot_cap = Messages.SUB_TOT_CAP;
  gross_amnt_cap = Messages.GROSS_AMNT_CAP;
  tax_cap = Messages.TAX_CAP;
  amount_paid_cap = Messages.AMNT_PAID_CAP;
  tot_amnt_to_pay_cap = Messages.TOT_AMNT_PAY_CAP;
  back_to_bill_cap = Messages.BACK_TO_BILL_CAP;
  payment_logs_cap = Messages.PAY_LOGS_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  refundable_cap = Messages.REFUNDABLE_CAP;
  status_cap = Messages.PAY_STATUS;
  mode_cap = Messages.MODE_CAP;
  refund_cap = Messages.REFUND_CAP;
  refunds_cap = Messages.REFUNDS_CAP;
  update_bill_cap = Messages.UPDATE_BILL_CAP;
  settle_bill_cap = Messages.SETTLE_BILL_CAP;
  print_bill_cap = Messages.PRINT_BILL_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  accept_payment_cap = Messages.ACCEPT_PAY_CAP;
  make_payment_cap = Messages.MAKE_PAYMENT_CAP;
  amount_to_pay_cap = Messages.AMNT_TO_PAY_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  bill_data = null;
  message = '';
  bname;
  today = new Date();
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  timeFormat = 'h:mm a';
  services: any = [];
  coupons: any = [];
  discounts: any = [];
  items: any = [];
  close_msg = 'close';
  showPaidlist = false;
  showHeading = true;
  selectedItems = [];
  cart = {
    'items': [],
    'prepayment_amount': 0,
    'sub_total': 0,
    'discount': null,
    'coupon': null,
    'total': 0
  };
  bill_load_complete = 0;
  item_service_tax: any = 0;
  item_service_gst = '';
  Pipe_disp_date = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
  billdate = '';
  billtime = '';
  subtotalwithouttax = 0;
  taxtotal = 0;
  taxabletotal = 0;
  taxpercentage = 0;
  billDatedisp;
  constructor(
    public dialogRef: MatDialogRef<ViewBillComponent>,
    public dialogrefundRef: MatDialogRef<ProviderRefundComponent>,
    private dialog: MatDialog,
    // public provider_services: ProviderServices,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    // public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    public shareServicesobj: SharedServices,
    @Inject(DOCUMENT) public document
  ) {
  }
  ngOnInit() {
    this.checkin = this.checkin || null;
    this.bill_data = this.billdata || null;
    console.log(this.billdata);
    const bildatesarr = this.bill_data.createdDate.split(' ');
    const billdatearr = bildatesarr[0].split('-');
    this.billDatedisp = billdatearr[2] + '/' + billdatearr[1] + '/' + billdatearr[0] + ' ' + bildatesarr[1] + ' ' + bildatesarr[2];
    if (this.bill_data['passedProvname']) {
      this.bname = this.bill_data['passedProvname'];
    } else {
      const bdetails = this.sharedfunctionObj.getitemfromLocalStorage('ynwbp');
      if (bdetails) {
        this.bname = bdetails.bn || '';
      }
    }
    this.bill_load_complete = 1;
  }
  ngOnChanges() {
    this.checkin = this.checkin || null;
    this.bill_data = this.billdata || null;
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  updateBill() {
    this.updatebill.emit('updateBill');
  }
  settleBill() {
    this.settlebill.emit('settleBill');
  }
  confirmSettleBill() {
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.sharedfunctionObj.getProjectMesssages('PROVIDER_BILL_SETTLE_CONFIRM')
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
  // showRefund(payment) {
  //   const dialogrefundRef = this.dialog.open(ProviderRefundComponent, {
  //     width: '50%',
  //     panelClass: ['commonpopupmainclass'],
  //     disableClose: true,
  //     data: {
  //       payment_det: payment
  //     }
  //   });
  //   dialogrefundRef.afterClosed().subscribe(result => {
  //     if (result === 'reloadlist') {
  //       this.getPrePaymentDetails();
  //     }
  //   });
  // }
  // getPrePaymentDetails() {
  //   this.shareServicesobj.getPaymentDetail(this.checkin.ynwUuid, 'provider')
  //     .subscribe(
  //       data => {
  //         this.pre_payment_log = data;
  //       },
  //       error => {
  //         this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //       }
  //     );

  // }
  stringtoDate(dt, mod) {
    let dtsarr;
    if (dt) {
      dtsarr = dt.split(' ');
      const dtarr = dtsarr[0].split('-');
      let retval = '';
      if (mod === 'all') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
      } else if (mod === 'date') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0];
      } else if (mod === 'time') {
        retval = dtsarr[1] + ' ' + dtsarr[2];
      }
      return retval;
      // return dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
    } else {
      return;
    }
  }

  printMe() {
    window.print();
  }
  // printElement(elem) {
  //   const domClone = elem.cloneNode(true);
  //   let printSection = document.getElementById('printSection');
  //   if (!printSection) {
  //     printSection = document.createElement('div');
  //     printSection.id = 'printSection';
  //     document.body.appendChild(printSection);
  //   }
  //   printSection.innerHTML = '';
  //   printSection.appendChild(domClone);
  //   window.print();
  // }
}
