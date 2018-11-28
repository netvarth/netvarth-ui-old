import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  isServiceBillable = true;
  showAddItemsec = false;
  showmainDiscSelsec = false;
  taxabletotal = 0;
  tottaxvalue = 0;
  totpaid = 0;
  curSelItm = { indx: 0, typ: '', qty: 1};
  bname;
  showPaidlist = false;
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
    'sub_totalwithouttax': 0,
    'discount': '',
    'discountamt': 0,
    'coupon': '',
    'couponamt': 0,
    'total': 0,
    'totalwithouttax': 0
  };
  bill_load_complete = 0;
  item_service_tax: any = 0;
  pre_payment_log: any = [];

  customer_label = '';
  billdate = '';
  billtime = '';
  gstnumber = '';
  billnumber = '';

  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistCheckInBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    @Inject(DOCUMENT) public document

    ) {
        this.checkin = this.data.checkin || null;
        this.bill_data = this.data.bill_data || [];
        // console.log('data' , this.bill_data);
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
    const bdetails = this.sharedfunctionObj.getitemfromLocalStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
    }
    //  this.ItemServiceGroupOptions = this.itemServiceSearch.valueChanges
    //  .pipe(
    //    startWith(''),
    //    map(val => this.filterGroup(val))
    //  );

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
    if (this.bill_data.hasOwnProperty('gstNumber')) {
      this.gstnumber = this.bill_data.gstNumber;
      // console.log('gst', this.gstnumber);
    }
    if (this.bill_data.hasOwnProperty('id')) {
      this.billnumber = this.bill_data.id;
      // console.log('gst', this.billnumber);
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
        // console.log('reached here');
      }
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
            this.isServiceBillable = false;
            reject();
          } else {
            this.isServiceBillable = true;
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

  keyupitemServiceSelected(ev, type, indx) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      this.itemServiceSelected(type, indx);
    }
  }

  itemServiceSelected(type, index) {

    // this.itemServiceSearch.reset();
    // this.item_service_search.nativeElement.blur();
    // console.log('typ', type, index);
    this.curSelItm = { indx: 0, typ: '', qty: 1};
    if (type === 'Services') {
      this.curSelItm.indx = this.services[index];
      this.curSelItm.typ = 'Services';
      this.curSelItm.qty = 1;
      // this.addCartItem(this.services[index], 'Services');
    } else if (type === 'Items') {
      // this.addCartItem(this.items[index], 'Items');
      this.curSelItm.indx = this.items[index];
      this.curSelItm.typ = 'Items';
      this.curSelItm.qty = 1;
    }
    // console.log('selected item', this.curSelItm);

  }

  addCartItem(item, type) {
   // console.log(item);
   let recalcreq = true;
    const retid = this.pushCartItem(item, type);
    if (type === 'Services') {
      if (retid !== -1) {
        this.api_error = Messages.PROVIDER_BILL_SERV_EXISTS;
        setTimeout(() => {
          this.api_error = '';
          }, projectConstants.TIMEOUT_DELAY);
        recalcreq = false;
      }
    }
    if (recalcreq) {
      if (retid === -1) {
        this.calculateItemTotal(this.cart.items.length - 1);
      } else {
        this.calculateItemTotal(retid);
      }
      this.calculateTotal();
    }
    // console.log('cart', this.cart);
  }

  pushCartItem(item, type) {

    let selected_item = {
    };
   // console.log('cart', this.cart);
    // check whether item already exists in the cart
    let foundid = -1;
    const itmid = (type === 'Services') ? item.id : item.itemId;
    for (let i = 0; i < this.cart.items.length; i++) {
        if (this.cart.items[i].itemId === itmid && this.cart.items[i].type === type) {
          foundid = i;
        }
    }
   // console.log('foundid', foundid);
    const tax = (item.taxable) ? this.item_service_tax : 0;
    if (foundid !== -1) { // case if item / service already exists in the array, then just increment the qty
      if (type !== 'Services') {
        this.cart.items[foundid].quantity = Number(this.cart.items[foundid].quantity) + Number(this.curSelItm.qty);
      }
    } else {
      let cqty = Number(this.curSelItm.qty);
      if (cqty < 0) {
        // cqty = cqty * -1;
        cqty = 1;
      }
      switch (type) {
        case 'Services' :  selected_item = {
                                  'name' : item.name,
                                  'itemId': item.id,
                                  // 'quantity': 1,
                                  'quantity': cqty, // Number(this.curSelItm.qty),
                                  'price': item.totalAmount,
                                  'rowtotal': item.totalAmount,
                                  'subtotal': item.totalAmount,
                                  'subtotalwithouttax': item.totalAmount,
                                  'discount': '',
                                  'discountamt': '',
                                  'coupon': '',
                                  'couponamt': '',
                                  'gst_percentage': tax / 2,
                                  'cgst_percentage': tax / 2,
                                  'type' : type,
                                  'taxable':  item.taxable,
                                  'showdisccoup': false
                                };
                                break;

        case 'Items' :  selected_item = {
                                  'name' : item.displayName,
                                  'itemId': item.itemId,
                                  // 'quantity': 1,
                                  'quantity': cqty, // Number(this.curSelItm.qty),
                                  'price': item.price,
                                  'rowtotal': item.price,
                                  'subtotal': item.price,
                                  'subtotalwithouttax': item.price,
                                  'discount': '',
                                  'discountamt': '',
                                  'coupon': '',
                                  'couponamt': '',
                                  'gst_percentage': tax / 2,
                                  'cgst_percentage': tax / 2,
                                  'type' : type,
                                  'taxable':  item.taxable,
                                  'showdisccoup': false
                                };
                                break;
      }

      this.cart.items.push(selected_item);
      this.selectedItems.push(item);
    }
    return foundid;

  }

  deleteCartItem(i) {
    this.hideAddItem();
    this.cart.items.splice(i, 1);
    this.selectedItems.splice(i, 1);
    this.calculateTotal();
  }

  itemDiscountChange(i) {
    this.cart['items'][i]['discountamt'] = 0;
    this.calculateItemTotal(i);
  }

  itemCouponChange(i) {
    this.cart['items'][i]['couponamt'] = 0;
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
    this.cart['items'][i]['rowtotal'] = this.cart['items'][i]['price'] * this.cart['items'][i]['quantity'];
    this.cart['items'][i]['subtotal'] = this.cart['items'][i]['price'] * this.cart['items'][i]['quantity'];
    this.cart['items'][i]['subtotalwithouttax'] = this.cart['items'][i]['price'] * this.cart['items'][i]['quantity'];
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
      this.cart['items'][i].subtotal = this.discCalculation(discount, 'discount', this.cart['items'][i].subtotal, '' , -1);
      this.cart['items'][i].subtotalwithouttax = this.discCalculation(discount, 'discount', this.cart['items'][i].subtotalwithouttax, '', i);
    }

  }

  reduceItemCoupon(i) {

    if (this.cart['items'][i].coupon !== '' &&
    this.coupons[this.cart['items'][i].coupon]) {
      const discount = this.coupons[this.cart['items'][i].coupon];
      discount.discValue = discount.amount;
      // coupon dont have discValue field
      // but we need it because discount n coupon used same function
      this.cart['items'][i].subtotal = this.discCalculation(discount, 'coupon', this.cart['items'][i].subtotal, '' , -1);
      this.cart['items'][i].subtotalwithouttax = this.discCalculation(discount, 'coupon', this.cart['items'][i].subtotalwithouttax, '', i);
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
    let totalwithouttax = 0;
    this.taxabletotal = 0;
    for ( const item of this.cart.items) {

      if (item.subtotal && item.subtotal > 0) {
        total = total + item.subtotal;
        totalwithouttax = totalwithouttax + item.subtotalwithouttax;
        if (item.taxable) {
          // console.log('taxable', item);
          this.taxabletotal += item.subtotalwithouttax;
        }
      }
    }
    // console.log('edit taxable total', this.taxabletotal);
    if (this.item_service_tax) {
      this.tottaxvalue = this.taxabletotal * (this.item_service_tax / 100);
    } else {
      this.tottaxvalue = 0;
    }

    this.cart.sub_total = (total < 0 ) ? 0 : total;
    this.cart.sub_totalwithouttax = (totalwithouttax < 0 ) ? 0 : totalwithouttax;
    this.cart.total = total;
    this.cart.totalwithouttax = totalwithouttax;

    // console.log(this.cart.total );
    this.reduceDiscount();
    this.reduceCoupon();
    this.reducePrePaidAmount();
    // console.log('cart', this.cart);

  }

  reduceDiscount() {

    if (this.cart.discount !== '' && this.discounts[this.cart.discount]) {
      const discount = this.discounts[this.cart.discount];
      this.cart.total = this.discCalculation(discount, 'discount', this.cart.sub_total, 'totdiscount', -1);
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
      this.cart.total = this.discCalculation(discount, 'coupon', this.cart.total, 'totcoupon', -1);
    } else {
      this.totcoup_val = 0;
    }

  }

  discCalculation(discount, curtype, cal_total, granddisc?, indx?) {
    // console.log('grand disc', granddisc);
    if (discount.calculationType === 'Fixed') {
      const disc_value = (discount.discValue > 0) ? discount.discValue : 0;
      if (indx !== -1) {
        if (curtype === 'discount') {
          this.cart['items'][indx]['discountamt'] = (disc_value <= cal_total) ? disc_value : cal_total;
        } else if (curtype === 'coupon') {
          this.cart['items'][indx]['couponamt'] = (disc_value <= cal_total) ? disc_value : cal_total;
        }
      } else {
          // this.cart['items'][indx]['discountamt'] = 0;
      }
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
      if (indx !== -1) {
        if (curtype === 'discount') {
          this.cart['items'][indx]['discountamt'] = (cal_total * disc_value / 100);
        } else if (curtype === 'coupon') {
          this.cart['items'][indx]['couponamt'] = (cal_total * disc_value / 100);
        }
      } else {
        // this.cart['items'][indx]['discountamt'] = 0;
      }
      const total = cal_total - ( cal_total * disc_value / 100);
      return (total > 0) ? total : 0;
    }
  }

  reducePrePaidAmount() {
    let pre_total = 0;
    for (const pay of this.pre_payment_log) {
      if (pay.status === 'SUCCESS') {
        pre_total = pre_total + pay.amount;
        if (pay.refundDetails.length > 0) {
                for (let j = 0; j < pay.refundDetails.length; j++) {
                  if (pay.refundDetails[j].status === 'SUCCESS') {
                    pre_total -= pay.refundDetails[j].amount;
                  }
                }
              }
      }
    } // console.log(pre_total);
    this.totpaid = pre_total;
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
          // console.log('paid', this.pre_payment_log);
          // for (let i = 0; i < this.pre_payment_log.length; i++) {
          //   // if (this.pre_payment_log[i].status === 'SUCCESS')  {
          //     this.totpaid += this.pre_payment_log[i].amount;
          //     if (this.pre_payment_log[i].refundDetails.length > 0) {
          //       for (let j = 0; j < this.pre_payment_log[i].refundDetails.length; j++) {
          //         if (this.pre_payment_log[i].refundDetails[j].status === 'SUCCESS') {
          //           // this.totpaid -= this.pre_payment_log[i].refundDetails[j].amount;
          //         }
          //       }
          //     }
          //  // }
          // }
          // console.log('tot paid', this.totpaid);
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
          let retid = this.pushCartItem(ob, 'Services');
          // console.log('retid', retid);
          if (retid === -1) {
            retid = this.cart.items.length - 1;

            this.cart.items[retid] ['quantity']  = service.quantity || 1;
            this.cart.items[retid]['price'] = service.price || ob.totalAmount;
            if (service.discountId !== 0) {
              this.cart.items[retid] ['discount'] = this.getIndexFromId(this.discounts, service.discountId);
            }
            if (service.couponId !== 0) {
              this.cart.items[retid] ['coupon'] = this.getIndexFromId(this.coupons, service.couponId);
            }
            this.calculateItemTotal(retid);


          } else {
             this.api_error = 'Service already exists in the bill';
          }
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
          let retid = this.pushCartItem(ob, 'Items');
          if (retid === -1) {
            retid = this.cart.items.length - 1;
          }
          this.cart.items[retid] ['quantity']  = item.quantity;
          this.cart.items[retid]['price'] = item.price;
          if (item.discountId !== 0) {
            this.cart.items[retid] ['discount'] = this.getIndexFromId(this.discounts, item.discountId);
          }

          if (item.couponId !== 0) {
            this.cart.items[retid] ['coupon'] = this.getIndexFromId(this.coupons, item.couponId);
          }

          this.calculateItemTotal(retid);
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
  stringtoDate(dt, mod) {
    let dtsarr;
    if (dt) {
      // const dts = new Date(dt);
      dtsarr = dt.split(' ');
      const dtarr = dtsarr[0].split('-');
      let retval = '';
      if (mod === 'all') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
      } else if (mod === 'date') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0];
      } else if (mod === 'time') {
        retval = dtsarr[1] + ' ' + dtsarr[2];
      }

      return retval;
    } else {
      return;
    }
  }

  showAddItem() {
    this.showAddItemsec = true;
    this.ItemServiceGroupOptions = this.itemServiceSearch.valueChanges
     .pipe(
       startWith(''),
       map(val => this.filterGroup(val))
     );
     // console.log('reached here');
     setTimeout(() => {
      /*if (this.document.getElementById('itemservicesearch')) {
        console.log('focus here');
        this.document.getElementById('itemservicesearch').focus();
      }*/
      this.item_service_search.nativeElement.focus();
    }, 500);
  }
  hideAddItem() {
    this.showAddItemsec = false;
    this.itemServiceSearch.reset();
    this.curSelItm = { indx: 0, typ: '', qty: 1};
  }
  addItem() {
    // console.log('clicked add item', this.curSelItm);
    if (isNaN(this.curSelItm.qty)) {
      this.curSelItm.qty = 1;
    }
    this.addCartItem(this.curSelItm.indx, this.curSelItm.typ);
    this.itemServiceSearch.reset();
    this.curSelItm = { indx: 0, typ: '', qty: 1};
    // this.item_service_search.nativeElement.blur();
  }
  handleTotalDiscSec() {
    if (this.showmainDiscSelsec) {
      this.showmainDiscSelsec = false;
    } else {
      this.showmainDiscSelsec = true;
    }
  }
  itemDiscCoupSec(indx) {
    // console.log('here', this.cart.items);
    if (this.cart.items[indx]) {
      if (this.cart.items[indx].showdisccoup) {
        this.cart.items[indx].showdisccoup = false;
      } else {
        this.cart.items[indx].showdisccoup = true;
      }
    }
  }
  showpaidSection() {
    if (this.showPaidlist) {
      this.showPaidlist = false;
    } else {
      this.showPaidlist = true;
    }
  }
  blurQty(val, itm) {
    if (isNaN(val)) {
      itm.qty = 1;
    } else {
      let vv = parseInt(val, 10);
      if (vv === 0) {
        vv = 1;
      } else if ( vv < 0) {
        // vv = vv * -1;
        vv = 1;
      }
      itm.qty = vv;
    }
  }

}


