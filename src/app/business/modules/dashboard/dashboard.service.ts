import { Injectable } from '@angular/core';
import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private serviceMeta: ServiceMeta
  ) { }

  getTodayAppointments(filter = {}) {
    let url = "provider/appointment/today"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getFutureAppointments(filter = {}) {
    let url = "provider/appointment/future"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getHistoryAppointments(filter = {}) {
    let url = "provider/appointment/history"
    return this.serviceMeta.httpGet(url, null, filter);
  }


  getTodayTokens(filter = {}) {
    let url = "provider/waitlist/today"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getFutureTokens(filter = {}) {
    let url = "provider/waitlist/future"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getHistoryTokens(filter = {}) {
    let url = "provider/waitlist/history"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getLabelList() {
    const url = 'provider/waitlist/label';
    return this.serviceMeta.httpGet(url);
  }

  getCustomersCount(filter = {}) {
    let url = "provider/customers/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getUsersCount(filter = {}) {
    let url = "provider/user/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getTodayAppointmentsCount(filter = {}) {
    let url = "provider/appointment/today/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getFutureAppointmentsCount(filter = {}) {
    let url = "provider/appointment/future/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getHistoryAppointmentsCount(filter = {}) {
    let url = "provider/appointment/history/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getTodayCheckinCount(filter = {}) {
    let url = "provider/waitlist/today/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getFutureCheckinCount(filter = {}) {
    let url = "provider/waitlist/future/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getHistoryCheckinCount(filter = {}) {
    let url = "provider/waitlist/history/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getTodayOrdersCount(filter = {}) {
    let url = "provider/orders/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getFutureOrdersCount(filter = {}) {
    let url = "provider/orders/future/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getHistoryOrdersCount(filter = {}) {
    let url = "provider/orders/history/count"
    return this.serviceMeta.httpGet(url, null, filter);
  }

}
