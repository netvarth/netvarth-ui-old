import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ConsumerPaymentmodeComponent } from '../../../shared/components/consumer-paymentmode/consumer-paymentmode.component';

@Component({
  selector: 'app-provider-licence-invoice-detail',
  templateUrl: './provider-licence-invoice-detail.component.html'
})
export class ProviderLicenceInvoiceDetailComponent implements OnInit {

  service_cap = Messages.SERVICES_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  mode_cap = Messages.MODE_CAP;
  date_cap = Messages.DATE_COL_CAP;
  status_cap = Messages.COUPONS_STATUS_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  make_payment = Messages.MAKE_PAYMENT_CAP;
  invoice_cap = Messages.INVOICE_CAP;
  statment_cap = Messages.STATMENT_CAP;
  invoice_summry_cap = Messages.INVOICE_SUMMRY_CAP;
  serv_period = Messages.SERV_PERIOD_CAP;
  gateway_cap = Messages.GATEWAY_CAP;
  payment_cap = Messages.PAYMENT_CAP;
  subsc_pack_cap = Messages.SUBSC_PACKAGE;
  id_cap = Messages.ID_CAP;
  ref_id_cap = Messages.REF_ID_CAP;
  @ViewChild('div') div: ElementRef;
  api_error = null;
  api_success = null;
  invoice: any = null;
  payMentShow = 0;
  payment_modes: any = [];
  payment_detail: any = [];
  payment_status = null;
  credt_debtJson: any = null;
  credt_debtDetls = '';
  licenseDiscounts: any = null;
  discounts;
  loading = true;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  pay_data = {
    amount: 0,
   // paymentMode: 'DC', // 'null', changes as per request from Manikandan
    uuid: null,
    purpose: null
  };
  payment_popup = null;
  source = 'payment-history';
  payment_loading = false;
  disablebutton = false;
  details: any = null;
  paymentDetlId;
  jaldeeegst_data: any = [];
  gstNumber = '';
  ynwbp;
  bname;
  gstDetails: any = [];
  latestInvoiceDiscount: any = [];
  previousStatements: any = {
    addonDetailsArray: [],
    licensePkgDetailsArray: []
  };
  showPreviousDue = false;
  show = false; 
  discountDetailsTxt = 'Show discount details';

