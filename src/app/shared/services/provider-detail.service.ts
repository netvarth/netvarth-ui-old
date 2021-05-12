import { Injectable } from '@angular/core';
import { ServiceMeta } from './service-meta';
@Injectable()
export class ProviderDetailService {

  orderListArray: any[] = ['apple','orange'];
  constructor(
    private servicemetaobj: ServiceMeta) { }
  getapproxWaitingtime(id) {
    const url1 = 'consumers/waitlist/appxWaitingTime?account=' + id;
    return this.servicemetaobj.httpGet(url1);
  }
  public getEstimatedWaitingTime(prov_arr) {
    let str = '';
    for (let i = 0; i < prov_arr.length; i++) {
      if (str !== '') {
        str += '%2C'; // comma
      }
      str += prov_arr[i];
    }
    if (str === '') {
      return null;
    }

    const path = 'provider/waitlist/queues/waitingTime/' + str;
    return this.servicemetaobj.httpGet(path);
  }
  public getUserEstimatedWaitingTime(prov_arr) {
    let str = '';
    for (let i = 0; i < prov_arr.length; i++) {
      if (str !== '') {
        str += '%2C'; // comma
      }
      str += prov_arr[i];
    }
    if (str === '') {
      return null;
    }

    const path = 'provider/waitlist/queues/providerWaitingTime/' + str;
    return this.servicemetaobj.httpGet(path);
  }
  public getApptTime(prov_arr) {
    let str = '';
    for (let i = 0; i < prov_arr.length; i++) {
      if (str !== '') {
        str += '%2C'; // comma
      }
      str += prov_arr[i];
    }
    if (str === '') {
      return null;
    }

    const path = 'provider/appointment/schedule/nextAvailableSchedule/' + str;
    return this.servicemetaobj.httpGet(path);
  }
  public getUserApptTime(prov_arr) {
    let str = '';
    for (let i = 0; i < prov_arr.length; i++) {
      if (str !== '') {
        str += '%2C'; // comma
      }
      str += prov_arr[i];
    }
    if (str === '') {
      return null;
    }

    const path = 'provider/appointment/schedule/nextAvailableSchedule/' + str;
    return this.servicemetaobj.httpGet(path);
  }

  setOrder(order) {
    this.orderListArray = ['mango,pineapple'];
    console.log(this.orderListArray);

  }
  getOrder() {
    console.log(this.orderListArray);
  return this.orderListArray;
}
}
