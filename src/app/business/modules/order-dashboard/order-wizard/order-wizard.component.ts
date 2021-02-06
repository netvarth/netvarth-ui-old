import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { Router, NavigationExtras } from '@angular/router';
import { SharedServices } from '../../../../shared/services/shared-services';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import { projectConstants } from '../../../../app.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-order-wizard',
  templateUrl: './order-wizard.component.html',
  styleUrls: ['./order-wizard.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css']
})
export class OrderWizardComponent implements OnInit {
  orderSummary: any[];
  orderNote: any;
  storeContact: any;
  emailId: string;
  selected_coupons: any;
  orderlistNote: any;
  customer_email: any;
  customer_phoneNumber: any;
  customer_countrycode: any;
  selectedAddress: any;
  orderType: string;
  added_address: any;
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
  disabledConfirmbtn: boolean;
  orders: any;
  order_count: number;
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
  form_data: any;
  step = 1;
  show_customer = false;
  create_customer = false;
  storeAvailableDates: any = [];
  homeAvailableDates: any = [];
  constructor(private fb: FormBuilder,
    private wordProcessor: WordProcessor,
    public router: Router,
    public sharedFunctionobj: SharedFunctions,
    private shared_services: SharedServices,
    private groupService: GroupStorageService,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private provider_services: ProviderServices) { }

