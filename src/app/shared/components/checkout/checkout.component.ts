import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
// import * as itemjson from '../../assets/json/item.json';
import * as itemjson from '../../../../assets/json/item.json';
import { SharedFunctions } from '../../functions/shared-functions';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
//  import { ConsumerServices } from '../../../ynw_consumer/services/consumer-services.service';
import { AddAddressComponent } from './add-address/add-address.component';
import { SharedServices } from '../../services/shared-services';
import { projectConstants } from '../../../app.component';
import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutSharedComponent implements OnInit, OnDestroy {
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
  choose_type;
  selectedRowIndex = -1;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;

  linear: boolean;
  catalog_details: any;
  trackUuid;
  screenWidth: number;
  no_of_grids: number;
  isLinear = true;
  loginForm: FormGroup;
  storeContact: FormGroup;
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
    this.account_id = this.shared_services.getaccountId();
    this.route.queryParams.subscribe(
      params => {
        this.delivery_type = params.delivery_type;
        if (this.delivery_type === 'home') {
        }
        if (this.delivery_type === 'store') {
        }
        this.catlog_id = params.catlog_id;
        this.selectedQsTime = params.selectedQsTime;
        this.selectedQeTime = params.selectedQeTime;
        this.order_date = params.order_date;
        this.advance_amount = params.advance_amount;
        this.account_id = params.account_id;
      });
    this.catalog_details = this.shared_services.getOrderDetails();
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
          this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
          this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
        }
      }
    }
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
    this.catlogArry();
    const activeUser = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      this.customer_data = activeUser;
      this.customer_phoneNumber = this.customer_data.primaryPhoneNumber;
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
  catlogArry() {
    this.catlog = itemjson;
    this.catalogItem = this.catlog.default.catalogItem;
  }
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
    this.location.back();
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
  changeTime() {
    console.log('chnage time');
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
  handleFuturetoggle() {
    this.showfuturediv = !this.showfuturediv;
  }
  changeType() {
    if (this.choose_type === 'store') {
      this.delivery_type = 'store';
      this.sel_checkindate = this.catalog_details.nextAvailablePickUpDetails.availableDate;
      this.nextAvailableTime = this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
    } else {
      this.delivery_type = 'homedelivery';
      this.sel_checkindate = this.catalog_details.nextAvailableDeliveryDetails.availableDate;
      this.nextAvailableTime = this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.catalog_details.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
    }
    if (this.todaydate === this.sel_checkindate) {
      this.isFuturedate = false;
    } else {
      this.isFuturedate = true;
    }
  }

}
