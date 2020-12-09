import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderdata: any;

  constructor() { }
    setOrderDetails(data) {
      this.orderdata = data;
      console.log(this.orderdata);
    }
    getOrderDetails() {
      return this.orderdata;  
    }
}
