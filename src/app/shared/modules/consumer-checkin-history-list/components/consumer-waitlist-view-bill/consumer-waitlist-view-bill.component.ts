import { Component, Inject, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { CheckInHistoryServices } from '../../consumer-checkin-history-list.service';
import { DomSanitizer } from '@angular/platform-browser'; import { DOCUMENT } from '@angular/common';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { JcCouponNoteComponent } from '../../../../../ynw_provider/components/jc-Coupon-note/jc-Coupon-note.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-consumer-waitlist-checkin-bill',
  templateUrl: './consumer-waitlist-view-bill.component.html'
})
export class ViewConsumerWaitlistCheckInBillComponent implements OnInit {
  @ViewChild('itemservicesearch', { static: false }) item_service_search;

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
  status_cap = Messages.PAY_STATUS;
  mode_cap = Messages.MODE_CAP;
  refunds_cap = Messages.REFUNDS_CAP;
  coupon_notes = projectConstants.COUPON_NOTES;
  // page_heading = 'Bill';
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
    'amount': 0,
    'accountId': null,
    'purpose': null
  };
  payment_popup = null;
  showPaidlist = false;
  showJCouponSection = false;
  jCoupon = '';
  couponList: any = [];
  refund_value;
  discountDisplayNotes = false;
  billNoteExists = false;
  showBillNotes = false;
  paytmEnabled = false;
  type;
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewConsumerWaitlistCheckInBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public consumer_checkin_history_service: CheckInHistoryServices,
    public sharedfunctionObj: SharedFunctions,
    public sharedServices: SharedServices,
    public _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) public document
  ) {
    this.checkin = this.data.checkin || null;
    this.type = this.data.isFrom;
    if (this.type == 'checkin') {
      this.uuid = this.checkin.ynwUuid;
    }
    else if (this.type == 'appointment') {
      this.uuid = this.checkin.uid;
    }
    
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
    this.bname = this.checkin.providerAccount['businessName'];
    if (this.bill_data.hasOwnProperty('billId')) {
      this.billnumber = this.bill_data.billId;
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
    const params = {
      account: checkin.providerAccount.id
    };
    this.consumer_checkin_history_service.getWaitlistBill(params, this.uuid)
      .subscribe(
        data => {
          this.bill_data = data;
          for (let i = 0; i < this.bill_data.discount.length; i++) {
            if (this.bill_data.discount[i].displayNote) {
              this.discountDisplayNotes = true;
            }
          }
          if (this.bill_data.displayNotes || this.discountDisplayNotes) {
            this.billNoteExists = true;
          }
          if (this.bill_data.amountDue < 0) {
            this.refund_value = Math.abs(this.bill_data.amountDue);
          }
          this.getBillDateandTime();
        },
        error => {
        },
        () => {
        }
      );
  }
  billNotesClicked() {
    if (!this.showBillNotes) {
      this.showBillNotes = true;
    } else {
      this.showBillNotes = false;
    }
  }
  billNotesExists(billNotesExists: any) {
    throw new Error('Method not implemented.');
  }
  getPrePaymentDetails() {
    const params = {
      account: this.checkin.providerAccount.id
    };
    this.consumer_checkin_history_service.getPaymentDetail(params, this.uuid)
      .subscribe(
        data => {
          this.pre_payment_log = data;
        },
        () => {

        }
      );
  }
  /**
   * To Get Payment Modes
   */
  getPaymentModes() {
    this.paytmEnabled = false;
    this.sharedServices.getPaymentModesofProvider(this.checkin.providerAccount.id)
      .subscribe(
        data => {
          this.payment_options = data;
          this.payment_options.forEach(element => {
            if (element.name === 'PPI') {
              this.paytmEnabled = true;
              return false;
            }
          });
          this.payModesQueried = true;
          if (this.payment_options.length <= 2) { // **** This is a condition added as per suggestion from Manikandan to avoid showing modes such as Cash, wallet etc in consumer area
            this.payModesExists = false;
          } else {
            this.payModesExists = true;
            // this.pay_data.paymentMode = 'DC'; // deleberately giving this value as per request from Manikandan.
          }
        },
        () => {
          this.payModesQueried = true;
          // this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );
  }
  /**
   * Perform PayU Payment
   */
  payuPayment() {
    this.pay_data.uuid = this.uuid;
    this.pay_data.amount = this.bill_data.amountDue;
    this.pay_data.paymentMode = 'DC';
    this.pay_data.accountId = this.checkin.providerAccount.id;
    this.pay_data.purpose = 'billPayment';
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
  paytmPayment() {
    this.pay_data.uuid = this.uuid;
    this.pay_data.amount = this.bill_data.amountDue;
    this.pay_data.paymentMode = 'PPI';
    this.pay_data.accountId = this.checkin.providerAccount.id;
    this.pay_data.purpose = 'billPayment';
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
              this.document.getElementById('paytmform').submit();
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
  //   jaldeeCoupon = ''' + jCouponCode + ''';
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
      this.sharedServices.applyCoupon(action, uuid, this.checkin.providerAccount.id).subscribe
        (billInfo => {
          this.bill_data = billInfo;
          this.getWaitlistBill(this.checkin);
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
    const params = [
      'height=' + screen.height,
      'width=' + screen.width,
      'fullscreen=yes'
    ].join(',');
    const printWindow = window.open('', '', params);
    let bill_html = '';
    bill_html += '<table width="100%">';
    bill_html += '<tr><td	style="text-align:center;font-weight:bold; color:#000000; font-size:11pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-bottom:10px;">' + this.checkin.providerAccount['businessName'] + '</td></tr>';
    bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
    bill_html += '<table width="100%">';
    bill_html += '	<tr style="line-height:20px">';
    if (this.type == 'checkin') {
      bill_html += '<td width="50%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif;">' + this.checkin.waitlistingFor[0].firstName + ' ' + this.checkin.waitlistingFor[0].lastName + '</td>';
    }
    else if (this.type == 'appointment') {
      bill_html += '<td width="50%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif;">' + this.checkin.appmtFor[0].firstName + ' ' + this.checkin.appmtFor[0].lastName + '</td>';
    }
    
    bill_html += '<td width="50%"	style="text-align:right;color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">' + this.bill_data.createdDate + '</td>';
    bill_html += '	</tr>';
    bill_html += '	<tr>';
    bill_html += '<td style="color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">Bill #' + this.bill_data.billId + '</td>';
    bill_html += '<td style="text-align:right;color:#000000; font-size:10pt;font-family:Ubuntu, Arial,sans-serif;">';
    if (this.bill_data.gstNumber) {
      bill_html += 'GSTIN ' + this.bill_data.gstNumber;
    }
    bill_html += '</td>';
    bill_html += '	</tr>';
    bill_html += '</table>';
    bill_html += '	</td></tr>';
    for (const service of this.bill_data.service) {
      bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:10px">';
      bill_html += '	<tr >';
      bill_html += '<td width="50%"';
      bill_html += '	style="text-align:left;font-weight:bold;">';
      bill_html += service.serviceName + ' &#x20b9;' + parseFloat(service.price).toFixed(2);
      if (service.getGSTpercentage > 0) {
        bill_html += '<span style="font-size: .60rem;;font-weight: 600;color: #fda60d;"><sup> Tax</sup></span>';
      }
      bill_html += '</td>';
      bill_html += '<td width="20%"';
      bill_html += '	style="text-align:right">Qty ' + service.quantity;
      bill_html += '</td>';
      bill_html += '<td width="30%"';
      bill_html += '	style="text-align:right">&#x20b9;' + (service.quantity * service.price).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      // List<Discount> serviceDisounts = mapper.readValue(service.getDiscount().toString(), new TypeReference<List<Discount>>(){});
      if (service.discount && service.discount.length > 0) {
        for (const serviceDiscount of service.discount) {
          bill_html += '	<tr style="color:#aaa">';
          bill_html += '<td style="text-align:right;"';
          bill_html += '	colspan="2">' + serviceDiscount.name + '</td>';
          bill_html += '<td style="text-align:right">(-) &#x20b9;' + parseFloat(serviceDiscount.discountValue).toFixed(2);
          bill_html += '</td>';
          bill_html += '	</tr>';
        }

        bill_html += '	<tr style="line-height:0;">';
        bill_html += '<td style="text-align:right" colspan="2"></td>';
        bill_html += '<td style="text-align:right; border-bottom:1px dotted #ddd"> </td>';
        bill_html += '	</tr>';
        bill_html += '	<tr style="font-weight:bold">';
        bill_html += '<td style="text-align:right"colspan="2">Sub Total</td>';
        bill_html += '<td style="text-align:right">&#x20b9;' + parseFloat(service.netRate).toFixed(2) + '</td>';
        bill_html += '	</tr>';
      }
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    for (const item of this.bill_data.items) {
      bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:10px">';
      bill_html += '	<tr>';
      bill_html += '<td width="50%" style="text-align:left;font-weight:bold;">' + item.itemName + ' @ &#x20b9;' + parseFloat(item.price).toFixed(2);
      if (item.GSTpercentage > 0) {
        bill_html += '<span style="font-size: .60rem;;font-weight: 600;color: #fda60d;"><sup> Tax</sup></span>';
      }
      bill_html += '</td>';
      bill_html += '<td width="20%" style="text-align:right">Qty ' + item.quantity + '</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + (item.quantity * item.price).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      // List<Discount> itemDiscounts = mapper.readValue(item.getDiscount().toString(), new TypeReference<List<Discount>>(){};
      for (const itemDiscount of item.discount) {
        bill_html += '	<tr style="color:#aaa">';
        bill_html += '<td style="text-align:right" colspan="2">' + itemDiscount.name + '</td>';
        bill_html += '<td style="text-align:right">(-) &#x20b9;' + parseFloat(itemDiscount.discountValue).toFixed(2) + '</td>';
        bill_html += '	</tr>';
      }
      if (item.discount && item.discount.length > 0) {
        bill_html += '	<tr style="line-height:0;">';
        bill_html += '<td style="text-align:right" colspan="2"></td>';
        bill_html += '<td style="text-align:right; border-bottom:1px dotted #ddd"> </td>';
        bill_html += '	</tr>';
        bill_html += '	<tr style="font-weight:bold">';
        bill_html += '<td style="text-align:right" colspan="2">Sub Total</td>';
        bill_html += '<td style="text-align:right">&#x20b9;' + parseFloat(item.netRate).toFixed(2) + '</td>';
        bill_html += '	</tr>';
      }
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    bill_html += '	<tr><td>';
    bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:5px">                                                                             ';
    bill_html += '	<tr style="font-weight: bold">';
    bill_html += '<td width="70%" style="text-align:right">Gross Amount</td>';
    bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.netTotal).toFixed(2) + '</td>';
    bill_html += '	</tr>                                                                           ';
    bill_html += '</table>';
    bill_html += '	</td></tr>';

    if (this.bill_data.jdn && this.bill_data.jdn.discount) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
      bill_html += '	<tr style="color:#aaa">';
      bill_html += '<td width="70%" style="text-align:right">JDN</td>';
      bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(this.bill_data.jdn.discount).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    // List<Discount> billDisounts = mapper.readValue(bill.getDiscount().toString(), new TypeReference<List<Discount>>(){});
    for (const billDiscount of this.bill_data.discount) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
      bill_html += '	<tr style="color:#aaa">';
      bill_html += '<td width="70%" style="text-align:right">' + billDiscount.name + '</td>';
      bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(billDiscount.discValue).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    // List<Coupon> providerCoupons = mapper.readValue(bill.getProviderCoupon().toString(), new TypeReference<List<Coupon>>(){});
    for (const providerCoupon of this.bill_data.providerCoupon) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt;  font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
      bill_html += '	<tr style="color:#aaa">';
      bill_html += '<td width="70%" style="text-align:right">' + providerCoupon.name + '</td>';
      bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(providerCoupon.couponValue).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    // List<JaldeeCoupon> jCoupons = new ArrayList<>();
    // if(bill.getjCoupon()!=null) {
    // 	jCoupons = mapper.readValue(bill.getjCoupon().toString(), new TypeReference<List<JaldeeCoupon>>(){});
    // }
    if (this.bill_data.jCoupon) {
      for (const [key, value] of Object.entries(this.bill_data.jCoupon)) {
        bill_html += '	<tr><td>';
        bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
        bill_html += '	<tr style="color:#aaa">';
        bill_html += '<td width="70%" style="text-align:right">' + key + '</td>';
        bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(value['value']).toFixed(2) + '</td>';
        bill_html += '	</tr>                                                                           ';
        bill_html += '</table>';
        bill_html += '	</td></tr>';
      }
    }
    if (this.bill_data.taxableTotal !== 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr>';
      bill_html += '<td width="70%" style="text-align:right">Tax ' + this.bill_data.taxPercentage + ' % of &#x20b9;' + parseFloat(this.bill_data.taxableTotal).toFixed(2) + '(CGST-' + (this.bill_data.taxPercentage / 2) + '%, SGST-' + (this.bill_data.taxPercentage / 2) + '%)</td>';
      bill_html += '<td width="30%" style="text-align:right">(+) &#x20b9;' + parseFloat(this.bill_data.totalTaxAmount).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.netRate > 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%"	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;">';
      bill_html += '<td width="70%" style="text-align:right">Net Total</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.netRate).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.totalAmountPaid > 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;">';
      bill_html += '<td width="70%" style="text-align:right">Amount Paid</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.totalAmountPaid).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.amountDue >= 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;"> ';
      bill_html += '<td width="70%" style="text-align:right">Amount Due</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.amountDue).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.amountDue < 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;"> ';
      bill_html += '<td width="70%" style="text-align:right">Refundable Amount</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.refund_value).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    bill_html += '</table>';
    printWindow.document.write('<html><head><title></title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(bill_html);
    printWindow.document.write('</body></html>');
    printWindow.moveTo(0, 0);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    // window.print();
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
          this.sharedServices.getbusinessprofiledetails_json(this.checkin.providerAccount.uniqueId, s3Url, 'coupon', UTCstring)
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
  showJCCouponNote(coupon) {
    if (coupon.value.systemNote.length === 1 && coupon.value.systemNote.includes('COUPON_APPLIED')) {
      // alert('in if');
    } else {
      if (coupon.value.value === '0.0') {
        const dialogref = this.dialog.open(JcCouponNoteComponent, {
          width: '50%',
          panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'jcouponmessagepopupclass'],
          disableClose: true,
          data: {
            jCoupon: coupon
          }
        });
      }
    }
  }
}
