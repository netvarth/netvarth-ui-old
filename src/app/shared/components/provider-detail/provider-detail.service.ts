import { Injectable } from '@angular/core';
import { ServiceMeta } from '../../services/service-meta';
@Injectable()
export class ProviderDetailService {
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
}