  ngOnInit() {
    this.accountId = this.groupService.getitemFromGroupStorage('accountId');
    this.createForm();
    this.getCatalog();

  }
  createForm() {
    this.searchForm = this.fb.group({
      search_input: ['', Validators.compose([Validators.required])]
    });
  }
  searchCustomer(form_data) {
    let mode = 'id';
    this.form_data = null;
    let post_data = {};
    const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
    const isEmail = emailPattern.test(form_data.search_input);
    if (isEmail) {
      mode = 'email';
    } else {
      const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const isNumber = phonepattern.test(form_data.search_input);
      const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const isCount10 = phonecntpattern.test(form_data.search_input);
      if (isNumber && isCount10) {
        mode = 'phone';
      } else {
        mode = 'id';
      }
    }

    switch (mode) {
      case 'phone':
        post_data = {
          'phoneNo-eq': form_data.search_input
        };
        break;
      case 'email':
        post_data = {
          'email-eq': form_data.search_input
        };
        break;
      case 'id':
        post_data = {
          'jaldeeId-eq': form_data.search_input
        };
        break;
    }

    this.provider_services.getCustomer(post_data)
      .subscribe(
        (data: any) => {
          this.customer_data = [];
          if (data.length === 0) {
            this.show_customer = false;
            this.create_customer = true;

            this.createNew('create');
          } else {
            if (data.length > 1) {
              const customer = data.filter(member => !member.parent);
              this.customer_data = customer[0];
            } else {
              this.customer_data = data[0];
            }
            this.jaldeeId = this.customer_data.jaldeeId;
            console.log(this.jaldeeId);
            if (this.customer_data.countryCode && this.customer_data.countryCode !== '+null') {
              this.countryCode = this.customer_data.countryCode;
            } else {
              this.countryCode = '+91';
            }
            this.show_customer = true;
            this.create_customer = false;
          }

        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }
  createNew(type?) {
    if (!type) {
      this.qParams = {};
    }
    if (type === 'new') {
      this.qParams['noMobile'] = false;
    }
    // this.qParams['checkinType'] = this.checkinType;
    // if (this.source === 'waitlist-block') {
    //     this.qParams['source'] = this.source;
    //     this.qParams['uid'] = this.uid;
    //     this.qParams['showtoken'] = this.showtoken;
    //     if (this.virtualServicemode && this.virtualServicenumber) {
    //         this.qParams['virtualServicemode'] = this.virtualServicemode;
    //         this.qParams['virtualServicenumber'] = this.virtualServicenumber;
    //     }
    // } else {
    //     this.qParams['source'] = (this.showtoken) ? 'token' : 'checkin';
    // }
    // this.qParams['thirdParty'] = this.thirdParty;
    this.qParams['type'] = type;
    this.qParams['id'] = 'add';
    const navigationExtras: NavigationExtras = {
      queryParams: this.qParams
    };
    this.router.navigate(['/provider/customers/create'], navigationExtras);
  }
  getCatalog() {
    this.getCatalogDetails().then(data => {
      this.catalog_details = data;
      console.log(this.catalog_details);
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
      if (this.catalog_details) {
        this.catalog_Id = this.catalog_details.id;
        if (this.catalog_details.pickUp) {
          if (this.catalog_details.pickUp.orderPickUp && this.catalog_details.nextAvailablePickUpDetails) {
            this.store_pickup = true;
            this.choose_type = 'store';
            this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
            this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
          }
        }
        if (this.catalog_details.homeDelivery) {
          if (this.catalog_details.homeDelivery.homeDelivery && this.catalog_details.nextAvailableDeliveryDetails) {
            this.home_delivery = true;

            if (!this.store_pickup) {
              this.choose_type = 'home';
              this.deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
              this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
              this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];

            }
          }
        }
        this.advance_amount = this.catalog_details.advanceAmount;
      }
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


    // this.shared_services.getConsumerCatalogs(accountId).subscribe(
    //   (catalogs: any) => {
    //     this.catalog_details = catalogs[0];
    //   });

  }
  gotoNext() {
    this.step = this.step + 1;
  }
  gotoPrev() {
    this.step = this.step - 1;
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
getDeliveryCharge() {
  let deliveryCharge = 0;
  if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
    deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
  }
  return deliveryCharge.toFixed(2);
}
getSubTotal() {
  let subtotal = 0;
  let deliveryCharge = 0;
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
      // this.nextAvailableTimeQueue = this.catalog_details.nextAvailablePickUpDetails.timeSlots;
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
      // this.nextAvailableTimeQueue = this.catalog_details.nextAvailableDeliveryDetails.timeSlots;
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
    this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
    this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
    this.getAvailabilityByDate(this.sel_checkindate);
  } else {
    this.home_delivery = true;
    this.choose_type = 'home';
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

confirm() {
  this.placeOrderDisabled = true;
  console.log(this.nextAvailableTime);
  const timeslot = this.nextAvailableTime.split(' - ');
  if (this.delivery_type === 'home') {
    if (this.added_address === null || this.added_address.length === 0) {
      this.placeOrderDisabled = false;
      this.snackbarService.openSnackBar('Please add delivery address', { 'panelClass': 'snackbarerror' });
      return;
    } else {
      if (this.emailId === '' || this.emailId === undefined || this.emailId == null) {
        this.emailId = this.customer_email;
      }
      if (this.orderType === 'SHOPPINGLIST') {
        const post_Data = {
          'homeDelivery': true,
          'homeDeliveryAddress': this.selectedAddress,
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
        console.log(post_Data);
     //   this.confirmOrder(post_Data);
      } else {
        const post_Data = {
          'homeDelivery': true,
          'homeDeliveryAddress': this.selectedAddress,
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
        console.log(post_Data);
      //  this.confirmOrder(post_Data);
      }
    }
  }
  if (this.delivery_type === 'store') {
    if (!this.storeContact.value.phone || !this.storeContact.value.email) {
      this.placeOrderDisabled = false;
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
        console.log(post_Data);
       // this.confirmOrder(post_Data);
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
        console.log(post_Data);
       // this.confirmOrder(post_Data);
      }
    }
  }

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
// confirmOrder(post_Data) {
//   console.log(post_Data);
//   console.log(this.selectedImagelist.files);
//   const dataToSend: FormData = new FormData();
//   if (this.orderType === 'SHOPPINGLIST') {
//     const captions = {};
//     let i = 0;
//     if (this.selectedImagelist) {
//       console.log(dataToSend);
//       for (const pic of this.selectedImagelist.files) {
//         dataToSend.append('attachments', pic, pic['name']);
//         captions[i] = this.selectedImagelist.caption[i] || '';
//         i++;
//       }
//     }
//     const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
//     dataToSend.append('captions', blobPropdata);
//     const blobpost_Data = new Blob([JSON.stringify(post_Data)], { type: 'application/json' });
//     dataToSend.append('order', blobpost_Data);
//     this.shared_services.CreateConsumerOrderlist(this.account_id, dataToSend)
//       .subscribe(data => {
//         const retData = data;
//         this.checkoutDisabled = false;
//         let prepayAmount;
//         const uuidList = [];
//         Object.keys(retData).forEach(key => {
//           if (key === '_prepaymentAmount') {
//             prepayAmount = retData['_prepaymentAmount'];
//           } else {
//             this.trackUuid = retData[key];
//             uuidList.push(retData[key]);
//           }
//         });

//         const navigationExtras: NavigationExtras = {
//           queryParams: {
//             account_id: this.account_id,
//             type_check: 'order_prepayment',
//             prepayment: prepayAmount,
//             uuid: this.trackUuid
//           }
//         };
//         if (this.catalog_details.advanceAmount && this.catalog_details.advanceAmount > 0.0) {
//           this.shared_services.CreateConsumerEmail(this.trackUuid, this.account_id, this.emailId)
//             .subscribe(res => {
//               console.log(res);
//               this.router.navigate(['consumer', 'order', 'payment'], navigationExtras);
//             });
//         } else {
//           this.orderList = [];
//           this.lStorageService.removeitemfromLocalStorage('order_sp');
//           this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
//           this.lStorageService.removeitemfromLocalStorage('order_spId');
//           this.lStorageService.removeitemfromLocalStorage('order');
//           this.snackbarService.openSnackBar('Your Order placed successfully');
//           this.router.navigate(['consumer'], { queryParams: { 'source': 'order' } });
//         }
//       },
//         error => {
//           this.checkoutDisabled = false;
//           this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
//         }

//       );
//   } else {
//     const blobpost_Data = new Blob([JSON.stringify(post_Data)], { type: 'application/json' });
//     dataToSend.append('order', blobpost_Data);
//     this.shared_services.CreateConsumerOrder(this.account_id, dataToSend)
//       .subscribe(data => {
//         const retData = data;
//         this.checkoutDisabled = false;
//         let prepayAmount;
//         const uuidList = [];
//         Object.keys(retData).forEach(key => {
//           if (key === '_prepaymentAmount') {
//             prepayAmount = retData['_prepaymentAmount'];
//           } else {
//             this.trackUuid = retData[key];
//             uuidList.push(retData[key]);
//           }
//         });

//         const navigationExtras: NavigationExtras = {
//           queryParams: {
//             account_id: this.account_id,
//             type_check: 'order_prepayment',
//             prepayment: prepayAmount,
//             uuid: this.trackUuid
//           }
//         };
//         if (this.catalog_details.advanceAmount && this.catalog_details.advanceAmount > 0.0) {
//           this.shared_services.CreateConsumerEmail(this.trackUuid, this.account_id, this.emailId)
//             .subscribe(res => {
//               console.log(res);
//               this.router.navigate(['consumer', 'order', 'payment'], navigationExtras);
//             });
//         } else {
//           this.orderList = [];
//           this.lStorageService.removeitemfromLocalStorage('order_sp');
//           this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
//           this.lStorageService.removeitemfromLocalStorage('order_spId');
//           this.lStorageService.removeitemfromLocalStorage('order');
//           this.snackbarService.openSnackBar('Your Order placed successfully');
//           this.router.navigate(['consumer'], { queryParams: { 'source': 'order' } });
//         }
//       },
//         error => {
//           this.checkoutDisabled = false;
//           this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
//         }

//       );
//   }
// }

}

