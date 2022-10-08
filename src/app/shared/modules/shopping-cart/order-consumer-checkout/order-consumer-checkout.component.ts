import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, ViewChild, Inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { SharedFunctions } from '../../../functions/shared-functions';
import { Location, DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AddAddressComponent } from './add-address/add-address.component';
import { SharedServices } from '../../../services/shared-services';
import { projectConstants } from '../../../../app.component';
import { ConsumerJoinComponent } from '../../../../ynw_consumer/components/consumer-join/join.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { ShoppinglistuploadComponent } from '../../../../shared/components/shoppinglistupload/shoppinglistupload.component';
import { ConfirmBoxComponent } from '../../../components/confirm-box/confirm-box.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { Messages } from '../../../constants/project-messages';
import { FormMessageDisplayService } from '../../form-message-display/form-message-display.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { S3UrlProcessor } from '../../../services/s3-url-processor.service';
import { SubSink } from '../../../../../../node_modules/subsink';
import { DomSanitizer } from '@angular/platform-browser';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { RazorpayService } from '../../../../shared/services/razorpay.service';
import { PaytmService } from '../../../../../app/shared/services/paytm.service';
import { JcCouponNoteComponent } from '../../jc-coupon-note/jc-coupon-note.component';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
import { ConsumerEmailComponent } from '../../../../ynw_consumer/shared/component/consumer-email/consumer-email.component';
import { MatStepper } from '@angular/material/stepper';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AddItemNotesComponent } from '../add-item-notes/add-item-notes.component';

@Component({
  selector: 'app-order-consumer-checkout',
  templateUrl: './order-consumer-checkout.component.html',
  styleUrls: ['./order-consumer-checkout.component.scss']
})

