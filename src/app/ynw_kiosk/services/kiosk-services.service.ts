
import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ServiceMeta } from '../../shared/services/service-meta';

@Injectable()

export class KioskServices {

    constructor(private servicemeta: ServiceMeta, private http: HttpClient) {}

    getCustomer(data) {
        const url = 'provider/customers';
        return this.servicemeta.httpGet(url, null, data);
    }
    createProviderCustomer(data) {
        const url = 'provider/customers';
        return this.servicemeta.httpPost(url, data);
    }
    getTerminoligies(domain, subdomain) {
        const url = 'ynwConf/terminologies/' + domain + '/' + subdomain;
        return this.servicemeta.httpGet(url);
    }
    getProviderLocations() {
        return this.servicemeta.httpGet('provider/locations');
    }

    getTodayWaitlist(params) {
        const url = 'provider/waitlist/today?consumer-eq=' + params['consumerId'] + '&waitlistStatus-eq=' + params['waitliststatus'] + '&location-eq=' + params['locationid'];
        return this.servicemeta.httpGet(url);
    }
}
