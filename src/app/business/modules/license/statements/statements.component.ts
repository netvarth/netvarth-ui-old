import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html'
})

export class StatementsComponent implements OnInit {

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
  discounts: any = [];
  loading = true;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;

  pay_data = {
    amount: 0,
    //  paymentMode: 'DC', // 'null', changes as per request from Manikandan
    uuid: null,
    refno: null,
    purpose: null
  };
  invoices: any = [];
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
  showref = false;
  refno = 'show ref no';
  mergeinvoicerefno: any = [];
  temp;
  temp4;
  discountDetailsTxt = 'Show discount details';
  // activated_route: any;
  apiloading = false;
  breadcrumbs_init = [
    {
      title: 'License & Invoice',
      url: '/provider/license'
    }
    // {
    //     title: 'Statements'
    // }
  ];
  breadcrumbs = this.breadcrumbs_init;
  customer_label: any;
  tempp: any;
  var: any;
  temp1;
  mergestatement: any;
  licensecaption = 'Statements';

  constructor(
    public dialogRef: MatDialogRef<StatementsComponent>,
    private router: Router,
    private activated_route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedFunctionobj: SharedFunctions,
    public shared_functions: SharedFunctions,
    public _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) public document
  ) {
    this.activated_route.queryParams.subscribe(
      (qParams) => {
        this.data = qParams;
        this.temp = this.data.source;
      });
    if (this.data.data1 === 'invo-statement NotPaid') {
      const breadcrumbs = [];
      this.breadcrumbs_init.map((e) => {
        breadcrumbs.push(e);
      });
      breadcrumbs.push({
        title: 'Invoice / Statement',
        url: '/provider/license/invoicestatus'
      });
      this.breadcrumbs = breadcrumbs;
      breadcrumbs.push({
        title: 'Payment Details'
      });
      this.breadcrumbs = breadcrumbs;
    } else if (this.data.data2 === 'invo-statement Paid') {
      this.licensecaption = 'Payment Details';
      const breadcrumbs = [];
      this.breadcrumbs_init.map((e) => {
        breadcrumbs.push(e);
      });
      breadcrumbs.push({
        title: 'Invoice / Statement',
        url: '/provider/license/invoicestatus'
      });
      this.breadcrumbs = breadcrumbs;
      breadcrumbs.push({
        title: 'Statements'
      });
      this.breadcrumbs = breadcrumbs;
    } else if (this.temp === 'payment-history') {
      this.licensecaption = 'Payment Details';
      const breadcrumbs = [];
      this.breadcrumbs_init.map((e) => {
        breadcrumbs.push(e);
      });
      breadcrumbs.push({
        title: 'Payment History',
        url: '/provider/license/payment/history'
      });
      this.breadcrumbs = breadcrumbs;
      breadcrumbs.push({
        title: 'Payment Details'
      });
      this.breadcrumbs = breadcrumbs;
    } else {
      const breadcrumbs = [];
      this.breadcrumbs_init.map((e) => {
        breadcrumbs.push(e);
      });
      breadcrumbs.push({
        title: 'Statements',
      });
      this.breadcrumbs = breadcrumbs;
    }
    this.invoice = this.data.invoice || null;
    const invoiceJson = JSON.parse(this.invoice);
    this.source = this.data.source || 'payment-history';
    this.payMentShow = this.data.payMent;
    this.pay_data.amount = invoiceJson.amount;
    this.pay_data.uuid = invoiceJson.ynwUuid;
    this.pay_data.refno = invoiceJson.invoiceRefNumber;
  }

  ngOnInit() {
    const bdetails = this.sharedFunctionobj.getitemFromGroupStorage('ynwbp');
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
      // this.dialogRef.close();
    }
    this.loading = false;
  }

  invoiceDetail() {
    this.provider_services.getInvoice(this.pay_data.uuid)
      .subscribe(
        data => {
          this.invoice = data;
          if (this.invoice.creditDebitJson) {
            this.credt_debtJson = this.invoice.creditDebitJson;
            this.credt_debtDetls = this.credt_debtJson.creditDebitDetails;
          }
          if (this.invoice.discount) {
            this.licenseDiscounts = this.invoice.discount;
            this.licenseDiscounts.discount.forEach(discountObj => {
              this.latestInvoiceDiscount.push(discountObj);
              this.discounts.push(discountObj);
            });
          }
          if (this.invoice.mergedStatements) {
            this.checkPreviousStatements(this.invoice.mergedStatements);
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
          const licenseDiscounts = object.discount;
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

  PreviousInvoiceReferenceNo(invoicerefno) {
    this.showPreviousDue = !this.showPreviousDue;
    if (this.showPreviousDue) {
      this.provider_services.getMergestatement(invoicerefno).subscribe(data => {
        this.mergeinvoicerefno = data;
      });
    }
  }
  previousRefstmt(mergeinvoicerefno) {
    // let stmt = [];
    // stmt = this.invoice.mergedStatements;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        InvoiceRefNo: mergeinvoicerefno
      }
    };
    this.router.navigate(['provider', 'license', 'viewstatement'], navigationExtras);
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
    this.provider_services.getPaymentDetail(this.pay_data.uuid)
      .subscribe(
        data => {
          this.payment_detail = data;
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
    this.disablebutton = true;
    this.pay_data.purpose = 'subscriptionLicenseInvoicePayment';
    if (this.pay_data.uuid && this.pay_data.amount &&
      this.pay_data.amount !== 0) {
      this.payment_loading = true;
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'details': JSON.stringify(this.pay_data),
          'origin': 'provider',
          'paidStatus': false
        }
      };
      this.router.navigate(['provider', 'license', 'payments'], navigationExtras);
      // const dialogrefd = this.dialog.open(ConsumerPaymentmodeComponent, {
      //   width: '50%',
      //   panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      //   disableClose: true,
      //   data: {
      //     'details': this.pay_data,
      //     'origin': 'provider',
      //   }
      // });
      // dialogrefd.close();
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
  redirecToLicenseInvoice() {
    if (this.data.data1 === 'invo-statement NotPaid') {
      this.router.navigate(['provider', 'license', 'invoicestatus']);
    } else if (this.data.data2 === 'invo-statement Paid') {
      this.router.navigate(['provider', 'license', 'invoicestatus']);
    } else if (this.temp === 'payment-history') {
      this.router.navigate(['provider', 'license', 'payment', 'history']);
    } else {
      this.router.navigate(['provider', 'license']);
    }
  }
}
