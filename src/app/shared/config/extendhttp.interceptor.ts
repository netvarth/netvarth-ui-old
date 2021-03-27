import { catchError, switchMap, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { base_url } from './../constants/urls';
import { SharedFunctions } from '../functions/shared-functions';
import { Messages } from '../constants/project-messages';
import { SharedServices } from '../services/shared-services';
import { ForceDialogComponent } from '../components/force-dialog/force-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MaintenanceMsgComponent } from '../components/maintenance-msg/maintenance-msg.component';
import { SnackbarService } from '../services/snackbar.service';
import { SessionStorageService } from '../services/session-storage.service';
import { LocalStorageService } from '../services/local-storage.service';
// import { version } from '../constants/version' ;

@Injectable()
export class ExtendHttpInterceptor implements HttpInterceptor {
  no_redirect_path = [
    base_url + 'consumer/login',
    base_url + 'superadmin/login',
    base_url + 'support/login',
    base_url + 'marketing/login',
    base_url + 'provider/login',
    base_url + 'consumer/login/reset/\d{10,12}'
  ];
  reload_path = [
    base_url + 'consumer/communications/unreadCount',
    base_url + 'consumer/waitlist',
    base_url + 'provider/communications/unreadCount',
    base_url + 'provider/waitlist/history/count/?location-eq=\d{10,12}',
    base_url + 'provider/waitlist/future/count/?location-eq=\d{10,12}',
    base_url + 'provider/waitlist/history/count/',
    base_url + 'provider/waitlist/future/count/',
    base_url + 'provider/waitlist/today',
    base_url + 'provider/alerts/count',
    base_url + 'provider/today/count',
    base_url + 'provider/communications/unreadCount',
    base_url + 'provider/alerts/count?ackStatus-eq=false'
  ];
  loaderDisplayed = false;
  loginAttempted = false;
  loginCompleted = false;
  forceUpdateCalled = false;
  stopThisRequest = false;

  constructor(private router: Router, private shared_functions: SharedFunctions,
    public shared_services: SharedServices, private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private sessionStorageService: SessionStorageService,
    private lStorageService: LocalStorageService) { }

  private _refreshSubject: Subject<any> = new Subject<any>();
  private _maintananceSubject: Subject<any> = new Subject<any>();

  private _ifSessionExpiredN() {
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length === 1) {
      this.shared_functions.doLogout().then(
        (refreshSubject: any) => {
          this._refreshSubject.next(refreshSubject);
        }
      );
    }
    return this._refreshSubject;
  }

  private _ifMaintenanceOn() {
    this._maintananceSubject.subscribe ({
      complete: () => {
        this._maintananceSubject = new Subject<any>();
      }
    });
    if (this._maintananceSubject.observers.length === 1) {
      this.shared_functions.callMaintanance().then(
        (refreshSubject: any) => {
          this._maintananceSubject.next(refreshSubject);
        }
      );
    }
    return this._maintananceSubject;
  }
  // private _ifSessionExpired() {
  //   this._refreshSubject.subscribe({
  //     complete: () => {
  //       this._refreshSubject = new Subject<any>();
  //     }
  //   });
  //   if (this._refreshSubject.observers.length === 1) {
  //     // Hit refresh-token API passing the refresh token stored into the request
  //     // to get new access token and refresh token pair
  //     // this.sessionService.refreshToken().subscribe(this._refreshSubject);
  //     this.shared_functions.removeitemfromSessionStorage('tabId');
  //     const ynw_user = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
  //     if (!ynw_user) {
  //       window.location.reload();
  //     }
  //     const phone_number = ynw_user.loginId;
  //     // const enc_pwd = this.lStorageService.getitemfromLocalStorage('jld');
  //     const enc_pwd = 'U2FsdGVkX1++uus5wpaBf1lGVWOMvpqlEENsT1AA5P4==';
  //     const password = this.shared_services.get(enc_pwd, projectConstants.KEY);
  //     const post_data = {
  //       'countryCode': '+91',
  //       'loginId': phone_number,
  //       'password': password,
  //       'mUniqueId': ynw_user.mUniqueId
  //     };
  //     const activeuser = this.lStorageService.getitemfromLocalStorage('isBusinessOwner');
  //     // this.shared_functions.doLogout().then(
  //     //   (refreshSubject: any) => {
  //     //     this._refreshSubject.next(refreshSubject);
  //     //   }
  //     // );
  //     if (activeuser) {
  //       this.shared_services.ProviderLogin(post_data).subscribe(this._refreshSubject);
  //     } else {
  //       this.shared_services.ConsumerLogin(post_data).subscribe(this._refreshSubject);
  //     }
  //   }
  //   return this._refreshSubject;
  // }

  private _checkSessionExpiryErr(error: HttpErrorResponse): boolean {
    return (
      error.status &&
      error.status === 419
    );
  }

  private _checkMaintanance(error: HttpErrorResponse): boolean {
    return (
      error.status &&
      error.status === 405
    );
  }
  private _handleErrors(error: HttpErrorResponse): boolean {
    return;
  }

  private _forceUpdate() {
    this.forceUpdateCalled = true;
    this.stopThisRequest = true;
    const dialogRef = this.dialog.open(ForceDialogComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'This version of Jaldee is no longer supported. Please update to the latest version',
        'heading': 'Jaldee Update Required'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stopThisRequest = false;
      }
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.stopThisRequest) {
      return EMPTY;
    }
    if (req.url.substr(0, 4) === 'http') {
      return next.handle(req);
    }
    const url = base_url + req.url;
    if (this.checkUrl(url)) {
      return next.handle(this.updateHeader(req, url)).pipe(
        catchError((error, caught) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 301) {
              if (!this.forceUpdateCalled) {
                this._forceUpdate();
                return EMPTY;
              } else {
                return throwError(error);
              }
            } else {
              return throwError(error);
            }
          }
          return caught;
        })
      );
    } else {
      if (!this.checkLoaderHideUrl(url)) {
        this.loaderDisplayed = true;
        // this.showLoader();
      }
      return next.handle(this.updateHeader(req, url)).pipe(
        catchError((error, caught) => {
          this._handleErrors(error);
          if (error instanceof HttpErrorResponse) {
            if (this._checkSessionExpiryErr(error)) {
              // const isprovider = this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'true';
              //  this.shared_functions.doLogout().then (
              //    () => {
              //      this.router.navigate(['/']);
              //    }
              //  );
              // return EMPTY;
              return this._ifSessionExpiredN().pipe(
                switchMap(() => {
                  // return next.handle(this.updateHeader(req, url));
                  this.router.navigate(['/']);
                  return EMPTY;
                })
              );
              // return EMPTY;
              // return throwError(error);
            } else if (this._checkMaintanance(error)) {
              return this._ifMaintenanceOn().pipe(
                switchMap(() => {
                  const dialogRef = this.dialog.open(MaintenanceMsgComponent, {
                    width: '40%',
                    panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
                    disableClose: true,
                    data: {
                      'message': error.error
                    }
                  });
                  dialogRef.afterClosed().subscribe(result => {
                    window.location.reload();
                    // this.router.navigate(['/']);
                  });
                  return EMPTY;
                })
              );
            } else if (error.status === 0) {
              // Network Error Handling
              // return next.handle(this.updateHeader(req, url)).pipe(
              retry(2),
                // catchError((errorN: HttpErrorResponse) => {
                this.snackbarService.openSnackBar(Messages.NETWORK_ERROR, { 'panelClass': 'snackbarerror' });
              return EMPTY;
              // }),
              // delay(10000);
              // );
            } else if (error.status === 404) {
              // return EMPTY;
              return throwError(error);
            } else if (error.status === 401) {
              this.shared_functions.logout();
              return EMPTY;
              // return throwError(error);
            } else if (error.status === 301) {
              if (!this.forceUpdateCalled) {
                this._forceUpdate();
                return EMPTY;
              } else {
                return throwError(error);
              }
            } else if (error.status === 303) {
              this.lStorageService.setitemonLocalStorage('unClaimAccount', true);
              return throwError(error);
            } else {
              return throwError(error);
            }
          }
          return caught;
        })
      );
    }
  }
  updateHeader(req, url) {
    req = req.clone({ headers: req.headers.set('Accept', 'application/json'), withCredentials: true });
    req = req.clone({ headers: req.headers.append('Source', 'Desktop'), withCredentials: true });
    req = req.clone({ headers: req.headers.append('Cache-Control', 'no-cache'), withCredentials: true });
    req = req.clone({ headers: req.headers.append('Pragma', 'no-cache'), withCredentials: true });
    req = req.clone({ headers: req.headers.append('SameSite', 'None'), withCredentials: true });
    // req = req.clone({ headers: req.headers.append('Hybrid-Version', version.androidpro) });
    // req = req.clone({ headers: req.headers.append('Hybrid-Version', version.iospro) });
    if (this.sessionStorageService.getitemfromSessionStorage('tabId')) {
      req = req.clone({ headers: req.headers.append('tab', this.sessionStorageService.getitemfromSessionStorage('tabId')), withCredentials: true });
    } else {
      req.headers.delete('tab');
    }
    req = req.clone({ url: url, responseType: 'json' });
    return req;
  }

  checkUrl(url) {
    let check = false;
    this.no_redirect_path.forEach(element => {
      element = element.replace(/[\/]/g, '\\$&');
      if (url.match(element)) {
        if (check === false) { check = true; }
      }
    });
    return check;
  }
  checkLoaderHideUrl(url) {
    let check = false;
    this.reload_path.forEach(element => {
      element = element.replace(/[\/]/g, '\\$&');
      if (url.match(element)) {
        check = true;
      }
    });
    return check;
  }
}

