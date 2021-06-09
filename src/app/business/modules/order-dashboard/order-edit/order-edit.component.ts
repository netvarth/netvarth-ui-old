import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { projectConstants } from '../../../../app.component';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ConfirmBoxComponent } from '../../../../shared/components/confirm-box/confirm-box.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { AddressComponent } from '../order-wizard/address/address.component';


@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css']

})
export class OrderEditComponent implements OnInit, OnDestroy {
  emailId: string;
  disableSave: boolean;
  queue: any;
  accountId: any;
  placeOrderDisabled: boolean;
  orderSummary: any[];
  selectedRowIndex: any;
  customer_email: any;
  customer_phoneNumber: any;
  added_address: any = [];
  customerId: any;
  orderCount: number;
  disabledConfirmbtn = false;
  // isfutureAvailableTime: boolean;
  isfutureAvailableTime=true ;
  selectedQeTime: any;
  order_date: any;
  selectedQsTime: any;
  catlog_id: any;
  delivery_type: any;
  chosenDateDetails: any;
  addItemNotesdialogRef: any;
  deliveryCharge = 0;
  store_pickup: boolean;
  home_delivery: boolean;
  catalog_details: any;
  order_count: number;
  price: number;
  orders: any[];
  orderList: any = [];
  catlog: any;
  catalogItem: any;
  action: any = '';
  catalogJSON: any;
  currentcatlog: any;
  isFuturedate = false;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  sel_checkindate;
  showfuturediv;
  today;
  server_date;
  minDate;
  maxDate;
  todaydate;
  ddate;
  hold_sel_checkindate;
  totaltax = 0;
  // choose_type = 'store';
  choose_type;
  timings_title:string;
  advance_amount: any;
  account_id: any;
  storeChecked = true;
  nextAvailableTime;
  availableDates: any = [];
  catalog_Id: any;
  businessDetails: any;
  futureAvailableTime;
  storeAvailableDates: any = [];
  homeAvailableDates: any = [];
  applied_inbilltime = Messages.APPLIED_INBILLTIME;
  couponvalid = true;
  api_cp_error = null;
  s3CouponsList: any = [];
  selected_coupons: any = [];
  couponsList: any = [];
  step = 3;
  selected_coupon;
  showCouponWB: boolean;
  showCoupon = false;
  provider_id: any;
  s3url;
  loading = true;
  api_loading1 = true;
  retval;
  tooltipcls = '';
  coupon_status = null;
  showSide = false;
  storeContact: any;
  canceldialogRef: any;
  sel_checdate: any;
  catalogItems: any[];
  itemCount: any;
  uid: any;
  orderDetails: any = [];
  addressDialogRef: any;
  selectedAddress: string;
  storeaddress: string;
  disabledNextbtn = false;
  amForm: FormGroup;
  nextAvailableTimeQueue: any;
  image_list_popup: Image[];
  imagelist: any = [];
  orderNumber:any;
  store_availables: any;
  home_availables: any;
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
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('closeDatepickerModal') private datepickerModal: ElementRef;
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private location: Location,
    private shared_services: SharedServices,
    private dialog: MatDialog,
        public providerservice: ProviderServices,
    public sharedFunctionobj: SharedFunctions,
    private groupService: GroupStorageService,
    public fed_service: FormMessageDisplayService,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private dateTimeProcessor: DateTimeProcessor) {
    this.route.params.pipe(takeUntil(this.onDestroy$))
    .subscribe(
      params => {
        this.account_id = this.groupService.getitemFromGroupStorage('accountId');
        this.uid = params.id;
         this.getOrderDetails(this.uid);
      });

  }

  ngOnInit() {
    this.fetchCatalog();
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

  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  confirm() {
    this.placeOrderDisabled = true;
    const timeslot = this.nextAvailableTime.split(' - ');
    if (this.choose_type === 'home') {
      if (this.selectedAddress === '' ) {
        this.placeOrderDisabled = false;
        this.snackbarService.openSnackBar('Please add delivery address', { 'panelClass': 'snackbarerror' });
        return;
      } else {
        const post_Data = {
          'homeDelivery': true,
          'homeDeliveryAddress': this.selectedAddress,
          'uid': this.orderDetails.uid,
          'timeSlot': {
            'sTime': timeslot[0],
            'eTime': timeslot[1]
          },
          'orderDate':  this.sel_checkindate,
          'countryCode': this.orderDetails.countryCode,
          'phoneNumber': this.orderDetails.phoneNumber,
          'email': this.orderDetails.email

        };
        this.confirmOrder(post_Data);

      }
    }
    if (this.choose_type === 'store') {
      const post_Data = {
        'storePickup': true,
        'uid': this.orderDetails.uid,
        'timeSlot': {
          'sTime': timeslot[0],
          'eTime': timeslot[1]
        },
        'orderDate': this.sel_checkindate,
        'countryCode': this.orderDetails.countryCode,
        'phoneNumber': this.orderDetails.phoneNumber,
        'email': this.orderDetails.email
      };
      this.confirmOrder(post_Data);
    }
  }


  onSubmit(form_data) {
    const timeslot = this.nextAvailableTime.split(' - ');
    this.selectedAddress = form_data;
    const post_data = {
      'homeDelivery': true,
      'homeDeliveryAddress': this.selectedAddress,
      'uid': this.orderDetails.uid,
      'timeSlot': {
        'sTime': timeslot[0],
        'eTime': timeslot[1]
      },
      'orderDate':  this.sel_checkindate,
      'countryCode': this.orderDetails.countryCode,
      'phoneNumber': this.orderDetails.phoneNumber,
      'email': this.orderDetails.email

    };
    this.closeModal.nativeElement.click();

    this.providerservice.updateProviderOrders(post_data)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        data => {
          this.disableSave = false;
          this.closeModal.nativeElement.click();
          this.getOrderDetails(this.uid);
        },
        error => {
          this.disableSave = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  // goBack() {
  //   this.router.navigate(['providers', 'orders']);
  // }
  editAddress() {
    this.amForm.setValue({
      'phoneNumber': this.orderDetails.homeDeliveryAddress.phoneNumber || null,
      'firstName': this.orderDetails.homeDeliveryAddress.firstName || null,
      'lastName': this.orderDetails.homeDeliveryAddress.lastName || null,
      'email': this.orderDetails.homeDeliveryAddress.email || null,
      'address': this.orderDetails.homeDeliveryAddress.address || null,
      'city': this.orderDetails.homeDeliveryAddress.city || null,
      'postalCode': this.orderDetails.homeDeliveryAddress.postalCode || null,
      'landMark': this.orderDetails.homeDeliveryAddress.landMark || null,
      'countryCode': '+91',
    });

  }
  getOrderItems() {

    this.orderSummary = [];
    this.orders.forEach(item => {
      let consumerNote = '';
      const itemId = item.item.itemId;
      const qty = this.getItemQty(item);
      console.log(qty);
      if (item.consumerNote) {
        consumerNote = item.consumerNote;
      }

      this.orderSummary.push({ 'id': itemId, 'quantity': qty, 'consumerNote': consumerNote });
    });
    return this.orderSummary;
  }

  confirmOrder(post_data) {
    this.providerservice.updateOrder(post_data)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        if(this.orderDetails && this.orderDetails.orderItem){
        this.updateOrderItems().then(res => {
          this.placeOrderDisabled = false;
          this.snackbarService.openSnackBar('Your Order updated successfully');
          this.orderList = [];
          this.router.navigate(['provider', 'orders']);
        },
        error => {
          this.placeOrderDisabled = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
      } else {
          this.placeOrderDisabled = false;
          this.snackbarService.openSnackBar('Your Order updated successfully');
          this.router.navigate(['provider', 'orders']);
      }
      },
        error => {
          this.placeOrderDisabled = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }

      );
  }
  updateOrderItems() {
    const items = this.getOrderItems();
    const orderId = this.orderDetails.uid;
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.providerservice.updateOrderItems(orderId, items)
        .subscribe(data => {
          resolve(data);
        },
          error => {
            reject(error);
          }
        );
    });
  }
  gotoNext() {
    if (this.step === 2) {
      if (this.orders.length === 0) {
        this.snackbarService.openSnackBar('Please add items to proceed', { 'panelClass': 'snackbarerror' });
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


  // fetch orderdetails using order id
  getOrderDetails(uid) {
    this.providerservice.getProviderOrderById(uid)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(data => {
      this.orderList = [];
      this.orderDetails = data;
      this.orderNumber = this.orderDetails.orderNumber;
      this.customerId = this.orderDetails.orderFor.id;
      if (this.orderDetails && this.orderDetails.orderItem && this.orderDetails.catalog.orderType !== 'SHOPPINGLIST') {
        for (const item of this.orderDetails.orderItem) {
          const itemqty: number = item.quantity;
          const itemId = item.id;
          const orderItem = this.catalogItems.find(i => i.item.itemId === itemId);
          const itemObject = orderItem.item;
          console.log(itemqty);
         // this.orderList = [];
          for (let i = 0; i < itemqty; i++) {
            this.orderList.push({ 'item': itemObject });
          }

        }
        console.log(this.orderList);
        this.orders = [...new Map(this.orderList.map(Item => [Item.item['itemId'], Item])).values()];
      this.orderCount = this.orders.length;
      console.log(this.orders);
      console.log(this.orderCount);
      }  
      if (this.orderDetails && this.orderDetails.shoppingList) {
        this.image_list_popup = [];
        this.imagelist = this.orderDetails.shoppingList;
        for (let i = 0; i < this.imagelist.length; i++) {
          const imgobj = new Image(
            i,
            { // modal
              img: this.imagelist[i].s3path,
              description: this.imagelist[i].caption || ''
            });
          this.image_list_popup.push(imgobj);
        }
      }

      if (this.orderDetails.storePickup) {
        this.choose_type = 'store';
        this.store_pickup = true;
      }
      if (this.orderDetails.homeDelivery) {
        this.choose_type = 'home';
        this.home_delivery = true;
        this.selectedRowIndex = 'i';
      }
      if (this.orderDetails.orderFor) {
        this.customerId = this.orderDetails.orderFor.id;
        this.getDeliveryAddress();
      }
      


      this.sel_checkindate = this.orderDetails.orderDate;
      // this.getAvailabilityByDate(this.sel_checkindate);
      this.nextAvailableTime = this.orderDetails.timeSlot.sTime + ' - ' + this.orderDetails.timeSlot.eTime;
      console.log(this.nextAvailableTime);
      this.loading = false;
    });
  }


  goBackToSummary(selectesTimeslot, queue) {
    const selectqueue = queue['sTime'] + ' - ' + queue['eTime'];
    this.nextAvailableTime = selectqueue;
    this.datepickerModal.nativeElement.click();

  }
  handleQueueSelection(queue, index) {
    this.queue = queue;
  }
  // Fetch catalog of this account using accountId
  fetchCatalog() {
    this.getCatalogDetails(this.account_id).then(data => {
      this.catalog_details = data;
      this.catalogItems = [];
      for (let itemIndex = 0; itemIndex < this.catalog_details.catalogItem.length; itemIndex++) {
        const catalogItemId = this.catalog_details.catalogItem[itemIndex].id;
        const minQty = this.catalog_details.catalogItem[itemIndex].minQuantity;
        const maxQty = this.catalog_details.catalogItem[itemIndex].maxQuantity;
        const showpric = this.catalog_details.showPrice;
        this.catalogItems.push({ 'type': 'item', 'minqty': minQty, 'maxqty': maxQty, 'id': catalogItemId, 'item': this.catalog_details.catalogItem[itemIndex].item, 'showpric': showpric });
        this.itemCount++;
      }
      if (this.catalog_details) {
        this.catalog_Id = this.catalog_details.id;
        if (this.catalog_details.pickUp) {
          if (this.catalog_details.pickUp.orderPickUp && this.catalog_details.nextAvailablePickUpDetails) {
            this.store_pickup = true;
            this.choose_type = 'store';
            this.timings_title="Store Pickup Timings";
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
        this.getOrderAvailableDatesForPickup();
        this.getOrderAvailableDatesForHome();
        this.getOrderDetails(this.uid);

      }

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

    });
  }

  getCatalogDetails(accountId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
     // _this.shared_services.getConsumerCatalogs(accountId)
     _this.providerservice.getProviderCatalogs()
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
  getItemQty(item) {
    const qty = this.orderList.filter(i => i.item.itemId === item.item.itemId).length;
    if (qty === 0) {
      this.removeItemFromCart(item);
    }
    console.log(qty);
    return qty;
  }

  getItemPrice(itemObj) {
    const qty = this.orderList.filter(i => i.item.itemId === itemObj.item.itemId).length;
    let item_price = itemObj.item.price;
    if (itemObj.item.showPromotionalPrice) {
      item_price = itemObj.item.promotionalPrice;
    }
    return (item_price * qty).toFixed(2);
  }
  increment(item) {
    this.addToCart(item);
  }

  decrement(item) {
    this.removeFromCart(item);
  }
  addToCart(Item) {
    this.orderList.push(Item);
    this.getTotalItemAndPrice();
    this.getItemQty(Item);
    this.orders = [...new Map(this.orderList.map(orderItem => [orderItem.item['itemId'], orderItem])).values()];

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



  getbusinessprofiledetails_json(section, modDateReq: boolean) {
    let UTCstring = null;
    if (modDateReq) {
      UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(res => {
        this.s3CouponsList = res;
        if (this.s3CouponsList.length > 0) {
          this.showCouponWB = true;
        }
      },
        () => {
        }
      );
  }
  removeFromCart(itemObj) {
    const item = itemObj.item;
    for (const i in this.orderList) {
      if (this.orderList[i].item.itemId === item.itemId) {
        this.orderList.splice(i, 1);
        this.lStorageService.setitemonLocalStorage('order', this.orderList);
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
  removeItemFromCart(item) {


    this.orderList = this.orderList.filter(Item => Item.item.itemId !== item.item.itemId);

    this.orders = [...new Map(this.orderList.map(Item => [Item.item['itemId'], Item])).values()];

    if (this.orders.length === 0) {
      this.disabledConfirmbtn = true;
    }

  }
  getTotalItemPrice() {
    this.price = 0;
    for (const itemObj of this.orderList) {
      let item_price = itemObj.item.price;
      if (itemObj.item.showPromotionalPrice) {
        item_price = itemObj.item.promotionalPrice;
      }
      this.price = this.price + item_price;
    }
    return this.price.toFixed(2);
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
  getDeliveryCharge() {
    let deliveryCharge = 0;
    if(this.orderDetails.bill && this.orderDetails.bill.deliveryCharges) {
      deliveryCharge=this.orderDetails.bill.deliveryCharges;
    }
    else if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
      deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
    }
    return deliveryCharge.toFixed(2);
  }
  getSubTotal() {
    let subtotal = 0;
    let deliveryCharge = 0;
    if (this.orders.length !== 0) {
      if(this.orderDetails.bill && this.orderDetails.bill.deliveryCharges) {
        deliveryCharge=this.orderDetails.bill.deliveryCharges;
      }
      else if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
        deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
      }
    }
    subtotal = subtotal + this.price + deliveryCharge;
    return subtotal.toFixed(2);
  }

  getSuborderTotal() {
    let subtotal = 0;
    let deliveryCharge = 0;
      if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
        deliveryCharge = this.orderDetails.deliveryCharge;
      }
    subtotal = subtotal + this.orderDetails.bill.netTotal + deliveryCharge;
    return subtotal.toFixed(2);
  }
  getDeliveryAddress() {
    if (this.orderDetails.homeDelivery && this.orderDetails.homeDeliveryAddress !== '') {
      this.orderAddress();
    }
    
  }
  highlight(index, address) {
    this.selectedRowIndex = index;
    this.customer_phoneNumber = address.phoneNumber;
    this.customer_email = address.email;
    this.selectedAddress = address.firstName + ' ' + address.lastName + '</br>' + address.address + '</br>' + address.landMark + ',' + address.city + ',' + address.countryCode + ' ' + address.phoneNumber + '</br>' + address.email;

  }
  orderAddress() {
    this.selectedRowIndex = 'i';
    this.selectedAddress = this.orderDetails.homeDeliveryAddress;

  }
  

  getItemImg(item) {
    if (item.itemImages) {
      const img = item.itemImages.filter(image => image.displayImage);
      if (img[0]) {
        return img[0].url;
      } else {
        return '../../../../../assets/images/order/Items.svg';
      }
    } else {
      return '../../../../assets/images/order/Items.svg';
    }
  }

  checkMinimumQuantityofItems() {
    let all_itemsSet = true;
    this.orders.forEach(item => {
      if (this.getItemQty(item) < item.minqty) {
        this.snackbarService.openSnackBar(item.item.displayName + ' required atleast qty ' + item.minqty + ' as minimum to checkout', { 'panelClass': 'snackbarerror' });
        all_itemsSet = false;
      }
    });
    return all_itemsSet;
  }
  goBack() {
    if(this.step === 2){
      this.step = this.step + 1;
    } else {
    if (this.action === 'changeTime') {
      this.action = '';
    } else {
      this.location.back();
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
  toggleCoupon() {
    this.showCoupon = !this.showCoupon;
  }
  changeType(event) {
    this.choose_type = event.value;
    if (event.value === 'store') {
      this.store_pickup = true;
      this.choose_type = 'store';
      this.timings_title="Store Pickup Timings";
      this.storeChecked = true;
      if (this.orderDetails.storePickup) {
        this.sel_checkindate = this.orderDetails.orderDate;
        this.nextAvailableTime = this.orderDetails.timeSlot.sTime + ' - ' + this.orderDetails.timeSlot.eTime;
      } else {
        this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
        this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
      }
      this.getAvailabilityByDate(this.sel_checkindate);
    } else {
      this.home_delivery = true;
      this.choose_type = 'home';
      this.timings_title="Delivery Timings";
      this.storeChecked = false;
      if (this.orderDetails.homeDelivery) {
        this.sel_checkindate = this.orderDetails.orderDate;
        this.nextAvailableTime = this.orderDetails.timeSlot.sTime + ' - ' + this.orderDetails.timeSlot.eTime;
      } else {
        this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
        this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
      }
      this.getAvailabilityByDate(this.sel_checkindate);
    }

    if (this.todaydate === this.sel_checkindate) {
      this.isFuturedate = false;
    } else {
      this.isFuturedate = true;
    }
  }
  // getOrderAvailableDatesForPickup() {
  //   const _this = this;

  //   _this.shared_services.getAvailableDatesForPickup(this.catalog_Id, this.account_id)
  //   .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data: any) => {
  //       const availables = data.filter(obj => obj.isAvailable);
  //       const availDates = availables.map(function (a) { return a.date; });
  //       _this.storeAvailableDates = availDates.filter(function (elem, index, self) {
  //         return index === self.indexOf(elem);
  //       });
  //     });
  // }
  // getOrderAvailableDatesForHome() {
  //   const _this = this;

  //   _this.shared_services.getAvailableDatesForHome(this.catalog_Id, this.account_id)
  //   .pipe(takeUntil(this.onDestroy$))
  //     .subscribe((data: any) => {
  //       const availables = data.filter(obj => obj.isAvailable);
  //       const availDates = availables.map(function (a) { return a.date; });
  //       _this.homeAvailableDates = availDates.filter(function (elem, index, self) {
  //         return index === self.indexOf(elem);
  //       });
  //     });
  // }
  getOrderAvailableDatesForPickup() {
    const _this = this;

    _this.shared_services.getAvailableDatesForPickup(this.catalog_Id, this.account_id)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.store_availables  = data.filter(obj => obj.isAvailable);
        console.log(this.store_availables);
        this.getAvailabilityByDate(this.sel_checkindate);
        const availDates = this.store_availables .map(function (a) { return a.date; });
        _this.storeAvailableDates = availDates.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
      });
  }
  getOrderAvailableDatesForHome() {
    const _this = this;

    _this.shared_services.getAvailableDatesForHome(this.catalog_Id, this.account_id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: any) => {
        this.home_availables = data.filter(obj => obj.isAvailable);
        console.log(this.home_availables);
        this.getAvailabilityByDate(this.sel_checkindate);
        const availDates =  this.home_availables.map(function (a) { return a.date; });
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
  // getAvailabilityByDate(date) {
  //   this.sel_checkindate = date;
  //   const cday = new Date(this.sel_checkindate);
  //   const currentday = (cday.getDay() + 1);
  //   if (this.choose_type === 'store') {
  //     const storeIntervals = (this.catalog_details.pickUp.pickUpSchedule.repeatIntervals).map(Number);

  //     if (storeIntervals.includes(currentday)) {
  //       this.isfutureAvailableTime = true;
  //       this.nextAvailableTimeQueue = this.catalog_details.pickUp.pickUpSchedule.timeSlots;
  //       this.futureAvailableTime = this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['eTime'];
  //       this.queue = this.catalog_details.pickUp.pickUpSchedule.timeSlots[0];
  //     } else {
  //       this.isfutureAvailableTime = false;
  //     }

  //   } else {
  //     const homeIntervals = (this.catalog_details.homeDelivery.deliverySchedule.repeatIntervals).map(Number);
  //     if (homeIntervals.includes(currentday)) {
  //       this.isfutureAvailableTime = true;
  //       this.nextAvailableTimeQueue = this.catalog_details.homeDelivery.deliverySchedule.timeSlots;
  //       this.futureAvailableTime = this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0]['eTime'];
  //       this.queue = this.catalog_details.homeDelivery.deliverySchedule.timeSlots[0];
  //     } else {
  //       this.isfutureAvailableTime = false;
  //     }
  //   }
  // }
  getAvailabilityByDate(date) { 
    console.log(date);
    console.log(this.storeAvailableDates);
    console.log(this.store_availables);
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

  itemDetails(item) {
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        item: JSON.stringify(item)
      }
    };
    this.router.navigate(['order', 'item-details'], navigationExtras);
  }
  deleteNotes(item, index) {
    this.canceldialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to Delete this Note?',
      }
    });
    this.canceldialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(result => {
      if (result) {
        this.orderList.map((Item, i) => {
          if (Item.item.itemId === item.item.itemId) {
            Item['consumerNote'] = Item.consumerNote.splice;
          }
        });
       
      }
    });
  }
  sidebar() {
    this.showSide = !this.showSide;
  }



  closeNav() {
    this.showSide = false;
  }
  addItems() {
    const additemsdialogRef = this.dialog.open(OrderItemsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {

      }
    });
    additemsdialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(data => {

    });
  }



  EditAddress(selectedAddress) {
    this.addressDialogRef = this.dialog.open(AddressComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        source: 'provider',
        type: 'edit',
        update_address: this.storeaddress
      }
    });
    this.addressDialogRef.afterClosed()
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(result => {
      this.storeaddress = result;
      this.selectedAddress = result.firstName + ' ' + result.lastName + '</br>' + result.address + '</br>' + result.landMark + ',' + result.city + ',' + result.countryCode + ' ' + result.phoneNumber + '</br>' + result.email;
      
    });
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }


}

