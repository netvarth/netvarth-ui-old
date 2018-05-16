import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';
import {Observable} from 'rxjs/Observable';
import {startWith, map} from 'rxjs/operators';

import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';

export interface ItemServiceGroup {
  type: string;
  values: string[];
}

@Component({
  selector: 'app-provider-waitlist-checkin-bill',
  templateUrl: './add-provider-waitlist-checkin-bill.component.html'
})

export class AddProviderWaitlistCheckInBillComponent implements OnInit {


  @ViewChild('itemservicesearch') item_service_search;

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  checkin = null;
  bill_data = null;
  message = '';
  source = 'add';
  today = new Date();
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  timeFormat = 'h:mm a';
  itemServiceSearch: FormControl = new FormControl();
  services: any = [];
  coupons: any = [];
  discounts: any = [];
  items: any = [];
  ItemServiceGroupOptions: Observable<ItemServiceGroup[]>;
  itemServicesGroup: ItemServiceGroup[] = [{
    'type' : 'Services',
    'values' : []
    },
    {
      'type' : 'Items',
      'values' : []
    }] ;

  selectedItems = [];
  cart = {
    'items': [],
    'prepayment_amount' : 0,
    'sub_total': 0,
    'discount': null,
    'coupon': null,
    'total': 0
  };
  bill_load_complete = 0;

  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistCheckInBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
        this.checkin = this.data.checkin || null;
        console.log(this.checkin);
        if ( !this.checkin) {
          setTimeout(() => {
            this.dialogRef.close('error');
            }, projectConstants.TIMEOUT_DELAY);
        }

