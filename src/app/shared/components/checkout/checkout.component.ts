import { Component, OnInit, OnDestroy } from '@angular/core';
// import * as itemjson from '../../assets/json/item.json';
import * as itemjson from '../../../../assets/json/item.json';
import { SharedFunctions } from '../../functions/shared-functions';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
//  import { ConsumerServices } from '../../../ynw_consumer/services/consumer-services.service';
import { AddAddressComponent } from './add-address/add-address.component';
import { SharedServices } from '../../services/shared-services';
// import { OrderService } from '../../../ynw_consumer/components/order/order.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutSharedComponent implements OnInit, OnDestroy {
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

  linear: boolean;
  catalog_details: any;
  trackUuid;
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    private shared_services: SharedServices,
    //  private consumer_services: ConsumerServices,
    // private orderService: OrderService
  ) {
    this.catalog_details = this.shared_services.getOrderDetails();
    this.account_id = this.shared_services.getaccountId();
    this.route.queryParams.subscribe(
      params => {
        console.log(params);
        console.log(JSON.stringify(params));
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

        // this.pid = params.pid;
        // this.members = params.members;
        // this.prepayment = params.prepayment;
      });
  }

  ngOnInit() {
    console.log('checkout shared');
    this.linear = false;
    this.orderList = JSON.parse(localStorage.getItem('order'));
    this.orders = [...new Map(this.orderList.map(item => [item['itemId'], item])).values()];
    console.log(this.orders);
    this.catlogArry();
    const activeUser = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      this.customer_data = activeUser;
    }
    console.log(this.customer_data);
    this.getaddress();
  }
  ngOnDestroy() {
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
  }
  getItemPrice(item) {
    const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    return item.price * qty;
  }
  getTaxCharges() {
    // const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    this.taxAmount = 100;
    return this.taxAmount;
  }
  getOrderFinalAmountToPay() {

    return parseInt(this.orderAmount, 0) + parseInt(this.getTaxCharges(), 0);
  }
  getItemQty(item) {
    const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    return qty;
  }
  catlogArry() {
    this.catlog = itemjson;
    this.catalogItem = this.catlog.default.catalogItem;
    console.log(this.catlog.default);
    console.log(this.catalogItem);
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
      // width: '800px;',
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
      // width: '800px;',
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
  // getTotalItemPrice() {
  //  let total = 0;
  //   for (const item of this.orders) {
  //    total = total + parseInt(item.promotionalPrice, 0) * parseInt(this.getItemQty(item), 0 );

  //   }
  //   this.orderAmount = total;
  //   return total;

  // }
  getTotalItemPrice() {
      this.price = 0;
    for (const item of this.orderList) {
      this.price = this.price + item.price;
    }
    this.orderAmount = this.price;
    console.log(this.orderAmount);
      return this.orderAmount;
  }
  confirm() {
    console.log(this.getOrderItems());

    console.log(this.delivery_type);


    if (this.delivery_type === 'homedelivery') {
      console.log(this.delivery_type);
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
        'orderDate': '2020-12-10',
        'phoneNumber': this.customer_phoneNumber,
        'email': this.customer_email
      };
      console.log(post_Data);
    }
    if (this.delivery_type === 'store') {
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
        'orderDate': '2020-12-10',
        'phoneNumber': '6303603789',
        'email': 'shiva.kumar@gmai.com'

      };
      console.log(post_Data);
      this.confirmOrder(post_Data);
      // ;
      // this.shared_services.CreateConsumerOrder(this.account_id, post_Data)
      //   .subscribe(
      //     data => {
      //       this.sharedFunctionobj.openSnackBar('Order placed successfully');
      //     },
      //     error => {
      //       this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      //     }
      //   );
      // this.router.navigate(['consumer', 'order', 'payment'] );
    }
  }
  confirmOrder(post_Data) {
    // this.api_loading = true;
    this.shared_services.CreateConsumerOrder(this.account_id, post_Data)
        .subscribe(data => {
            const retData = data;
            let retUUID;
            let prepayAmount;
            let uuidList = [];
            Object.keys(retData).forEach(key => {
                if (key === '_prepaymentAmount') {
                    prepayAmount = retData['_prepaymentAmount'];
                } else {
                    retUUID = retData[key];
                    this.trackUuid = retData[key];
                    uuidList.push(retData[key]);
                    console.log(retUUID);
                }
            });
            // if (this.selectedMessage.files.length > 0) {
            //     this.consumerNoteAndFileSave(retUUID);
            // }
            // this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'users', this.userId, 'bprofile', 'media']);
            // const member = [];
            // for (const memb of this.waitlist_for) {
            //     member.push(memb.firstName + ' ' + memb.lastName);
            // }
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    account_id: this.account_id,
                    type_check: 'checkin_prepayment',
                    prepayment: prepayAmount,
                    uuid: this.trackUuid
                }
            };
          console.log(this.catalog_details.advanceAmount);
            if (this.catalog_details.advanceAmount) {
              console.log('hi');
              // this.router.navigate(['consumer', 'checkin', 'payment', this.trackUuid], navigationExtras);

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
      const itemId = item.itemId;
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

}
