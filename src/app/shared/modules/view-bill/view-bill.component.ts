import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
import { ProviderRefundComponent } from '../../../ynw_provider/components/provider-refund/provider-refund.component';
import { DOCUMENT } from '@angular/common';
declare let cordova: any;
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
    // public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    public shareServicesobj: SharedServices,
    @Inject(DOCUMENT) public document
  ) {
  }
  ngOnInit() {
    this.checkin = this.checkin || null;
    this.bill_data = this.billdata || null;
    const bildatesarr = this.bill_data.createdDate.split(' ');
    const billdatearr = bildatesarr[0].split('-');
    this.billDatedisp = billdatearr[2] + '/' + billdatearr[1] + '/' + billdatearr[0] + ' ' + bildatesarr[1] + ' ' + bildatesarr[2];
    if (this.bill_data['passedProvname']) {
      this.bname = this.bill_data['passedProvname'];
    } else {
      const bdetails = this.sharedfunctionObj.getitemFromGroupStorage('ynwbp');
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
  /**
   * To Print Receipt
   */
  printMe() {
    // const params = [
    //   'height=' + screen.height,
    //   'width=' + screen.width,
    //   'fullscreen=yes'
    // ].join(',');
    // const printWindow = window.open('', '', params);
    let bill_html = '';
    bill_html += '<table width="100%">';
    bill_html += '<tr><td	style="text-align:center;font-weight:bold; color:#000000; font-size:11pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-bottom:10px;">' + this.checkin.provider['businessName'] + '</td></tr>';
    bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
    bill_html += '<table width="100%">';
    bill_html += '	<tr style="line-height:20px">';
    bill_html += '<td width="50%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif;">' + this.checkin.waitlistingFor[0].firstName + ' ' + this.checkin.waitlistingFor[0].lastName + '</td>';
    bill_html += '<td width="50%"	style="text-align:right;color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">' + this.bill_data.createdDate + '</td>';
    bill_html += '	</tr>';
    bill_html += '	<tr>';
    bill_html += '<td style="color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">Bill #' + this.bill_data.id + '</td>';
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
      bill_html += service.serviceName + ' @ &#x20b9;' + parseFloat(service.price).toFixed(2);
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
      for (const serviceDiscount of service.discount) {
        bill_html += '	<tr style="color:#aaa">';
        bill_html += '<td style="text-align:right;"';
        bill_html += '	colspan="2">' + serviceDiscount.name + '</td>';
        bill_html += '<td style="text-align:right">(-) &#x20b9;' + parseFloat(serviceDiscount.discountValue).toFixed(2);
        bill_html += '</td>';
        bill_html += '	</tr>';
      }
      if (service.discount && service.discount.length > 0) {
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
      bill_html += '<td width="70%" style="text-align:right">Tax ' + this.bill_data.taxPercentage + ' % of &#x20b9;' + parseFloat(this.bill_data.taxableTotal).toFixed(2) + '(CGST-' + (this.bill_data.taxPercentage() / 2) + '%, SGST-' + (this.bill_data.taxPercentage() / 2) + '%)</td>';
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
    if (this.bill_data.getTotalAmountPaid > 0) {
      bill_html += '	<tr><td>';
      bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;">';
      bill_html += '<td width="70%" style="text-align:right">Amount Paid</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.totalAmountPaid).toFixed(2) + '</td>';
      bill_html += '	</tr>';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    if (this.bill_data.amountDue > 0) {
      bill_html += '	<tr><td style="border-bottom:1px solid #ddd;">';
      bill_html += '<table width="100%"';
      bill_html += '	style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
      bill_html += '	<tr style="font-weight: bold;"> ';
      bill_html += '<td width="70%" style="text-align:right">Amount Due</td>';
      bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.amountDue).toFixed(2) + '</td>';
      bill_html += '	</tr>                                                                           ';
      bill_html += '</table>';
      bill_html += '	</td></tr>';
    }
    bill_html += '</table>';
    // printWindow.document.write('<html><head><title></title>');
    // printWindow.document.write('</head><body >');
    // printWindow.document.write(bill_html);
    // printWindow.document.write('</body></html>');
    // printWindow.moveTo(0, 0);
    // printWindow.document.close();
    // printWindow.print();
    // printWindow.close();
    cordova.plugins.printer.print(bill_html);
    // window.print();
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
