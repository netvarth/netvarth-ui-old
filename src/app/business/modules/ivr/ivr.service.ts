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

  getIvrQuestionnaire() {
    const url = 'provider/questionnaire/ivr/call/ONLINE';
    return this.servicemeta.httpGet(url, null);
  }

  validateProviderQuestionnaire(body) {
    const url = 'provider/questionnaire/validate';
    return this.servicemeta.httpPut(url, body);
  }

  submitQuestionnaire(id, data) {
    const url = 'provider/ivr/questionnaire/submit/' + id;
    return this.servicemeta.httpPost(url, data);
  }

  addIvrCallRemarks(id, data) {
    const url = 'provider/ivr/notes/' + id;
    return this.servicemeta.httpPost(url, data);
  }

  getIvrRecoredFile(filename) {
    const url = 'provider/ivr/file/' + filename;
    return this.servicemeta.httpGet(url, null);
  }

  getCustomers(filter) {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getCustomerById(id) {
    const url = 'provider/customers/' + id;
    return this.servicemeta.httpGet(url, null);
  }

  getUsers() {
    const url = 'provider/user';
    return this.servicemeta.httpGet(url, null);
  }


  getIvrUsers() {
    const url = 'provider/ivr/user/settings';
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

  getRecordingFile(filename) {
    const url = 'provider/ivr/file/' + filename;
    return this.servicemeta.httpGet(url, null);
  }

  unassignToCall(data) {
    const url = 'provider/ivr/unassign';
    return this.servicemeta.httpPut(url, data);
  }

  getUserAvialability() {
    const url = 'provider/ivr/user/availability';
    return this.servicemeta.httpGet(url, null);
  }

  changeAvialabilityStatus(id, status) {
    const url = 'provider/ivr/users/' + id + '/' + status;
    return this.servicemeta.httpPut(url, null);
  }

  createSchedule(data) {
    const url = 'provider/schedule';
    return this.servicemeta.httpPost(url, data);
  }

  updateSchedule(data) {
    const url = 'provider/schedule';
    return this.servicemeta.httpPut(url, data);
  }

  getScheduleById(id) {
    const url = 'provider/schedule/' + id;
    return this.servicemeta.httpGet(url, null);
  }

  getScheduleCount(filter = {}) {
    const url = 'provider/schedule/count';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getUser(providerid) {
    const url = 'provider/user/' + providerid;
    return this.servicemeta.httpGet(url);
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

  markAsComplete(id) {
    const url = 'provider/ivr/status/' + id + '/callCompleted';
    return this.servicemeta.httpPut(url);
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
