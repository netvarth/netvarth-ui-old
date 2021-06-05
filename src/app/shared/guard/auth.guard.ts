import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { GroupStorageService } from '../services/group-storage.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class AuthGuardConsumer implements CanActivate {

  constructor(private router: Router, private lStorageService: LocalStorageService) { }

  canActivate() {
    if (this.lStorageService.getitemfromLocalStorage('ynw-credentials')) {
      return true;
    }

    this.router.navigate(['/logout']);
    return false;
  }
}

@Injectable()
export class AuthGuardLogin implements CanActivate {
  constructor(private router: Router, private lStorageService: LocalStorageService) { }
  canActivate() {
    if (this.lStorageService.getitemfromLocalStorage('ynw-credentials')) {
      return true;
    }
    this.router.navigate(['/logout']);
    return false;
  }
}


@Injectable()
export class AuthGuardHome implements CanActivate {
  constructor(private router: Router, private groupService: GroupStorageService, 
    private lStorageService: LocalStorageService) {}
  canActivate() {
    let credentials = null;
    let userType = null;
    if (this.lStorageService.getitemfromLocalStorage('ynw-credentials') && this.groupService.getitemFromGroupStorage('ynw-user') ) {
      credentials = this.groupService.getitemFromGroupStorage('ynw-user');
      userType = credentials['userType'];
      if (this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'true' || userType === 3) {
        this.router.navigate(['/provider/check-ins/']);
        return false;
      } else if (this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'false') {
        this.router.navigate(['/consumer']);
        return false;
      }
    }
    return true;
  }
}

@Injectable()
export class AuthGuardProviderHome implements CanActivate {
  constructor(private router: Router, private groupService: GroupStorageService, private lStorageService: LocalStorageService) { }
  canActivate() {
    if (this.lStorageService.getitemfromLocalStorage('ynw-credentials')
      && this.groupService.getitemFromGroupStorage('ynw-user')) {
      const user = this.groupService.getitemFromGroupStorage('ynw-user');
      if (user.accStatus === 'ACTIVE') {
        return true;
      } else {
        if (this.lStorageService.getitemfromLocalStorage('new_provider')) {
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
  constructor(private lStorageService: LocalStorageService) { }
  canActivate() {
    if (this.lStorageService.getitemfromLocalStorage('new_provider')) {
      return true;
    } else {
      return false;
    }
  }
}
