import {map,  catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';
import { ProviderServices } from './provider-services.service';
import { GroupStorageService } from '../../shared/services/group-storage.service';

@Injectable()
export class ProviderResolver implements Resolve<{}> {
  constructor(private provider_services: ProviderServices,
    private groupService: GroupStorageService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user_data = this.groupService.getitemFromGroupStorage('ynw-user');
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
