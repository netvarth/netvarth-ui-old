import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { SharedServices } from '../../../../shared/services/shared-services';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import { projectConstants } from '../../../../app.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddressComponent } from './address/address.component';
import { Messages } from '../../../../shared/constants/project-messages';
import { ShoppinglistuploadComponent } from '../../../../shared/components/shoppinglistupload/shoppinglistupload.component';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { ConfirmBoxComponent } from '../../../../shared/components/confirm-box/confirm-box.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { SubSink } from '../../../../../../node_modules/subsink';
 




@Component({
  selector: 'app-order-wizard',
  templateUrl: './order-wizard.component.html',
  styleUrls: ['./order-wizard.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css']
})
export class OrderWizardComponent implements OnInit ,OnDestroy{
  coupon_status: any;
  s3url: {};
  retval: Promise<void>;
  api_loading1: boolean;
  prefillnewCustomerwithfield = '';
  canceldialogRef: any;
  addressDialogRef: any;
  selectedRowIndex = -1;
  formMode: string;
  exist_add: any = [];
  disableSave: boolean;
  haveMobile: any;
  loading: boolean;
  trackUuid: any;
  orderSummary: any[];
  orderNote: any;
  storeContact: any;
  emailId: string;
  orderlistNote: any;
  customer_email: any;
  customer_phoneNumber: any;
  customer_countrycode: any;
  selectedAddress: any;
  orderType: string;
  added_address: any = [];
  delivery_type: string;
  placeOrderDisabled: boolean;
  today: any;
  maxDate: Date;
  storeChecked: boolean;
  showfuturediv: boolean;
  ddate;
  isFuturedate: boolean;
  todaydate;
  hold_sel_checkindate;
  action: string;
  queue: any;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  futureAvailableTime: string;
  nextAvailableTimeQueue: any;
  isfutureAvailableTime: boolean;
  advance_amount: any;
  deliveryCharge: any;
  home_delivery: boolean;
  nextAvailableTime: string;
  sel_checkindate: any;
  store_pickup: boolean;
  catalog_Id: any;
  totaltax = 0;
  server_date;
  minDate;
  choose_type: string;
  timings_title:string;
  disabledConfirmbtn: boolean;
  orders: any;
  order_count = 0;
  price: number;
  itemCount: any;
  orderItems: any[];
  orderList: any = [];
  catalog_details: any;
  accountId: any;
  checkinType: any;
  qParams: {};
  countryCode: any;
  jaldeeId: any;
  customer_data: any;
  searchForm: FormGroup;
  createCustomer: FormGroup;
  amForm: FormGroup;
  form_data: any;
  step = 1;
  show_customer = false;
  create_customer = false;
  storeAvailableDates: any = [];
  homeAvailableDates: any = [];
  disabledNextbtn = true;
  applied_inbilltime = Messages.APPLIED_INBILLTIME;
  couponvalid = true;
  api_cp_error = null;
  s3CouponsList: any = [];
  selected_coupons: any = [];
  couponsList: any = [];
  selected_coupon;
  tooltipcls = '';
  showCouponWB: boolean;
  showCoupon = false;
  screenWidth: number;
  no_of_grids: any;
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
  image_list_popup: Image[];
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
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('closeDatepickerModal') private datepickerModal: ElementRef;
  customer_label: any;
  private onDestroy$: Subject<void> = new Subject<void>();
  api_error=false;
  api_error_msg='';
  iscustomerEmailPhone=false;
  order_Mode;
  searchby = '';
  contactDialogRef: MatDialogRef<ContactInfoComponent, any>;
  catalogExpired=false;
  private subs = new SubSink();