        this.getWaitlistBill();
        this.getPrePaymentDetails();
        this.getCoupons();
        this.getDiscounts();
        this.getServiceList();
        this.getItemsList();

     }

  ngOnInit() {
     this.ItemServiceGroupOptions = this.itemServiceSearch.valueChanges
     .pipe(
       startWith(''),
       map(val => this.filterGroup(val))
     );

  }

  filterGroup(val: string): ItemServiceGroup[] {
    if (val) {
      return this.itemServicesGroup
        .map(group => ({ type: group.type, values: this._filter(group.values, val) }))
        .filter(group => group.values.length > 0);
    }

    return this.itemServicesGroup;
  }

  private _filter(opt: string[], val: string) {
    const filterValue = val.toLowerCase();
    return opt.filter(item => item.toLowerCase().startsWith(filterValue));
  }



  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }

  getWaitlistBill() {
    this.provider_services.getWaitlistBill(this.checkin.ynwUuid)
    .subscribe(
      data => {
        this.bill_data = data;
      },
      error => {
        if (error.status === '422') { this.bill_data = null; }
      },
      () => {
        this.bill_load_complete = 1;
      }
    );
  }

  getServiceList() {
    this.provider_services.getServicesList()
    .subscribe(
      data => {
        this.services = data;
        const services = this.services.map((ob) => ob.name );

        this.itemServicesGroup[0]['values'] = services;
      },
      error => {

      }
    );
  }

  getCoupons() {
    this.provider_services.getProviderCoupons()
    .subscribe(
      data => {
        this.coupons = data;
      },
      error => {

      }
    );
  }

  getDiscounts() {
    this.provider_services.getProviderDiscounts()
    .subscribe(
      data => {
        this.discounts = data;
      },
      error => {

      }
    );
  }

  getItemsList() {
    this.provider_services.getProviderItems()
    .subscribe(
      data => {
        this.items = data;
        const items = this.items.map((ob) => ob.displayName );
        console.log(items);
        this.itemServicesGroup[1]['values'] = items;
      },
      error => {

      }
    );
  }

  itemServiceSelected(type, index) {

    this.itemServiceSearch.reset();
    this.item_service_search.nativeElement.blur();

    if (type === 'Services') {
      this.addCartItem(this.services[index], 'Services');
    } else if (type === 'Items') {
      this.addCartItem(this.items[index], 'Items');
    }

  }

  addCartItem(item, type) {
    console.log(item);
    let selected_item = {
    };

    switch (type) {
      case 'Services' :  selected_item = {
                                'name' : item.name,
                                'itemId': item.id,
                                'quantity': 1,
                                'price': item.totalAmount,
                                'subtotal': item.totalAmount,
                                'discount': null,
                                'coupon': null,
                                'type' : type
                              };
                              break;

      case 'Items' :  selected_item = {
                                'name' : item.displayName,
                                'itemId': item.itemId,
                                'quantity': 1,
                                'price': item.price,
                                'subtotal': item.price,
                                'discount': null,
                                'coupon': null,
                                'type' : type
                              };
                              break;
    }

    this.cart.items.push(selected_item);
    this.selectedItems.push(item);
    this.calculateTotal();
  }

  deleteCartItem(i) {
    this.cart.items.splice(i, 1);
    this.selectedItems.splice(i, 1);
    this.calculateTotal();
  }

  itemDiscountChange(i) {
    this.calculateItemTotal(i);
  }

  itemCouponChange(i) {
    this.calculateItemTotal(i);
  }

  quantityChange(i) {

    if (!this.cart['items'][i]['quantity'] ||
    this.cart['items'][i]['quantity'] < 0) {
      this.cart['items'][i]['quantity'] = 1;
    }

    this.calculateItemTotal(i);

  }

  calculateItemTotal(i) {
    this.cart['items'][i]['subtotal'] = this.cart['items'][i]['price'] * this.cart['items'][i]['quantity'];
    this.reduceItemDiscount(i);
    this.reduceItemCoupon(i);
    this.calculateTotal();
  }

  reduceItemDiscount(i) {

    if (this.cart['items'][i].discount !== null && this.discounts[this.cart['items'][i].discount]) {
      const discount = this.discounts[this.cart['items'][i].discount];
      this.cart['items'][i].subtotal = this.discCalculation(discount, this.cart['items'][i].subtotal);
    }

  }

  reduceItemCoupon(i) {

    if (this.cart['items'][i].coupon !== null &&
    this.coupons[this.cart['items'][i].coupon]) {
      const discount = this.coupons[this.cart['items'][i].coupon];
      discount.discValue = discount.amount;
      // coupon dont have discValue field
      // but we need it because discount n coupon used same function
      this.cart['items'][i].subtotal = this.discCalculation(discount, this.cart['items'][i].subtotal);
    }

  }

  discountChange() {
    this.calculateTotal();
  }
  couponChange() {
    this.calculateTotal();
  }

  calculateTotal() {
    let total = 0;
    for ( const item of this.cart.items) {

      if (item.subtotal && item.subtotal > 0) {
        total = total + item.subtotal;
      }

    }

    this.cart.sub_total = (total < 0 ) ? 0 : total;
    this.cart.total = total;
    this.reduceDiscount();
    this.reduceCoupon();

  }

  reduceDiscount() {

    if (this.cart.discount !== null && this.discounts[this.cart.discount]) {
      const discount = this.discounts[this.cart.discount];
      this.cart.total = this.discCalculation(discount, this.cart.sub_total);
    }

  }

  reduceCoupon() {

    if (this.cart.coupon !== null && this.coupons[this.cart.coupon]) {
      const discount = this.coupons[this.cart.coupon];
      discount.discValue = discount.amount;
      // coupon dont have discValue field
      // but we need it because discount n coupon used same function
      this.cart.total = this.discCalculation(discount, this.cart.total);
    }

  }

  discCalculation(discount, cal_total) {

    if (discount.calculationType === 'Fixed') {
      const disc_value = (discount.discValue > 0) ? discount.discValue : 0;
      const total = cal_total - disc_value;
      return (total > 0) ? total : 0;

    } else if (discount.calculationType === 'Percentage') {
      const disc_value = (discount.discValue > 0) ? discount.discValue : 0;
      const total = cal_total - ( cal_total * disc_value / 100);
      return (total > 0) ? total : 0;
    }
  }

  submitBill() {

    const item_array = [];
    const service_array = [];
    console.log(this.cart.items);
    for ( const item of  this.cart.items) {
      const ob = {
        'reason': '',
        'price': item.subtotal,
        'quantity': item.quantity,
      };
      console.log(ob);
      if (item.coupon != null) {
        ob['couponId'] = this.coupons[item.coupon]['id'];
      }

      if (item.discount != null) {
        ob['discountId'] = this.discounts[item.discount]['id'];
      }

      if (item.type === 'Items') {
        ob['itemId'] =  item.itemId;
        item_array.push(ob);
      } else if (item.type === 'Services') {
        ob['serviceId'] =  item.itemId;
        service_array.push(ob);
      }
    }


    const post_data = {
      'uuid' : this.checkin.ynwUuid,
      'netTotal': this.cart.total,
      'service': service_array,
      'items': item_array
    } ;

    // if (service_array.length > 0) {
    //   post_data['service'] = service_array;
    // }

    // if (item_array.length > 0) {
    //   post_data['items'] = item_array;
    // }

    if (this.cart.coupon != null) {
      post_data['couponId'] = this.coupons[this.cart.coupon]['id'];
    }

    if (this.cart.discount != null) {
      post_data['discountId'] = this.discounts[this.cart.discount]['id'];
    }

    if (this.bill_data == null) {
      this.provider_services.createWaitlistBill(post_data)
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
    } else {
      this.provider_services.updateWaitlistBill(post_data)
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
    }
  }

  getPrePaymentDetails() {
    this.provider_services.getPaymentDetail(this.checkin.ynwUuid)
    .subscribe(
      data => {
        console.log(data);
      },
      error => {

      }
    );
  }

}


