import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { ProviderServices } from '../../../../../business/services/provider-services.service';
import { SharedFunctions } from '../../../../functions/shared-functions';
import { SharedServices } from '../../../../services/shared-services';
import { Messages } from '../../../../constants/project-messages';
import { ActivatedRoute, Router } from '@angular/router';
import { RazorpayService } from '../../../../services/razorpay.service';
import { WindowRefService } from '../../../../services/windowRef.service';
import { WordProcessor } from '../../../../services/word-processor.service';
import { PaytmService } from '../../../../services/paytm.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { SubSink } from 'subsink';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { CommonDataStorageService } from '../../../../../shared/services/common-datastorage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { projectConstants } from '../../../../../app.component';

@Component({
  'selector': 'app-donation-link',
  'templateUrl': './donation-link.component.html',
  'styleUrls': ['./donation-link.component.css']
})

export class DonationLinkComponent implements OnInit {

  select_service_cap = Messages.SELECT_SER_CAP;
  select_deptment_cap = Messages.SELECT_DEPT_CAP;
  no_services_avail_cap = Messages.NO_SER_AVAIL_CAP;
  add_change_member = Messages.ADD_CHANGE_MEMBER;
  date_cap = Messages.DATE_CAP;
  serv_time_window_cap = Messages.SERV_TIME_WINDOW_CAP;
  enter_party_size_cap = Messages.ENTER_PARTY_SIZE;
  have_note_click_here = '';
  not_accepted_for_this_date = Messages.NOT_ACCEPTED_THIS_DATE_CAP;
  service_needs_prepayment = Messages.NEEDS_PREPAYMENT_FOR_CAP;
  prepayment_amnt_cap = Messages.PREPAYMENT_AMOUNT_CAP;
  no_pay_modes_avail_cap = Messages.NO_PAY_MODES_AVAIL_CAP;
  apply_cap = Messages.APPLY_CAP;
  select_the_cap = Messages.SELECT_THE_CAP;
  member_cap = Messages.MEMBER_CAPTION;
  members_cap = Messages.MEMBERS_CAP;
  for_whom_the_cap = Messages.FOR_WHOM_CAP;
  is_beingmade_cap = Messages.IS_BEING_MADE_CAP;
  add_member_cap = Messages.ADD_MEMBER_CAP;
  for_cap = Messages.FOR_CAP;
  today_cap = Messages.TODAY_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  domain;
  api_success = null;
  api_error = null;
  api_cp_error = null;
  services: any = [];
  servicesjson: any = [];
  serviceslist: any = [];
  galleryjson: any = [];
  settingsjson: any = [];
  locationjson: any = [];
  terminologiesjson: any = [];
  queuejson: any = [];
  sel_loc;
  sel_ser;
  sel_ser_det: any = [];
  prepaymentAmount = 0;
  sel_que;
  search_obj;
  pass_loc;
  today;
  minDate;
  maxDate;
  account_id;
  retval;
  waitlist_for: any = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  todaydate;
  server_date;
  api_loading1 = true;
  api_loading = false;
  departmentlist: any = [];
  departments: any = [];
  selected_dept;
  selected_user;
  deptLength;
  filterDepart = false;
  confrmshow = false;
  rupee_symbol = '₹';
  userData: any = [];
  userEmail;
  userPhone;
  users = [];
  selected_phone;
  consumerPhoneNo;
  donationAmount;
  provider_id: any;
  donorName: any;
  checkIn_type: any;
  origin: string;
  pGateway: any;
  donorerror = null;
  donorlasterror = null;
  donor = '';
  donorfirst;
  donorlast;
  phoneNumber;
  separateDialCode = true;
  dialCode;
  uid;
  private subs = new SubSink();
  donorFirstName = '';
  donorLastName = '';
  customId: any;
  loading = false;
  accountId;
  readMore = false;
  @ViewChild('consumer_donation') paytmview;
  loadingPaytm = false;
  isClickedOnce = false;
  payment_options: any = [];
  paytmEnabled = false;
  razorpayEnabled = false;
  interNatioanalPaid = false;
  paymentmodes: any;
  customer_countrycode: any;
  from: string;
  indian_payment_modes: any = [];
  non_indian_modes: any = [];
  shownonIndianModes: boolean;
  selected_payment_mode: any;
  isInternatonal: boolean;
  isPayment: boolean;
  theme: any;
  api_loading_video = false;
  disablebutton = false;
  payId: any;
  donationInfo: any;

  paymentStatus = false;
  orderId: any;
  paymentId: any;


