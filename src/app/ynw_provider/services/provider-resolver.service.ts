import {map} from 'rxjs/operators/map';
import { catchError} from 'rxjs/operators/catchError';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { ProviderServices } from './provider-services.service';
import { SharedFunctions } from '../../shared/functions/shared-functions';

@Injectable()
export class ProviderResolver implements Resolve<{}> {
  constructor(private provider_services: ProviderServices,
    private shared_functions: SharedFunctions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user_data = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const domain = user_data.sector || null;
    const sub_domain =  user_data.subSector || null;
    if (domain && sub_domain) {
      return this.provider_services.getIdTerminologies(domain, sub_domain).pipe(
        map(term => {
          return term;
        }),
        catchError(error => {
          return of(null);
        })
      );
    } else {
      return null;
    }
  }
}
