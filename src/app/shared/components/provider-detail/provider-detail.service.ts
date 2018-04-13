import { Component, OnInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
// import 'rxjs/add/operator/switchMap';

import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';

import { SearchFields } from '../../modules/search/searchfields';
import { ServiceMeta } from '../../services/service-meta';

import { base_url } from '../../../shared/constants/urls';
import { projectConstants } from '../../../shared/constants/project-constants';

@Injectable()

export class ProviderDetailService {
  constructor (
    private servicemetaobj: ServiceMeta,
    private shared_functionsobj: SharedFunctions
  ) {}

  getapproxWaitingtime(id) {
    const url1 = 'consumers/waitlist/appxWaitingTime?account=' + id;
    // console.log('iamhere'+url);
    return this.servicemetaobj.httpGet(url1);
  }


}
