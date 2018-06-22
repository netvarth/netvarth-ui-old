import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable()

export class CheckInHistoryServices {

  constructor(private servicemeta: ServiceMeta, private http: HttpClient) {}

  getWaitlistHistory(params) {
    return this.servicemeta.httpGet('consumer/waitlist/history', null, params);
    // set no_redirect_path in interceptor to avoid redirect on 401
  }

  getHistoryWaitlistCount() {
    return this.servicemeta.httpGet('consumer/waitlist/history/count');
  }

}
