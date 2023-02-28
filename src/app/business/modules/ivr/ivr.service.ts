import { Injectable } from '@angular/core';
import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class IvrService {

  constructor(
    private servicemeta: ServiceMeta
  ) { }

  getAllIvrCalls() {
    const url = 'provider/ivr';
    return this.servicemeta.httpGet(url, null);
  }

  getAllIvrCallsbyFilter(filter = {}) {
    const url = 'provider/ivr';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getCustomers() {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null);
  }
}
