import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  couponsList: any = [];
  adwordshowmore = false;
  constructor(private activaterouterobj: ActivatedRoute,
    private shared_service: SharedServices,
    private shared_functions: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     }
  ngOnInit() {
    this.couponsList = this.data.couponsList;
  }

  formatDateDisplay(dateStr) {
    return this.shared_functions.formatDateDisplay(dateStr);
  }

  toggle_adwordshowmore() {
    if (this.adwordshowmore) {
      this.adwordshowmore = false;
    } else {
      this.adwordshowmore = true;
    }
  }
}
