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
export class AuthGuardProvider implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('ynw-credentials')
      && localStorage.getItem('isBusinessOwner') === 'true') {
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

@Injectable()
export class AuthGuardProviderHome implements CanActivate {
  constructor(private router: Router, private shared_functions: SharedFunctions) { }
  canActivate() {
    if (localStorage.getItem('ynw-credentials')
      && this.shared_functions.getitemFromGroupStorage('ynw-user')) {
      const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
      if (user.accStatus === 'ACTIVE') {
        return true;
      } else {
        if (localStorage.getItem('new_provider')) {
          // this.router.navigate(['/provider/tour']); // commented to make the bwizard work
          this.router.navigate(['/provider/bwizard']);
        } else {
          // this.router.navigate(['/provider/settings']);
          this.router.navigate(['/provider/settings/bprofile']);
        }
        return false;
      }
    }
    this.router.navigate(['/logout']);
    return false;
  }
}
@Injectable()
export class AuthGuardNewProviderHome implements CanActivate {
  constructor(private router: Router) { }
  canActivate() {
    if (localStorage.getItem('new_provider')) {
      return true;
    } else {
      return false;
    }
  }
}