export class OrderConsumerCheckoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;
  totaltax = 0;
  provider_id: any;
  // s3url;
  retval: Promise<void>;
  api_loading1: boolean;
  coupon_status = null;
  checkoutDisabled: boolean;
  loading = true;
  disabled = false;
  userEmail = '';
  orderNote: any;
  deliveryoptions = true;
  deliveryoptionsmobile = false;
  orderlistNote: any;
  addItemNotesdialogRef: any;
  phonenumber: any;
  customer_countrycode: any;
  notfutureAvailableTime = false;
  chosenDateDetails: any;
  businessDetails: any;
  order_count: any;
  desktopView: any;
  mobileView: any;
  deviceInfo: any;
  isFuturedate = false;
  sel_checkindate;
  showfuturediv;
  today;
  server_date;
  minDate;
  maxDate;
  todaydate;
  home_delivery = false;
  store_pickup = false;
  nextAvailableTime: string;
  customer_email: any;
  customer_phoneNumber: any;
  selectedAddress: any;
  orderSummary: any[];
  taxAmount: any;
  orderAmount: any;
  catalogItem: any;
  addressDialogRef: any;
  orderList: any = [];
  price: number;
  orders: any[];
  delivery_type: any;
  selectedQsTime;
  selectedQeTime;
  order_date;
  customer_data: any = [];
  added_address: any = [];
  advance_amount: any;
  account_id: any;
  selectedRowIndex = -1;
  storeChecked = true;
  emailId;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  tooltipcls = '';
  linear: boolean;
  catalog_details: any;
  trackUuid;
  screenWidth: number;
  no_of_grids: number;
  isLinear = true;
  loginForm: FormGroup;
  storeContact: FormGroup;
  choose_type = 'store';
  action: any = '';
  catalog_Id: any;
  futureAvailableTime;
  storeAvailableDates: any = [];
  homeAvailableDates: any = [];
  hold_sel_checkindate;
  applied_inbilltime = Messages.APPLIED_INBILLTIME;
  ddate;
  isfutureAvailableTime = true;
  storeContactNw: any;
  showSide = false;
  orderType = '';
  image_list_popup: Image[];
  selectedImagelist = {
    files: [],
    base64: [],
    caption: []
  };
  imagelist = {
    files: [],
    base64: [],
    caption: []
  };
  shoppinglistdialogRef;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [

      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };

  onlyvirtualItemsPresent = false;
  canceldialogRef: any;
  // availableTimewindows: any = [];
  // timeWindows;
  nextAvailableTimeQueue: any = [];
  queue;
  couponvalid = true;
  api_cp_error = null;
  s3CouponsList: any = {
    JC: [], OWN: []
  };
  selected_coupons: any = [];
  couponsList: any = [];
  selected_coupon;
  showCouponWB: boolean;
  cartDetails: any = [];
  listDetails: any = [];
  store_availables: any;
  home_availables: any;
  couponStatuses: any;
  private subs = new SubSink();
  couponlist: any = [];
  pcouponlist: any = [];
  checkJcash = false;
  checkJcredit = false;
  jaldeecash: any;
  jcashamount: any;
  jcreditamount: any;
  remainingadvanceamount;
  amounttopay: any;
  wallet: any;
  orderDetails: any;
  pGateway: any;
  payment_popup = null;
  livetrack: any;
  prepayAmount: any;
  customId: any; // To know the source whether the router came from Landing page or not
  businessId: any;
  @ViewChild('consumer_order') paytmview;
  totalamountPay: any;
  loadingPaytm = false;
  isClickedOnce = false;
  payment_options: any = [];
  paytmEnabled = false;
  razorpayEnabled = false;
  interNatioanalPaid = false;
  paymentmodes: any;
  from: string;
  isEditable = true;
  stepperIndex: string;
  selected_payment_mode: any;
  isInternatonal: boolean;
  shownonIndianModes: boolean;
  isPayment: boolean;
  indian_payment_modes: any = [];
  non_indian_modes: any = [];
  questionnaireList: any = [];
  questionAnswers;
  catalogId: any;
  questionnaireLoaded = false;
  qnr = false;
  api_loading_video;
  disableButton;
  disablebutton = false;
  bookStep = 'qnr';
  con_email: any;
  source: any;
  termscheck: boolean = false;
  convenientPaymentModes: any = [];
  convenientFeeObj: any;
  convenientFee: any;
  gatewayFee: any;
  defultTextFirstStep: string = 'The primary objective of AuthorDemy.com is to help you improve the quality of the manuscript that you have prepared for publication so that its chances for getting accepted for publication increases considerably.We are particular that you should take full advantage of this additional step that we recommend to you before you submit your manuscript for publication. We want to improve not only the quality of the publication that you submitted to us, but also the writing skill of the authors by this exercise. Ideally, we do not want you to come back to AuthorDemy.com for all your future publications. Instead, we look forward to new authors to come to us based on the positive feed back about AuthorDemy.com that you give to them based on your experience in working with AuthorDemy.com. In order to achieve these, we request you to make sure that the manuscript you submit to AuthorDemy.com is finalized based on the information and instructions provided below.'
  defultMoreText: string = '...show more';
  defultTextSecondStep: string = ''
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    private shared_services: SharedServices,
    private _formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private lStorageService: LocalStorageService,
    public fed_service: FormMessageDisplayService,
    private dateTimeProcessor: DateTimeProcessor,
    private s3Processor: S3UrlProcessor,
    public _sanitizer: DomSanitizer,
    private wordProcessor: WordProcessor,
    @Inject(DOCUMENT) public document,
    public razorpayService: RazorpayService,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private paytmService: PaytmService,
    public provider_services: ProviderServices,
    private deviceService: DeviceDetectorService
  ) {


    this.loginForm = this._formBuilder.group({
      phone: [this.customer_phoneNumber, Validators.required]
    });

    this.storeContact = this._formBuilder.group({

      phone: ['', Validators.required],
      email: ['', Validators.required]
    });
    this.route.queryParams.subscribe(
      params => {

        if (params.catalog_Id) {
          this.catalogId = params.catalog_Id;
        }
      });
    this.chosenDateDetails = this.lStorageService.getitemfromLocalStorage('chosenDateTime');
    this.account_id = this.chosenDateDetails.account_id;
    this.route.queryParams.subscribe(
      params => {
        this.provider_id = params.providerId;
        if (params.customId) {
          this.customId = params.customId;
        }
        if (params.isFrom && params.isFrom == 'providerdetail') {
          this.from = 'providerdetail';
        }
        if (params.source) {
          this.source = params.source;
        }
        if (params.account_id) {
          this.account_id = params.account_id;
        }
      });



    this.businessDetails = this.lStorageService.getitemfromLocalStorage('order_sp');
    this.chosenDateDetails = this.lStorageService.getitemfromLocalStorage('chosenDateTime');
    this.delivery_type = this.chosenDateDetails.delivery_type;
    this.choose_type = this.delivery_type;
    this.catalog_Id = this.chosenDateDetails.catlog_id;
    this.advance_amount = this.chosenDateDetails.advance_amount;
    this.account_id = this.chosenDateDetails.account_id;
    if (this.chosenDateDetails.selected_coupons) {
      if (this.chosenDateDetails.selected_coupons.length > 0) {
        this.selected_coupons = this.chosenDateDetails.selected_coupons;
        console.log(this.selected_coupons);
      }
    } if (this.chosenDateDetails.couponsList) {
      this.couponsList = this.chosenDateDetails.couponsList;
      console.log(this.couponsList);
    }

    if (this.choose_type === 'store') {
      this.store_pickup = true;
      this.storeChecked = true;

    } else if (this.choose_type === 'home') {
      this.home_delivery = true;
      this.storeChecked = false;
    }
    this.sel_checkindate = this.chosenDateDetails.order_date;
    this.nextAvailableTime = this.chosenDateDetails.nextAvailableTime;
    this.onResize();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    let divider;
    const divident = this.screenWidth / 37.8;
    if (this.screenWidth > 1000) {
      divider = divident / 2;
    } else if (this.screenWidth > 500 && this.screenWidth < 1000) {
      divider = divident / 2;
    } else if (this.screenWidth > 375 && this.screenWidth < 500) {
      divider = divident / 2;
    } else if (this.screenWidth < 375) {
      divider = divident / 1;
    }
    this.no_of_grids = Math.round(divident / divider);

  }

  ngOnInit() {
    console.log("Checkout Component");
    this.getPaymentModes();
    const credentials = this.sharedFunctionobj.getJson(this.lStorageService.getitemfromLocalStorage('ynw-credentials'));
    this.customer_countrycode = credentials.countryCode;
    this.linear = false;
    this.orderList = this.lStorageService.getitemfromLocalStorage('consumerorders');
    if (this.orderList) {
      console.log("this.orderList", this.orderList)
      this.orders = [...new Map(this.orderList.map(item => [item.item['itemId'], item])).values()];
      this.isPhysicalItemsPresent();
    }

    this.getConsumerQuestionnaire();


    this.getCatalogDetails(this.account_id).then(data => {
      this.catalog_details = data;
      this.imagelist = this.selectedImagelist;
      this.orderType = this.catalog_details.orderType;
      this.loading = false;
      this.gets3curl();
      if (this.catalog_details.advanceAmount > 0 && this.orderType === 'SHOPPINGLIST') {
        // this.getJaldeeCashandCredit();
        this.getlisttDetails();
      }
      if (this.orderType !== 'SHOPPINGLIST') {
        this.getCartDetails();
      }
      if (this.orderType === 'SHOPPINGLIST') {
        this.imagelist = {
          files: [],
          base64: [],
          caption: []
        };

        this.shoppinglistdialogRef = this.dialog.open(ShoppinglistuploadComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true,
          data: {
            source: this.imagelist,
            type: 'add'
          }
        });
        this.shoppinglistdialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.selectedImagelist = {
              files: [],
              base64: [],
              caption: []
            };
            console.log(result);
            this.selectedImagelist = result;
            console.log(this.selectedImagelist.files);
            this.image_list_popup = [];
            if (this.selectedImagelist.files.length > 0) {
              for (let i = 0; i < this.selectedImagelist.files.length; i++) {
                const imgobj = new Image(i,
                  {
                    img: this.selectedImagelist.base64[i],
                    description: this.selectedImagelist.caption[i] || ''
                  }, this.selectedImagelist.files[i].name);
                this.image_list_popup.push(imgobj);
              }
              console.log(this.image_list_popup);

            }
          }
        });
      }
      this.advance_amount = this.catalog_details.advanceAmount;

      if (this.catalog_details.pickUp) {
        if (this.catalog_details.pickUp.orderPickUp && this.catalog_details.nextAvailablePickUpDetails) {
          this.store_pickup = true;
          this.storeChecked = true;
          this.getOrderAvailableDatesForPickup();
        }
      } if (this.catalog_details.homeDelivery) {
        if (this.catalog_details.homeDelivery.homeDelivery && this.catalog_details.nextAvailableDeliveryDetails) {
          console.log('inisde home');
          this.home_delivery = true;
          this.storeChecked = false;
          this.getOrderAvailableDatesForHome();

        }
      }

    });
    this.getStoreContact();

    this.showfuturediv = false;
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    this.today = new Date(this.today);
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    this.minDate = new Date(this.minDate);
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
    if (this.todaydate === this.sel_checkindate) {
      this.isFuturedate = false;
    } else {
      this.isFuturedate = true;
    }

    // this.catlogArry();


    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.mobileView = this.deviceService.isMobile() || this.deviceService.isTablet();
    this.desktopView = this.deviceService.isDesktop();


  }
  isPhysicalItemsPresent() {
    let physical_item_present = true;
    console.log(this.orders);
    const virtualItems = this.orders.filter(orderitem => orderitem.item.itemType === 'VIRTUAL')

    if (virtualItems.length > 0 && this.orders.length === virtualItems.length) {
      console.log('insidee');
      physical_item_present = false;
      this.onlyvirtualItemsPresent = true;
      this.isfutureAvailableTime = true;
      this.isEditable = false;

    }
    return physical_item_present;
  }
  indian_payment_mode_onchange(event) {
    this.selected_payment_mode = event.value;
    this.isInternatonal = false;
    this.convenientPaymentModes.map((res: any) => {
      this.convenientFeeObj = {}
      if (res.isInternational === false) {
        this.convenientFeeObj = res;
        if (this.selected_payment_mode === res.mode) {
          //  this.convenientFee = this.convenientFeeObj.convenienceFee;
          // this.gatewayFee = this.convenientFeeObj.consumerGatewayFee;
          this.gatewayFee = this.convenientFeeObj.totalGatewayFee;
          console.log("convenientFee for Indian:", this.convenientFee, res.mode, this.gatewayFee)
        }
      }
    })
  }

  editDate() {
    this.deliveryoptions = true;
    this.deliveryoptionsmobile = true;

  }

  showDeliveryOptions() {
    this.deliveryoptions = false;
    this.deliveryoptionsmobile = false;
  }

  non_indian_modes_onchange(event) {
    this.selected_payment_mode = event.value;
    this.isInternatonal = true;
    this.convenientPaymentModes.map((res: any) => {
      this.convenientFeeObj = {}
      if (res.isInternational === false) {
        this.convenientFeeObj = res;
        if (this.selected_payment_mode === res.mode) {
          //  this.convenientFee = this.convenientFeeObj.convenienceFee;
          // this.gatewayFee = this.convenientFeeObj.consumerGatewayFee;
          this.gatewayFee = this.convenientFeeObj.totalGatewayFee;
          console.log("convenientFee for Indian:", this.convenientFee, res.mode, this.gatewayFee)
        }
      }
    })
  }
  togglepaymentMode() {
    this.shownonIndianModes = !this.shownonIndianModes;
    this.selected_payment_mode = null;
  }
  getImageSrc(mode) {

    return 'assets/images/payment-modes/' + mode + '.png';
  }
  getPaymentModes() {
    this.shared_services.getPaymentModesofProvider(this.account_id, 0, 'prePayment')
      .subscribe(
        data => {

          this.paymentmodes = data[0];
          this.isPayment = true;
          let convienientPaymentObj = {}
          convienientPaymentObj = {
            "profileId": this.paymentmodes.profileId,
            "amount": this.totalamountPay
          }
          this.shared_services.getConvenientFeeOfProvider(this.account_id, convienientPaymentObj).subscribe((data: any) => {
            // let array = []
            console.log("Convenient response :", data)
            this.convenientPaymentModes = data;
            if (this.convenientPaymentModes) {
              this.convenientPaymentModes.map((res: any) => {
                this.convenientFeeObj = {}
                if (res) {
                  this.convenientFeeObj = res;
                  this.convenientFee = this.convenientFeeObj.convenienceFee;
                  console.log("payment convenientFee for Indian:", this.convenientFee, res.mode, this.gatewayFee)

                }
              })
            }


          })
          console.log("isConvenienceFee paymentsss:", this.paymentmodes)
          if (this.paymentmodes && this.paymentmodes.indiaPay) {
            this.indian_payment_modes = this.paymentmodes.indiaBankInfo;
          }
          if (this.paymentmodes && this.paymentmodes.internationalPay) {
            this.non_indian_modes = this.paymentmodes.internationalBankInfo;

          }
          if (this.paymentmodes && !this.paymentmodes.indiaPay && this.paymentmodes.internationalPay) {
            this.shownonIndianModes = true;
          } else {
            this.shownonIndianModes = false;
          }

        }
      );
  }
  ngAfterViewInit() {
    const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      this.getProfile();
      const credentials = this.sharedFunctionobj.getJson(this.lStorageService.getitemfromLocalStorage('ynw-credentials'));
      this.customer_countrycode = credentials.countryCode;
      this.phonenumber = activeUser.primaryPhoneNumber;
      // this.storeContact.get('phone').value(this.phonenumber);
      // this.storeContact.controls.phone.setValue(this.phonenumber);
      if (this.customer_countrycode == "+91") {
        this.storeContact.controls.phone.setValue(this.phonenumber);
      }
      this.customer_phoneNumber = activeUser.primaryPhoneNumber;
      console.log(this.customer_phoneNumber);
      this.getaddress();
      //this.nextbtn.nativeElement.click();
    } else {
      this.doLogin('consumer');
    }
  }
  getlisttDetails() {
    let delivery = false;
    if (this.delivery_type === 'home') {
      delivery = true;
    } else {
      delivery = false;
    }
    const passdata = {
      'catalog': {
        'id': this.catalog_Id
      },
      'homeDelivery': delivery,
      'coupons': this.selected_coupons,
      'orderDate': this.sel_checkindate
    };
    this.shared_services.getCartdetails(this.account_id, passdata)
      .subscribe(
        data => {
          console.log('cartData' + data);
          this.cartDetails = data;
          console.log("this.cartDetails", this.cartDetails)
          if (this.cartDetails.eligibleJcashAmt) {
            this.checkJcash = true
            this.jcashamount = this.cartDetails.eligibleJcashAmt.jCashAmt;
            this.jcreditamount = this.cartDetails.eligibleJcashAmt.creditAmt;
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getCartDetails() {
    console.log('details');
    let delivery = false;
    if (this.delivery_type === 'home') {
      delivery = true;
    } else {
      delivery = false;
    }
    const passdata = {
      'catalog': {
        'id': this.catalog_Id
      },
      'orderItem': this.getOrderItems(),
      'homeDelivery': delivery,
      'coupons': this.selected_coupons,
      'orderDate': this.sel_checkindate
    };
    this.shared_services.getCartdetails(this.account_id, passdata)
      .subscribe(
        data => {
          console.log(data);
          this.cartDetails = data;
          console.log("this.cartDetails", this.cartDetails)
          this.couponlist = [];
          this.pcouponlist = [];
          if (this.cartDetails.jCouponList) {
            for (const [key, value] of Object.entries(this.cartDetails.jCouponList)) {
              if (value['value'] !== '0.0') {
                this.couponlist.push(key);
                console.log(this.couponlist);
              }
            }
          }
          if (this.cartDetails.proCouponList) {
            for (const [key, value] of Object.entries(this.cartDetails.proCouponList)) {
              if (value['value'] !== '0.0') {
                this.pcouponlist.push(key);
                console.log(this.pcouponlist);
              }
            }
          }
          if (this.cartDetails.eligibleJcashAmt) {
            this.checkJcash = true
            this.jcashamount = this.cartDetails.eligibleJcashAmt.jCashAmt;
            this.jcreditamount = this.cartDetails.eligibleJcashAmt.creditAmt;
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getAmountToPay(paymentDetails) {
    this.totalamountPay = paymentDetails.advanceAmount;
    return this.totalamountPay;
  }
  OnChangeJcash(event) {
    console.log(event.checked);

  }
  gets3curl() {
    console.log('getS3url');
    this.api_loading1 = true;
    let accountS3List = 'coupon,providerCoupon';
    this.subs.sink = this.s3Processor.getJsonsbyTypes(this.provider_id,
      null, accountS3List).subscribe(
        (accountS3s) => {
          console.log(accountS3s);
          if (accountS3s['coupon']) {
            this.processS3s('coupon', accountS3s['coupon']);
          }
          if (accountS3s['providerCoupon']) {
            this.processS3s('providerCoupon', accountS3s['providerCoupon']);
          }
          this.api_loading1 = false;
        }
      );
  }
  processS3s(type, res) {
    console.log('inisde');
    let result = this.s3Processor.getJson(res);
    console.log(JSON.stringify(result));
    switch (type) {
      case 'coupon': {
        this.s3CouponsList.JC = result;
        console.log(this.s3CouponsList.JC);
        if (this.s3CouponsList.JC.length > 0) {
          this.showCouponWB = true;
        }
        break;
      }
      case 'providerCoupon': {
        this.s3CouponsList.OWN = result;
        console.log(this.s3CouponsList.OWN);
        if (this.s3CouponsList.OWN.length > 0) {
          this.showCouponWB = true;
        }
        break;
      }
    }
  }
  ngOnDestroy() {
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    this.subs.unsubscribe();
  }

  applyPromocode() {
    this.action = 'coupons';
  }
  toggleterms(i) {
    if (this.couponsList[i].showme) {
      this.couponsList[i].showme = false;
    } else {
      this.couponsList[i].showme = true;
    }
  }

  decrement(item) {
    this.removeFromCart(item);
  }

  removeFromCart(itemObj) {
    const item = itemObj.item;
    for (const i in this.orderList) {
      if (this.orderList[i].item.itemId === item.itemId) {
        this.orderList.splice(i, 1);
        // this.lStorageService.setitemonLocalStorage('order', this.orderList);
        break;
      }
    }

    this.getTotalItemAndPrice();
    this.getItemQty(itemObj);
  }


  increment(item) {
    this.addToCart(item);
  }

  // addToCart(Item) {
  //   this.orderList.push(Item);
  //   this.getTotalItemAndPrice();
  //   this.getItemQty(Item);
  // }



  addToCart(itemObj) {
    const spId = this.lStorageService.getitemfromLocalStorage('order_spId');
    console.log("spId", typeof (spId), typeof (this.account_id));
    if (spId === null) {
      this.orderList = [];
      this.lStorageService.setitemonLocalStorage('order_spId', this.account_id);
      this.orderList.push(itemObj);
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.getTotalItemAndPrice();
      this.getItemQty(itemObj);
    } else {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (spId != this.account_id) {
          if (this.getConfirmation()) {
            this.lStorageService.removeitemfromLocalStorage('order');
          }
        } else {
          this.orderList.push(itemObj);
          this.lStorageService.setitemonLocalStorage('order', this.orderList);
          this.getTotalItemAndPrice();
          console.log("Testing order catalog", this.lStorageService.getitemfromLocalStorage('order'))
          this.getItemQty(itemObj);
        }
      } else {
        this.orderList.push(itemObj);
        this.lStorageService.setitemonLocalStorage('order', this.orderList);
        this.getTotalItemAndPrice();
        this.getItemQty(itemObj);
      }
    }

  }

  getConfirmation() {
    let can_remove = false;
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': '  All added items in your cart for different Provider will be removed ! '
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        can_remove = true;
        this.orderList = [];
        this.lStorageService.removeitemfromLocalStorage('order_sp');
        this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
        this.lStorageService.removeitemfromLocalStorage('order_spId');
        this.lStorageService.removeitemfromLocalStorage('order');
        return true;
      } else {
        can_remove = false;

      }
    });
    return can_remove;
  }

  getTotalItemAndPrice() {
    this.price = 0;
    this.order_count = 0;
    for (const itemObj of this.orderList) {
      let item_price = itemObj.item.price;
      if (itemObj.item.showPromotionalPrice) {
        item_price = itemObj.item.promotionalPrice;
      }
      this.price = this.price + item_price;
      this.order_count = this.order_count + 1;
    }

    console.log("Price : ", this.price, this.orderList)
    return this.price;
  }


  addNotes(item, index) {
    this.addItemNotesdialogRef = this.dialog.open(AddItemNotesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: item

    });
    this.addItemNotesdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderList.map((Item, i) => {
          if (Item.itemId === item.itemId) {
            Item['consumerNote'] = result;
          }
        });
        this.orders.map((Item, i) => {
          if (Item.itemId === item.itemId) {
            Item['consumerNote'] = result;
          }
        });
      }
    });
  }
  deleteNotes(item, index) {
    console.log(this.orderList);
    this.canceldialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to Delete this Note?',
      }
    });
    this.canceldialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(this.orderList);
        this.orderList.map((Item, i) => {
          if (Item.item.itemId === item.item.itemId) {
            console.log(Item.consumerNote);
            Item['consumerNote'] = Item.consumerNote.splice;
          }
        });
      }
    });
  }


  applyCoupons(jCoupon) {
    this.api_cp_error = null;
    this.couponvalid = true;
    const couponInfo = {
      'couponCode': '',
      'instructions': ''
    };
    if (jCoupon) {
      const jaldeeCoupn = jCoupon.trim();
      if (this.checkCouponExists(jaldeeCoupn)) {
        this.api_cp_error = 'Coupon already applied';
        this.couponvalid = false;
        return false;
      }
      this.couponvalid = false;
      let found = false;
      for (let couponIndex = 0; couponIndex < this.s3CouponsList.JC.length; couponIndex++) {
        if (this.s3CouponsList.JC[couponIndex].jaldeeCouponCode.trim() === jaldeeCoupn) {
          this.selected_coupons.push(this.s3CouponsList.JC[couponIndex].jaldeeCouponCode);
          couponInfo.couponCode = this.s3CouponsList.JC[couponIndex].jaldeeCouponCode;
          couponInfo.instructions = this.s3CouponsList.JC[couponIndex].consumerTermsAndconditions;
          this.couponsList.push(couponInfo);
          found = true;
          this.selected_coupon = '';
          break;
        }
      }
      for (let couponIndex = 0; couponIndex < this.s3CouponsList.OWN.length; couponIndex++) {
        if (this.s3CouponsList.OWN[couponIndex].couponCode.trim() === jaldeeCoupn) {
          this.selected_coupons.push(this.s3CouponsList.OWN[couponIndex].couponCode);
          couponInfo.couponCode = this.s3CouponsList.OWN[couponIndex].couponCode;
          if (this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions) {
            couponInfo.instructions = this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions;
          }
          this.couponsList.push(couponInfo);
          found = true;
          this.selected_coupon = '';
          break;
        }
      }
      if (found) {
        this.couponvalid = true;
        this.snackbarService.openSnackBar('Promocode accepted', { 'panelclass': 'snackbarerror' });
        this.action = '';
        if (this.orderType !== 'SHOPPINGLIST') {
          this.getCartDetails();
        }
      } else {
        this.api_cp_error = 'Coupon invalid';
      }
    } else {
      this.api_cp_error = 'Enter a Coupon';
    }
  }

  removeJCoupon(i) {
    this.selected_coupons.splice(i, 1);
    this.couponsList.splice(i, 1);
    if (this.orderType !== 'SHOPPINGLIST') {
      this.getCartDetails();
    }
  }
  removeCoupons() {
    this.selected_coupons = [];
    this.couponsList = [];
    this.coupon_status = null;
  }
  checkCouponExists(couponCode) {
    let found = false;
    for (let index = 0; index < this.selected_coupons.length; index++) {
      if (couponCode === this.selected_coupons[index]) {
        found = true;
        break;
      }
    }
    return found;
  }
  clearCouponErrors() {
    this.couponvalid = true;
    this.api_cp_error = null;
  }
  getProfile() {
    this.sharedFunctionobj.getProfile()
      .then(
        (data: any) => {
          this.userEmail = data.userProfile.email;
          this.storeContact.get('email').setValue(this.userEmail);
        },

      );
  }
  getCatalogDetails(accountId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getConsumerCatalogs(accountId)
        .subscribe(
          (data: any) => {
            resolve(data[0]);
          },
          () => {
            reject();
          }
        );
    });


  }

  isLoggedIn() {
    const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      const credentials = this.sharedFunctionobj.getJson(this.lStorageService.getitemfromLocalStorage('ynw-credentials'));
      const customer_phonenumber = credentials.countryCode + activeUser.primaryPhoneNumber;
      this.loginForm.get('phone').setValue(customer_phonenumber);
      // this.getaddress();
    }
    return true;
  }
  getDeliveryCharges() {
    let deliveryCharge = 0;
    if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
      deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
    }
    return deliveryCharge.toFixed(2);
  }

  getItemQty(item) {
    const qty = this.orderList.filter(i => i.item.itemId === item.item.itemId).length;
    return qty;
  }

  getaddress() {
    this.shared_services.getConsumeraddress()
      .subscribe(
        data => {
          if (data !== null) {
            this.added_address = data;
            if (this.added_address.length > 0 && this.added_address !== null) {
              this.highlight(0, this.added_address[0]);
            }

          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  addAddress() {
    this.addressDialogRef = this.dialog.open(AddAddressComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'Add',
        address: this.added_address,
        source: 'consumer',

      }
    });
    this.addressDialogRef.afterClosed().subscribe(result => {
      this.getaddress();
    });
  }
  updateAddress(address, index) {
    this.addressDialogRef = this.dialog.open(AddAddressComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'edit',
        address: this.added_address,
        update_address: address,
        edit_index: index,
        source: 'consumer',

      }
    });
    this.addressDialogRef.afterClosed().subscribe(result => {
      this.getaddress();
    });
  }
  deleteAddress(address, index) {
    this.canceldialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to Delete this address?',
      }
    });
    this.canceldialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.added_address.splice(index, 1);
        this.shared_services.updateConsumeraddress(this.added_address)
          .subscribe(
            data => {
              if (data) {
                this.getaddress();
              }
              this.snackbarService.openSnackBar('Address deleted successfully');
            },
            error => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
      }
    });
  }
  goBack() {
    if (this.action === 'timeChange' || this.action === 'coupons') {
      this.action = '';
    }
    else if (this.source == 'paper' && this.bookStep == 'Step 3') {
      this.bookStep = 'qnr';
    }
    else {
      const chosenDateTime = {
        delivery_type: this.choose_type,
        catlog_id: this.catalog_details.id,
        nextAvailableTime: this.nextAvailableTime,
        order_date: this.sel_checkindate,
        account_id: this.account_id,
        selected_coupons: this.selected_coupons,
        couponsList: this.couponsList

      };
      this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
      this.location.back();
    }
  }

  goBackToHome() {
    // const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
    const source = this.lStorageService.getitemfromLocalStorage('source');
    console.log(source);
    if (source) {
      window.location.href = source;
      this.lStorageService.removeitemfromLocalStorage('reqFrom');
      this.lStorageService.removeitemfromLocalStorage('source');
    } else {
      const chosenDateTime = {
        delivery_type: this.choose_type,
        catlog_id: this.catalog_details.id,
        nextAvailableTime: this.nextAvailableTime,
        order_date: this.sel_checkindate,
        account_id: this.account_id,
        selected_coupons: this.selected_coupons,
        couponsList: this.couponsList

      };
      this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
      this.location.back();
    }
  }

  confirm(paytype?) {
    let post_Data: any;
    let timeslot: any;
    this.isClickedOnce = true;
    this.checkoutDisabled = true;
    post_Data = {
      'catalog': {
        'id': this.catalog_details.id
      },
      'orderFor': {
        'id': 0
      },

      'orderNote': this.orderlistNote,
      'coupons': this.selected_coupons,
      'countryCode': '+91',
    }
    if (this.orderType !== 'SHOPPINGLIST') {
      post_Data['orderItem'] = this.getOrderItems();
    }
    if (this.jcashamount > 0 && this.checkJcash) {
      post_Data['useCredit'] = this.checkJcredit
      post_Data['useJcash'] = this.checkJcash
    }
    if (!this.onlyvirtualItemsPresent) {
      timeslot = this.nextAvailableTime.split(' - ');
      let timeSlot = {
        'sTime': timeslot[0],
        'eTime': timeslot[1]

      }
      post_Data['timeSlot'] = timeSlot;
      post_Data['orderDate'] = this.sel_checkindate;

      if (this.delivery_type === 'home') {
        if ((this.added_address === null || this.added_address.length === 0)) {
          if (this.source !== "paper") {
            this.checkoutDisabled = false;
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar('Please add delivery address', { 'panelClass': 'snackbarerror' });
            return;
          }

        } else {
          const delivery_address = {
            'firstName': this.selectedAddress.firstName,
            'lastName': this.selectedAddress.lastName,
            'phoneNumber': this.selectedAddress.phoneNumber,
            'countryCode': '+91',
            'email': this.selectedAddress.email,
            'address': this.selectedAddress.address,
            'city': this.selectedAddress.city,
            'postalCode': this.selectedAddress.postalCode,
            'landMark': this.selectedAddress.landMark

          };
          if (this.emailId === '' || this.emailId === undefined || this.emailId == null) {
            this.emailId = this.customer_email;
          }
          post_Data['homeDelivery'] = true;
          post_Data['homeDeliveryAddress'] = delivery_address;
          post_Data['email'] = this.selectedAddress.email;

        }
      }
    }
    if ((this.delivery_type === 'store' || this.onlyvirtualItemsPresent) && this.source !== "paper") {

      if (!this.storeContact.value.phone || !this.storeContact.value.email) {
        this.checkoutDisabled = false;
        this.isClickedOnce = false;
        this.snackbarService.openSnackBar('Please provide Contact Details', { 'panelClass': 'snackbarerror' });
        return;
      } else {
        console.log("StoreContact:", this.storeContact);
        const contactNumber = this.storeContact.value.phone;
        const contact_email = this.storeContact.value.email;
        post_Data['phoneNumber'] = contactNumber,
          post_Data['email'] = contact_email

      }
      if (this.delivery_type === 'store' && !this.onlyvirtualItemsPresent) {
        post_Data['storePickup'] = true;
        console.log("storePickupstorePickupstorePickup")
      }
      this.confirmOrder(post_Data, paytype);
    } else if (this.source === "paper") {
      const contactNumber = this.storeContact.value.phone;
      const contact_email = this.storeContact.value.email;
      post_Data['phoneNumber'] = contactNumber;
      post_Data['email'] = contact_email;
      if (!contact_email) {
        const emaildialogRef = this.dialog.open(ConsumerEmailComponent, {
          width: '40%',
          panelClass: ['loginmainclass', 'popup-class'],
        });
        emaildialogRef.afterClosed().subscribe(result => {
          if (result !== '' && result !== undefined) {
            post_Data['email'] = result;
            // this.commObj['communicationEmail'] = result;
            // this.confirmAppointment(type);
            this.confirmOrder(post_Data, paytype);
          } else {
            this.isClickedOnce = false;
            // this.goBack('backy');
          }
        });
      } else {
        this.confirmOrder(post_Data, paytype);
      }
    } else {
      this.confirmOrder(post_Data, paytype);
    }
    console.log("StoreContact:", this.storeContact);

  }

  doLogin(origin?, passParam?) {

    const is_test_account = true;

    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        test_account: is_test_account,
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        if (this.isLoggedIn()) {
          // this.nextbtn.nativeElement.click();
        }

      } else if (result === 'showsignup') {

      }
    });
  }

  terms_check() {
    this.termscheck = !this.termscheck;
  }
  termsOpen() {
    if (this.termscheck = !this.termscheck) {
      this.defultMoreText = '...show less'
    }
    else {
      this.defultMoreText = '...show more'
    }


  }
  confirmOrder(post_Data, paytype?) {
    console.log("Orderr Data :", post_Data);
    const dataToSend: FormData = new FormData();
    if (this.orderType === 'SHOPPINGLIST') {
      const captions = {};
      let i = 0;
      if (this.selectedImagelist) {
        for (const pic of this.selectedImagelist.files) {
          dataToSend.append('attachments', pic, pic['name']);
          captions[i] = this.selectedImagelist.caption[i] || '';
          i++;
        }
      }
      const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
      dataToSend.append('captions', blobPropdata);
      const blobpost_Data = new Blob([JSON.stringify(post_Data)], { type: 'application/json' });
      dataToSend.append('order', blobpost_Data);
      this.shared_services.CreateConsumerOrder(this.account_id, dataToSend)
        .subscribe(data => {
          const retData = data;

          if (this.customId) {
            console.log("businessid" + this.account_id);
            this.shared_services.addProvidertoFavourite(this.account_id)
              .subscribe(() => {
              });
          }

          this.checkoutDisabled = false;
          // let prepayAmount;
          const uuidList = [];
          Object.keys(retData).forEach(key => {
            if (key === '_prepaymentAmount') {
              this.prepayAmount = retData['_prepaymentAmount'];
            } else {
              this.trackUuid = retData[key];
              uuidList.push(retData[key]);
            }
          });
          if (post_Data.email) {
            this.con_email = post_Data.email
          }
          if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
            this.submitQuestionnaire(this.trackUuid, paytype);
          } else {
            this.paymentOperation(this.con_email, paytype);
          }

        },
          error => {
            this.isClickedOnce = false;
            this.checkoutDisabled = false;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }

        );
    } else {
      const blobpost_Data = new Blob([JSON.stringify(post_Data)], { type: 'application/json' });
      dataToSend.append('order', blobpost_Data);
      this.shared_services.CreateConsumerOrder(this.account_id, dataToSend)
        .subscribe(data => {
          const retData = data;
          if (this.customId) {
            console.log("businessid" + this.account_id);
            this.shared_services.addProvidertoFavourite(this.account_id)
              .subscribe(() => {
              });
          }
          this.checkoutDisabled = false;
          const uuidList = [];
          Object.keys(retData).forEach(key => {
            if (key === '_prepaymentAmount') {
              this.prepayAmount = retData['_prepaymentAmount'];
            } else {
              this.trackUuid = retData[key];
              uuidList.push(retData[key]);
            }
          });
          if (post_Data.email) {
            this.con_email = post_Data.email
          }
          if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
            this.submitQuestionnaire(this.trackUuid, paytype);
          } else {
            console.log(post_Data)
            this.paymentOperation(this.con_email, paytype);
          }

        },
          error => {
            this.isClickedOnce = false;
            this.checkoutDisabled = false;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }

        );
    }
  }
  paymentOperation(post_Data?, paytype?) {
    if (this.catalog_details.paymentType !== 'NONE' && this.prepayAmount > 0) {
      console.log(post_Data.email + 'post_Data.email')
      this.shared_services.CreateConsumerEmail(this.trackUuid, this.account_id, this.con_email)
        .subscribe(res => {
          if (this.jcashamount > 0 && this.checkJcash) {
            this.shared_services.getRemainingPrepaymentAmount(this.checkJcash, this.checkJcredit, this.catalog_details.advanceAmount)
              .subscribe(data => {
                this.remainingadvanceamount = data;

                this.payuPayment(paytype);


              });
          }
          else {
            this.payuPayment(paytype);

          }

        });

    } else {
      this.orderList = [];
      this.lStorageService.removeitemfromLocalStorage('order_sp');
      this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
      this.lStorageService.removeitemfromLocalStorage('order_spId');
      this.lStorageService.removeitemfromLocalStorage('order');
      this.snackbarService.openSnackBar('Your Order placed successfully');
      if (this.from) {
        let queryParams = {
          'source': 'order'
        }
        if (this.customId) {
          queryParams['customId'] = this.customId;
          queryParams['accountId'] = this.account_id;
        }
        let navigationExtras: NavigationExtras = {
          queryParams: queryParams
        };
        console.log("Payment Data :", this.from);
        this.router.navigate(['consumer'], navigationExtras);
        // this.router.navigate([`${this.customId}`,'dashboard'], navigationExtras);

      } else {
        let queryParams = {
          'source': 'order'
        }
        if (this.customId) {
          queryParams['customId'] = this.customId;
          queryParams['accountId'] = this.account_id;
        }
        let navigationExtras: NavigationExtras = {
          queryParams: queryParams
        };
        this.router.navigate(['consumer'], navigationExtras);
        // this.router.navigate([`${this.customId}`,'dashboard'], navigationExtras);

      }
    }
  }
  goBackToCheckout(selectesTimeslot, queue) {
    this.action = '';
    const selectqueue = queue['sTime'] + ' - ' + queue['eTime'];
    this.nextAvailableTime = selectqueue;
    const chosenDateTime = {
      delivery_type: this.choose_type,
      catlog_id: this.catalog_details.id,
      nextAvailableTime: this.nextAvailableTime,
      order_date: this.sel_checkindate,
      advance_amount: this.catalog_details.advance_amount,
      account_id: this.account_id

    };
    this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
    if (this.couponsList.length > 0 && this.orderType !== 'SHOPPINGLIST') {
      this.getCartDetails();
    }
  }
  changeTime() {
    this.action = 'timeChange';
    this.getAvailabilityByDate(this.sel_checkindate);
  }
  getOrderItems() {

    this.orderSummary = [];
    this.orders.forEach(item => {
      let consumerNote = '';
      const itemId = item.item.itemId;
      const qty = this.getItemQty(item);
      if (item.consumerNote) {
        consumerNote = item.consumerNote;
      }
      this.orderSummary.push({ 'id': itemId, 'quantity': qty, 'consumerNote': consumerNote, 'itemType': item.item.itemType, 'name': item.item.displayName });
    });
    return this.orderSummary;
  }
  highlight(index, address) {
    this.selectedRowIndex = index;
    this.customer_phoneNumber = address.phoneNumber;
    this.customer_email = address.email;
    this.selectedAddress = address;
  }
  // handleFuturetoggle() {
  //   this.showfuturediv = !this.showfuturediv;
  // }
  changeType(event) {

    this.choose_type = event.value;
    if (this.choose_type === 'store') {
      this.storeChecked = true;
      this.delivery_type = 'store';
      this.store_pickup = true;
      this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
      this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
      this.getAvailabilityByDate(this.sel_checkindate);
    } else {
      this.storeChecked = false;
      this.delivery_type = 'home';
      this.home_delivery = true;
      this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
      this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
      this.getAvailabilityByDate(this.sel_checkindate);
    }
    if (this.orderType !== 'SHOPPINGLIST') {
      this.getCartDetails();
    }
    if (this.todaydate === this.sel_checkindate) {
      this.isFuturedate = false;
    } else {
      this.isFuturedate = true;
    }
  }
  getOrderAvailableDatesForPickup() {
    const _this = this;
    _this.shared_services.getAvailableDatesForPickup(this.catalog_Id, this.account_id)
      .subscribe((data: any) => {
        this.store_availables = data.filter(obj => obj.isAvailable);
        this.getAvailabilityByDate(this.sel_checkindate);
        const availDates = this.store_availables.map(function (a) { return a.date; });
        _this.storeAvailableDates = availDates.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
      });
  }
  getOrderAvailableDatesForHome() {
    const _this = this;
    _this.shared_services.getAvailableDatesForHome(this.catalog_Id, this.account_id)
      .subscribe((data: any) => {
        this.home_availables = data.filter(obj => obj.isAvailable);
        this.getAvailabilityByDate(this.sel_checkindate);
        const availDates = this.home_availables.map(function (a) { return a.date; });
        _this.homeAvailableDates = availDates.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
      });

  }

  dateClass(date: Date): MatCalendarCellCssClasses {
    if (this.choose_type === 'store') {
      return (this.storeAvailableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    } else {
      return (this.homeAvailableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    }
  }
  calculateDate(days) {
    // this.resetApi();
    const dte = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
    const newdate = new Date(date);
    newdate.setDate(newdate.getDate() + days);
    const dd = newdate.getDate();
    const mm = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const ndate1 = y + '-' + mm + '-' + dd;
    const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
    // const strtDt1 = this.hold_sel_checkindate + ' 00:00:00';
    const strtDt1 = this.todaydate + ' 00:00:00';
    const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();

    const nDt = new Date(ndate);
    if (nDt.getTime() >= strtDt.getTime()) {
      this.sel_checkindate = ndate;
      this.getAvailabilityByDate(this.sel_checkindate);
      // this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    }
    const dt = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const dt1 = moment(dt, 'YYYY-MM-DD HH:mm').format();
    const date1 = new Date(dt1);
    const dt0 = this.todaydate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    const date2 = new Date(dt2);
    // if (this.sel_checkindate !== this.todaydate) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
    if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      this.isFuturedate = true;
    } else {
      this.isFuturedate = false;
    }
    const day1 = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const day = moment(day1, 'YYYY-MM-DD HH:mm').format();
    const ddd = new Date(day);
    this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
  }
  disableMinus() {
    const seldate1 = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
    const seldate = new Date(seldate2);
    const selecttdate = new Date(seldate.getFullYear() + '-' + this.dateTimeProcessor.addZero(seldate.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(seldate.getDate()));
    const strtDt1 = this.hold_sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
    const strtDt = new Date(strtDt2);
    const startdate = new Date(strtDt.getFullYear() + '-' + this.dateTimeProcessor.addZero(strtDt.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(strtDt.getDate()));
    if (startdate >= selecttdate) {
      return true;
    } else {
      return false;
    }
  }
  handleFutureDateChange(e) {
    const tdate = e.targetElement.value;
    const newdate = tdate.split('/').reverse().join('-');
    const futrDte = new Date(newdate);
    const obtmonth = (futrDte.getMonth() + 1);
    let cmonth = '' + obtmonth;
    if (obtmonth < 10) {
      cmonth = '0' + obtmonth;
    }
    const seldate = futrDte.getFullYear() + '-' + cmonth + '-' + futrDte.getDate();
    this.sel_checkindate = seldate;
    const dt0 = this.todaydate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    const date2 = new Date(dt2);
    const dte0 = this.sel_checkindate.toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION });
    const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
    const datee2 = new Date(dte2);
    const last_date = moment().add(30, 'days');
    console.log('30 day date..' + last_date);
    const thirty_date = moment(last_date, 'YYYY-MM-DD HH:mm').format();
    if (dte2 > thirty_date) {
      console.log('greater than 30');
    } else {
      console.log('less than 30');
    }

    if (datee2.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      this.isFuturedate = true;
    } else {
      this.isFuturedate = false;
    }
    this.handleFuturetoggle();
    this.getAvailabilityByDate(this.sel_checkindate);
  }

  handleFuturetoggle() {
    this.showfuturediv = !this.showfuturediv;
  }
  getAvailabilityByDate(date) {
    this.sel_checkindate = date;
    const cday = new Date(this.sel_checkindate);
    const currentday = (cday.getDay() + 1);
    if (this.choose_type === 'store') {
      const storeIntervals = (this.catalog_details.pickUp.pickUpSchedule.repeatIntervals).map(Number);
      const last_date = moment().add(30, 'days');
      const thirty_date = moment(last_date, 'YYYY-MM-DD HH:mm').format();
      if ((storeIntervals.includes(currentday)) && (date > thirty_date)) {
        this.isfutureAvailableTime = true;
        this.nextAvailableTimeQueue = this.catalog_details.pickUp.pickUpSchedule.timeSlots;
        this.queue = this.catalog_details.pickUp.pickUpSchedule.timeSlots[0];
        this.futureAvailableTime = this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['eTime'];
        console.log('greater than 30');
      }
      else if ((storeIntervals.includes(currentday)) && (date < thirty_date)) {
        console.log('less than 30');
        console.log(this.store_availables);
        const sel_check_date = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        if (this.store_availables) {
          const availability = this.store_availables.filter(obj => obj.date === sel_check_date);
          if (availability.length > 0) {
            this.isfutureAvailableTime = true;
            this.nextAvailableTimeQueue = availability[0].timeSlots;
            this.queue = availability[0].timeSlots[0];
            this.futureAvailableTime = availability[0].timeSlots[0]['sTime'] + ' - ' + availability[0].timeSlots[0]['eTime'];
          } else {
            this.isfutureAvailableTime = false;
          }
        }
      }
      else {
        this.isfutureAvailableTime = false;
      }
    }
    else {
      const homeIntervals = (this.catalog_details.homeDelivery.deliverySchedule.repeatIntervals).map(Number);
      const last_date = moment().add(30, 'days');
      const thirty_date = moment(last_date, 'YYYY-MM-DD HH:mm').format();
      if (homeIntervals.includes(currentday) && (date > thirty_date)) {
        this.isfutureAvailableTime = true;
        this.nextAvailableTimeQueue = this.catalog_details.homeDelivery.deliverySchedule.timeSlots;
        this.queue = this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0];
        this.futureAvailableTime = this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['eTime'];
        console.log('greater than 30');
      } else if (homeIntervals.includes(currentday) && (date < thirty_date)) {
        console.log(this.home_availables);
        const sel_check_date = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const availability = this.home_availables.filter(obj => obj.date === sel_check_date);
        if (availability.length > 0) {
          this.isfutureAvailableTime = true;
          this.nextAvailableTimeQueue = availability[0].timeSlots;
          this.queue = availability[0].timeSlots[0];
          this.futureAvailableTime = availability[0].timeSlots[0]['sTime'] + ' - ' + availability[0].timeSlots[0]['eTime'];
        } else {
          this.isfutureAvailableTime = false;
        }
      }
      else {
        this.isfutureAvailableTime = false;
      }
    }
  }
  getStoreContact() {
    this.shared_services.getStoreContact(this.account_id)
      .subscribe((data: any) => {
        this.storeContactNw = data;
      });
  }
  sidebar() {
    this.showSide = !this.showSide;
  }
  closeNav() {
    this.showSide = false;
  }
  deleteTempImage(img, index) {
    this.image_list_popup = this.image_list_popup.filter((val: Image) => val.id !== img.id);
    this.selectedImagelist.files.splice(index, 1);
    this.selectedImagelist.base64.splice(index, 1);
    this.selectedImagelist.caption.splice(index, 1);
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }

  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }

  onButtonBeforeHook(event) {
    if (!event || !event.button) {
      return;
    }
    if (event.button.type === ButtonType.DELETE) {
      const idex = this.selectedImagelist.files.findIndex(i => i.id === event.image.id);
      this.image_list_popup = this.image_list_popup.filter((val: Image) => val.id !== event.image.id);
      this.selectedImagelist.files.splice(idex, 1);
      this.selectedImagelist.base64.splice(idex, 1);
      this.selectedImagelist.caption.splice(idex, 1);
    }

  }
  deletemodelboxImage(name) {
    const idex = this.selectedImagelist.files.findIndex(i => i.name === name);
    this.selectedImagelist.files.splice(idex, 1);
    this.selectedImagelist.base64.splice(idex, 1);
    this.selectedImagelist.caption.splice(idex, 1);
    this.image_list_popup.splice(idex, 1);
  }
  onButtonAfterHook() { }

  imageSelect(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstantsLocal.IMAGE_FORMATS.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstantsLocal.IMAGE_MAX_SIZE) {
          this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
        } else {
          this.selectedImagelist.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedImagelist.base64.push(e.target['result']);
            this.image_list_popup = [];
            for (let i = 0; i < this.selectedImagelist.files.length; i++) {
              const imgobj = new Image(i,
                {
                  img: this.selectedImagelist.base64[i],
                  description: ''
                }, this.selectedImagelist.files[i].name);
              this.image_list_popup.push(imgobj);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  editshoppinglist() {
    this.imagelist = {
      files: [],
      base64: [],
      caption: []
    };
    this.imagelist = this.selectedImagelist;
    this.shoppinglistdialogRef = this.dialog.open(ShoppinglistuploadComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        file: this.imagelist.files.slice(),
        base: this.imagelist.base64.slice(),
        caption: this.imagelist.caption.slice(),
        type: 'edit'
      }
    });
    this.shoppinglistdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedImagelist = {
          files: [],
          base64: [],
          caption: []
        };
        this.selectedImagelist = result;
        this.image_list_popup = [];
        if (this.selectedImagelist.files.length > 0) {
          for (let i = 0; i < this.selectedImagelist.files.length; i++) {
            const imgobj = new Image(i,
              {
                img: this.selectedImagelist.base64[i],
                description: this.selectedImagelist.caption[i] || ''
              });
            this.image_list_popup.push(imgobj);
          }

        }
      }
    });
  }
  uploadShoppingList() {
    this.imagelist = {
      files: [],
      base64: [],
      caption: []
    };
    this.shoppinglistdialogRef = this.dialog.open(ShoppinglistuploadComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        source: this.imagelist,
        type: 'add'
      }
    });
    this.shoppinglistdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedImagelist = {
          files: [],
          base64: [],
          caption: []
        };
        this.selectedImagelist = result;
        this.image_list_popup = [];
        if (this.selectedImagelist.files.length > 0) {
          for (let i = 0; i < this.selectedImagelist.files.length; i++) {
            const imgobj = new Image(i,
              {
                img: this.selectedImagelist.base64[i],
                description: this.selectedImagelist.caption[i] || ''
              }, this.selectedImagelist.files[i].name);
            this.image_list_popup.push(imgobj);
          }
          console.log(this.image_list_popup);

        }
      }
    });
  }
  handleQueueSelection(queue, index) {
    this.queue = queue;
    console.log("Queue Selected : ", queue, index);
  }

  // openPayment() {
  //   this.currentStep = 3;
  //   return true;
  // }

  showJCCouponNote(coupon) {
    if (coupon.value.systemNote.length === 1 && coupon.value.systemNote.includes('COUPON_APPLIED')) {
    } else {
      if (coupon.value.value === '0.0') {
        this.dialog.open(JcCouponNoteComponent, {
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
  payuPayment(paymenttype?) {
    let paymentWay;
    // if (paymenttype == 'paytm') {
    //   paymentWay = 'PPI';
    // } else {
    //   paymentWay = 'DC';
    // }
    this.makeFailedPayment(paymentWay);
  }
  makeFailedPayment(paymentMode) {
    if (!this.selected_payment_mode) {
      this.snackbarService.openSnackBar('Please select one payment mode', { 'panelClass': 'snackbarerror' });
      this.isClickedOnce = false;
      return false;
    }
    // console.log(this.orderType);
    // console.log(this.remainingadvanceamount);
    // if(this.orderType === 'SHOPPINGLIST'){
    //   if(this.remainingadvanceamount > 0 && this.checkJcash ){
    //     this.amounttopay = this.remainingadvanceamount;
    //  } else {
    //     this.amounttopay = this.catalog_details.advanceAmount;
    //  }
    // }
    // else{
    //   if(this.remainingadvanceamount > 0 && this.checkJcash ){
    //     this.amounttopay = this.remainingadvanceamount
    //  } else {
    //     this.amounttopay = this.cartDetails.advanceAmount;
    //  }
    // }
    this.orderDetails = {
      // 'amount': this.amounttopay,
      'amount': this.prepayAmount,
      'paymentMode': this.selected_payment_mode,
      'uuid': this.trackUuid,
      'accountId': this.account_id,
      'purpose': 'prePayment',
      'serviceId': 0,
      'isInternational': this.isInternatonal

    };
    this.convenientPaymentModes.map((res: any) => {
      this.convenientFeeObj = res
      if (this.convenientFeeObj && this.convenientFeeObj.isInternational && this.isInternatonal) {
        // this.convenientFeeObj = res;
        if (paymentMode === this.convenientFeeObj.mode) {
          this.orderDetails['convenientFee'] = this.convenientFeeObj.consumerGatewayFee;
          this.orderDetails['convenientFeeTax'] = this.convenientFeeObj.consumerGatewayFeeTax;
          this.orderDetails['jaldeeConvenienceFee'] = this.convenientFeeObj.convenienceFee;
          this.orderDetails['profileId'] = this.paymentmodes.profileId;
          this.orderDetails['paymentSettingsId'] = this.convenientFeeObj.paymentSettingsId
          this.orderDetails['paymentGateway'] = this.convenientFeeObj.gateway
          console.log("Non-Indian Payment Info", this.orderDetails)
        }
      }
      if (this.convenientFeeObj && !this.convenientFeeObj.isInternational && !this.isInternatonal) {
        // this.convenientFeeObj = res;
        if (paymentMode === this.convenientFeeObj.mode) {
          this.orderDetails['convenientFee'] = this.convenientFeeObj.consumerGatewayFee;
          this.orderDetails['convenientFeeTax'] = this.convenientFeeObj.consumerGatewayFeeTax;
          this.orderDetails['jaldeeConvenienceFee'] = this.convenientFeeObj.convenienceFee;
          this.orderDetails['profileId'] = this.paymentmodes.profileId;
          this.orderDetails['paymentSettingsId'] = this.convenientFeeObj.paymentSettingsId
          this.orderDetails['paymentGateway'] = this.convenientFeeObj.gateway
          console.log("Indian Payment Info", this.orderDetails)
        }
      }
    })
    this.lStorageService.setitemonLocalStorage('uuid', this.trackUuid);
    this.lStorageService.setitemonLocalStorage('acid', this.account_id);
    this.lStorageService.setitemonLocalStorage('p_src', 'c_c');
    console.log("orderDetails", this.orderDetails);
    if (this.remainingadvanceamount == 0 && this.checkJcash) {
      const postData = {
        'amountToPay': this.prepayAmount,
        'accountId': this.account_id,
        'uuid': this.trackUuid,
        'paymentPurpose': 'prePayment',
        'isJcashUsed': true,
        'isreditUsed': false,
        'paymentMode': 'JCASH',
        'serviceId': 0,
        'isinternational': this.isInternatonal,

      };
      this.shared_services.PayByJaldeewallet(postData)
        .subscribe(data => {
          this.wallet = data;
          if (!this.wallet.isGateWayPaymentNeeded && this.wallet.isJCashPaymentSucess) {

            this.orderList = [];
            this.lStorageService.removeitemfromLocalStorage('order_sp');
            this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
            this.lStorageService.removeitemfromLocalStorage('order_spId');
            this.lStorageService.removeitemfromLocalStorage('order');
            this.snackbarService.openSnackBar('Your Order placed successfully');
            let queryParams = {
              'source': 'order'
            }
            if (this.customId) {
              queryParams['customId'] = this.customId;
              queryParams['accountId'] = this.account_id;
            }
            let navigationExtras: NavigationExtras = {
              queryParams: queryParams
            };
            this.router.navigate(['consumer'], navigationExtras);
            // this.router.navigate([`${this.customId}`,'dashboard'], navigationExtras);
            // this.router.navigate(['consumer'], { queryParams: { 'source': 'order' } });
          }
        },
          error => {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          });
    }

    else if (this.remainingadvanceamount > 0 && this.checkJcash) {
      const postData = {
        'amountToPay': this.prepayAmount,
        'accountId': this.account_id,
        'uuid': this.trackUuid,
        'paymentPurpose': 'prePayment',
        'isJcashUsed': true,
        'isreditUsed': false,
        'serviceId': 0,
        'isinternational': this.isInternatonal,
        'paymentMode': this.selected_payment_mode
      };
      // if (paymentMode == 'PPI') {
      //   postData.isPayTmPayment = true;
      //   postData.isRazorPayPayment = false;
      //   postData.paymentMode = "PPI";
      // } else {
      //   postData.isPayTmPayment = false;
      //   postData.isRazorPayPayment = true;
      //   postData.paymentMode = "DC";
      // }

      this.shared_services.PayByJaldeewallet(postData)
        .subscribe((pData: any) => {
          if (pData.isGateWayPaymentNeeded == true && pData.isJCashPaymentSucess == true) {
            if (pData.response.paymentGateway == 'PAYTM') {
              this.payWithPayTM(pData.response, this.account_id);
            } else {
              this.paywithRazorpay(pData.response);
            }
          }
        },
          error => {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          });

    }
    else {

      this.shared_services.consumerPayment(this.orderDetails)
        .subscribe((pData: any) => {
          this.pGateway = pData.paymentGateway;
          if (this.pGateway === 'RAZORPAY') {
            this.paywithRazorpay(pData);
          } else {
            if (pData['response']) {
              this.payWithPayTM(pData, this.account_id);
              // this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
              // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
              // setTimeout(() => {
              //   if (paymentMode === 'DC') {
              //     this.document.getElementById('payuform').submit();
              //   } else {
              //     this.document.getElementById('paytmform').submit();
              //   }
              // }, 2000);
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
  }
  paywithRazorpay(pData: any) {
    pData.paymentMode = this.selected_payment_mode;
    this.razorpayService.initializePayment(pData, this.account_id, this);
  }
  payWithPayTM(pData: any, accountId: any) {
    this.loadingPaytm = true;
    pData.paymentMode = this.selected_payment_mode;
    this.paytmService.initializePayment(pData, accountId, this);
  }

  finishCheckout(status) {
    console.log("Finish Checkout");
    if (status) {
      this.isClickedOnce = false;
      this.lStorageService.removeitemfromLocalStorage('order_sp');
      this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
      this.lStorageService.removeitemfromLocalStorage('order_spId');
      this.lStorageService.removeitemfromLocalStorage('order');
      this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
      if (this.from) {
        let queryParams = {
          'source': 'order',
        };
        let navigationExtras: NavigationExtras = {
          queryParams: queryParams
        }
        this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
      } else {
        let queryParams = {
          'source': 'order',
        };
        if (this.customId) {
          queryParams['customId'] = this.customId;
          queryParams['accountId'] = this.account_id;
        }
        let navigationExtras: NavigationExtras = {
          queryParams: queryParams
        }
        this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
      }
    } else {
      this.isClickedOnce = false;
      this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
      if (this.from) {
        let queryParams = {
          'source': 'order',
        };
        let navigationExtras: NavigationExtras = {
          queryParams: queryParams
        }
        this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
      } else {
        let queryParams = {
          'source': 'order',
        };
        if (this.customId) {
          queryParams['customId'] = this.customId;
          queryParams['accountId'] = this.account_id;
        }
        let navigationExtras: NavigationExtras = {
          queryParams: queryParams
        }
        this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
      }
    }
  }

  transactionCompleted(response, payload, accountId) {
    if (response.SRC) {
      if (response.STATUS == 'TXN_SUCCESS') {
        this.razorpayService.updateRazorPay(payload, accountId, 'consumer')
          .then((data) => {
            if (data) {
              this.finishCheckout(true);
            }
          },
            error => {
              // this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
            })
      } else if (response.STATUS == 'TXN_FAILURE') {
        if (response.error && response.error.description) {
          this.snackbarService.openSnackBar(response.error.description, { 'panelClass': 'snackbarerror' });
        }
        this.finishCheckout(false);
      }
    } else {
      if (response.STATUS == 'TXN_SUCCESS') {
        this.paytmService.updatePaytmPay(payload, accountId)
          .then((data) => {
            if (data) {
              this.finishCheckout(true);
            }
          },
            error => {
              // this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
            })
      } else if (response.STATUS == 'TXN_FAILURE') {
        this.snackbarService.openSnackBar(response.RESPMSG, { 'panelClass': 'snackbarerror' });
        this.finishCheckout(false);
      }
    }
  }


  closeloading() {
    this.isClickedOnce = false;
    this.loadingPaytm = false;
    this.cdRef.detectChanges();
    // this.ngZone.run(() => this.router.navigate(['consumer']));
    // this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
  }
  getQuestionAnswers(event) {
    this.questionAnswers = event;
  }
  getConsumerQuestionnaire() {
    this.subs.sink = this.shared_services.getConsumerOrderQuestionnaire(this.catalogId, this.account_id).subscribe(data => {
      this.questionnaireList = data;
      if (this.questionnaireList.questionnaireId) {
        this.qnr = true;
      }

      console.log(this.questionnaireList)
      this.questionnaireLoaded = true;
    });
  }
  submitQuestionnaire(uuid, paymenttype?) {
    const dataToSend: FormData = new FormData();
    console.log("Submit Questionaire");
    console.log(this.questionAnswers)
    if (this.questionAnswers === undefined) {
      this.snackbarService.openSnackBar('Please fill more info to complete your booking.', { 'panelClass': 'snackbarerror' });
      this.isClickedOnce = false;
    }
    else {
      if (this.questionAnswers && this.questionAnswers.files) {
        for (const pic of this.questionAnswers.files) {
          dataToSend.append('files', pic, pic['name']);
        }
      }
      const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
      dataToSend.append('question', blobpost_Data);
      this.subs.sink = this.shared_services.submitConsumerOrderQuestionnaire(dataToSend, uuid, this.account_id).subscribe((data: any) => {
        let postData = {
          urls: []
        };
        if (data.urls && data.urls.length > 0) {
          for (const url of data.urls) {
            this.api_loading_video = true;
            const file = this.questionAnswers.filestoUpload[url.labelName][url.document];
            this.provider_services.videoaudioS3Upload(file, url.url)
              .subscribe(() => {
                postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                if (data.urls.length === postData['urls'].length) {
                  this.shared_services.consumerOrderQnrUploadStatusUpdate(uuid, this.account_id, postData)
                    .subscribe((data) => {
                      console.log("Payment Started");
                      this.paymentOperation(this.con_email, paymenttype);
                    },
                      error => {
                        this.isClickedOnce = false;
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                        this.disablebutton = false;
                        this.api_loading_video = false;
                      });
                }
              },
                error => {
                  this.isClickedOnce = false;
                  this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                  this.disablebutton = false;
                  this.api_loading_video = false;
                });
          }
        } else {
          this.paymentOperation(this.con_email, paymenttype);
        }
      },
        error => {
          this.isClickedOnce = false;
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.disablebutton = false;
          this.api_loading_video = false;
        });
    }
  }
  validateQuestionnaire() {
    if (!this.questionAnswers) {
      this.questionAnswers = {
        answers: {
          answerLine: [],
          questionnaireId: this.questionnaireList.id
        }
      }
    }
    if (this.questionAnswers.answers) {
      this.shared_services.validateConsumerQuestionnaire(this.questionAnswers.answers, this.account_id).subscribe((data: any) => {
        if (data.length === 0) {
          this.bookStep = 'Step 3';
        }
        else {
          this.bookStep = 'qnr';
          this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
        }
      }, error => {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
    }
  }

}