


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    if (waitlist != null && waitlist.ynwUuid) {
      const params = {
        account: waitlist.provider.id
      };
      return this.consumer_services.getWaitlistDetail(waitlist.ynwUuid, params);
    } else {
      this.router.navigate(['/consumer']);
    }

  }

}
