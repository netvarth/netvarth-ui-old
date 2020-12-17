import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
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
  home_delivery: boolean;
  store_pickup: boolean;
  nextAvailableTime: string;
  customer_email: any;
  customer_phoneNumber: any;
  selectedAddress: string;
  orderSummary: any[];
  taxAmount: any;
  orderAmount: any;
  catlog: any;
  catalogItem: any;
  addressDialogRef: any;
  orderList: any = [];
  price: number;
  orders: any[];
  delivery_type: any;
  catlog_id: any;
  selectedQsTime;
  selectedQeTime;
  order_date;
  customer_data: any = [];
  added_address: any = [];
  advance_amount: any;
  account_id: any;
  selectedRowIndex = -1;
  storeChecked = false;
  homeChecked = false;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;

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
  ddate;
  isfutureAvailableTime = false;
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    private shared_services: SharedServices,
    private _formBuilder: FormBuilder

  ) {
    this.catalog_details = this.shared_services.getOrderDetails();
    console.log(this.catalog_details);
    this.account_id = this.shared_services.getaccountId();
    this.chosenDateDetails = this.sharedFunctionobj.getitemfromLocalStorage('chosenDateTime');
    this.delivery_type = this.chosenDateDetails.delivery_type;
    this.choose_type = this.delivery_type;
    this.catlog_id = this.chosenDateDetails.catlog_id;
    this.advance_amount = this.chosenDateDetails.advance_amount;
    this.account_id = this.chosenDateDetails.account_id;

    this.catalog_Id = this.catalog_details.id;
    if (this.delivery_type === 'store') {
      this.store_pickup = true;
      this.storeChecked = true;

    } else if (this.delivery_type === 'home') {
      this.home_delivery = true;
      this.homeChecked = true;
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

    this.linear = false;
    this.orderList = JSON.parse(localStorage.getItem('order'));
    this.orders = [...new Map(this.orderList.map(item => [item.item['itemId'], item])).values()];
    this.businessDetails = this.sharedFunctionobj.getitemfromLocalStorage('order_sp');
    // this.catlogArry();
    const activeUser = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      this.customer_data = activeUser;
      this.customer_phoneNumber = this.customer_data.primaryPhoneNumber;
      console.log(this.customer_phoneNumber);
      this.getaddress();
    } else {
      this.doLogin('consumer');
    }

    // this.getaddress();
    this.loginForm = this._formBuilder.group({
      phone: [this.customer_phoneNumber, Validators.required]
    });
    this.storeContact = this._formBuilder.group({
      phone: [this.customer_phoneNumber, Validators.required],
      email: ['', Validators.required]
    });
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
    if (this.todaydate === this.sel_checkindate) {
      this.isFuturedate = false;
    } else {
      this.isFuturedate = true;
    }
    this.getOrderAvailableDatesForPickup();
    this.getOrderAvailableDatesForHome();
    this.getAvailabilityByDate(this.sel_checkindate);
  }
  ngOnDestroy() {
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
  }
  getItemPrice(item) {
    const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    return item.price * qty;
  }
  isLoggedIn() {
    const activeUser = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      this.loginForm.get('phone').setValue(activeUser.primaryPhoneNumber);
      // this.getaddress();
    }
    return true;
  }
  getTaxCharges() {
    let deliveryCharge = 0;
    if (this.choose_type === 'home' && this.catalog_details.homeDelivery.deliveryCharge) {
      deliveryCharge = this.catalog_details.homeDelivery.deliveryCharge;
    }
    return deliveryCharge;
  }
  getOrderFinalAmountToPay() {

    return this.price + this.getTaxCharges();
  }
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
          this.added_address = data;

        },
        error => {
          this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
        address: this.added_address
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
        edit_index: index

      }
    });
    this.addressDialogRef.afterClosed().subscribe(result => {
      this.getaddress();

    });

  }
  goBack() {
    if (this.action === 'changeTime') {
      this.action = '';
    } else {
      this.location.back();
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
    return this.price;
  }

  confirm() {

    if (this.delivery_type === 'homedelivery') {
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
          'sTime': this.selectedQsTime,
          'eTime': this.selectedQeTime
        },
        'orderItem': this.getOrderItems(),
        'orderDate': this.sel_checkindate,
        'phoneNumber': this.customer_phoneNumber,
        'email': this.customer_email
      };
      this.confirmOrder(post_Data);
    }
    if (this.delivery_type === 'store') {
      const contactNumber = this.storeContact.value.phone;
      const contact_email = this.storeContact.value.email;
      const post_Data = {
        'storePickup': true,
        'catalog': {
          'id': this.catalog_details.id
        },
        'orderFor': {
          'id': 0
        },
        'timeSlot': {
          'sTime': this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'],
          'eTime': this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime']
        },
        'orderItem': this.getOrderItems(),
        'orderDate': this.sel_checkindate,
        'phoneNumber': contactNumber,
        'email': contact_email

      };
      this.confirmOrder(post_Data);

    }

  }
  doLogin(origin?, passParam?) {
    // this.shared_functions.openSnackBar('You need to login to check in');
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
        this.isLoggedIn();
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
    this.shared_services.CreateConsumerOrder(this.account_id, post_Data)
      .subscribe(data => {
        localStorage.removeItem('order');
        const retData = data;
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

        if (this.catalog_details.advanceAmount) {
          this.router.navigate(['consumer', 'order', 'payment'], navigationExtras);
        } else {
          this.router.navigate(['consumer']);
        }
      },
        // error => {
        //     this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
        //     this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //     this.api_loading = false;
        // }
        error => {
          this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }

      );
  }
  goBackToCheckout() {
    this.action = '';

    const chosenDateTime = {
      delivery_type: this.choose_type,
      catlog_id: this.catalog_details.id,
      nextAvailableTime: this.nextAvailableTime,
      order_date: this.sel_checkindate,
      advance_amount: this.catalog_details.advance_amount,
      account_id: this.account_id

    };
    this.sharedFunctionobj.setitemonLocalStorage('chosenDateTime', chosenDateTime);
  }
  changeTime() {
    this.action = 'timeChange';
    console.log(this.choose_type);
  }
  getOrderItems() {
    this.orderSummary = [];
    this.orders.forEach(item => {
      const itemId = item.item.itemId;
      const qty = this.getItemQty(item);
      this.orderSummary.push({ 'id': itemId, 'quantity': qty });
    });
    return this.orderSummary;
  }
  highlight(index, address) {
    this.selectedRowIndex = index;
    this.customer_phoneNumber = address.phoneNumber;
    this.customer_email = address.email;
    this.selectedAddress = address.firstName + ' ' + address.lastName + '</br>' + address.address + '</br>' + address.city + ',' + address.phoneNumber + '</br>' + address.email;
    console.log(this.selectedAddress);
  }
  // handleFuturetoggle() {
  //   this.showfuturediv = !this.showfuturediv;
  // }
  changeType(event) {

    this.choose_type = event.value;
    if (this.choose_type === 'store') {
      this.storeChecked = true;
      this.homeChecked = false;
      this.delivery_type = 'store';
      this.store_pickup = true;
      this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
      this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
      this.getAvailabilityByDate(this.sel_checkindate);
    } else {
      this.storeChecked = false;
      this.homeChecked = true;
      this.delivery_type = 'homedelivery';
      this.home_delivery = true;
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
    console.log(this.catalog_Id);
    console.log(this.account_id);
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
    console.log(this.catalog_Id);
    console.log(this.account_id);
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
  getAvailabilityByDate(date) {
    console.log(date);
    console.log(this.choose_type);
    this.sel_checkindate = date;
    const cday = new Date(this.sel_checkindate);
    const currentday = (cday.getDay() + 1);
    console.log(currentday);
    if (this.choose_type === 'store') {
      const storeIntervals = (this.catalog_details.pickUp.pickUpSchedule.repeatIntervals).map(Number);
      console.log(storeIntervals);
      console.log(JSON.stringify(storeIntervals));
      if (storeIntervals.includes(currentday)) {
        this.isfutureAvailableTime = true;
        this.futureAvailableTime = this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['eTime'];
      } else {
        this.isfutureAvailableTime = false;
      }

    } else {
      const homeIntervals = (this.catalog_details.homeDelivery.deliverySchedule.repeatIntervals).map(Number);
      console.log(homeIntervals);
      console.log(JSON.stringify(homeIntervals));
      if (homeIntervals.includes(currentday)) {
        this.isfutureAvailableTime = true;
        this.futureAvailableTime = this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.pickUp.pickUpSchedule.timeSlots[0]['eTime'];
      } else {
        this.isfutureAvailableTime = false;
      }
    }
  }
}
