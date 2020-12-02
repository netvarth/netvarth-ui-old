import { Component, OnInit,OnDestroy } from '@angular/core';
import * as itemjson from '../../../../../assets/json/item.json';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressComponent } from './add-address/add-address.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit,OnDestroy {
  catlog: any;
  catalogItem: any;
  addressdialogRef: any;
  orderList: any = [];
  price: number;
  orders: any[];
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private location: Location ,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.orderList = JSON.parse(localStorage.getItem('order'));
    this.orders = [...new Map(this.orderList.map(item => [item['itemId'], item])).values()];
    this.catlogArry();
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

  }
  goBack() {
    this.location.back();
  }
}