  constructor(
    public dialog: MatDialog,
    public shared_services: SharedServices,
    public sharedFunctionobj: SharedFunctions,
    public router: Router,
    public route: ActivatedRoute,
    public provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    public datastorage: CommonDataStorageService,
    public _sanitizer: DomSanitizer,
    public razorpayService: RazorpayService,
    public winRef: WindowRefService,
    private paytmService: PaytmService,
    private cdRef: ChangeDetectorRef,
    private dateTimeProcessor: DateTimeProcessor,
    private ngZone: NgZone) {
    this.subs.sink = this.route.paramMap.subscribe(
      (params: any) => {
        // tslint:disable-next-line:radix
        this.payId = params.get('id');
      });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit() {
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.shared_services.getDonationLinkUuid(this.payId).subscribe(
      (donationInfo: any) => {
        this.initDonation(donationInfo);
      }
    )
  }
  initDonation(donationInfo) {
    this.donationAmount = donationInfo.donationAmount;
    this.donationInfo = donationInfo;
    console.log("Donation Info:", donationInfo);
    this.sel_loc = donationInfo.location.id;
    this.accountId = this.account_id = donationInfo.accountId;
    this.donorName = this.donor = donationInfo.donor.firstName + ' ' + donationInfo.donor.lastName;
    this.donorFirstName = donationInfo.donor.firstName;
    this.donorLastName = donationInfo.donor.lastName;
    this.donorfirst = donationInfo.donor.firstName;
    this.donorlast = donationInfo.donor.lastName;
    this.userPhone = donationInfo.donorPhoneNumber || '';
    this.dialCode = donationInfo.countryCode || '';
    this.customer_countrycode = donationInfo.countryCode;
    this.userEmail = donationInfo.donorEmail || '';
    this.consumerPhoneNo = this.userPhone;
    this.setServiceDetails(donationInfo.service);
    if (this.customer_countrycode == '+91') {
      this.getPaymentModes();
    } else {
      this.razorpayEnabled = true;
    }
    this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    this.today = new Date(this.today);
    const dd = this.today.getDate();
    const mm = this.today.getMonth() + 1; // January is 0!
    const yyyy = this.today.getFullYear();
    let cday = '';
    if (dd < 10) {
      cday = '0' + dd;
    } else {
      cday = '' + dd;
    }
    let cmon;
    if (mm < 10) {
      cmon = '0' + mm;
    } else {
      cmon = '' + mm;
    }
    const dtoday = yyyy + '-' + cmon + '-' + cday;
    this.todaydate = dtoday;
    this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
    this.waitlist_for.push({ id: 0, firstName: this.donorFirstName, lastName: this.donorLastName });
  }

  getPaymentModes() {
    this.paytmEnabled = false;
    this.razorpayEnabled = false;
    this.interNatioanalPaid = false;
    this.shared_services.getPaymentModesofProvider(this.accountId, this.sel_ser, 'donation')
      .subscribe(
        data => {
          this.paymentmodes = data[0];
          console.log('payment details..', this.paymentmodes)
          this.isPayment = true;
          if (this.paymentmodes.indiaPay) {
            this.indian_payment_modes = this.paymentmodes.indiaBankInfo;
          }
          if (this.paymentmodes.internationalPay) {
            this.non_indian_modes = this.paymentmodes.internationalBankInfo;
          }
          if (!this.paymentmodes.indiaPay && this.paymentmodes.internationalPay) {
            this.shownonIndianModes = true;
          } else {
            this.shownonIndianModes = false;
          }
        },
        error => {
          this.isPayment = false;
          console.log(this.isPayment);
        }
      );
  }
  indian_payment_mode_onchange(event) {
    this.selected_payment_mode = event.value;
    this.isInternatonal = false;
  }
  non_indian_modes_onchange(event) {
    this.selected_payment_mode = event.value;
    this.isInternatonal = true;
  }
  togglepaymentMode() {
    this.shownonIndianModes = !this.shownonIndianModes;
    this.selected_payment_mode = null;
  }
  setServiceDetails(service) {
    this.sel_ser_det = [];
    this.sel_ser_det = service;
    this.sel_ser = service.id;
    console.log('donation details.......', this.sel_ser_det);
  }
  goToGateway() {
    this.isClickedOnce = true;
    this.resetApi();
    let paymenttype = this.selected_payment_mode;
    if (this.api_error === null && this.donationAmount) {
      this.consumerPayment(this.payId, this.donationAmount, paymenttype);
    } else {
      this.isClickedOnce = false;
      this.snackbarService.openSnackBar('Please enter valid donation amount', { 'panelClass': 'snackbarerror' });
    }
  }
  consumerPayment(uid, amount, paymentWay) {
    const payInfo: any = {
      'amount': parseFloat(amount),
      'custId': this.donationInfo.id,
      'paymentMode': paymentWay,
      'uuid': uid,
      'accountId': this.account_id,
      'source': 'Desktop',
      'purpose': 'donation',
      'serviceId': this.sel_ser
    };
    payInfo.isInternational = this.isInternatonal;
    this.lStorageService.setitemonLocalStorage('uuid', uid);
    this.lStorageService.setitemonLocalStorage('acid', this.account_id);
    this.lStorageService.setitemonLocalStorage('p_src', 'c_d');
    this.subs.sink = this.shared_services.donationViaLink(payInfo)
      .subscribe((pData: any) => {
        this.checkIn_type = 'donations';
        this.origin = 'consumer';
        this.pGateway = pData.paymentGateway;
        if (this.pGateway === 'RAZORPAY') {
          this.paywithRazorpay(pData);
        } else {
          if (pData['response']) {
            this.payWithPayTM(pData, this.account_id);
          } else {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
          }
        }
      },
        error => {
          this.isClickedOnce = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  paywithRazorpay(pData: any) {
    pData.paymentMode = this.selected_payment_mode;
    this.razorpayService.initializePayment(pData, this.accountId, this);
  }
  payWithPayTM(pData: any, accountId: any) {
    this.loadingPaytm = true;
    pData.paymentMode = this.selected_payment_mode;
    this.paytmService.initializePayment(pData, accountId, this);
  }
  finishDonation(status, response?) {
    this.isClickedOnce = false;
    console.log("Status:", status);
    console.log("Response:", response);
    if (status) {
      this.paymentStatus = true;
      this.loadingPaytm=false;
      if (this.pGateway === 'RAZORPAY') {
        this.orderId = response.razorpay_order_id;
        this.paymentId = response.razorpay_payment_id;
      } else {
        this.orderId = response.ORDERID;
        this.paymentId = response.TXNID;
      }
      this.cdRef.detectChanges();
      // this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
      // let queryParams = {
      //   account_id: this.account_id,
      //   uuid: this.uid,
      //   "details": response
      // };
      // if (this.customId) {
      //   queryParams['customId'] = this.customId;
      //   if (this.lStorageService.getitemfromLocalStorage('theme')) {
      //     queryParams['theme'] = this.lStorageService.getitemfromLocalStorage('theme');
      //   }
      // }
      // if (this.from) {
      //   queryParams['isFrom'] = this.from;
      // }
      // let navigationExtras: NavigationExtras = {
      //   queryParams: queryParams
      // };
      // this.ngZone.run(() => this.router.navigate(['consumer', 'donations', 'confirm'], navigationExtras));
    } else {
      this.isClickedOnce = false;
      this.loadingPaytm = false;
      this.cdRef.detectChanges();
      this.ngZone.run(() => {
        const snackBar = this.snackbarService.openSnackBar("Transaction Failed", { 'panelClass': 'snackbarerror' });
        snackBar.onAction().subscribe(() => {
          snackBar.dismiss();
        })
      });
    }
  }
  transactionCompleted(response, payload, accountId) {
    const  _this = this;

    if (response.SRC) {
      if (response.STATUS == 'TXN_SUCCESS') {
        _this.razorpayService.updateRazorPay(payload, accountId, 'consumer')
          .then((data) => {
            if (data) {
              _this.finishDonation(true, response);
            }
          },
            error => {
              _this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
            })
      } else if (response.STATUS == 'TXN_FAILURE') {
        _this.finishDonation(false);
      }
    } else {

      if (response.STATUS == 'TXN_SUCCESS') {
        _this.paytmService.updatePaytmPay(payload, accountId)
          .then((data) => {
            if (data) {
              _this.finishDonation(true, response);
            }
          },
            error => {
              _this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
            })
      } else if (response.STATUS == 'TXN_FAILURE') {
        _this.finishDonation(false);
      }
    }
  }
  getImageSrc(mode) {
    return 'assets/images/payment-modes/' + mode + '.png';
  }
  showCheckinButtonCaption() {
    let caption = '';
    caption = 'Confirm';
    return caption;
  }
  resetApi() {
    this.api_error = null;
    this.api_success = null;
  }
  isNumeric(evt) {
    return this.sharedFunctionobj.isNumeric(evt);
  }
  showText() {
    this.readMore = !this.readMore;
  }
}
