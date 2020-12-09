import { Component, OnInit, OnDestroy } from '@angular/core';
import * as itemjson from '../../../../../assets/json/item.json';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressComponent } from './add-address/add-address.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerServices } from '../../../services/consumer-services.service';
import { OrderService } from '../order.service';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  orderSummary: any[];
  taxAmount: any;
  orderAmount: number;
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

  linear: boolean;
  catalog_details: any;
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog,

    private consumer_services: ConsumerServices,
    private orderService: OrderService) {
    this.catalog_details = this.orderService.getOrderDetails();
    this.account_id = this.orderService.getaccountId();
    console.log(this.account_id);
    console.log(this.catalog_details);
    this.route.queryParams.subscribe(
      params => {
        this.delivery_type = params.delivery_type;
        console.log(this.delivery_type);
        if (this.delivery_type === 'home') {
          console.log(this.delivery_type);
        }
        if (this.delivery_type === 'store') {
          console.log(this.delivery_type);
        }
        this.catlog_id = params.catlog_id;
        console.log(this.catlog_id);
        this.selectedQsTime = params.selectedQsTime;
        console.log(this.selectedQsTime);
        this.selectedQeTime = params.selectedQeTime;
        console.log(this.selectedQeTime);
        this.order_date = params.order_date;
        console.log(this.order_date);

        this.advance_amount = params.advance_amount;
        console.log(this.advance_amount);
        // this.account_id = params.account_id;
        // console.log(this.account_id);

        // this.pid = params.pid;
        // this.members = params.members;
        // this.prepayment = params.prepayment;
      });
  }

  ngOnInit() {
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

    return this.orderAmount + this.taxAmount;
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
    this.consumer_services.getConsumeraddress()
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
  getTotalItemPrice() {
    this.orderAmount = 0;
    for (const item of this.orders) {
      this.orderAmount = this.orderAmount + item.promotionalPrice * this.getItemQty(item);

    }
    console.log(this.orderAmount);
    return this.orderAmount;
  }
  confirm() {
    console.log(this.getOrderItems());

    console.log(this.delivery_type);


    if (this.delivery_type === 'home') {
      console.log(this.delivery_type);
      const post_Data = {
        'homeDelivery': true,
        'homeDeliveryAddress': 'madathiparambil house po kozhukully tcr',
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
        'orderItem': [{
          'id': 805,
          'quantity': 2
        },
        {
          'id': 2,
          'quantity': 1
        }
        ],
        'orderDate': '2020-11-26',
        'phoneNumber': '8129630960',
        'email': 'aneesh.mg@jaldee.com'
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
        'orderItem': [{
          'id': 805,
          'quantity': 2
        }
        ],
        'orderDate': '2020-12-09',
        'phoneNumber': '6303603789',
        'email': 'shiva.kumar@gmai.com'

      };
      console.log(post_Data);
      this.consumer_services.CreateConsumerOrder(this.account_id, post_Data)
        .subscribe(
          data => {
            const history: any = data;
            console.log(history);
          },
          error => {
            this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
      // this.router.navigate(['consumer', 'order', 'payment'] );




    }
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
}
