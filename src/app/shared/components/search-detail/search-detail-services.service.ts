import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ServiceMeta } from '../../services/service-meta';

@Injectable()

export class SearchDetailServices {

    constructor(private servicemetaobj: ServiceMeta, private httpobj: HttpClient) {}

    getRefinedSearch(domain?, subdomain?) {
        let path = 'ynwConf/refinedFilters';
        if (domain && domain !== 'All' && domain !== undefined && domain !== 'undefined') {
            path += '/' + domain;
            if (subdomain) {
                path += '/' + subdomain;
            }
        }
        return this.servicemetaobj.httpGet(path);
    }
}
