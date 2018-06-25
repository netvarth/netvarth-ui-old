
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
}
