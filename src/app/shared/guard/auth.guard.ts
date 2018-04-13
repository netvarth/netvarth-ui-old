import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

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

        constructor(private router: Router) { }

        canActivate() {
            if (localStorage.getItem('ynw-credentials')
                && localStorage.getItem('isBusinessOwner') === 'true') {

                  this.router.navigate(['/provider']);
                  return false;

            } else if (localStorage.getItem('ynw-credentials')
            && localStorage.getItem('isBusinessOwner') === 'false') {

                  this.router.navigate(['/consumer']);
                  return false;

            } else {
              return true;
            }

        }
}

@Injectable()
export class AuthGuardProviderHome implements CanActivate {

        constructor(private router: Router) { }

        canActivate() {
            if (localStorage.getItem('ynw-credentials')
                && localStorage.getItem('ynw-user')) {
                const user = JSON.parse(localStorage.getItem('ynw-user'));

                if (user.accStatus === 'ACTIVE') {
                  return true;
                } else {
                  if (localStorage.getItem('new_provider')) {
                    // this.router.navigate(['/provider/tour']); // commented to make the bwizard work
                    this.router.navigate(['/provider/bwizard']);
                  } else {
                    this.router.navigate(['/provider/settings']);
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
