import { Component, OnInit, OnDestroy } from '@angular/core';
import * as itemjson from '../../../../../assets/json/item.json';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressComponent } from './add-address/add-address.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  catlog: any;
  catalogItem: any;
  addressdialogRef: any;
  orderList: any = [];
  price: number;
  orders: any[];
  delivery_type: any;
  catlog_id: any;
  selectedQsTime;
  selectedQeTime;
  order_date;
  customer_data: any = [];
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog) { 
      this.route.queryParams.subscribe(
        params => {
            this.delivery_type = params.delivery_type;
            console.log(this.delivery_type);
            if( this.delivery_type === 'home') {
              console.log(this.delivery_type);
            }
            if ( this.delivery_type === 'store') {
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

            // this.pid = params.pid;
            // this.members = params.members;
            // this.prepayment = params.prepayment;
        });
    }

  ngOnInit() {
    this.orderList = JSON.parse(localStorage.getItem('order'));
    this.orders = [...new Map(this.orderList.map(item => [item['itemId'], item])).values()];
    this.catlogArry();
    const activeUser = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
        this.customer_data = activeUser;
    }
    console.log(this.customer_data);
  }
  ngOnDestroy() {
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
  }
  getItemPrice(item) {
    const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    return item.price * qty;
  }
  getItemCharges(item) {
    // const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    return item.promotionalPrice;
  }
  getItemPay(item) {
    const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    return item.price * qty + item.promotionalPrice;
  }
  catlogArry() {
    this.catlog = itemjson;
    this.catalogItem = this.catlog.default.catalogItem;
    console.log(this.catlog.default);
    console.log(this.catalogItem);
  }
  AddAddress() {
    this.addressdialogRef = this.dialog.open(AddAddressComponent, {
      width: '50%',
      // width: '800px;',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'Add'
        // type: 'edit',

      }
    });
    // this.addressdialogRef.afterClosed().subscribe(result => {
    // });
  }
  updateAddress() {
    this.addressdialogRef = this.dialog.open(AddAddressComponent, {
      width: '50%',
      // width: '800px;',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
         type: 'edit',

      }
    });

  }
  goBack() {
    this.location.back();
  }
  confirm() {

    if( this.delivery_type === 'home') {
      console.log(this.delivery_type);
      const post_Data = {
        "homeDelivery": true,
        "homeDeliveryAddress": "madathiparambil house po kozhukully tcr",
        'catalog': {
          'id': this.catlog_id
        },
        'orderFor': {
          'id': 0
        },
        'timeSlot': {
          'sTime': this.selectedQsTime,
          'eTime': this.selectedQeTime
        },
        'orderItem': [{
          'id': 1,
          'quantity': 2
        },
        {
          'id': 2,
          'quantity': 1
        }
        ],
        'orderDate': "2020-11-26",
        'phoneNumber': "8129630960",
        'email': "aneesh.mg@jaldee.com"
      };
      console.log(post_Data);
    }
    if ( this.delivery_type === 'store') {
    const post_Data = {
      'storePickup': true,
      'catalog': {
        'id': this.catlog_id
      },
      'orderFor': {
        'id': 0
      },
      'timeSlot': {
        'sTime': this.selectedQsTime,
        'eTime': this.selectedQeTime
      },
      'orderItem': [{
        'id': 1,
        'quantity': 2
      },
      {
        'id': 2,
        'quantity': 1
      }
      ],
      'orderDate': "2020-11-26",
      'phoneNumber': "8129630960",
      'email': "aneesh.mg@jaldee.com"

    };
    console.log(post_Data);
  }
  }


  }
