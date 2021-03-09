import { Component, OnInit, Inject } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  couponsList: any = [];
  type;
  tempCouponList: any = [];
  providerCouponList: any[];
  ownCoupons: any;
  constructor(private shared_functions: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    console.log(this.data);
    this.tempCouponList = this.data.couponsList[0].JC;
    this.ownCoupons=this.data.couponsList[1].OWN;
    if (this.data.type) {
      this.type = this.data.type;
    }
    this.showCoupons();
  }
  showCoupons() {
    this.couponsList = [];
    this.providerCouponList=[];
    for (let index = 0; index < this.tempCouponList.length; index++) {
      if (this.type) {
        if (this.tempCouponList[index].firstCheckinOnly === true) {
          this.couponsList.push(this.tempCouponList[index]);
        }
      } else {
        if (this.tempCouponList[index].firstCheckinOnly === false) {
          this.couponsList.push(this.tempCouponList[index]);
        }
      }
    }
    for (let index = 0; index < this.ownCoupons.length; index++) {
      if (this.type) {
        if (this.ownCoupons[index].firstCheckinOnly === true) {
          this.providerCouponList.push(this.ownCoupons[index]);
        }
      } else {
        if (this.ownCoupons[index].firstCheckinOnly === false) {
          this.providerCouponList.push(this.ownCoupons[index]);
        }
      }
    }
    console.log(this.couponsList);
    console.log(this.providerCouponList);
  }

  formatDateDisplay(dateStr) {
    return this.shared_functions.formatDateDisplay(dateStr);
  }

  toggle_adwordshowmore(i) {
    if (this.couponsList[i].adwordshowmore) {
      this.couponsList[i].adwordshowmore = false;
    } else {
      this.couponsList[i].adwordshowmore = true;
    }
  }
  formatPrice(price) {
    return this.shared_functions.print_PricewithCurrency(price);
  }
}
