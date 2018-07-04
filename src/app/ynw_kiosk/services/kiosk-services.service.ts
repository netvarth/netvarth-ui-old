
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

    getLocationDetail(location_id) {
        const url = 'provider/locations/' + location_id;
        return this.servicemeta.httpGet(url);
    }

    getEstimatedWaitingTime(prov_loc_id) {
        const path = 'provider/waitlist/queues/waitingTime/' + prov_loc_id;
        return this.servicemeta.httpGet(path);
      }

    getTodayWaitlist(params) {
        let waitlistcondition = '';
        if (params['waitliststatus'] !== undefined) {
            waitlistcondition = '&waitlistStatus-eq=' + params['waitliststatus'];
        }
        const url = 'provider/waitlist/today?consumer-eq=' + params['consumerid'] + waitlistcondition + '&location-eq=' + params['locationid'];
        return this.servicemeta.httpGet(url);
    }

    changeWaitlistStatus(uuid, action) {
        const url = 'provider/waitlist/' + uuid + '/' + action;
        const message = {};
        return this.servicemeta.httpPut(url, message);
    }

    getBussinessProfile() {
        return this.servicemeta.httpGet('provider/bProfile');
    }
}
