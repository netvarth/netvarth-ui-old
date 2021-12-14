import { Component, OnInit, ChangeDetectorRef, ViewChild, NgZone } from '@angular/core';
import { ProviderServices } from '../../../business/services/provider-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { SharedServices } from '../../services/shared-services';
import { Messages } from '../../constants/project-messages';
import { ActivatedRoute } from '@angular/router';
import { RazorpayService } from '../../services/razorpay.service';
import { RazorpayprefillModel } from '../razorpay/razorpayprefill.model';
import { WindowRefService } from '../../services/windowRef.service';
import { Razorpaymodel } from '../razorpay/razorpay.model';
import { WordProcessor } from '../../services/word-processor.service';
import { GroupStorageService } from '../../services/group-storage.service';
import { PaytmService } from '../../services/paytm.service';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  'selector': 'app-payment-link',
  'templateUrl': './payment-link.component.html',
  'styleUrls': ['./payment-link.component.css']
})

export class PaymentLinkComponent implements OnInit {
  tooltipcls = '';
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
  countryCode: any;
  data: any;
  razorpayDetails: any = [];
  order_id: any;
  payment_id: any;
  razorpay_signature: any;
  paidStatus = 'false';
  providername: any;
  description: any;
  businessname: any;
  username: any;
  provider_label: any;
  customer: any;
  loadingPaytm = false;
  isClickedOnce = false;
  paymentmodes: any;
  paymode = false;
  @ViewChild('consumer_paylink') paytmview;
  razorpayEnabled = false;
  interNatioanalPaid = false;
  serviceId: any;
  shownonIndianModes: boolean;
  isInternatonal: boolean;
  selected_payment_mode: any;
  isPayment: boolean;
  indian_payment_modes: any=[]
  non_indian_modes: any=[];
  constructor(
    public provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    public sharedfunctionObj: SharedFunctions,
    public sharedServices: SharedServices,
    public razorpayService: RazorpayService,
    private paytmService: PaytmService,
    public prefillmodel: RazorpayprefillModel,
    public winRef: WindowRefService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private groupService: GroupStorageService) {
    this.activated_route.params.subscribe(
      qparams => {
        if (qparams.id !== 'new') {
          this.genid = qparams.id;
        }
      });
  }
  ngOnInit() {
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
    const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
    }
    this.getuuid();
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
  }
  getuuid() {
    this.provider_services.Paymentlinkcheck(this.genid)
      .subscribe(
        data => {
          this.bill_data = data;
          if (this.bill_data = data) {
            this.businessname = this.bill_data.accountProfile.businessName;
            this.firstname = this.bill_data.billFor.firstName;
            this.netRate = this.bill_data.netRate;
            this.amountDue = this.bill_data.amountDue;
            this.location = this.bill_data.accountProfile.location.place;
            this.billPaymentStatus = this.bill_data.billPaymentStatus;
            this.uuid = this.bill_data.uuid;
            this.accountId = this.bill_data.accountId;
            this.countryCode = this.bill_data.billFor.countryCode;
            this.serviceId=this.bill_data.service[0].serviceId;
           
         
          }
          if (this.bill_data && this.bill_data.accountId === 0) {
            this.razorpayEnabled = true;
          }
          else {
            this.getPaymentModes();
          }
          if (this.bill_data.accountProfile.providerBusinessName) {
            this.username = this.bill_data.accountProfile.providerBusinessName;
          }
          if (this.bill_data.accountProfile.domain && this.bill_data.accountProfile.subDomain) {
            const domain = this.bill_data.accountProfile.domain || null;
            const sub_domain = this.bill_data.accountProfile.subDomain || null;
            this.provider_services.getIdTerminologies(domain, sub_domain)
              .subscribe((data: any) => {
                this.customer = data.customer;
              },
                error => {
                  this.api_error = this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' };
                }
              );
          }
          if (this.bill_data && this.bill_data.discount) {
            for (let i = 0; i < this.bill_data.discount.length; i++) {
              if (this.bill_data.discount[i].displayNote) {
                this.discountDisplayNotes = true;
              }
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
  getPaymentModes() {
    
    this.serviceId=0;
    this.sharedServices.getPaymentModesofProvider(this.accountId,this.serviceId, 'billPayment')
      .subscribe(
        data => {
          this.paymentmodes = data[0];
          this.isPayment = true;
          if (this.paymentmodes.indiaPay) {
              this.indian_payment_modes = this.paymentmodes.indiaBankInfo;
          }
           if (this.paymentmodes.internationalPay) {
              this.non_indian_modes = this.paymentmodes.internationalBankInfo;

          }
          if(!this.paymentmodes.indiaPay && this.paymentmodes.internationalPay){
              this.shownonIndianModes=true;
          }else{
              this.shownonIndianModes=false;  
          }

      },
      error => {
          this.isPayment = false;
          console.log(this.isPayment);
      }

      );
  }
  getBillDateandTime() {
    if (this.bill_data.hasOwnProperty('createdDate')) {
      this.billdate = this.bill_data.createdDate;
      const datearr = this.bill_data.createdDate.split(' ');
      const billdatearr = datearr[0].split('-');
      // this.billdate = billdatearr[2] + '/' + billdatearr[1] + '/' + billdatearr[0];
      this.billtime = datearr[1] + ' ' + datearr[2];
      this.billdate = billdatearr[0] + '-' + billdatearr[1] + '-' + billdatearr[2];

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
  indian_payment_mode_onchange(event) {
    this.selected_payment_mode = event.value;
    this.isInternatonal = false;
}
non_indian_modes_onchange(event) {
    this.selected_payment_mode = event.value;
    this.isInternatonal = true;

}
togglepaymentMode(){
    this.shownonIndianModes=!this.shownonIndianModes;
}
  goToGateway(paytype?) {
    this.isClickedOnce = true;
  
    const postdata = {
      'uuid': this.genid,
      'amount': this.amountDue,
      'purpose': 'billPayment',
      'source': 'Desktop',
      'accountId':this.accountId,
      'paymentMode': this.selected_payment_mode,
      'isInternational':this.isInternatonal,
      'serviceId':0
    };

    this.provider_services.linkPayment(postdata)
      .subscribe((data: any) => {
        this.checkIn_type = 'payment_link';
        this.origin = 'consumer';
        this.pGateway = data.paymentGateway || 'PAYTM';
        if (this.pGateway === 'RAZORPAY') {
          this.paywithRazorpay(data);
        } else {
          this.payWithPayTM(data, this.accountId);
        }
      },
        error => {
          this.isClickedOnce = false;
          // this.api_error = this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' };
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
    this.razorModel.mode=this.selected_payment_mode;
    this.isClickedOnce = false;
    this.razorpayService.payBillWithoutCredentials(this.razorModel).then(
      (response: any) => {
        if (response !== 'failure') {
          this.paidStatus = 'true';

          this.order_id = response.razorpay_order_id;
          this.payment_id = response.razorpay_payment_id;
          // this.razorpay_signature = response.razorpay_signature;
          const razorpay_payload={
        
            "paymentId":response.razorpay_payment_id,
            "orderId":response.razorpay_order_id,
            "signature":response.razorpay_signature
          
        };
        this.razorpayService.updateRazorPay(razorpay_payload,this.accountId,'consumer').then((data)=>{
          console.log('successs');

          });
        } else {
          this.paidStatus = 'false';
        }
      }
    );
  }
  payWithPayTM(pData: any, accountId: any) {
    this.isClickedOnce = true;
    this.loadingPaytm = true;
    pData.paymentMode=this.selected_payment_mode;
    this.paytmService.initializePayment(pData, projectConstantsLocal.PAYTM_URL, accountId, this);
  }
  transactionCompleted(response, payload, accountId) {
    if (response.STATUS == 'TXN_SUCCESS') {
      this.paytmService.updatePaytmPay(payload, accountId)
        .then((data) => {
          if (data) {
            this.paidStatus = 'true';
            this.order_id = response.ORDERID;
            this.payment_id = response.TXNID;
            this.loadingPaytm = false;
            this.cdRef.detectChanges();
            this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
            this.ngZone.run(() => console.log('Transaction success'));
          }
        },
        error=>{
          this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
        })
    } else if (response.STATUS == 'TXN_FAILURE') {
      this.isClickedOnce = false;
      this.paidStatus = 'false';
      this.loadingPaytm = false;
      this.cdRef.detectChanges();
      this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
      this.ngZone.run(() => console.log('Transaction failed'));
    }
  }
  closeloading() {
    this.isClickedOnce = false;
    this.loadingPaytm = false;
    this.cdRef.detectChanges();
    this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
    this.ngZone.run(() => console.log('cancelled'));
  }
  billview() {
    this.showbill = !this.showbill;
  }
}
