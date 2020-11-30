import { Component, OnInit } from '@angular/core';
import * as itemdetails from '../../../../../assets/json/item-details.json';

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
  constructor() { }

  ngOnInit() {
    this.orderList = JSON.parse(localStorage.getItem('order'));
    this.itemDetailsJSON = itemdetails;
    console.log(JSON.stringify(this.itemDetailsJSON));
    this.currentItem = this.itemDetailsJSON.default.item;

    console.log(this.currentItem);
    console.log(JSON.stringify(this.currentItem));

  }
  getItemQty() {
    const qty = this.orderList.filter(i => i.itemId === this.currentItem.itemId).length;
    return qty;
  }
  increment() {
    this.addToCart();
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
