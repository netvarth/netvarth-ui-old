
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';

import { ConsumerServices } from './consumer-services.service';
import { ConsumerDataStorageService } from './consumer-datastorage.service';

@Injectable()
export class WaitlistDetailResolver implements Resolve<{}> {
  constructor(private consumer_services: ConsumerServices,
    private consumer_datastorage: ConsumerDataStorageService,
    private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // let id = route.paramMap.get('id');

    const waitlist = this.consumer_datastorage.get();
    if (waitlist != null && waitlist.id) {
      return this.consumer_services.getWaitlistDetail(waitlist.token, waitlist.createdDate, waitlist.provider.id);
    } else {
      this.router.navigate(['/consumer']);
    }

  }

}
