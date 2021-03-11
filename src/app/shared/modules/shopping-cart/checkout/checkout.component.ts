import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import * as itemjson from '../../assets/json/item.json';
// import * as itemjson from '../../../../assets/json/item.json';
import { SharedFunctions } from '../../../functions/shared-functions';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
//  import { ConsumerServices } from '../../../ynw_consumer/services/consumer-services.service';
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


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit {
  totaltax = 0;
  provider_id: any;
  s3url;
  retval: Promise<void>;
  api_loading1: boolean;
  coupon_status = null;
  checkoutDisabled: boolean;
  loading = true;
  disabled = false;
  userEmail = '';
  orderNote: any;
  orderlistNote: any;
  phonenumber: any;
  customer_countrycode: any;
  notfutureAvailableTime = false;
  chosenDateDetails: any;
  businessDetails: any;
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
  isfutureAvailableTime = false;
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
        className: 'fa fa-trash-o',
        type: ButtonType.DELETE,
        ariaLabel: 'custom plus aria label',
        title: 'Delete',
        fontSize: '20px'
      },
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };


  canceldialogRef: any;
  // availableTimewindows: any = [];
  // timeWindows;
  nextAvailableTimeQueue: any = [];
  queue;
  couponvalid = true;
  api_cp_error = null;
  s3CouponsList: any = {
    JC:[],OWN:[]
  };
  selected_coupons: any = [];
  couponsList: any = [];
  selected_coupon;
  showCouponWB: boolean;
  cartDetails: any = [];
  // @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('firstStep', { read: ElementRef }) private nextbtn: ElementRef;
  store_availables: any;
  home_availables: any;
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
    private lStorageService: LocalStorageService

  ) {


    this.loginForm = this._formBuilder.group({
      phone: [this.customer_phoneNumber, Validators.required]
    });

    this.storeContact = this._formBuilder.group({

      phone: [this.phonenumber, Validators.required],
      email: ['', Validators.required]
    });

    this.route.queryParams.subscribe(
      params => {
        this.provider_id = params.providerId;
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
    console.log(this.sel_checkindate);
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

    this.linear = false;
    this.orderList = JSON.parse(this.lStorageService.getitemfromLocalStorage('order'));
    if (this.orderList) {
      console.log(this.orderList);
      this.orders = [...new Map(this.orderList.map(item => [item.item['itemId'], item])).values()];
      console.log(this.orders);

    }

    this.getCatalogDetails(this.account_id).then(data => {
      this.catalog_details = data;
      this.imagelist = this.selectedImagelist;
      this.orderType = this.catalog_details.orderType;
      this.loading = false;
      if (this.orderType !== 'SHOPPINGLIST') {
        this.getCartDetails();
      }
      if (this.orderType === 'SHOPPINGLIST') {
        this.gets3curl();
        this.shoppinglistdialogRef = this.dialog.open(ShoppinglistuploadComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true,
          data: {
            source: this.imagelist
          }
        });
        this.shoppinglistdialogRef.afterClosed().subscribe(result => {
          if (result) {
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
      this.getAvailabilityByDate(this.sel_checkindate);
    });
    this.getStoreContact();

    this.showfuturediv = false;
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    this.today = new Date(this.today);
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
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


  }
  ngAfterViewInit() {
    const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      this.getProfile();
      const credentials = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
      this.customer_countrycode = credentials.countryCode;
      this.phonenumber = activeUser.primaryPhoneNumber;
      // this.storeContact.get('phone').value(this.phonenumber);
      this.storeContact.controls.phone.setValue(this.phonenumber);
      this.customer_phoneNumber = this.customer_countrycode + activeUser.primaryPhoneNumber;
      console.log(this.customer_phoneNumber);
      this.getaddress();
      this.nextbtn.nativeElement.click();
    } else {
      this.doLogin('consumer');
    }
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
      'coupons': this.selected_coupons
    };
    this.shared_services.getCartdetails(this.account_id, passdata)
      .subscribe(
        data => {
          console.log(data);
          this.cartDetails = data;
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  gets3curl() {
    this.api_loading1 = true;
    this.retval = this.sharedFunctionobj.getS3Url()
      .then(
        res => {
          this.s3url = res;
          this.getbusinessprofiledetails_json('coupon', true);
          this.getprovidercoupondetails_json('providerCoupon', true);
          this.api_loading1 = false;
        },
        () => {
          this.api_loading1 = false;
        }
      );
  }
  getbusinessprofiledetails_json(section, modDateReq: boolean) {
    let UTCstring = null;
    if (modDateReq) {
      UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
      .subscribe(res => {
        this.s3CouponsList.JC = res;
        console.log(this.s3CouponsList.JC);
        if (this.s3CouponsList.jaldeeCoupn.length > 0) {
          this.showCouponWB = true;
        }
      },
        () => {
        }
      );
  }
  getprovidercoupondetails_json(section, modDateReq: boolean) {
    let UTCstring = null;
    if (modDateReq) {
      UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
      .subscribe(res => {
        this.s3CouponsList.OWN = res;
        console.log(this.s3CouponsList.OWN);
        if (this.s3CouponsList.OWN.length > 0) {
          this.showCouponWB = true;
        }
      },
        () => {
        }
      );
  }
  ngOnDestroy() {
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
  }
  // getItemPrice(item) {
  //   const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
  //   return item.price * qty;
  // }
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
        this.snackbarService.openSnackBar('Promocode applied', { 'panelclass': 'snackbarerror' });
        this.action = '';
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
          console.log(data);
          this.userEmail = data.userProfile.email;
          console.log(this.userEmail);
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
            console.log(JSON.stringify(data[0]));
            resolve(data[0]);
          },
          () => {
            reject();
          }
        );
    });
    // this.shared_services.getConsumerCatalogs(accountId).subscribe(
    //   (catalogs: any) => {
    //     this.catalog_details = catalogs[0];
    //   });

  }

  isLoggedIn() {
    const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      const credentials = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
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
  // getOrderFinalAmountToPay() {
  //   const amount = this.price + this.totaltax + parseInt(this.getDeliveryCharges(), 0);
  //   return amount.toFixed(2);
  // }
  // getTotalItemTax(taxValue) {
  //   this.totaltax = 0;
  //   for (const itemObj of this.orderList) {
  //     let taxprice = 0;
  //     if (itemObj.item.taxable) {
  //       if (itemObj.item.showPromotionalPrice) {
  //         taxprice = itemObj.item.promotionalPrice * (taxValue / 100);
  //       } else {
  //         taxprice = itemObj.item.price * (taxValue / 100);
  //       }
  //     } else {
  //       taxprice = 0;
  //     }
  //     this.totaltax = this.totaltax + taxprice;
  //   }
  //   return this.totaltax.toFixed(2);
  // }

  getItemQty(item) {
    const qty = this.orderList.filter(i => i.item.itemId === item.item.itemId).length;
    return qty;
  }
  // catlogArry() {
  //   this.catlog = itemjson;
  //   this.catalogItem = this.catlog.default.catalogItem;
  // }
  getaddress() {
    console.log('hi');
    this.shared_services.getConsumeraddress()
      .subscribe(
        data => {
          console.log(data);
          if (data !== null) {
            console.log(this.added_address);
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
      console.log(result);
      if (result) {
        this.added_address.splice(index, 1);
        this.shared_services.updateConsumeraddress(this.added_address)
          .subscribe(
            data => {
              if (data) {
                //  this.added_address.splice(index, 1);
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
    console.log(this.action);
    if (this.action === 'timeChange' || this.action === 'coupons') {
      this.action = '';
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

  // getTotalItemPrice() {
  //   this.price = 0;

  //   for (const itemObj of this.orderList) {
  //     let item_price = itemObj.item.price;
  //     if (itemObj.item.showPromotionalPrice) {
  //       item_price = itemObj.item.promotionalPrice;
  //     }
  //     this.price = this.price + item_price;
  //   }
  //   return this.price.toFixed(2);
  // }

  confirm() {
    this.checkoutDisabled = true;
    console.log(this.nextAvailableTime);
    const timeslot = this.nextAvailableTime.split(' - ');
    if (this.delivery_type === 'home') {
      if (this.added_address === null || this.added_address.length === 0) {
        this.checkoutDisabled = false;
        this.snackbarService.openSnackBar('Please add delivery address', { 'panelClass': 'snackbarerror' });
        return;
      } else {
        if (this.emailId === '' || this.emailId === undefined || this.emailId == null) {
          this.emailId = this.customer_email;
        }
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
        if (this.orderType === 'SHOPPINGLIST') {
          const post_Data = {
            'homeDelivery': true,
            'homeDeliveryAddress': delivery_address,
            'catalog': {
              'id': this.catalog_details.id
            },
            'orderFor': {
              'id': 0
            },
            'timeSlot': {
              'sTime': timeslot[0],
              'eTime': timeslot[1]
              // 'sTime': this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['sTime'],
              // 'eTime': this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['eTime']
            },
            'orderDate': this.sel_checkindate,
            'countryCode': this.customer_countrycode,
            'phoneNumber': this.customer_phoneNumber,
            'email': this.customer_email,
            'orderNote': this.orderlistNote,
            'coupons': this.selected_coupons
          };
          this.confirmOrder(post_Data);
        } else {
          const post_Data = {
            'homeDelivery': true,
            'homeDeliveryAddress': delivery_address,
            'catalog': {
              'id': this.catalog_details.id
            },
            'orderFor': {
              'id': 0
            },
            'timeSlot': {
              'sTime': timeslot[0],
              'eTime': timeslot[1]
              // 'sTime': this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['sTime'],
              // 'eTime': this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['eTime']
            },
            'orderItem': this.getOrderItems(),
            'orderDate': this.sel_checkindate,
            'countryCode': this.customer_countrycode,
            'phoneNumber': this.customer_phoneNumber,
            'email': this.customer_email,
            'orderNote': this.orderNote,
            'coupons': this.selected_coupons
          };
          this.confirmOrder(post_Data);
        }
      }
    }
    if (this.delivery_type === 'store') {
      if (!this.storeContact.value.phone || !this.storeContact.value.email) {
        this.checkoutDisabled = false;
        this.snackbarService.openSnackBar('Please provide Contact Details', { 'panelClass': 'snackbarerror' });
        return;
      } else {
        const contactNumber = this.storeContact.value.phone;
        const contact_email = this.storeContact.value.email;
        if (this.emailId === '' || this.emailId === undefined || this.emailId == null) {
          this.emailId = contact_email;
        }
        if (this.orderType === 'SHOPPINGLIST') {
          const post_Data = {
            'storePickup': true,
            'catalog': {
              'id': this.catalog_details.id
            },
            'orderFor': {
              'id': 0
            },
            'timeSlot': {
              'sTime': timeslot[0],
              'eTime': timeslot[1]
              // 'sTime': this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['sTime'],
              // 'eTime': this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['eTime']
            },
            'orderDate': this.sel_checkindate,
            'countryCode': this.customer_countrycode,
            'phoneNumber': contactNumber,
            'email': contact_email,
            'orderNote': this.orderlistNote,
            'coupons': this.selected_coupons
          };
          this.confirmOrder(post_Data);
        } else {
          const post_Data = {
            'storePickup': true,
            'catalog': {
              'id': this.catalog_details.id
            },
            'orderFor': {
              'id': 0
            },
            'timeSlot': {
              'sTime': timeslot[0],
              'eTime': timeslot[1]
              // 'sTime': this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['sTime'],
              // 'eTime': this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['eTime']
            },
            'orderItem': this.getOrderItems(),
            'orderDate': this.sel_checkindate,
            'countryCode': this.customer_countrycode,
            'phoneNumber': contactNumber,
            'email': contact_email,
            'orderNote': this.orderNote,
            'coupons': this.selected_coupons
          };
          this.confirmOrder(post_Data);
        }
      }
    }

  }
  doLogin(origin?, passParam?) {
    // this.snackbarService.openSnackBar('You need to login to check in');
    // const current_provider = passParam['current_provider'];
    // let is_test_account = null;
    // if (current_provider) {
    //   if (current_provider.test_account === '1') {
    const is_test_account = true;
    //   } else {
    //     is_test_account = false;
    //   }
    // }
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
          this.nextbtn.nativeElement.click();
        }
        // if (passParam['callback'] === 'communicate') {
        //   // this.getFavProviders();
        //   // this.showCommunicate(passParam['providerId']);
        // } else if (passParam['callback'] === 'history') {
        //   // this.redirectToHistory();
        // } else if (passParam['callback'] === 'fav') {
        //   // this.getFavProviders(passParam['mod']);
        // } else if (passParam['callback'] === 'donation') {
        //   // this.showDonation(passParam['loc_id'], passParam['date'], passParam['service']);
        // } else if (passParam['callback'] === 'appointment') {
        //   // this.showAppointment(current_provider['location']['id'], current_provider['location']['place'], current_provider['cdate'], current_provider['service'], 'consumer');
        // } else {
        //   // this.getFavProviders();
        //   // this.showCheckin(current_provider['location']['id'], current_provider['location']['place'], current_provider['cdate'], current_provider['service'], 'consumer');
        // }
      } else if (result === 'showsignup') {
        // this.doSignup(passParam);
      }
    });
  }
  confirmOrder(post_Data) {
    console.log(post_Data);
    console.log(this.selectedImagelist.files);
    const dataToSend: FormData = new FormData();
    if (this.orderType === 'SHOPPINGLIST') {
      const captions = {};
      let i = 0;
      if (this.selectedImagelist) {
        console.log(dataToSend);
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
          this.checkoutDisabled = false;
          let prepayAmount;
          const uuidList = [];
          Object.keys(retData).forEach(key => {
            if (key === '_prepaymentAmount') {
              prepayAmount = retData['_prepaymentAmount'];
            } else {
              this.trackUuid = retData[key];
              uuidList.push(retData[key]);
            }
          });

          const navigationExtras: NavigationExtras = {
            queryParams: {
              account_id: this.account_id,
              type_check: 'order_prepayment',
              prepayment: prepayAmount,
              uuid: this.trackUuid
            }
          };

          if (this.catalog_details.paymentType !== 'NONE' && prepayAmount > 0) {
            this.shared_services.CreateConsumerEmail(this.trackUuid, this.account_id, this.emailId)
              .subscribe(res => {
                console.log(res);
                this.router.navigate(['consumer', 'order', 'payment'], navigationExtras);
              });
          } else {
            this.orderList = [];
            this.lStorageService.removeitemfromLocalStorage('order_sp');
            this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
            this.lStorageService.removeitemfromLocalStorage('order_spId');
            this.lStorageService.removeitemfromLocalStorage('order');
            this.snackbarService.openSnackBar('Your Order placed successfully');
            this.router.navigate(['consumer'], { queryParams: { 'source': 'order' } });
          }
        },
          error => {
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
          this.checkoutDisabled = false;
          let prepayAmount;
          const uuidList = [];
          Object.keys(retData).forEach(key => {
            if (key === '_prepaymentAmount') {
              prepayAmount = retData['_prepaymentAmount'];
            } else {
              this.trackUuid = retData[key];
              uuidList.push(retData[key]);
            }
          });

          const navigationExtras: NavigationExtras = {
            queryParams: {
              account_id: this.account_id,
              type_check: 'order_prepayment',
              prepayment: prepayAmount,
              uuid: this.trackUuid
            }
          };
          console.log('prepaymentAmount' + prepayAmount);
          if (this.catalog_details.paymentType !== 'NONE' && prepayAmount > 0) {
            this.shared_services.CreateConsumerEmail(this.trackUuid, this.account_id, this.emailId)
              .subscribe(res => {
                console.log(res);
                this.router.navigate(['consumer', 'order', 'payment'], navigationExtras);
              });
          } else {
            this.orderList = [];
            this.lStorageService.removeitemfromLocalStorage('order_sp');
            this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
            this.lStorageService.removeitemfromLocalStorage('order_spId');
            this.lStorageService.removeitemfromLocalStorage('order');
            this.snackbarService.openSnackBar('Your Order placed successfully');
            this.router.navigate(['consumer'], { queryParams: { 'source': 'order' } });
          }
        },
          error => {
            this.checkoutDisabled = false;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }

        );
    }
  }

  goBackToCheckout(selectesTimeslot, queue) {
    this.action = '';
    console.log(queue);
    const selectqueue = queue['sTime'] + ' - ' + queue['eTime'];
    console.log(selectqueue);
    this.nextAvailableTime = selectqueue;
    // this.nextAvailableTime = selectesTimeslot;
    const chosenDateTime = {
      delivery_type: this.choose_type,
      catlog_id: this.catalog_details.id,
      nextAvailableTime: this.nextAvailableTime,
      order_date: this.sel_checkindate,
      advance_amount: this.catalog_details.advance_amount,
      account_id: this.account_id

    };
    this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
  }
  changeTime() {
    this.action = 'timeChange';
    console.log(this.choose_type);
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
      this.orderSummary.push({ 'id': itemId, 'quantity': qty, 'consumerNote': consumerNote });
    });
    return this.orderSummary;
  }
  highlight(index, address) {
    this.selectedRowIndex = index;
    this.customer_phoneNumber = address.phoneNumber;
    this.customer_email = address.email;
    this.selectedAddress = address;
    console.log(this.selectedAddress);
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
    console.log(this.catalog_Id);
    console.log(this.account_id);
    _this.shared_services.getAvailableDatesForPickup(this.catalog_Id, this.account_id)
      .subscribe((data: any) => {
        this.store_availables = data.filter(obj => obj.isAvailable);
        const availDates = this.store_availables.map(function (a) { return a.date; });
        console.log(availDates);
        _this.storeAvailableDates = availDates.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
      });
  }
  getOrderAvailableDatesForHome() {
    const _this = this;
    console.log(this.catalog_Id);
    console.log(this.account_id);
    _this.shared_services.getAvailableDatesForHome(this.catalog_Id, this.account_id)
      .subscribe((data: any) => {
         this.home_availables = data.filter(obj => obj.isAvailable);
        console.log(this.home_availables);
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
    const dte = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
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
    const dt = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const dt1 = moment(dt, 'YYYY-MM-DD HH:mm').format();
    const date1 = new Date(dt1);
    const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    const date2 = new Date(dt2);
    // if (this.sel_checkindate !== this.todaydate) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
    if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      this.isFuturedate = true;
    } else {
      this.isFuturedate = false;
    }
    const day1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const day = moment(day1, 'YYYY-MM-DD HH:mm').format();
    const ddd = new Date(day);
    this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));
  }
  disableMinus() {
    const seldate1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
    const seldate = new Date(seldate2);
    const selecttdate = new Date(seldate.getFullYear() + '-' + this.sharedFunctionobj.addZero(seldate.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(seldate.getDate()));
    const strtDt1 = this.hold_sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
    const strtDt = new Date(strtDt2);
    const startdate = new Date(strtDt.getFullYear() + '-' + this.sharedFunctionobj.addZero(strtDt.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(strtDt.getDate()));
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
    const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    const date2 = new Date(dt2);
    const dte0 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
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
    console.log(date);
    console.log(this.storeAvailableDates);
    console.log(this.choose_type);
    this.sel_checkindate = date;
    const cday = new Date(this.sel_checkindate);
    const currentday = (cday.getDay() + 1);
    console.log(currentday);
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
        const availability  = this.store_availables.filter(obj => obj.date ===  sel_check_date);          
        if(availability.length > 0){
            this.isfutureAvailableTime = true;
            this.nextAvailableTimeQueue = availability[0].timeSlots;
            this.queue = availability[0].timeSlots[0];
            this.futureAvailableTime = availability[0].timeSlots[0]['sTime'] + ' - ' +  availability[0].timeSlots[0]['eTime'];
          } else{
            this.isfutureAvailableTime = false;
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
      console.log(homeIntervals);
      console.log(JSON.stringify(homeIntervals));
      if (homeIntervals.includes(currentday) && (date > thirty_date))  {
        this.isfutureAvailableTime = true;
        this.nextAvailableTimeQueue = this.catalog_details.homeDelivery.deliverySchedule.timeSlots;
        this.queue = this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0];
        this.futureAvailableTime = this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['eTime'];
        console.log('greater than 30');
      } else if( homeIntervals.includes(currentday) && (date < thirty_date)) {   
        console.log(this.home_availables);
        const sel_check_date = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const availability  = this.home_availables.filter(obj => obj.date ===  sel_check_date);          
        if(availability.length > 0){
            this.isfutureAvailableTime = true;
            this.nextAvailableTimeQueue = availability[0].timeSlots;
            this.queue = availability[0].timeSlots[0];
            this.futureAvailableTime = availability[0].timeSlots[0]['sTime'] + ' - ' +  availability[0].timeSlots[0]['eTime'];
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
        console.log(data);
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
    console.log(img);
    // this.image_list_popup.splice(index, 1);
    //  const idex = this.selectedImagelist.files.findIndex(i => i.id === img.id);
    // console.log(idex);
    this.image_list_popup = this.image_list_popup.filter((val: Image) => val.id !== img.id);
    this.selectedImagelist.files.splice(img.id, 1);
    this.selectedImagelist.base64.splice(img.id, 1);
    this.selectedImagelist.caption.splice(img.id, 1);
    console.log(this.image_list_popup);
    console.log(this.selectedImagelist.files);
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }

  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }

  onButtonBeforeHook(event) {
    console.log(event);
    if (!event || !event.button) {
      return;
    }
    if (event.button.type === ButtonType.DELETE) {

      console.log(event.image.plain);
      console.log(this.selectedImagelist.files);
      console.log(this.image_list_popup);
      // this.deletemodelboxImage(event.image.plain);
      const idex = this.selectedImagelist.files.findIndex(i => i.id === event.image.id);
      console.log(idex);
      this.image_list_popup = this.image_list_popup.filter((val: Image) => val.id !== event.image.id);
      this.selectedImagelist.files.splice(idex, 1);
      this.selectedImagelist.base64.splice(idex, 1);
      this.selectedImagelist.caption.splice(idex, 1);
      // this.image_list_popup.splice(idex, 1);

      console.log(this.selectedImagelist.files);
      console.log(this.image_list_popup);
    }

  }
  deletemodelboxImage(name) {
    console.log(name);
    const idex = this.selectedImagelist.files.findIndex(i => i.name === name);
    console.log(idex);
    this.selectedImagelist.files.splice(idex, 1);
    this.selectedImagelist.base64.splice(idex, 1);
    this.image_list_popup.splice(idex, 1);
    console.log(this.selectedImagelist.files);
    // this.image_list_popup = [];
    //   if (this.selectedImagelist.files.length > 0) {
    //   for (let i = 0; i < this.selectedImagelist.files.length; i++) {
    //     const imgobj = new Image(i,
    //         {
    //             img: this.selectedImagelist.base64[i],
    //             description: ''
    //         });
    //     this.image_list_popup.push(imgobj);
    // }
    // console.log(this.image_list_popup);

    //   }
    console.log(this.image_list_popup);
  }
  onButtonAfterHook() { }

  imageSelect(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.IMAGE_FORMATS.indexOf(file.type) === -1) {
          this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
        } else if (file.size > projectConstants.IMAGE_MAX_SIZE) {
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
    this.imagelist = this.selectedImagelist;
    console.log(this.selectedImagelist);
    this.shoppinglistdialogRef = this.dialog.open(ShoppinglistuploadComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        source: this.imagelist
      }
    });
    this.shoppinglistdialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.selectedImagelist = result;
        this.image_list_popup = [];
        if (this.selectedImagelist.files.length > 0) {
          for (let i = 0; i < this.selectedImagelist.files.length; i++) {
            const imgobj = new Image(i,
              {
                img: this.selectedImagelist.base64[i],
                description: ''
              });
            this.image_list_popup.push(imgobj);
          }

        }
      }
    });
  }
  handleQueueSelection(queue, index) {
    console.log(index);
    this.queue = queue;
  }
}