  constructor(private fb: FormBuilder,
    private wordProcessor: WordProcessor,
    public router: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddressComponent>,
    public sharedFunctionobj: SharedFunctions,
    private shared_services: SharedServices,
    private groupService: GroupStorageService,
    public fed_service: FormMessageDisplayService,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private activated_route: ActivatedRoute,
    private provider_services: ProviderServices,
    private dateTimeProcessor: DateTimeProcessor,
    private s3Processor: S3UrlProcessor) {

    this.activated_route.queryParams
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(qparams => {

      if (qparams.order_type) {
        this.order_Mode = qparams.order_type;
      }
      if (qparams.ph || qparams.id) {
        const filter = {};
        if (qparams.ph) {
          filter['phoneNo-eq'] = qparams.ph;
        }
        if (qparams.id) {
          filter['id-eq'] = qparams.id;
        }
        this.provider_services.getProviderCustomers(filter)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          (data: any) => {
            if (data.length > 1) {
              const customer = data.filter(member => !member.parent);
              this.customer_data = customer[0];
              this.show_customer = true;
            } else {
              this.customer_data = data[0];
              this.show_customer = true;
            }
            this.jaldeeId = this.customer_data.jaldeeId;
           
           
              console.log(this.jaldeeId);
              if (this.customer_data.countryCode && this.customer_data.countryCode !== '+null') {
                this.countryCode = this.customer_data.countryCode;
              } else {
                this.countryCode = '+91';
              }
              if (this.customer_data.email && this.customer_data.email !== 'null') {
                this.customer_email = this.customer_data.email;
              } 
              if(!this.catalogExpired){
                this.step = 2;
                }else{
                  this.snackbarService.openSnackBar('Your Catalog might be expired,please update to proceed', { 'panelClass': 'snackbarerror' });
                }
          }
        );
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    let divider;
    const divident = this.screenWidth / 37.8;
    if (this.screenWidth > 1000) {
       divider = divident / 6;
    } else if (this.screenWidth > 500 && this.screenWidth < 1000) {
      divider = divident / 4;
    } else if (this.screenWidth > 375 && this.screenWidth < 500) {
      divider = divident / 3;
    } else if (this.screenWidth < 375) {
      divider = divident / 2;
    }
    this.no_of_grids = Math.round(divident / divider);
  }
  ngOnInit() {
    this.accountId = this.groupService.getitemFromGroupStorage('accountId');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.searchby = 'Search by '+ this.customer_label + ' id/email/phone number';
    this.createForm();
    this.getCatalog();
    this.gets3curl();


  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.subs.unsubscribe();
  }
  gets3curl() {
    this.api_loading1 = true;
    
    this.subs.sink = this.s3Processor.getPresignedUrls(this.accountId, null, 'coupon').subscribe(
      (accountS3s) => {
        if (accountS3s['coupon']) {
          this.s3CouponsList = JSON.parse(accountS3s['coupon']);
          if (this.s3CouponsList.length > 0) {
            this.showCouponWB = true;
          }
        }
      }, () => { },
      () => {
      });

    // this.retval = this.sharedFunctionobj.getS3Url()
    //   .then(
    //     res => {
    //       this.s3url = res;
    //       this.getbusinessprofiledetails_json('coupon', true);
    //       this.api_loading1 = false;
    //     },
    //     () => {
    //       this.api_loading1 = false;
    //     }
    //   );
  }
  toggleterms(i) {
    if (this.couponsList[i].showme) {
      this.couponsList[i].showme = false;
    } else {
      this.couponsList[i].showme = true;
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
  toggleCoupon() {
    this.showCoupon = !this.showCoupon;
  }
  // getbusinessprofiledetails_json(section, modDateReq: boolean) {
  //   let UTCstring = null;
  //   if (modDateReq) {
  //     UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
  //   }
  //   this.shared_services.getbusinessprofiledetails_json('59222', this.s3url, section, UTCstring)
  //   .pipe(takeUntil(this.onDestroy$))
  //     .subscribe(res => {
  //       this.s3CouponsList = res;
  //       console.log(this.s3CouponsList);
  //       if (this.s3CouponsList.length > 0) {
  //         this.showCouponWB = true;
  //       }
  //     },
  //       () => {
  //       }
  //     );
  // }
  createForm() {
    this.searchForm = this.fb.group({
      search_input: ['', Validators.compose([Validators.required])]
    });
    this.amForm = this.fb.group({
      phoneNumber: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],

      address: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      postalCode: ['', Validators.compose([Validators.required, Validators.maxLength(6), Validators.minLength(6), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      landMark: ['', Validators.compose([Validators.required])],
      countryCode: ['+91'],
    });
    if (this.formMode === 'edit') {
      this.updateForm();
    }
  }


  searchCustomer(form_data) {
    this.image_list_popup = [];
    this.selectedImagelist = {
      files: [],
      base64: [],
      caption: []
    };
    this.qParams = {};
    let mode = 'id';
    this.form_data = null;
    let post_data = {};
    const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
    const isEmail = emailPattern.test(form_data.search_input);
    if (isEmail) {
      mode = 'email';
      this.prefillnewCustomerwithfield = 'email';
    } else {
      const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const isNumber = phonepattern.test(form_data.search_input);
      const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const isCount10 = phonecntpattern.test(form_data.search_input);
      if (isNumber && isCount10) {
        mode = 'phone';
        this.prefillnewCustomerwithfield = 'phone';
      } else {
        mode = 'id';
        this.prefillnewCustomerwithfield = 'id';
      }
    }

    switch (mode) {
      case 'phone':
        post_data = {
          'phoneNo-eq': form_data.search_input
        };
        this.qParams['phone'] = form_data.search_input;
        break;
      case 'email':
        post_data = {
          'email-eq': form_data.search_input
        };
        this.qParams['email'] = form_data.search_input;
        break;
      case 'id':
        post_data = {
          'jaldeeId-eq': form_data.search_input
        };
        break;
    }

    this.provider_services.getCustomer(post_data)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (data: any) => {
          this.customer_data = [];
          if (data.length === 0) {
            this.show_customer = false;
            this.create_customer = true;

            this.createNew();
          } else {
            if (data.length > 1) {
              const customer = data.filter(member => !member.parent);
              this.customer_data = customer[0];

            } else {
              this.customer_data = data[0];
            }
            this.disabledNextbtn = false;
            this.jaldeeId = this.customer_data.jaldeeId;
            this.show_customer = true;
            this.create_customer = false;
            this.getDeliveryAddress();
            this.formMode = data.type;
      
            console.log(this.jaldeeId);
            if (this.customer_data.countryCode && this.customer_data.countryCode !== '+null') {
              this.countryCode = this.customer_data.countryCode;
            } else {
              this.countryCode = '+91';
            }
            if (this.customer_data.email && this.customer_data.email !== 'null') {
              this.customer_email = this.customer_data.email;
            } 
           
            if(!this.catalogExpired){
              this.step = 2;
              }else{
                this.snackbarService.openSnackBar('Your Catalog might be expired,please update to proceed', { 'panelClass': 'snackbarerror' });
              }
          
        }

        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }
  updateCustomer(id){
    this.qParams={};
    this.qParams['checkinType'] = 'WALK_IN_ORDER';
    this.qParams['source'] = 'order';
    this.qParams['action'] = 'edit';
    this.qParams['id'] = id;
    const navigationExtras: NavigationExtras = {
      queryParams: this.qParams
    };
    this.router.navigate(['/provider/customers/create'], navigationExtras);
  }
  createNew() {
    this.qParams['checkinType'] = 'WALK_IN_ORDER';
    this.qParams['source'] = 'order';
    this.qParams['thirdParty'] = '';
    this.qParams['type'] = 'create';
    this.qParams['id'] = 'add';
    const navigationExtras: NavigationExtras = {
      queryParams: this.qParams
    };
    this.router.navigate(['/provider/customers/create'], navigationExtras);
  }
  getDeliveryAddress() {
    this.provider_services.getDeliveryAddress(this.customer_data.id)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        console.log(data);
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
  highlight(index, address) {
    this.selectedRowIndex = index;
    this.customer_phoneNumber = address.phoneNumber;
  //  this.customer_email = address.email;
    this.selectedAddress = address;
  }
  getCatalog() {
    this.getCatalogDetails().then((data:any) => {
      if(data!==undefined &&data.length!==0){
      this.catalog_details = data;
      this.orderType = this.catalog_details.orderType;
       console.log(this.catalog_details);
       if (this.orderType !== 'SHOPPINGLIST') {
        this.orderItems = [];
      for (let itemIndex = 0; itemIndex < this.catalog_details.catalogItem.length; itemIndex++) {
        const catalogItemId = this.catalog_details.catalogItem[itemIndex].id;
        const minQty = this.catalog_details.catalogItem[itemIndex].minQuantity;
        const maxQty = this.catalog_details.catalogItem[itemIndex].maxQuantity;
        const showpric = this.catalog_details.showPrice;
        this.orderItems.push({ 'type': 'item', 'minqty': minQty, 'maxqty': maxQty, 'id': catalogItemId, 'item': this.catalog_details.catalogItem[itemIndex].item, 'showpric': showpric });
        this.itemCount++;
        console.log(this.orderItems);
      }
      }
      
      
      if (this.catalog_details) {
        this.catalog_Id = this.catalog_details.id;
        if (this.catalog_details.pickUp) {
          if (this.catalog_details.pickUp.orderPickUp && this.catalog_details.nextAvailablePickUpDetails) {
            this.store_pickup = true;
            this.choose_type = 'store';
            this.timings_title=" Store Pickup Timings";
            this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
            this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
          }
        }
        if (this.catalog_details.homeDelivery) {
          if (this.catalog_details.homeDelivery.homeDelivery && this.catalog_details.nextAvailableDeliveryDetails) {
            this.home_delivery = true;

            if (!this.store_pickup) {
              this.choose_type = 'home';
              this.timings_title="Delivery Timings";
              this.deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
              this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
              this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];

            }
          }
        }
        this.advance_amount = this.catalog_details.advanceAmount;
      }
      this.getAvailabilityByDate(this.sel_checkindate);
      this.getOrderAvailableDatesForPickup();
      this.getOrderAvailableDatesForHome();
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
    }else{
     this.catalogExpired=true;
    
    }
    });
  
}
  
  
  getCatalogDetails() {
    const accountId = this.accountId;
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getConsumerCatalogs(accountId)
        .subscribe(
          (data: any) => {
            console.log(data);
            resolve(data[0]);
          },
          () => {
            reject();
          }
        );
    });


  }
  goBackToSummary(selectesTimeslot, queue) {

    console.log(queue);
    const selectqueue = queue['sTime'] + ' - ' + queue['eTime'];
    console.log(selectqueue);
    this.nextAvailableTime = selectqueue;
    this.datepickerModal.nativeElement.click();

  }
  goBack() {
        this.router.navigate(['provider', 'orders']);
}
  updateForm() {
    // this.amForm.setValue({
    //   'phoneNumber': this.edit_address.phoneNumber || null,
    //   'firstName': this.edit_address.firstName || null,
    //   'lastName': this.edit_address.lastName || null,
    //   'email': this.edit_address.email || null,
    //   'address': this.edit_address.address || null,
    //   'city': this.edit_address.city || null,
    //   'postalCode': this.edit_address.postalCode || null,
    //   'landMark': this.edit_address.landMark || null,
    //   'countryCode': '+91',
    // });
  }
  handleQueueSelection(queue, index) {
    console.log(queue);
    this.queue = queue;
  }
  onSubmit(form_data) {

    console.log(JSON.stringify(form_data));
    this.disableSave = true;
    this.added_address.push(form_data);
    console.log('addres' + JSON.stringify(this.added_address));
    this.provider_services.updateDeliveryaddress(this.customer_data.id, this.added_address)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          this.disableSave = false;
          this.closeModal.nativeElement.click();
          this.getDeliveryAddress();
        },
        error => {
          this.disableSave = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  gotoNext() {
    if (this.step === 2) {
      if (this.orders && this.orders.length === 0 && this.orderType !== 'SHOPPINGLIST') {
        this.snackbarService.openSnackBar('Please add items to proceed', { 'panelClass': 'snackbarerror' });
        return false;
       }else if (this.selectedImagelist && this.selectedImagelist.files.length === 0 && this.orderType === 'SHOPPINGLIST') {
        this.snackbarService.openSnackBar('Please upload shoppinglist to proceed', { 'panelClass': 'snackbarerror' });
        return false;
       } else {
        this.step = this.step + 1;
      }
    } else {
      this.step = this.step + 1;
    }

  }
  gotoPrev() {
    this.step = this.step - 1;
  }
  increment(item) {

      // this.iscustomerEmailPhone=true;
      this.addToCart(item);
   
    
  }
  collectContactInfo() {
    this.contactDialogRef = this.dialog.open(ContactInfoComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        phone: this.customer_data.phoneNo,
        email: this.customer_data.email
       

      }
    });
    this.contactDialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(result => {
      if(result){
        this.customer_data.phoneNo=result.phone;
        this.customer_data.email=result.email;
      }
    });
  }
  decrement(item) {
    this.removeFromCart(item);
  }
  addToCart(Item) {
    console.log(JSON.stringify(Item));
    this.orderList.push(Item);
    this.getTotalItemAndPrice();
    this.getItemQty(Item);
    this.orders = [...new Map(this.orderList.map(orderItem => [orderItem.item['itemId'], orderItem])).values()];

  }
  getItemQty(item) {
    const qty = this.orderList.filter(i => i.item.itemId === item.item.itemId).length;
    if (qty === 0) {
      this.removeItemFromCart(item);
    }
    return qty;
  }
  removeFromCart(itemObj) {
    const item = itemObj.item;
    for (const i in this.orderList) {
      if (this.orderList[i].item.itemId === item.itemId) {
        this.orderList.splice(i, 1);
        break;
      }
    }

    this.getTotalItemAndPrice();
    this.getItemQty(itemObj);
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
    return this.price;
  }
  getItemPrice(itemObj) {
    const qty = this.orderList.filter(i => i.item.itemId === itemObj.item.itemId).length;
    let item_price = itemObj.item.price;
    if (itemObj.item.showPromotionalPrice) {
      item_price = itemObj.item.promotionalPrice;
    }
    return (item_price * qty).toFixed(2);
  }

  getItemImg(item) {
    console.log(JSON.stringify(item));
    if (item.itemImages) {
      const img = item.itemImages.filter(image => image.displayImage);
      if (img[0]) {
        return img[0].url;
      } else {
        return '../../../../assets/images/order/Items.svg';
      }
    } else {
      return '../../../../assets/images/order/Items.svg';
    }
  }
  removeItemFromCart(item) {


    this.orderList = this.orderList.filter(Item => Item.item.itemId !== item.item.itemId);

    this.orders = [...new Map(this.orderList.map(Item => [Item.item['itemId'], Item])).values()];
    console.log(JSON.stringify(this.orders));

    if (this.orders.length === 0) {
      this.disabledConfirmbtn = true;
    }

  }
 
  getTotalItemPrice() {
    this.price = 0.0;
    for (const itemObj of this.orderList) {
      let item_price = itemObj.item.price;
      if (itemObj.item.showPromotionalPrice) {
        item_price = itemObj.item.promotionalPrice;
      }
      this.price = this.price + item_price;
    }
    return this.price.toFixed(2);
  }
  getDeliveryCharge() {
    this.deliveryCharge = 0.0;
    if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
      this.deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
    }
    return this.deliveryCharge.toFixed(2);
  }
  getSubTotal() {
    let subtotal = 0.0;
    let deliveryCharge = 0.0;
    if (this.orders.length !== 0) {
      if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
        deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
      }
    }
    subtotal = subtotal + this.price + deliveryCharge + this.totaltax;
    return subtotal.toFixed(2);
  }
  getTotalItemTax(taxValue) {
    this.totaltax = 0;
    for (const itemObj of this.orderList) {
      let taxprice = 0;
      if (itemObj.item.taxable) {
        if (itemObj.item.showPromotionalPrice) {
          taxprice = itemObj.item.promotionalPrice * (taxValue / 100);
        } else {
          taxprice = itemObj.item.price * (taxValue / 100);
        }
      } else {
        taxprice = 0;

      }
      this.totaltax = this.totaltax + taxprice;

    }
    return this.totaltax.toFixed(2);


  }
  getOrderAvailableDatesForPickup() {
    const _this = this;

    _this.shared_services.getAvailableDatesForPickup(this.catalog_Id, this.accountId)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        const availables = data.filter(obj => obj.isAvailable);
        const availDates = availables.map(function (a) { return a.date; });
        _this.storeAvailableDates = availDates.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
      });
  }
  getOrderAvailableDatesForHome() {
    const _this = this;

    _this.shared_services.getAvailableDatesForHome(this.catalog_Id, this.accountId)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        const availables = data.filter(obj => obj.isAvailable);
        const availDates = availables.map(function (a) { return a.date; });
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
  getAvailabilityByDate(date) {
    this.sel_checkindate = date;
    const cday = new Date(this.sel_checkindate);
    const currentday = (cday.getDay() + 1);
    if (this.choose_type === 'store') {
      const storeIntervals = (this.catalog_details.pickUp.pickUpSchedule.repeatIntervals).map(Number);

      if (storeIntervals.includes(currentday)) {
        this.isfutureAvailableTime = true;
        this.nextAvailableTimeQueue = this.catalog_details.pickUp.pickUpSchedule.timeSlots;
        console.log(this.nextAvailableTimeQueue);
        this.futureAvailableTime = this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['eTime'];
        this.queue = this.catalog_details.pickUp.pickUpSchedule.timeSlots[0];
      } else {
        this.isfutureAvailableTime = false;
      }

    } else {
      const homeIntervals = (this.catalog_details.homeDelivery.deliverySchedule.repeatIntervals).map(Number);
      if (homeIntervals.includes(currentday)) {
        this.isfutureAvailableTime = true;
        this.nextAvailableTimeQueue = this.catalog_details.homeDelivery.deliverySchedule.timeSlots;
        console.log(this.nextAvailableTimeQueue);
        this.futureAvailableTime = this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['eTime'];
        this.queue = this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0];
      } else {
        this.isfutureAvailableTime = false;
      }
    }
  }
  changeTime() {
    this.action = 'timeChange';
    this.getAvailabilityByDate(this.sel_checkindate);
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
    this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
  }
  disableMinus() {
    const seldate1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
    const seldate = new Date(seldate2);
    const selecttdate = new Date(seldate.getFullYear() + '-' + this.dateTimeProcessor.addZero(seldate.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(seldate.getDate()));
    const strtDt1 = this.hold_sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
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
    const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    const date2 = new Date(dt2);
    const dte0 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
    const datee2 = new Date(dte2);
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
  changeType(event) {
    this.choose_type = event.value;
    console.log(this.choose_type);
    if (event.value === 'store') {
      this.store_pickup = true;
      this.choose_type = 'store';
      this.storeChecked = true;
      this.timings_title=" Store Pickup Timings";
      this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
      this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
      this.getAvailabilityByDate(this.sel_checkindate);
    } else {
      this.home_delivery = true;
      this.choose_type = 'home';
      this.timings_title="Delivery Timings";
      this.storeChecked = false;
      this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
      this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
      this.getAvailabilityByDate(this.sel_checkindate);
    }

    if (this.todaydate === this.sel_checkindate) {
      this.isFuturedate = false;
    } else {
      this.isFuturedate = true;
    }
  }
  getItemImage(item) {
    return item.itemImages[0].url;

  }
  confirm() {
    if(!this.iscustomerEmailPhone && (!this.customer_data.email || !this.customer_data.phoneNo ||this.customer_data.phoneNo.includes('*'))){
      this.collectContactInfo();
     }else{
       this.iscustomerEmailPhone=true;
    this.placeOrderDisabled = true;
    console.log(this.nextAvailableTime);
    const timeslot = this.nextAvailableTime.split(' - ');
    if(this.orderType!=='SHOPPINGLIST'){
      if(this.getOrderItems().length===0){
        this.snackbarService.openSnackBar('Please add items', { 'panelClass': 'snackbarerror' });
        this.placeOrderDisabled=false;
        return; 
      }
    }
    if (this.choose_type === 'home') {
      console.log(this.added_address);
      if (this.added_address === null || this.added_address.length === 0) {
        this.placeOrderDisabled = false;
        this.snackbarService.openSnackBar('Please add delivery address', { 'panelClass': 'snackbarerror' });
        this.placeOrderDisabled=false;
        return;
      } else {
        if (this.emailId === '' || this.emailId === undefined || this.emailId == null) {
          this.emailId = this.customer_data.email;
        }
          if(this.orderType === 'SHOPPINGLIST'){
            const post_Data = {
              'homeDelivery': true,
              'homeDeliveryAddress': this.selectedAddress,
              'catalog': {
                'id': this.catalog_details.id
              },
              'orderFor': {
                'id': this.customer_data.id
              },
              'consumer': {
                'id': this.customer_data.id
    
              },
              'timeSlot': {
                'sTime': timeslot[0],
                'eTime': timeslot[1]
               
              },
              'orderDate': this.sel_checkindate,
              'countryCode': this.countryCode,
              'phoneNumber': this.customer_data.phoneNo,
              'email': this.customer_data.email,
              'orderMode': this.order_Mode,
              'orderNote': this.orderNote,
              'coupons': this.selected_coupons
            };
            console.log(post_Data);
            this.confirmOrder(post_Data);
          }else{
            const post_Data = {
              'homeDelivery': true,
              'homeDeliveryAddress': this.selectedAddress,
              'catalog': {
                'id': this.catalog_details.id
              },
              'orderFor': {
                'id': this.customer_data.id
              },
              'consumer': {
                'id': this.customer_data.id
    
              },
              'timeSlot': {
                'sTime': timeslot[0],
                'eTime': timeslot[1]
                // 'sTime': this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['sTime'],
                // 'eTime': this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['eTime']
              },
              'orderItem': this.getOrderItems(),
              'orderDate': this.sel_checkindate,
              'countryCode': this.countryCode,
              'phoneNumber': this.customer_data.phoneNo,
              'email': this.customer_data.email,
              'orderMode': this.order_Mode,
              'orderNote': this.orderNote,
              'coupons': this.selected_coupons
            };
            console.log(post_Data);
            this.confirmOrder(post_Data);

          }
        

      }
    }
    if (this.choose_type === 'store') {
      console.log('inisde' +this.orderType);
      
      const contactNumber = this.customer_data.phoneNo;
      const contact_email = this.customer_data.email;
      if (this.emailId === '' || this.emailId === undefined || this.emailId == null) {
        this.emailId = this.customer_data.email;
      }
        if(this.orderType === 'SHOPPINGLIST'){
          const post_Data = {
            'storePickup': true,
            'catalog': {
              'id': this.catalog_details.id
            },
            'orderFor': {
              'id': this.customer_data.id
            },
            'consumer': {
              'id': this.customer_data.id
  
            },
            'timeSlot': {
              'sTime': timeslot[0],
              'eTime': timeslot[1]
            },
            'orderDate': this.sel_checkindate,
            'countryCode': this.countryCode,
            'orderMode': this.order_Mode,
            'phoneNumber': contactNumber,
            'email': contact_email,
        
          };
          console.log(post_Data);
          this.confirmOrder(post_Data);
        }else {
          console.log('progress');
          
          const post_Data = {
            'storePickup': true,
            'catalog': {
              'id': this.catalog_details.id
            },
            'orderFor': {
              'id': this.customer_data.id
            },
            'consumer': {
              'id': this.customer_data.id
  
            },
            'timeSlot': {
              'sTime': timeslot[0],
              'eTime': timeslot[1]
            },
            'orderItem': this.getOrderItems(),
            'orderDate': this.sel_checkindate,
            'countryCode': this.countryCode,
            'orderMode': this.order_Mode,
            'phoneNumber': contactNumber,
            'email': contact_email,

          };
    console.log(post_Data);
          this.confirmOrder(post_Data);
        }
        
        //  }
      
    }
  }
  }
  getOrderItems() {
    console.log('orderitems');
    
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
  confirmOrder(post_Data) {
    console.log(post_Data);
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
      this.shared_services.CreateWalkinOrder(this.accountId, dataToSend)
      .pipe(takeUntil(this.onDestroy$))
        .subscribe(data => {
          this.placeOrderDisabled = false;
          this.snackbarService.openSnackBar('Your Order placed successfully');
          this.router.navigate(['provider', 'orders']);
         
        },
          error => {
            this.placeOrderDisabled = false;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }

        );
    }else {
      const blobpost_Data = new Blob([JSON.stringify(post_Data)], { type: 'application/json' });
      dataToSend.append('order', blobpost_Data);
      this.shared_services.CreateWalkinOrder(this.accountId, dataToSend)
      .pipe(takeUntil(this.onDestroy$))
        .subscribe(data => {
          console.log(JSON.stringify(data));
          this.placeOrderDisabled = false;
          this.snackbarService.openSnackBar('Your Order placed successfully');
          this.orderList = [];
          this.router.navigate(['provider', 'orders']);
        },
          error => {
            this.placeOrderDisabled = false;
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
  
        );
    }
    
  }
  addAddress() {
    this.addressDialogRef = this.dialog.open(AddressComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'Add',
        address: this.added_address,
        customer: this.customer_data

      }
    });
    this.addressDialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(result => {
      this.getDeliveryAddress();
    });
  }
  updateAddress(address, index) {
    this.addressDialogRef = this.dialog.open(AddressComponent, {
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
    this.addressDialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(result => {
      this.getDeliveryAddress();
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
    this.canceldialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
      console.log(result);
      if (result) {
        this.added_address.splice(index, 1);
        this.provider_services.updateDeliveryaddress(this.customer_data.id,this.added_address).pipe(takeUntil(this.onDestroy$))
          .subscribe(
            data => {
              if (data) {
                this.getDeliveryAddress();
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
  addItem(){
    this.step = 2;
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
      for (let couponIndex = 0; couponIndex < this.s3CouponsList.length; couponIndex++) {
        if (this.s3CouponsList[couponIndex].jaldeeCouponCode.trim() === jaldeeCoupn) {
          this.selected_coupons.push(this.s3CouponsList[couponIndex].jaldeeCouponCode);
          couponInfo.couponCode = this.s3CouponsList[couponIndex].jaldeeCouponCode;
          couponInfo.instructions = this.s3CouponsList[couponIndex].consumerTermsAndconditions;
          this.couponsList.push(couponInfo);
          found = true;
          this.selected_coupon = '';
          break;
        }
      }
      if (found) {
        this.couponvalid = true;
        this.snackbarService.openSnackBar('Promocode applied', { 'panelclass': 'snackbarerror' });
        this.showCoupon = false;
      } else {
        this.api_cp_error = 'Coupon invalid';
      }
    } else {
      this.api_cp_error = 'Enter a Coupon';
    }
  }
 
   
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
  uploadShoppingList(){
      this.shoppinglistdialogRef = this.dialog.open(ShoppinglistuploadComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          source: this.imagelist
        }
      });
      this.shoppinglistdialogRef.afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(result => {
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

 
}



