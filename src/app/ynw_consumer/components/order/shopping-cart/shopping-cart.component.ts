import { Component, OnInit } from '@angular/core';
import * as itemjson from '../../../../../assets/json/item.json';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  catlog: any;
  catalogItem: any;

  constructor() { }

  ngOnInit() {
    this.catlogArry();
  }
  catlogArry() {
    this.catlog = itemjson;
    this.catalogItem = this.catlog.default.catalogItem;
    console.log(this.catlog.default);
    console.log(this.catalogItem);

  }
}
