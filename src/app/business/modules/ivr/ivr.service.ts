import { Injectable } from '@angular/core';
import * as moment from 'moment';
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

  getAllIvrCallsByUid(id) {
    const url = 'provider/ivr/' + id;
    return this.servicemeta.httpGet(url, null);
  }

  getAllIvrCallsbyFilter(filter = {}) {
    const url = 'provider/ivr';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getIvrCallsCount(filter = {}) {
    const url = 'provider/ivr/count';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getCustomers() {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null);
  }

  getCustomerById(id) {
    const url = 'provider/customers/' + id;
    return this.servicemeta.httpGet(url, null);
  }

  getUsers() {
    const url = 'provider/user';
    return this.servicemeta.httpGet(url, null);
  }

  getChartData(data) {
    const url = 'provider/ivr/graph';
    return this.servicemeta.httpPut(url, data);
  }

  assignToCall(data) {
    const url = 'provider/ivr/assign';
    return this.servicemeta.httpPut(url, data);
  }

  createCallBack(uid) {
    const url = 'provider/ivr/callback/' + uid;
    return this.servicemeta.httpPost(url, null);
  }

  unassignToCall(data) {
    const url = 'provider/ivr/unassign';
    return this.servicemeta.httpPut(url, data);
  }


  getCustomerTodayVisit(id) {
    const url = 'provider/customers/bookings/today/' + id;
    return this.servicemeta.httpGet(url);
  }
  getCustomerFutureVisit(id) {
    const url = 'provider/customers/bookings/future/' + id;
    return this.servicemeta.httpGet(url);
  }
  getCustomerHistoryVisit(id) {
    const url = 'provider/customers/bookings/history/' + id;
    return this.servicemeta.httpGet(url);
  }

  setFiltersFromPrimeTable(event) {
    let api_filter = {}
    if ((event && event.first) || (event && event.first == 0)) {
      api_filter['from'] = event.first;
    }

    if (event && event.rows) {
      api_filter['count'] = event.rows;
    }

    if (event && event.filters) {
      let filters = event.filters;
      Object.entries(filters).forEach(([key, value]) => {
        if (filters[key]['value'] != null) {
          let filterSuffix = ''
          if (filters[key]['matchMode'] == 'startsWith') {
            filterSuffix = 'startWith';
          }
          else if (filters[key]['matchMode'] == 'contains') {
            filterSuffix = 'like';
          }
          else if (filters[key]['matchMode'] == 'endsWith') {
            filterSuffix = 'endWith';
          }
          else if (filters[key]['matchMode'] == 'equals') {
            filterSuffix = 'eq';
          }
          else if (filters[key]['matchMode'] == 'notEquals') {
            filterSuffix = 'neq';
          }
          else if (filters[key]['matchMode'] == "dateIs") {
            filterSuffix = 'eq';
            let dateValue = new Date(filters[key]['value']);
            filters[key]['value'] = moment(dateValue).format('YYYY-MM-DD');
          }
          else if (filters[key]['matchMode'] == "dateIsNot") {
            filterSuffix = 'neq';
            let dateValue = new Date(filters[key]['value']);
            filters[key]['value'] = moment(dateValue).format('YYYY-MM-DD');
          }
          if (filterSuffix != '') {
            api_filter[key + '-' + filterSuffix] = filters[key]['value'];
          }
        }
      });
    }

    if (event && event.sortField) {
      let filterValue;
      if (event.sortOrder && event.sortOrder == 1) {
        filterValue = 'asc';
      }
      else if (event.sortOrder && event.sortOrder == -1) {
        filterValue = 'dsc';
      }
      if (filterValue) {
        api_filter['sort_' + event.sortField] = filterValue;
      }
    }
    return api_filter;
  }
}