  constructor(
    public dialogRef: MatDialogRef<ProviderLicenceInvoiceDetailComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedFunctionobj: SharedFunctions,
    public sharedfunctionObj: SharedFunctions,
    public shared_functions: SharedFunctions,
    public _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) public document
  ) {
    this.invoice = data.invoice || null;
    this.source = data.source || 'payment-history';
    this.payMentShow = data.payMent;
    this.pay_data.amount = this.invoice.amount;
    this.pay_data.uuid = this.invoice.ynwUuid;
  }

  ngOnInit() {
    // alert('data is'+JSON.stringify(this.datas));
    // alert(JSON.stringify(this.invoice));
    const bdetails = this.sharedfunctionObj.getitemfromLocalStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
    }
    this.getTaxpercentage();
    this.loading = true;
    this.payment_status = this.invoice.licensePaymentStatus || null;
    this.getgst();

    this.invoiceDetail();

    if (this.payment_status === 'NotPaid' && this.source !== 'payment-history') {
      this.payment_loading = true;
      this.getPaymentModes();
    } else if (this.payment_status === 'Paid') {
      this.getPaymentDetails();
    } else if (this.source === 'payment-history') {
      this.getPaymentDetails();
    } else {
      this.dialogRef.close();
    }
    this.loading = false;
  }

  invoiceDetail() {
    this.provider_services.getInvoice(this.invoice.ynwUuid)
      .subscribe(
        data => {
          this.invoice = data;
          if (this.invoice.creditDebitJson) {
            this.credt_debtJson = JSON.parse(this.invoice.creditDebitJson);
            this.credt_debtDetls = this.credt_debtJson.creditDebitDetails;
          }
          if (this.invoice.discount) {
            this.licenseDiscounts = JSON.parse(this.invoice.discount);
            this.discounts = this.licenseDiscounts.discount;
            this.latestInvoiceDiscount =this.licenseDiscounts.discount;
          }
          if (this.invoice.mergedStatements) {
            this.checkPreviousStatements(this.invoice.mergedStatements);
            console.log('old statements.........' + JSON.stringify(this.previousStatements));
          }
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }

      );
  }

  checkPreviousStatements(mergedStatements) {
    if (mergedStatements.statements.length !== 0) {
      mergedStatements.statements.forEach(object => {
        if (object.addonDetails) {
          object.addonDetails.forEach(addon => {
            if (object.discountTotal) {
              addon['discountTotal'] = object.discountTotal;
            }
            this.previousStatements.addonDetailsArray.push(addon);
          });
        }
        if (object.discount) {
          const licenseDiscounts = JSON.parse(object.discount);
          licenseDiscounts.discount.forEach(discountObj => {
            this.discounts.push(discountObj);
          });
        }
        if (object.licensePkgDetails) {
          if (object.discountTotal) {
            object.licensePkgDetails['discountTotal'] = object.discountTotal;
          }
          this.previousStatements.licensePkgDetailsArray.push(object.licensePkgDetails);
        }
        this.checkPreviousStatements(object.mergedStatements);
      });
    }

  }
  togglePreviousDue() {
    this.showPreviousDue = !this.showPreviousDue;
  }

  toggleDiscountDetails() {
    this.show = !this.show;
    if (this.show) {
      this.discountDetailsTxt = 'Hide discount details';
    } else {
      this.discountDetailsTxt = 'Show discount details';
    }

  }
  getPaymentModes() {
    this.provider_services.getPaymentModes()
      .subscribe(
        data => {
          this.payment_modes = data;
          this.payment_loading = false;
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getTaxpercentage() {
    this.provider_services.getTaxpercentage()
      .subscribe(data => {
        this.gstDetails = data;
        if (this.gstDetails && this.gstDetails.gstNumber) {
          this.gstNumber = this.gstDetails.gstNumber || '';
        }
      },
        () => {
        });
  }
  getPaymentDetails() {
    this.provider_services.getPaymentDetail(this.invoice.ynwUuid)
      .subscribe(
        data => {
          this.payment_detail = data;
          // this.paymentDetlId = this.getJsonPaymentId(this.payment_detail);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  getJsonPaymentId(paymentdetail) {
    for (const payment of paymentdetail) {
      this.details = JSON.parse(payment.paymentId);
    }
    return this.details;
  }

  makePayment() {
    this.dialogRef.close();
    this.disablebutton = true;
    this.pay_data.purpose = 'subscriptionLicenseInvoicePayment';
    if (this.pay_data.uuid && this.pay_data.amount &&
      this.pay_data.amount !== 0 ) {

      this.payment_loading = true;

      const dialogrefd = this.dialog.open(ConsumerPaymentmodeComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'details': this.pay_data,
          'origin' : 'provider'
        }
      });

      // this.provider_services.providerPayment(this.pay_data)
      //   .subscribe(
      //     data => {
      //       if (data['response']) {
      //         this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(data['response']);
      //         this.api_success = this.shared_functions.getProjectMesssages('PAYMENT_REDIRECT');
      //         setTimeout(() => {
      //           this.document.getElementById('payuform').submit();
      //         }, 2000);
      //       } else {
      //         this.api_error = this.shared_functions.getProjectMesssages('CHECKIN_ERROR');
      //       }
      //     },
      //     error => {
      //       this.payment_loading = false;
      //       this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      //     }
      //   );
    }
  }
  getgst() {
    this.provider_services.getgst()
      .subscribe(
        data => {
          this.jaldeeegst_data = data;
        }
      );
  }
  // printMe() {
  //   // window.print();
  //   const params = [
  //     'height=' + screen.height,
  //     'width=' + screen.width,
  //     'fullscreen=yes'
  //   ].join(',');
  //   const printWindow = window.open('', '', params);
  //   let bill_html = '';
  //   bill_html += '<table width="100%">';
  //   bill_html += ' <tr><td style="border-bottom:1px solid #ddd;">';
  //   bill_html += '<table width="100%">';
  //   bill_html += ' <tr style="line-height:20px">';
  //   bill_html += '<td width="50%"  style="text-align:right;color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">' + this.bill_data.createdDate + '</td>';
  //   bill_html += ' </tr>';
  //   bill_html += ' <tr>';
  //   bill_html += '<td style="color:#000000; font-size:10pt; font-family:"Ubuntu, Arial,sans-serif;">Bill #' + this.bill_data.billId + '</td>';
  //   bill_html += '<td style="text-align:right;color:#000000; font-size:10pt;font-family:Ubuntu, Arial,sans-serif;">';
  //   if (this.bill_data.gstNumber) {
  //     bill_html += 'GSTIN ' + this.bill_data.gstNumber;
  //   }
  //   bill_html += '</td>';
  //   bill_html += ' </tr>';
  //   bill_html += '</table>';
  //   bill_html += ' </td></tr>';
  //   for (const service of this.bill_data.service) {
  //     bill_html += ' <tr><td style="border-bottom:1px solid #ddd;">';
  //     bill_html += '<table width="100%"';
  //     bill_html += ' style="color:#000000; font-size:10pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:10px">';
  //     bill_html += ' <tr >';
  //     bill_html += '<td width="50%"';
  //     bill_html += ' style="text-align:left;font-weight:bold;">';
  //     bill_html += service.serviceName + ' @ &#x20b9;' + parseFloat(service.price).toFixed(2);
  //     if (service.getGSTpercentage > 0) {
  //       bill_html += '<span style="font-size: .60rem;;font-weight: 600;color: #fda60d;"><sup> Tax</sup></span>';
  //     }
  //     bill_html += '</td>';
  //     bill_html += '<td width="20%"';
  //     bill_html += ' style="text-align:right">Qty ' + service.quantity;
  //     bill_html += '</td>';
  //     bill_html += '<td width="30%"';
  //     bill_html += ' style="text-align:right">&#x20b9;' + (service.quantity * service.price).toFixed(2) + '</td>';
  //     bill_html += ' </tr>';
  //     // List<Discount> serviceDisounts = mapper.readValue(service.getDiscount().toString(), new TypeReference<List<Discount>>(){});
  //     for (const serviceDiscount of service.discount) {
  //       bill_html += ' <tr style="color:#aaa">';
  //       bill_html += '<td style="text-align:right;"';
  //       bill_html += ' colspan="2">' + serviceDiscount.name + '</td>';
  //       bill_html += '<td style="text-align:right">(-) &#x20b9;' + parseFloat(serviceDiscount.discountValue).toFixed(2);
  //       bill_html += '</td>';
  //       bill_html += ' </tr>';
  //     }
  //     if (service.discount && service.discount.length > 0) {
  //       bill_html += ' <tr style="line-height:0;">';
  //       bill_html += '<td style="text-align:right" colspan="2"></td>';
  //       bill_html += '<td style="text-align:right; border-bottom:1px dotted #ddd"> </td>';
  //       bill_html += ' </tr>';
  //       bill_html += ' <tr style="font-weight:bold">';
  //       bill_html += '<td style="text-align:right"colspan="2">Sub Total</td>';
  //       bill_html += '<td style="text-align:right">&#x20b9;' + parseFloat(service.netRate).toFixed(2) + '</td>';
  //       bill_html += ' </tr>';
  //     }
  //     bill_html += '</table>';
  //     bill_html += ' </td></tr>';
  //   }
  //   for (const item of this.bill_data.items) {
  //     bill_html += ' <tr><td style="border-bottom:1px solid #ddd;">';
  //     bill_html += '<table width="100%"';
  //     bill_html += ' style="color:#000000; font-size:10pt; line-height:25px; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:10px">';
  //     bill_html += ' <tr>';
  //     bill_html += '<td width="50%" style="text-align:left;font-weight:bold;">' + item.itemName + ' @ &#x20b9;' + parseFloat(item.price).toFixed(2);
  //     if (item.GSTpercentage > 0) {
  //       bill_html += '<span style="font-size: .60rem;;font-weight: 600;color: #fda60d;"><sup> Tax</sup></span>';
  //     }
  //     bill_html += '</td>';
  //     bill_html += '<td width="20%" style="text-align:right">Qty ' + item.quantity + '</td>';
  //     bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + (item.quantity * item.price).toFixed(2) + '</td>';
  //     bill_html += ' </tr>';
  //     // List<Discount> itemDiscounts = mapper.readValue(item.getDiscount().toString(), new TypeReference<List<Discount>>(){};
  //     for (const itemDiscount of item.discount) {
  //       bill_html += ' <tr style="color:#aaa">';
  //       bill_html += '<td style="text-align:right" colspan="2">' + itemDiscount.name + '</td>';
  //       bill_html += '<td style="text-align:right">(-) &#x20b9;' + parseFloat(itemDiscount.discountValue).toFixed(2) + '</td>';
  //       bill_html += ' </tr>';
  //     }
  //     if (item.discount && item.discount.length > 0) {
  //       bill_html += ' <tr style="line-height:0;">';
  //       bill_html += '<td style="text-align:right" colspan="2"></td>';
  //       bill_html += '<td style="text-align:right; border-bottom:1px dotted #ddd"> </td>';
  //       bill_html += ' </tr>';
  //       bill_html += ' <tr style="font-weight:bold">';
  //       bill_html += '<td style="text-align:right" colspan="2">Sub Total</td>';
  //       bill_html += '<td style="text-align:right">&#x20b9;' + parseFloat(item.netRate).toFixed(2) + '</td>';
  //       bill_html += ' </tr>';
  //     }
  //     bill_html += '</table>';
  //     bill_html += ' </td></tr>';
  //   }
  //   bill_html += ' <tr><td>';
  //   bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-top:10px;padding-bottom:5px">                                                                             ';
  //   bill_html += ' <tr style="font-weight: bold">';
  //   bill_html += '<td width="70%" style="text-align:right">Gross Amount</td>';
  //   bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.netTotal).toFixed(2) + '</td>';
  //   bill_html += ' </tr>                                                                           ';
  //   bill_html += '</table>';
  //   bill_html += ' </td></tr>';
  //   // List<Discount> billDisounts = mapper.readValue(bill.getDiscount().toString(), new TypeReference<List<Discount>>(){});
  //   for (const billDiscount of this.bill_data.discount) {
  //     bill_html += ' <tr><td>';
  //     bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
  //     bill_html += ' <tr style="color:#aaa">';
  //     bill_html += '<td width="70%" style="text-align:right">' + billDiscount.name + '</td>';
  //     bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(billDiscount.discValue).toFixed(2) + '</td>';
  //     bill_html += ' </tr>';
  //     bill_html += '</table>';
  //     bill_html += ' </td></tr>';
  //   }
  //   // List<Coupon> providerCoupons = mapper.readValue(bill.getProviderCoupon().toString(), new TypeReference<List<Coupon>>(){});
  //   for (const providerCoupon of this.bill_data.providerCoupon) {
  //     bill_html += ' <tr><td>';
  //     bill_html += '<table width="100%" style="color:#000000; font-size:10pt;  font-family:Ubuntu, Arial,sans-serif; padding-bottom:5px">';
  //     bill_html += ' <tr style="color:#aaa">';
  //     bill_html += '<td width="70%" style="text-align:right">' + providerCoupon.name + '</td>';
  //     bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(providerCoupon.couponValue).toFixed(2) + '</td>';
  //     bill_html += ' </tr>                                                                           ';
  //     bill_html += '</table>';
  //     bill_html += ' </td></tr>';
  //   }
  //   // List<JaldeeCoupon> jCoupons = new ArrayList<>();
  //   // if(bill.getjCoupon()!=null) {
  //   //   jCoupons = mapper.readValue(bill.getjCoupon().toString(), new TypeReference<List<JaldeeCoupon>>(){});
  //   // }
  //   if (this.bill_data.jCoupon) {
  //     for (const [key, value] of Object.entries(this.bill_data.jCoupon)) {
  //       bill_html += ' <tr><td>';
  //       bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
  //       bill_html += ' <tr style="color:#aaa">';
  //       bill_html += '<td width="70%" style="text-align:right">' + key + '</td>';
  //       bill_html += '<td width="30%" style="text-align:right">(-) &#x20b9;' + parseFloat(value['value']).toFixed(2) + '</td>';
  //       bill_html += ' </tr>                                                                           ';
  //       bill_html += '</table>';
  //       bill_html += ' </td></tr>';
  //     }
  //   }
  //   if (this.bill_data.taxableTotal !== 0) {
  //     bill_html += ' <tr><td>';
  //     bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
  //     bill_html += ' <tr>';
  //     bill_html += '<td width="70%" style="text-align:right">Tax ' + this.bill_data.taxPercentage + ' % of &#x20b9;' + parseFloat(this.bill_data.taxableTotal).toFixed(2) + '(CGST-' + (this.bill_data.taxPercentage() / 2) + '%, SGST-' + (this.bill_data.taxPercentage() / 2) + '%)</td>';
  //     bill_html += '<td width="30%" style="text-align:right">(+) &#x20b9;' + parseFloat(this.bill_data.totalTaxAmount).toFixed(2) + '</td>';
  //     bill_html += ' </tr>';
  //     bill_html += '</table>';
  //     bill_html += ' </td></tr>';
  //   }
  //   if (this.bill_data.netRate > 0) {
  //     bill_html += ' <tr><td>';
  //     bill_html += '<table width="100%"  style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
  //     bill_html += ' <tr style="font-weight: bold;">';
  //     bill_html += '<td width="70%" style="text-align:right">Net Total</td>';
  //     bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.netRate).toFixed(2) + '</td>';
  //     bill_html += ' </tr>';
  //     bill_html += '</table>';
  //     bill_html += ' </td></tr>';
  //   }
  //   if (this.bill_data.getTotalAmountPaid > 0) {
  //     bill_html += ' <tr><td>';
  //     bill_html += '<table width="100%" style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
  //     bill_html += ' <tr style="font-weight: bold;">';
  //     bill_html += '<td width="70%" style="text-align:right">Amount Paid</td>';
  //     bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.totalAmountPaid).toFixed(2) + '</td>';
  //     bill_html += ' </tr>';
  //     bill_html += '</table>';
  //     bill_html += ' </td></tr>';
  //   }
  //   if (this.bill_data.amountDue > 0) {
  //     bill_html += ' <tr><td style="border-bottom:1px solid #ddd;">';
  //     bill_html += '<table width="100%"';
  //     bill_html += ' style="color:#000000; font-size:10pt; font-family:Ubuntu, Arial,sans-serif; ;padding-bottom:5px">';
  //     bill_html += ' <tr style="font-weight: bold;"> ';
  //     bill_html += '<td width="70%" style="text-align:right">Amount Due</td>';
  //     bill_html += '<td width="30%" style="text-align:right">&#x20b9;' + parseFloat(this.bill_data.amountDue).toFixed(2) + '</td>';
  //     bill_html += ' </tr>                                                                           ';
  //     bill_html += '</table>';
  //     bill_html += ' </td></tr>';
  //   }
  //   bill_html += '</table>';
  //   printWindow.document.write('<html><head><title></title>');
  //   printWindow.document.write('</head><body >');
  //   printWindow.document.write(bill_html);
  //   printWindow.document.write('</body></html>');
  //   printWindow.moveTo(0, 0);
  //   printWindow.document.close();
  //   printWindow.print();
  //   printWindow.close();
  // }
}