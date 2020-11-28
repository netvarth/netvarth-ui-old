import { Component, OnInit } from '@angular/core';
import * as itemjson from '../../../../../assets/json/item.json';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  catlog: any;
  catalogItem: any;

  constructor(
    public sharedFunctionobj: SharedFunctions,
    private location: Location ) { }

  ngOnInit() {
    this.catlogArry();
  }
  catlogArry() {
    this.catlog = itemjson;
    this.catalogItem = this.catlog.default.catalogItem;
    console.log(this.catlog.default);
    console.log(this.catalogItem);
  }
  goBack() {
    this.location.back();
  }
}
