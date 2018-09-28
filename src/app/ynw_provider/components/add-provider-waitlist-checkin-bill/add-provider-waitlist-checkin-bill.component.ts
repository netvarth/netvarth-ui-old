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
  bill_data: any = [];
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
  totdisc_val = 0;
  totcoup_val = 0;
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
    'discount': '',
    'coupon': '',
    'total': 0
  };
  bill_load_complete = 0;
  item_service_tax: any = 0;
  pre_payment_log: any = [];

  customer_label = '';
  billdate = '';
  billtime = '';

  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistCheckInBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
        this.checkin = this.data.checkin || null;
        this.bill_data = this.data.bill_data || [];
        // console.log(this.checkin);
        if ( !this.checkin) {
          setTimeout(() => {
            this.dialogRef.close('error');
            }, projectConstants.TIMEOUT_DELAY);
        }
        this.getBillDateandTime();

        // this.getWaitlistBill();

        this.getPrePaymentDetails()
        .then(
          (result) => {

            this.getCoupons()
            .then(
              () => {

                this.getDiscounts()
                .then(
                  () => {

                    this.getTaxDetails()
                    .then(
                      () => {
                          this.getDomainSubdomainSettings()
                          .then(
                            () => {
                              this.getServiceList();
                            },
                            error => {
                            }

                          );

                          this.getItemsList();

                          this.bill_load_complete = 1;
                      },
                      (error) => {
                        this.bill_load_complete = 0;
                      });

                  },
                  (error) => {
                    this.bill_load_complete = 0;
                  });

                },
                (error) => {
                  this.bill_load_complete = 0;
                });
          },
          (error) => {
            this.bill_load_complete = 0;
          }
        );

        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');

     }

  ngOnInit() {
     this.ItemServiceGroupOptions = this.itemServiceSearch.valueChanges
     .pipe(
       startWith(''),
       map(val => this.filterGroup(val))
     );

  }
  getBillDateandTime() {
    if (this.bill_data.hasOwnProperty('createdDate')) {
      const datearr = this.bill_data.createdDate.split(' ');
      const billdatearr = datearr[0].split('-');
      this.billdate =  billdatearr[2] + '/' + billdatearr[1] + '/' + billdatearr[0];
      this.billtime = datearr[1] + ' ' + datearr[2];
    } else {
      this.billdate =  this.sharedfunctionObj.addZero(this.today.getDate()) + '/' + this.sharedfunctionObj.addZero((this.today.getMonth() + 1)) + '/' + this.today.getFullYear();
      // this.billtime = this.sharedfunctionObj.addZero(this.today.getHours()) + ':' + this.sharedfunctionObj.addZero(this.today.getMinutes());
      const gethrs = this.today.getHours();
      const amOrPm = (gethrs < 12) ? 'AM' : 'PM';
     // const hour = (gethrs < 12) ? gethrs : gethrs - 12;
     let hour = 0;
     if (gethrs === 12) {
       hour = 12;
     } else if (gethrs > 12) {
       hour = gethrs - 12;
     } else {
       hour = gethrs;
     }
      this.billtime = this.sharedfunctionObj.addZero(hour) + ':' + this.sharedfunctionObj.addZero(this.today.getMinutes()) + ' ' + amOrPm;
      // const amOrPm = (this.today.getHours() < 12) ? 'AM' : 'PM';
      // const hour = (this.today.getHours() < 12) ? this.today.getHours() : this.today.getHours() - 12;
      // this.billtime = this.sharedfunctionObj.addZero(hour) + ':' + this.sharedfunctionObj.addZero(this.today.getMinutes()) + ' ' + amOrPm;

    }
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
        if (error.status === 422) { this.bill_data = [];
        console.log('reached here'); }
        this.bill_load_complete = 1;
      },
      () => {
        this.bill_load_complete = 1;
      }
    );
  }

  getDomainSubdomainSettings() {

    const user_data = this.sharedfunctionObj.getitemfromLocalStorage('ynw-user');

    const domain = user_data.sector || null;
    const sub_domain =  user_data.subSector || null;

    return new Promise((resolve, reject) => {
      this.provider_services.domainSubdomainSettings(domain, sub_domain)
      .subscribe(
        (data: any) => {
          if (data.serviceBillable === false) {
            reject();
          } else {
            resolve();
          }
        },
        error => {
         reject(error);
        }
      );
    });

  }

  getServiceList() {
    this.provider_services.getServicesList()
    .subscribe(
      (data: any) => {

        for (const ser of data) {
          if (ser.status === 'ACTIVE') {
            this.services.push(ser);
          }
        }

        const services = this.services.map((ob) => ob.name );

        this.itemServicesGroup[0]['values'] = services;

        if (this.bill_data.service && this.bill_data.service.length > 0) {
          this.addSavedServiceToCart(this.bill_data.service);
        } else if (this.bill_data.length === 0 && this.checkin.service) {
          // Add waitlist service by default
          const service = [];
          service.push({
            name: this.checkin.service.id || '',
            serviceId: this.checkin.service.id || 0
          }); // Create an array same like service array
          this.addSavedServiceToCart(service);
        }

      },
      error => {
        this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  getCoupons() {
    return new Promise((resolve, reject) => {
      this.provider_services.getProviderCoupons()
      .subscribe(
        data => {
          this.coupons = data;

          if (this.bill_data.couponId) {
            this.cart.coupon = this.getIndexFromId(this.coupons, this.bill_data.couponId);
          }
          resolve();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
          reject(error);
        }
      );
    });

  }

  getDiscounts() {

    return new Promise((resolve, reject) => {
      this.provider_services.getProviderDiscounts()
      .subscribe(
        data => {
          this.discounts = data;

          if (this.bill_data.discountId) {
            this.cart.discount = this.getIndexFromId(this.discounts, this.bill_data.discountId);
          }

          resolve();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
          reject(error);
        }
      );
     });


  }

  getItemsList() {
    this.provider_services.getProviderItems()
    .subscribe(
      (data: any) => {

        this.items = data;
        const items = this.items.map((ob) => ob.displayName );

        this.itemServicesGroup[1]['values'] = items;

        if (this.bill_data.items && this.bill_data.items.length > 0) {
          this.addSavedItemToCart(this.bill_data.items);
        }
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});

      }
    );
  }

  getTaxDetails() {
    return new Promise((resolve, reject) => {
      this.provider_services.getProviderTax()
      .subscribe(
        data => {
          this.item_service_tax = data['taxPercentage'];
          resolve();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});

          reject(error);
        }
      );
    });

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
    this.pushCartItem(item, type);
    this.calculateItemTotal(this.cart.items.length - 1);
    this.calculateTotal();
  }

  pushCartItem(item, type) {

    let selected_item = {
    };
    const tax = (item.taxable) ? this.item_service_tax : 0;
    switch (type) {
      case 'Services' :  selected_item = {
                                'name' : item.name,
                                'itemId': item.id,
                                'quantity': 1,
                                'price': item.totalAmount,
                                'subtotal': item.totalAmount,
                                'discount': '',
                                'coupon': '',
                                'gst_percentage': tax / 2,
                                'cgst_percentage': tax / 2,
                                'type' : type,
                                'taxable':  item.taxable
                              };
                              break;

      case 'Items' :  selected_item = {
                                'name' : item.displayName,
                                'itemId': item.itemId,
                                'quantity': 1,
                                'price': item.price,
                                'subtotal': item.price,
                                'discount': '',
                                'coupon': '',
                                'gst_percentage': tax / 2,
                                'cgst_percentage': tax / 2,
                                'type' : type,
                                'taxable':  item.taxable
                              };
                              break;
    }

    this.cart.items.push(selected_item);
    this.selectedItems.push(item);

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

  stdRateChange(i) {
    if (!this.cart['items'][i]['price'] ||
    isNaN(this.cart['items'][i]['price']) ||
    this.cart['items'][i]['price'] < 0) {
      this.cart['items'][i]['price'] = 1;
    }

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
    if (this.cart['items'][i]['taxable']) {

      this.applyTax(i);
    }
    this.calculateTotal();
  }

  reduceItemDiscount(i) {

    if (this.cart['items'][i].discount !== '' && this.discounts[this.cart['items'][i].discount]) {
      const discount = this.discounts[this.cart['items'][i].discount];
      this.cart['items'][i].subtotal = this.discCalculation(discount, this.cart['items'][i].subtotal);
    }

  }

  reduceItemCoupon(i) {

    if (this.cart['items'][i].coupon !== '' &&
    this.coupons[this.cart['items'][i].coupon]) {
      const discount = this.coupons[this.cart['items'][i].coupon];
      discount.discValue = discount.amount;
      // coupon dont have discValue field
      // but we need it because discount n coupon used same function
      this.cart['items'][i].subtotal = this.discCalculation(discount, this.cart['items'][i].subtotal);
    }

  }

  applyTax(i) {
    this.cart['items'][i].subtotal = this.cart['items'][i].subtotal + (this.cart['items'][i].subtotal * this.item_service_tax / 100);
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
    // console.log(this.cart.total );
    this.reduceDiscount();
    this.reduceCoupon();
    this.reducePrePaidAmount();
    // console.log(this.cart.total );

  }

  reduceDiscount() {

    if (this.cart.discount !== '' && this.discounts[this.cart.discount]) {
      const discount = this.discounts[this.cart.discount];
      this.cart.total = this.discCalculation(discount, this.cart.sub_total, 'totdiscount');
    } else {
      this.totdisc_val = 0;
    }

  }

  reduceCoupon() {

    if (this.cart.coupon !== '' && this.coupons[this.cart.coupon]) {
      const discount = this.coupons[this.cart.coupon];
      discount.discValue = discount.amount;
      // coupon dont have discValue field
      // but we need it because discount n coupon used same function
      this.cart.total = this.discCalculation(discount, this.cart.total, 'totcoupon');
    } else {
      this.totcoup_val = 0;
    }

  }

  discCalculation(discount, cal_total, granddisc?) {
    // console.log('grand disc', granddisc);
    if (discount.calculationType === 'Fixed') {
      const disc_value = (discount.discValue > 0) ? discount.discValue : 0;
      if (granddisc === 'totdiscount') {
        this.totdisc_val = disc_value;
      }
      if (granddisc === 'totcoupon') {
        this.totcoup_val = disc_value;
      }
      const total = cal_total - disc_value;
      return (total > 0) ? total : 0;

    } else if (discount.calculationType === 'Percentage') {
      const disc_value = (discount.discValue > 0) ? discount.discValue : 0;
      const calcdisc = ( cal_total * disc_value / 100);
      if (granddisc === 'totdiscount') {
        this.totdisc_val = calcdisc;
      }
      if (granddisc === 'totcoupon') {
        this.totcoup_val = calcdisc;
      }
      const total = cal_total - ( cal_total * disc_value / 100);
      return (total > 0) ? total : 0;
    }
  }

  reducePrePaidAmount() {
    let pre_total = 0;
    for (const pay of this.pre_payment_log) {
      pre_total = pre_total + pay.amount;
    } // console.log(pre_total);
    this.cart.total = this.cart.total - pre_total;
    // console.log(this.cart.total);
    this.cart.total = (this.cart.total > 0) ? this.cart.total : 0;
  }

  submitBill() {

    const item_array = [];
    const service_array = [];
    // console.log(this.cart.items);
    for ( const item of  this.cart.items) {
      const ob = {
        'reason': '',
        'price': item.price,
        'quantity': item.quantity,
      };
     // console.log(item, ob);
      if (item.coupon !== '' && this.coupons[item.coupon]) {
        ob['couponId'] = this.coupons[item.coupon]['id'];
      }

      if (item.discount !== '' && this.discounts[item.discount]) {
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

    if (this.cart.coupon !== '' && this.coupons[this.cart.coupon]) {
      post_data['couponId'] = this.coupons[this.cart.coupon]['id'];
    }

    if (this.cart.discount !== '' && this.discounts[this.cart.discount]) {
      post_data['discountId'] = this.discounts[this.cart.discount]['id'];
    }

    if (this.bill_data.length === 0) {
      this.provider_services.createWaitlistBill(post_data)
      .subscribe(
        data => {
          // console.log(data);
          this.sharedfunctionObj.openSnackBar(Messages.PROVIDER_BILL_CREATE);
          this.dialogRef.close('reloadlist');
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );
    } else {
      this.provider_services.updateWaitlistBill(post_data)
      .subscribe(
        data => {
          // console.log(data);
          if (data) {
            this.sharedfunctionObj.openSnackBar(Messages.PROVIDER_BILL_UPDATE);
            this.dialogRef.close('reloadlist');
          }
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );
    }
  }

  getPrePaymentDetails() {
    return new Promise((resolve, reject) => {
      this.provider_services.getPaymentDetail(this.checkin.ynwUuid)
      .subscribe(
        data => {
          this.pre_payment_log = data;
          resolve();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});

          reject(error);
        }
      );
    });

  }

  addSavedServiceToCart(services) {

    for (const service of services) {
      this.services
      .map((ob) => {
        // console.log(ob, service);
        if (ob.id === service.serviceId) {// console.log('here');
          this.pushCartItem(ob, 'Services');
          this.cart.items[this.cart.items.length - 1] ['quantity']  = service.quantity || 1;
          this.cart.items[this.cart.items.length - 1]['price'] = service.price || ob.totalAmount;
          if (service.discountId !== 0) {
            this.cart.items[this.cart.items.length - 1] ['discount'] = this.getIndexFromId(this.discounts, service.discountId);
          }

          if (service.couponId !== 0) {
            this.cart.items[this.cart.items.length - 1] ['coupon'] = this.getIndexFromId(this.coupons, service.couponId);
          }
          this.calculateItemTotal(this.cart.items.length - 1);
        }

      });

    }

    this.calculateTotal();


  }

  addSavedItemToCart(items) {

    for (const item of items) {
      this.items
      .map((ob) => {

        if (ob.itemId === item.itemId) {
          this.pushCartItem(ob, 'Items');
          this.cart.items[this.cart.items.length - 1] ['quantity']  = item.quantity;
          this.cart.items[this.cart.items.length - 1]['price'] = item.price;
          if (item.discountId !== 0) {
            this.cart.items[this.cart.items.length - 1] ['discount'] = this.getIndexFromId(this.discounts, item.discountId);
          }

          if (item.couponId !== 0) {
            this.cart.items[this.cart.items.length - 1] ['coupon'] = this.getIndexFromId(this.coupons, item.couponId);
          }

          this.calculateItemTotal(this.cart.items.length - 1);
        }

      });

    }

    this.calculateTotal();


  }

  getIndexFromId(array, id) {
    let index = '';
    array
    .map((ob, i) => {
      if (ob.id === id) {
        index = i;
      }
    });
    return index;
  }
  stringtoDate(dt) {
    let dtsarr;
    if (dt) {
      // const dts = new Date(dt);
      dtsarr = dt.split(' ');
      const dtarr = dtsarr[0].split('-');
      return dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
    } else {
      return;
    }
  }

}


