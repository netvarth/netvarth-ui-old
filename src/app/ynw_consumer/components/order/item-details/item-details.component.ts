import { Component, OnInit } from '@angular/core';
import * as itemdetails from '../../../../../assets/json/item-details.json';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  itemDetailsJSON: any;
  itemId: any;
  currentItem: any;
  orderList: any;
  constructor(   public sharedFunctionobj: SharedFunctions,
    private location: Location ,) { }

  ngOnInit() {
    this.orderList = JSON.parse(localStorage.getItem('order'));
    this.itemDetailsJSON = itemdetails;
    this.currentItem = this.itemDetailsJSON.default.item;


  }
  getItemQty() {
    const qty = this.orderList.filter(i => i.itemId === this.currentItem.itemId).length;
    return qty;
  }
  increment() {
    this.addToCart();
  }
  goBack() {
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
    this.location.back();
  }

  decrement() {
    this.removeFromCart();
  }
  addToCart() {
    this.orderList.push(this.currentItem);
    this.getItemQty();

  }
  removeFromCart() {
    console.log(this.orderList);
    for (const i in this.orderList) {
      if (this.orderList[i] === this.currentItem) {
        this.orderList.splice(i, 1);
        break;
      }
    }

    this.getItemQty();
  }

}
