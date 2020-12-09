import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderdata: any;
  accountId: any;

  constructor() { }
    setOrderDetails(data) {
      this.orderdata = data;
      console.log(this.orderdata);
    }
    getOrderDetails() {
      return this.orderdata;  
    }
    setaccountId(data) {
      this.accountId = data;
      console.log(this.accountId);
    }
    getaccountId() {
      return this.accountId;  
    }
}
