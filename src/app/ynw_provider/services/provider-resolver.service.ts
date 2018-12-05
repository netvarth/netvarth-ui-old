
import {map, catchError} from 'rxjs/operators';



import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';

import { ProviderServices } from './provider-services.service';
import { CommonDataStorageService } from '../../shared/services/common-datastorage.service';
import { SharedFunctions } from '../../shared/functions/shared-functions';

@Injectable()
export class ProviderResolver implements Resolve<{}> {
  constructor(private provider_services: ProviderServices,
    private provider_datastorage: CommonDataStorageService,
    private router: Router,
    private shared_functions: SharedFunctions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // let id = route.paramMap.get('id');
    const user_data = this.shared_functions.getitemfromLocalStorage('ynw-user');

    const domain = user_data.sector || null;
    const sub_domain =  user_data.subSector || null;

    // if (domain && sub_domain) {
    //     return this.provider_services.getIdTerminologies(domain, sub_domain).pipe(
    //     map(term => {
    //       return term;
    //     }))
    //   .catch(error => {
    //       return Observable.of(null);
    //   });

    // } else {
    //   return null;
    // }
    if (domain && sub_domain) {
      return this.provider_services.getIdTerminologies(domain, sub_domain).pipe(
      map(term => {
        return term;
      }),
      catchError(error => {
        return null;
      }));

    /*.catch(error => {
        return Observable.of(null);
    });*/

  } else {
    return null;
  }


  }

}
