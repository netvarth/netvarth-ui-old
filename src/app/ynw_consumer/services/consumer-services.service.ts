
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
      return this.servicemeta.httpGet('consumers/waitlist', null, params);
      // set no_redirect_path in interceptor to avoid redirect on 401
  }



  deleteFavProvider(id) {
    return this.servicemeta.httpDelete('consumers/accounts/' + id);
  }



  getWaitlistCount(params) {
    return this.servicemeta.httpGet('consumers/waitlist/count', null, params);
  }

  deleteWaitlist(id, params) {
    return this.servicemeta.httpDelete('consumers/waitlist/' + id, null, params);
  }

  getWaitlistDetail(token, date, provider_id) {
    const path = 'consumers/waitlist/' + token + '/' + date + '?account=' + provider_id;
    return this.servicemeta.httpGet(path);
  }

  getMembers() {
    return this.servicemeta.httpGet('consumer/familyMember');
  }

  deleteMember(id) {
    const path = 'consumer/familyMember/' + id;
    return this.servicemeta.httpDelete(path);
  }

  addMembers(data) {
    return this.servicemeta.httpPost('consumer/familyMember', data);
  }

  editMember(data) {
    return this.servicemeta.httpPut('consumer/familyMember', data);
  }


}
