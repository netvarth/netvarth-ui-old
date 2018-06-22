
import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ServiceMeta } from '../../shared/services/service-meta';

@Injectable()

export class ConsumerServices {


  constructor(private servicemeta: ServiceMeta, private http: HttpClient) {}

  getWaitlist(params) {
      return this.servicemeta.httpGet('consumer/waitlist', null, params);
      // set no_redirect_path in interceptor to avoid redirect on 401
  }

  getWaitlistHistory(params) {
    return this.servicemeta.httpGet('consumer/waitlist/history', null, params);
    // set no_redirect_path in interceptor to avoid redirect on 401
  }


  deleteFavProvider(id) {
    return this.servicemeta.httpDelete('consumer/providers/' + id);
  }



  getWaitlistCount(params) {
    return this.servicemeta.httpGet('consumer/waitlist/count', null, params);
  }

  getHistoryWaitlistCount() {
    return this.servicemeta.httpGet('consumer/waitlist/history/count');
  }

  deleteWaitlist(id, params) {
    return this.servicemeta.httpDelete('consumer/waitlist/' + id, null, params);
  }

  getWaitlistDetail(token, date, provider_id) {
    const path = 'consumer/waitlist/' + token + '/' + date + '?account=' + provider_id;
    return this.servicemeta.httpGet(path);
  }

  getMembers() {
    return this.servicemeta.httpGet('consumer/familyMember');
  }

  deleteMember(id) {
    const path = 'consumer/familyMember/' + id;
    return this.servicemeta.httpDelete(path);
  }

  addConsumertoProviderNote(uuid, message) {
    const url = 'consumer/communications?account=' + uuid;
    return this.servicemeta.httpPost(url, message);
  }

  addConsumerWaitlistNote(accountid, uuid, body) {
    const url = 'consumer/waitlist/communicate/' + uuid + '?account=' + accountid;
    return this.servicemeta.httpPost(url, body);
  }

 /* addMembers(data) {
    return this.servicemeta.httpPost('consumer/familyMember', data);
  }

  editMember(data) {
    return this.servicemeta.httpPut('consumer/familyMember', data);
  } */

  getWaitlistBill(uuid) {
    const path = 'consumer/bill/' + uuid;
    return this.servicemeta.httpGet(path);
  }

  getPaymentDetail(uuid) {
    const url = 'consumer/payment/' + uuid ;
    return this.servicemeta.httpGet(url);
  }


}
