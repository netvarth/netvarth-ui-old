import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { CheckInHistoryServices } from '../../consumer-checkin-history-list.service';
import { DomSanitizer, DOCUMENT } from '@angular/platform-browser';
import { SharedServices } from '../../../../../shared/services/shared-services';
@Component({
  selector: 'app-consumer-waitlist-checkin-bill',
  templateUrl: './consumer-waitlist-view-bill.component.html'
})
export class ViewConsumerWaitlistCheckInBillComponent implements OnInit {
  @ViewChild('itemservicesearch') item_service_search;
  new_cap = Messages.NEW_CAP;
  bill_cap = Messages.BILL_CAPTION;
  date_cap = Messages.DATE_CAP;
  time_cap = Messages.TIME_CAP;
  bill_no_cap = Messages.BILL_NO_CAP;
  gstin_cap = Messages.GSTIN_CAP;
  ad_ser_item_cap = Messages.ADD_SER_ITEM_CAP;
  no_cap = Messages.NO_CAP;
  available_cap = Messages.AVAILABLE_CAP;
  qty_cap = Messages.QTY_CAPITAL_CAP;
  add_btn_cap = Messages.ADD_BTN;
  cancel_btn_cap = Messages.CANCEL_BTN;
  qnty_cap = Messages.QTY_CAP;
  select_discount_cap = Messages.SEL_DISC_CAP;
  select_coupon_cap = Messages.SEL_COUPON_CAP;
  done_btn_cap = Messages.DONE_BTN;
  discount_cap = Messages.DISCOUNT_CAP;
  coupon_cap = Messages.COUPON_CAP;
  sub_tot_cap = Messages.SUB_TOT_CAP;
  dis_coupons_cap = Messages.DISCOUNTS_COUPONS_CAP;
  delete_btn_cap = Messages.DELETE_BTN;
  gross_amnt_cap = Messages.GROSS_AMNT_CAP;
  bill_disc_cap = Messages.BILL_DISCOUNT_CAP;
  tax_cap = Messages.TAX_CAP;
  amount_paid_cap = Messages.AMNT_PAID_CAP;
  amount_to_pay_cap = Messages.AMNT_TO_PAY_CAP;
  back_to_bill_cap = Messages.BACK_TO_BILL_CAP;
  payment_logs_cap = Messages.PAY_LOGS_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  refundable_cap = Messages.REFUNDABLE_CAP;
  status_cap = Messages.STATUS_CAP;
  mode_cap = Messages.MODE_CAP;
  refunds_cap = Messages.REFUNDS_CAP;
  coupon_notes = projectConstants.COUPON_NOTES;
  api_error = null;
  api_success = null;
  checkin = null;
  bill_data = null;
  message = '';
  items: any = [];
  pre_payment_log: any = [];
  payment_options: any = [];
  close_msg = 'close';
  bname = '';
  customer_label = '';
  billdate = '';
  billtime = '';
  gstnumber = '';
  billnumber = '';
  bill_load_complete = 0;
  item_service_tax: any = 0;
  uuid;
  gateway_redirection = false;
  payModesExists = false;
  payModesQueried = false;
  pay_data = {
    'uuid': null,
    'paymentMode': null,
    'amount': 0
  };
  payment_popup = null;
  showPaidlist = false;
  showJCouponSection = false;
  jCoupon = '';
  couponList: any = [];
  constructor(
    public dialogRef: MatDialogRef<ViewConsumerWaitlistCheckInBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public consumer_checkin_history_service: CheckInHistoryServices,
    public sharedfunctionObj: SharedFunctions,
    public sharedServices: SharedServices,
    public _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) public document
  ) {
    this.checkin = this.data.checkin || null;
    this.uuid = this.checkin.ynwUuid;
    if (!this.checkin) {
      setTimeout(() => {
        this.dialogRef.close('error');
      }, projectConstants.TIMEOUT_DELAY);
    }
    this.bill_load_complete = 1;
  }
  ngOnInit() {
    this.getCouponList();
    this.getWaitlistBill(this.checkin);
    this.getPrePaymentDetails();
    this.getPaymentModes();
  }

  getBillDateandTime() {
    if (this.bill_data.hasOwnProperty('createdDate')) {
      const datearr = this.bill_data.createdDate.split(' ');
      const billdatearr = datearr[0].split('-');
      this.billdate = billdatearr[2] + '/' + billdatearr[1] + '/' + billdatearr[0];
      this.billtime = datearr[1] + ' ' + datearr[2];
    }
    if (this.bill_data.hasOwnProperty('gstNumber')) {
      this.gstnumber = this.bill_data.gstNumber;
    }
    this.bname = this.checkin.provider['businessName'];
    if (this.bill_data.hasOwnProperty('id')) {
      this.billnumber = this.bill_data.id;
    }
  }
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
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  showJCWorkbench() {
    this.showJCouponSection = true;
  }
  getWaitlistBill(checkin) {
    this.consumer_checkin_history_service.getWaitlistBill(checkin.ynwUuid)
      .subscribe(
        data => {
          this.bill_data = data;
          console.log(this.checkin);
          console.log(this.bill_data);
          this.getBillDateandTime();
        },
        error => {
          console.log(error);
        },
        () => {
        }
      );
  }
  getPrePaymentDetails() {
    this.consumer_checkin_history_service.getPaymentDetail(this.checkin.ynwUuid)
      .subscribe(
        data => {
          this.pre_payment_log = data;
        },
        error => {

        }
      );
  }
  /**
   * To Get Payment Modes
   */
  getPaymentModes() {
    this.sharedServices.getPaymentModesofProvider(this.checkin.provider.id)
      .subscribe(
        data => {
          this.payment_options = data;
          this.payModesQueried = true;
          if (this.payment_options.length <= 2) { // **** This is a condition added as per suggestion from Manikandan to avoid showing modes such as Cash, wallet etc in consumer area
            this.payModesExists = false;
          } else {
            this.payModesExists = true;
            // this.pay_data.paymentMode = 'DC'; // deleberately giving this value as per request from Manikandan.
          }
        },
        error => {
          this.payModesQueried = true;
          // this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );
  }
  /**
   * Perform PayU Payment
   */
  payuPayment() {
    console.log(this.bill_data);
    this.pay_data.uuid = this.checkin.ynwUuid;
    this.pay_data.amount = this.bill_data.amountDue;
    this.pay_data.paymentMode = 'DC';
    this.resetApiError();
    if (this.pay_data.uuid != null &&
      this.pay_data.paymentMode != null &&
      this.pay_data.amount !== 0) {
      this.api_success = Messages.PAYMENT_REDIRECT;
      this.gateway_redirection = true;
      this.sharedServices.consumerPayment(this.pay_data)
        .subscribe(
          data => {
            this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(data['response']);
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
            setTimeout(() => {
              this.document.getElementById('payuform').submit();
            }, 2000);
          },
          error => {
            this.resetApiError();
            this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    }
  }
  resetApiError() {
    this.api_success = null;
  }
  /**
 * Apply Jaldee Coupon
 */
  applyJCoupon() {
    if (this.checkCouponValid(this.jCoupon)) {
      this.applyAction(this.jCoupon, this.bill_data.uuid);
    } else {
      this.sharedfunctionObj.openSnackBar('Coupon Invalid', { 'panelClass': 'snackbarerror' });
    }
  }
  /**
   * Remove Jaldee Coupon
   * @param jCouponCode Coupon Code
   */
  // removeJCoupon(jCouponCode) {
  //   const action = 'removeJaldeeCoupons';
  //   let jaldeeCoupon: string;
  //   jaldeeCoupon = '"' + jCouponCode + '"';
  // }
  clearJCoupon() {
    this.jCoupon = '';
  }
  /**
   * Perform Bill Actions
   * @param action Action Type
   * @param uuid Bill Id
   * @param data Data to be sent as request body
   */
  applyAction(action, uuid) {
    return new Promise((resolve, reject) => {
      this.sharedServices.applyCoupon(action, uuid, this.checkin.provider.id).subscribe
        (billInfo => {
          this.bill_data = billInfo;
          this.clearJCoupon();
          resolve();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          reject(error);
        });
    });
  }
  /**
   * To Print Receipt
   */
  printMe() {
    window.print();
  }
  /**
   * Cash Button Pressed
   */
  cashPayment() {
    this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('CASH_PAYMENT'));
  }
  getCouponList() {
    const UTCstring = this.sharedfunctionObj.getCurrentUTCdatetimestring();
    this.sharedfunctionObj.getS3Url()
      .then(
        s3Url => {
          this.sharedServices.getbusinessprofiledetails_json(this.checkin.provider.uniqueId, s3Url, 'coupon', UTCstring)
            .subscribe(res => {
              this.couponList = res;
            });
        });
  }
  checkCouponValid(couponCode) {
    let found = false;
    for (let couponIndex = 0; couponIndex < this.couponList.length; couponIndex++) {
      if (this.couponList[couponIndex].jaldeeCouponCode.trim() === couponCode.trim()) {
        found = true;
        break;
      }
    }
    if (found) {
      return true;
    } else {
      return false;
    }
  }
}
