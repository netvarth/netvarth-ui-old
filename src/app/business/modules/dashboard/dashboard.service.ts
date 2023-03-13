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
}
