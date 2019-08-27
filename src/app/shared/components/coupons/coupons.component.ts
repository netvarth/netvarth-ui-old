import { Component, OnInit, Inject } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  couponsList: any = [];
  type;
  tempCouponList: any = [];
  constructor(private shared_functions: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit() {
    this.tempCouponList = this.data.couponsList;
    if (this.data.type) {
      this.type = this.data.type;
    }
    this.showCoupons();
  }
  showCoupons() {
    this.couponsList = [];
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
}
