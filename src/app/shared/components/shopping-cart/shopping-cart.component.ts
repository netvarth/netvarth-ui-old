import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { SharedServices } from '../../services/shared-services';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']

})
export class ShoppingCartSharedComponent implements OnInit, OnDestroy {
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
  homeChecked = false;
  nextAvailableTime;
  availableDates: any = [];
  catalog_Id: any;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private location: Location,
    private shared_services: SharedServices,
    public sharedFunctionobj: SharedFunctions) {
    this.route.queryParams.subscribe(
      params => {
        this.account_id = params.account_id;
        console.log(this.account_id);
      });
  }

  ngOnInit() {
    console.log('cart shared');
    this.orderList = JSON.parse(localStorage.getItem('order'));
    this.orders = [...new Map(this.orderList.map(item => [item.item['itemId'], item])).values()];
    console.log(this.orders);
    this.catalog_details = this.shared_services.getOrderDetails();
    console.log(JSON.stringify(this.catalog_details));
    if (this.catalog_details) {
      this.catalog_Id = this.catalog_details.id;
      console.log(this.catalog_Id);
    }

    console.log(this.catalog_details);
    if (this.catalog_details.pickUp) {
      if (this.catalog_details.pickUp.orderPickUp) {
        this.store_pickup = true;
        this.choose_type = 'store';
        this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
        this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
      }
    }
    if (this.catalog_details.homeDelivery) {
      if (this.catalog_details.homeDelivery.homeDelivery) {
        this.home_delivery = true;

        if (!this.store_pickup) {
          this.choose_type = 'home';
          this.deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
          this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
          this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
        }
      }
    }
    console.log(this.store_pickup);
    console.log(this.home_delivery);
    console.log(this.sel_checkindate);
    console.log(this.nextAvailableTime);
    //
    // console.log(this.sel_checkindate);

    // this.hold_sel_checkindate = this.sel_checkindate;
    this.advance_amount = this.catalog_details.advanceAmount;
    this.showfuturediv = false;
    this.server_date = this.sharedFunctionobj.getitemfromLocalStorage('sysdate');
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
    console.log(this.todaydate);
    if (this.todaydate === this.sel_checkindate) {
      this.isFuturedate = false;
    } else {
      this.isFuturedate = true;
    }
    this.getOrderAvailableDatesForPickup();
    this.getOrderAvailableDatesForHome();
  }
  ngOnDestroy() {
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
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
    return item_price * qty;
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

  removeFromCart(itemObj) {
    const item = itemObj.item;
    console.log(this.orderList);
    for (const i in this.orderList) {
      if (this.orderList[i].item.itemId === item.itemId) {
        this.orderList.splice(i, 1);
        this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
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
    this.orders = [...new Map(this.orderList.map(Item => [item.Item['itemId'], Item])).values()];
    console.log(this.orders);

  }
  getSubTotal() {
    let subtotal = 0;
    let deliveryCharge = 0;
    if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
      deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
    }
    subtotal = subtotal + this.price + deliveryCharge;
    return subtotal;
  }
  cart() {
    console.log('cart');
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        delivery_type: this.choose_type,
        catlog_id: this.catalog_details.id,
        // selectedQsTime: this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'],
        // selectedQeTime: this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'],
        // order_date: this.sel_checkindate,
        // advance_amount: this.catalog_details.advance_amount,
        account_id: this.account_id

      }

    };
    // this.router.navigate(['consumer', 'order', 'checkout'] , navigationExtras);
    this.router.navigate(['order/checkout'], navigationExtras);

  }
  goBack() {
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
    this.location.back();
  }
  goBackCart() {
    this.action = '';
  }
  changeTime() {
    this.action = 'timeChange';
    console.log(this.choose_type);
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
  changeType() {
    if (this.choose_type === 'store') {
      this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
      this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
    } else {
      this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
      this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
    }
    console.log(this.nextAvailableTime);
    console.log(this.todaydate);
    console.log(this.sel_checkindate);
    if (this.todaydate === this.sel_checkindate) {
      this.isFuturedate = false;
    } else {
      this.isFuturedate = true;
    }
  }
  getOrderAvailableDatesForPickup() {
    console.log('pickup');
    const _this = this;
    console.log(this.catalog_Id);
    console.log(this.account_id);
    _this.shared_services.getAvailableDatesForPickup(this.catalog_Id, this.account_id)
      .subscribe((data: any) => {
        console.log(data);
        const availables = data.filter(obj => obj.isAvailable);
        const availDates = availables.map(function (a) { return a.date; });
        _this.availableDates = availDates.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
        console.log(availDates);
      });
  }
  getOrderAvailableDatesForHome() {
    console.log('home');
    const _this = this;
    console.log(this.catalog_Id);
    console.log(this.account_id);
    _this.shared_services.getAvailableDatesForHome(this.catalog_Id, this.account_id)
      .subscribe((data: any) => {
        console.log(data);
        const availables = data.filter(obj => obj.isAvailable);
        const availDates = availables.map(function (a) { return a.date; });
        _this.availableDates = availDates.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
        console.log(availDates);
      });
  }
  getAvailabilityByDate(date) {
    this.sel_checkindate = date;
    const cday = new Date(this.sel_checkindate);
    const currentday = (cday.getDay() + 1);
    console.log(currentday);
    if (this.choose_type === 'store') {
      console.log(this.catalog_details.pickUp.pickUpSchedule.repeatIntervals);
      for (let i = 0; i < this.catalog_details.pickUp.pickUpSchedule.repeatIntervals.length; i++) {
          const pday = Number(this.catalog_details.pickUp.pickUpSchedule.repeatIntervals[i]);
          if (currentday === pday) {
            console.log('future time available ');
          }
      }
    } else {
    for (let i = 0; i < this.catalog_details.homeDelivery.deliverySchedule.repeatIntervals.length; i++) {
      const pday = Number(this.catalog_details.pickUp.pickUpSchedule.repeatIntervals[i]);
      if (currentday === pday) {
        console.log('future time available');
      }
    }
   }
  }
}
