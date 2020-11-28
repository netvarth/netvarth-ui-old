import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']

})
export class ShoppingCartComponent implements OnInit {
  order_count: number;
  price: number;
  orders: any[];
  orderList: any = [];
  catlog: any;
  catalogItem: any;

  constructor(
    public router: Router,
    public sharedFunctionobj: SharedFunctions) { }

  ngOnInit() {
console.log('inisde');
   this.orderList = JSON.parse(localStorage.getItem('order'));
   console.log(this.orderList);
   this.orders =[...new Map(this.orderList.map(item => [item['itemId'], item])).values()];
   console.log(this.orders);
  }
  getItemQty(item) {
    return this.orderList.filter(i => i.itemId === item.itemId).length;
  }
  getItemPrice(item) {
    const qty = this.orderList.filter(i => i.itemId === item.itemId).length;
    return  item.price * qty;
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
    this.router.navigate(['consumer', 'order', 'checkout']);
  }
}
