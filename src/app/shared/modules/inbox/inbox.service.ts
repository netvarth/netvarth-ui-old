import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

// Import RxJs required methods



import { ServiceMeta } from '../../services/service-meta';

@Injectable()

export class InboxServices {

    constructor(private servicemeta: ServiceMeta, private httpobj: HttpClient) {}

    getInbox(usertype) {
        return this.servicemeta.httpGet(usertype + '/communications');
    }

    postInboxReply(consumerId, data, usertype) {
        let url = '';
        if (usertype === 'provider') {
         url = usertype + '/communications/' + consumerId;
        } else {
         url = usertype + '/communications?account=' + consumerId;
        }
        return this.servicemeta.httpPost(url, data);
    }

    getBussinessProfile() {
      return this.servicemeta.httpGet('provider/bProfile');
    }
}
