import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedFunctions } from '../functions/shared-functions';

@Injectable()
export class AuthGuardConsumer implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('ynw-credentials')
      && localStorage.getItem('isBusinessOwner') === 'false') {
      return true;
    }

    this.router.navigate(['/logout']);
    return false;
  }
}

@Injectable()
export class AuthGuardLogin implements CanActivate {
  constructor(private router: Router) { }
  canActivate() {
    if (localStorage.getItem('ynw-credentials')) {
      return true;
    }
    this.router.navigate(['/logout']);
    return false;
  }
}


@Injectable()
export class AuthGuardHome implements CanActivate {
  constructor(private router: Router, private shared_functions: SharedFunctions) {}
  canActivate() {
    let credentials = null;
    let userType = null;
    if (localStorage.getItem('ynw-credentials') && this.shared_functions.getitemFromGroupStorage('ynw-user') ) {
      credentials = this.shared_functions.getitemFromGroupStorage('ynw-user');
      userType = credentials['userType'];
      if (localStorage.getItem('isBusinessOwner') === 'true' || userType === 3) {
        this.router.navigate(['/provider/check-ins/']);
        return false;
      } else if (localStorage.getItem('isBusinessOwner') === 'false') {
        this.router.navigate(['/consumer']);
        return false;
      }
    }
    return true;
  }
}
