import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { SharedServices } from '../../services/shared-services';
import { AddItemNotesComponent } from './add-item-notes/add-item-notes.component';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Messages } from '../../constants/project-messages';
import { ConfirmBoxComponent } from '../../components/confirm-box/confirm-box.component';
import { projectConstantsLocal } from '../../constants/project-constants';
import { SnackbarService } from '../../services/snackbar.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']

})
export class ShoppingCartSharedComponent implements OnInit, OnDestroy {

  totaltax = 0;
  catalog_loading = false;
  orderCount: number;
  disabledConfirmbtn = false;
  isfutureAvailableTime: boolean;
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
  choose_type = 'store';
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
  selected_coupon;
  showCouponWB: boolean;
  provider_id: any;
  s3url;
  api_loading1 = true;
  retval;
  tooltipcls = '';
  coupon_status = null;
  showSide = false;
  storeContact: any;
  canceldialogRef: any;
  nextAvailableTimeQueue: any = [];
  queue;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private location: Location,
    private shared_services: SharedServices,
    private dialog: MatDialog,
    public sharedFunctionobj: SharedFunctions,
    private snackbarService: SnackbarService,
    private lStorageService: LocalStorageService) {
    this.route.queryParams.subscribe(
      params => {
        this.account_id = params.account_id;
        this.provider_id = params.unique_id;
      });

  }

  ngOnInit() {
    this.businessDetails = this.lStorageService.getitemfromLocalStorage('order_sp');
    this.orderList = this.lStorageService.getitemfromLocalStorage('order');
    this.orders = [...new Map(this.orderList.map(item => [item.item['itemId'], item])).values()];
    this.orderCount = this.orders.length;
    this.gets3curl();
    this.fetchCatalog();

  }




  ngOnDestroy() {
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
  }
  fetchCatalog() {
    this.getCatalogDetails(this.account_id).then(data => {
      this.catalog_loading = true;
      this.catalog_details = data;
      console.log(this.catalog_details);
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
      this.fillDateFromLocalStorage();
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

    });
  }
  fillDateFromLocalStorage() {
    this.chosenDateDetails = this.lStorageService.getitemfromLocalStorage('chosenDateTime');
    if (this.chosenDateDetails !== null) {
      this.delivery_type = this.chosenDateDetails.delivery_type;
      this.choose_type = this.delivery_type;
      if (this.delivery_type === 'store') {
        this.store_pickup = true;
        this.choose_type = 'store';
        this.storeChecked = true;
      } else if (this.delivery_type === 'home') {
        this.home_delivery = true;
        this.choose_type = 'home';
        this.storeChecked = false;
      }
      this.sel_checkindate = this.chosenDateDetails.order_date;
      this.nextAvailableTime = this.chosenDateDetails.nextAvailableTime;
      if (this.chosenDateDetails.selected_coupons.length > 0) {
        this.selected_coupons = this.chosenDateDetails.selected_coupons;
        this.couponsList = this.chosenDateDetails.couponsList;
        this.couponvalid = true;
        this.action = '';
      }
    } else {
      this.storeChecked = true;
    }

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


    // this.shared_services.getConsumerCatalogs(accountId).subscribe(
    //   (catalogs: any) => {
    //     this.catalog_details = catalogs[0];
    //   });

  }
  getItemQty(item) {
    const qty = this.orderList.filter(i => i.item.itemId === item.item.itemId).length;
    if (qty === 0) {
      this.removeItemFromCart(item);
    }
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
  gets3curl() {
    this.api_loading1 = true;
    this.retval = this.sharedFunctionobj.getS3Url()
      .then(
        res => {
          this.s3url = res;
          this.getbusinessprofiledetails_json('coupon', true);
          this.api_loading1 = false;
        },
        () => {
          this.api_loading1 = false;
        }
      );
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
  applyPromocode() {
    this.action = 'coupons';
  }
  getbusinessprofiledetails_json(section, modDateReq: boolean) {
    let UTCstring = null;
    if (modDateReq) {
      UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
      .subscribe(res => {
        this.s3CouponsList = res;
        console.log(this.s3CouponsList);
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
  confirmOrder() {
    if (this.checkMinimumQuantityofItems()) {

      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      console.log(this.nextAvailableTime);

      const chosenDateTime = {
        delivery_type: this.choose_type,
        catlog_id: this.catalog_details.id,
        nextAvailableTime: this.nextAvailableTime,
        order_date: this.sel_checkindate,
        advance_amount: this.catalog_details.advance_amount,
        account_id: this.account_id,
        selected_coupons: this.selected_coupons,
        couponsList: this.couponsList


      };
      this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
      this.router.navigate(['order', 'shoppingcart', 'checkout']);
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
    if (this.action === 'changeTime' || this.action === 'coupons') {
      this.clearCouponErrors();
      this.action = '';
    } else {
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.location.back();
    }
  }
  goBackCart(selectedTimeslot, queue) {
    console.log(queue);
    console.log(selectedTimeslot);
    const selectqueue = queue['sTime'] + ' - ' + queue['eTime'];
    console.log(selectqueue);
    this.nextAvailableTime = selectqueue;
    // this.nextAvailableTime = selectedTimeslot;
    this.action = '';
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
  getOrderAvailableDatesForPickup() {
    const _this = this;

    _this.shared_services.getAvailableDatesForPickup(this.catalog_Id, this.account_id)
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

    _this.shared_services.getAvailableDatesForHome(this.catalog_Id, this.account_id)
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

  itemDetails(item) {
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        item: JSON.stringify(item)
      }
    };
    this.router.navigate(['order', 'item-details'], navigationExtras);
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
          if (Item.item.itemId === item.item.itemId) {
            Item['consumerNote'] = result;
          }
        });
        this.orders.map((Item, i) => {
          if (Item.item.itemId === item.item.itemId) {
            Item['consumerNote'] = result;
          }
        });
      }
      // console.log(this.orderList);
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
        // this.orders.map((Item, i) => {
        //   if (Item.item.itemId === item.item.itemId) {
        //     Item['consumerNote'] = Item.consumerNote.splice;
        //   }
        // });
        console.log(this.orderList);

      }
    });
  }
  sidebar() {
    this.showSide = !this.showSide;
  }
  getStoreContact() {
    this.shared_services.getStoreContact(this.account_id)
      .subscribe((data: any) => {
        this.storeContact = data;
      });
  }
  // resetDateTime() {
  //   this.action = '';
  //   this.fetchCatalog();
  // }

  closeNav() {
    this.showSide = false;
  }
  handleQueueSelection(queue, index) {
    console.log(queue);
    console.log(index);
    this.queue = queue;
    console.log(this.queue);
  }
}


