import { Component, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { SharedServices } from '../../services/shared-services';
import { Messages } from '../../constants/project-messages';
import { ActivatedRoute, Router } from '@angular/router';
import { RazorpayService } from '../../services/razorpay.service';
import { RazorpayprefillModel } from '../razorpay/razorpayprefill.model';
import { WindowRefService } from '../../services/windowRef.service';
import { Razorpaymodel } from '../razorpay/razorpay.model';

@Component({
  'selector': 'app-payment-link.component',
  'templateUrl': './payment-link.component.html'
})

export class PaymentLinkComponent implements OnInit {
  api_loading: boolean;
  genid;
  isCheckin;
  netRate: any;
  location: any;
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
  pGateway: any;
  orderid: any;
  razorpayid: any;
  amount: any;
  status_check: any;
  firstname: any;
  phoneno: any;
  consumeremail: any;
  consumerphonenumnber: any;
  consumername: any;
  statuscheck = true;
  showbill = false;
  billPaymentStatus: any;
  amountDue: any;
  origin: string;
  razorModel: Razorpaymodel;
  checkIn_type: string;
  accountId: any;
  data: any;
  razorpayDetails: any = [];
  razorpay_order_id: any;
  razorpay_payment_id: any;
  razorpay_signature: any;
  paidStatus = 'false';
  providername: any;
  description: any;

  constructor(
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    public sharedfunctionObj: SharedFunctions,
    public sharedServices: SharedServices,
    public razorpayService: RazorpayService,
    public prefillmodel: RazorpayprefillModel,
    public winRef: WindowRefService) {
    this.activated_route.params.subscribe(
      qparams => {
        if (qparams.id !== 'new') {
          this.genid = qparams.id;
        }
        console.log(this.genid);
      });
  }
  ngOnInit() {
    this.isCheckin = this.sharedfunctionObj.getitemFromGroupStorage('isCheckin');
    console.log(this.isCheckin);
    const bdetails = this.sharedfunctionObj.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
    }
    this.getuuid();
  }
  getuuid() {
    this.provider_services.Paymentlinkcheck(this.genid)
      .subscribe(
        data => {
          console.log(data);
          this.bill_data = data;
          if (this.bill_data = data) {
            this.firstname = this.bill_data.billFor.firstName;
            this.netRate = this.bill_data.netRate;
            this.amountDue = this.bill_data.amountDue;
            this.location = this.bill_data.accountProfile.location.place;
            this.billPaymentStatus = this.bill_data.billPaymentStatus;
            this.uuid = this.bill_data.uuid;
            this.accountId = this.bill_data.id;
          }

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
  getBillDateandTime() {
    if (this.bill_data.hasOwnProperty('createdDate')) {
      const datearr = this.bill_data.createdDate.split(' ');
      const billdatearr = datearr[0].split('-');
      this.billdate = billdatearr[2] + '/' + billdatearr[1] + '/' + billdatearr[0];
      this.billtime = datearr[1] + ' ' + datearr[2];
      console.log(this.billtime);
    }
    if (this.bill_data.hasOwnProperty('gstNumber')) {
      this.gstnumber = this.bill_data.gstNumber;
    }
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
  billNotesClicked() {
    if (!this.showBillNotes) {
      this.showBillNotes = true;
    } else {
      this.showBillNotes = false;
    }
  }


  pay() {
    const postdata = {
      'uuid': this.genid,
      'amount': this.amountDue,
      'purpose': 'prePayment',
      'source': 'Desktop',
      'paymentMode': 'DC'
    };
    this.provider_services.linkPayment(postdata)
      .subscribe((data: any) => {
        this.checkIn_type = 'payment_link';
        this.origin = 'consumer';
        this.pGateway = data.paymentGateway;
        if (this.pGateway === 'RAZORPAY') {
          this.paywithRazorpay(data);
        }
      });
  }
  paywithRazorpay(data: any) {
    this.prefillmodel.name = data.consumerName;
    this.prefillmodel.email = data.ConsumerEmail;
    this.prefillmodel.contact = data.consumerPhoneumber;
    this.razorModel = new Razorpaymodel(this.prefillmodel);
    this.razorModel.key = data.razorpayId;
    this.razorModel.amount = data.amount;
    this.razorModel.order_id = data.orderId;
    this.razorModel.name = data.providerName;
    this.razorModel.description = data.description;
    this.razorpayService.payBillWithoutCredentials(this.razorModel).then(
      (response: any) => {
        console.log(response);
        if (response !== 'failure') {
          this.paidStatus = 'true';
          this.razorpay_order_id = response.razorpay_order_id;
          this.razorpay_payment_id = response.razorpay_payment_id;
          // this.razorpay_signature = response.razorpay_signature;
        } else {
          this.paidStatus = 'false';
        }
      }
    );
  }
  billview() {
    this.showbill = true;
  }
}

