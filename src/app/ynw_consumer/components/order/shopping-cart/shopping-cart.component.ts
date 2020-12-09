import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';
import { projectConstants } from '../../../../app.component';
import * as moment from 'moment';
import { SharedServices } from '../../../../shared/services/shared-services';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']

})
export class ShoppingCartComponent implements OnInit,OnDestroy {
  home_delivery = false;
  store_pickup = false;
  order_count: number;
  price: number;
  orders: any[];
  orderList: any = [];
  catlog: any;
  catalogItem: any;
  action: any = '';
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
  advance_amount: any;
  catalog_details: any;
  // choose_type: any;
  choose_type = 'store';



  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private location: Location,
    public sharedFunctionobj: SharedFunctions,
    private shared_services: SharedServices) {
      this.catalog_details = this.shared_services.getOrderDetails();
      console.log(JSON.stringify(this.catalog_details));
      // if(this.catalog_details.homeDelivery.homeDelivery){
      //   this.home_delivery = true;
      // }
      // if(this.catalog_details.pickUp.orderPickUp){
      //  this.store_pickup = true;
      // }
      this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
      console.log(this.sel_checkindate);
    }


  ngOnInit() {
    this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
    console.log(this.sel_checkindate);
    this.orderList = JSON.parse(localStorage.getItem('order'));
    this.orders = [...new Map(this.orderList.map(item => [item['itemId'], item])).values()];
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

  }
  ngOnDestroy() {
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
  }
  getItemQty(item) {
    const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    if (qty === 0) {
      this.removeItemFromCart(item);
    }
    return qty;
  }
  getItemPrice(item) {
    const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    return item.price * qty;
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
  removeFromCart(Item) {
    console.log(this.orderList);
    for (const i in this.orderList) {
      if (this.orderList[i] === Item) {
        this.orderList.splice(i, 1);
        break;
      }
    }
    this.getTotalItemAndPrice();
    this.getItemQty(Item);
  }
  getTotalItemAndPrice() {
    this.price = 0;
    this.order_count = 0;
    for (const item of this.orderList) {
      this.price = this.price + item.price;
      this.order_count = this.order_count + 1;
    }
  }
  removeItemFromCart(item) {
    this.orderList = this.orderList.filter(Item => Item.itemId !== item.itemId);
    this.orders = [...new Map(this.orderList.map(Item => [Item['itemId'], Item])).values()];
    console.log(this.orders);

  }
  cart() {
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        delivery_type: this.choose_type ,
        order_date: this.sel_checkindate
      }

  };
  console.log(navigationExtras);
    this.router.navigate(['consumer', 'order', 'checkout'] , navigationExtras);

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
    console.log(this.sel_checkindate);
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
    // this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
  }
  handleFuturetoggle() {
    this.showfuturediv = !this.showfuturediv;
  }
  }
