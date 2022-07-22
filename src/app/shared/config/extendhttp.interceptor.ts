import { catchError, switchMap, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, EMPTY } from 'rxjs';
import { base_url } from './../constants/urls';
import { SharedFunctions } from '../functions/shared-functions';
import { Messages } from '../constants/project-messages';
import { SharedServices } from '../services/shared-services';
import { ForceDialogComponent } from '../components/force-dialog/force-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { SessionStorageService } from '../services/session-storage.service';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
// import { version } from '../constants/version' ;

@Injectable()
export class ExtendHttpInterceptor implements HttpInterceptor {
  loggedUrls = [];
  no_redirect_path = [
    base_url + 'consumer/login',
    base_url + 'superadmin/login',
    base_url + 'support/login',
    base_url + 'marketing/login',
    base_url + 'provider/login',
    base_url + 'consumer/login/reset/\d{10,12}',
    base_url + 'consumer/oauth/token/refresh'
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
  sessionExpired = false;

  constructor(private shared_functions: SharedFunctions,
    public shared_services: SharedServices, private dialog: MatDialog,
    private snackbarService: SnackbarService,
    public router: Router,
    private sessionStorageService: SessionStorageService,
    private lStorageService: LocalStorageService,
    private authService: AuthService) { }

  private _refreshSubject: Subject<any> = new Subject<any>();
  private _maintananceSubject: Subject<any> = new Subject<any>();

  private _ifSessionExpiredN() {
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length === 1) {
      this.authService.logoutFromJaldee().then(
        (refreshSubject: any) => {
          this._refreshSubject.next(refreshSubject);
        }
      );
    }
    return this._refreshSubject;
  }

  private _ifMaintenanceOn() {
    this._maintananceSubject.subscribe({
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
  private _ifSessionExpired() {
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length === 1) {
      // Hit refresh-token API passing the refresh token stored into the request
      // to get new access token and refresh token pair
      // this.sessionService.refreshToken().subscribe(this._refreshSubject);
      this.sessionStorageService.removeitemfromSessionStorage('tabId');
      let ynw_user = this.lStorageService.getitemfromLocalStorage('ynw-credentials');
      ynw_user = JSON.parse(ynw_user);
      if (!ynw_user) {
        window.location.reload();
      }
      const phone_number = ynw_user.loginId;
      const password = this.lStorageService.getitemfromLocalStorage('bpwd');
      if (!ynw_user.mUniqueId) {
        if (this.lStorageService.getitemfromLocalStorage('mUniqueId')) {
          ynw_user.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
          this.lStorageService.setitemonLocalStorage('ynw-credentials', ynw_user);
        }
      }
      const post_data = {
        'countryCode': '+91',
        'loginId': phone_number,
        'password': password,
        'mUniqueId': ynw_user.mUniqueId
      };
      const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
      if (reqFrom === 'cuA') {
        this.authService.refreshToken().then(
          (response)=> {
            this.authService.refresh(response).subscribe(this._refreshSubject);
          }
        )        
      } else {
        this.shared_services.ProviderLogin(post_data).subscribe(this._refreshSubject);
      }      
    }
    return this._refreshSubject;
  }

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

      let refresh = false;
      let refreshUrl = base_url + 'consumer/oauth/token/refresh';
      let element = refreshUrl.replace(/[\/]/g, '\\$&');
      if (url.match(element)) {
        refresh = true;
      }
    
      return next.handle(this.updateHeader(req, url, refresh)).pipe(
        catchError((error, caught) => {
          if (error instanceof HttpErrorResponse) {
            if (this._checkMaintanance(error)) {
              return this._ifMaintenanceOn().pipe(
                switchMap(() => {
                  this.router.navigate(['/maintenance']);
                  console.log("Maintainance Interceptor1");
                  return throwError(error);
                })
              );
            } else if (error.status === 301) {
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
            // console.log('HttpErrorResponse:',error);
            if (this._checkSessionExpiryErr(error)) {

              let reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');

              if (reqFrom && reqFrom === 'SP_APP' || (reqFrom === 'cuA' && this.lStorageService.getitemfromLocalStorage('refreshToken'))){
                return this._ifSessionExpired().pipe(
                  switchMap(() => {
                    return next.handle(this.updateHeader(req, url));
                  })
                );
              } else {
                if (!this.sessionExpired) {
                  // this.shared_services.callHealth(JSON.stringify(this.loggedUrls)).subscribe();
                  this.sessionExpired = true;
                }
                return this._ifSessionExpiredN().pipe(
                  switchMap(() => {
                    // return next.handle(this.updateHeader(req, url));
                    // this.router.navigate(['/']);
                    this.sessionExpired = false;
                    return EMPTY;
                  })
                );
              }
              // return EMPTY;
              // return throwError(error);
            } else if (this._checkMaintanance(error)) {
              console.log("Maintainance Interceptor Check");
              this.router.navigate(['/maintenance']);
              return this._ifMaintenanceOn().pipe(
                switchMap(() => {
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
              //this.shared_functions.logout();
              return throwError(error);
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
  updateHeader(req, url, refresh?) {
    req = req.clone({ headers: req.headers.set('Accept', 'application/json'), withCredentials: true });
    req = req.clone({ headers: req.headers.append('Source', 'Desktop'), withCredentials: true });
    req = req.clone({ headers: req.headers.append('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0'), withCredentials: true });
    req = req.clone({ headers: req.headers.append('Pragma', 'no-cache'), withCredentials: true });
    req = req.clone({ headers: req.headers.append('SameSite', 'None'), withCredentials: true });
    req = req.clone({ headers: req.headers.append('Expires', '0'), withCredentials: true });
    // req = req.clone({ headers: req.headers.append('Hybrid-Version', version.androidpro) });
    // req = req.clone({ headers: req.headers.append('Hybrid-Version', version.iospro) });
    const customId = this.lStorageService.getitemfromLocalStorage('customId');
    const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
    console.log("reqFrom:", reqFrom);
    if (customId) {
      if (reqFrom === 'cuA') {
        req = req.clone({ headers: req.headers.append('BOOKING_REQ_FROM', 'CUSTOM_APP'), withCredentials: true });
      } else {
        req = req.clone({ headers: req.headers.append('BOOKING_REQ_FROM', 'WEB_LINK'), withCredentials: true });
      }
    } else if (reqFrom) {
      req = req.clone({ headers: req.headers.append('BOOKING_REQ_FROM', reqFrom), withCredentials: true });
      if (reqFrom === 'CUSTOM_WEBSITE') {
        req = req.clone({ headers: req.headers.append('website-link', this.lStorageService.getitemfromLocalStorage('source')), withCredentials: true });
      }
    }

    if (this.sessionStorageService.getitemfromSessionStorage('tabId')) {
      req = req.clone({ headers: req.headers.append('tab', this.sessionStorageService.getitemfromSessionStorage('tabId')), withCredentials: true });
    } else {
      req.headers.delete('tab');
    }
    console.log("Refresh:", refresh);
    // authorizationToken --- For OTP Login/Signup
    if (refresh) {
      let authToken = this.lStorageService.getitemfromLocalStorage("refreshToken");
      req = req.clone({ headers: req.headers.append('Authorization', authToken), withCredentials: true });
      this.lStorageService.removeitemfromLocalStorage("authorizationToken");
    } else if (this.lStorageService.getitemfromLocalStorage("authorizationToken")) {
      let authToken = this.lStorageService.getitemfromLocalStorage("authorizationToken");
      req = req.clone({ headers: req.headers.append('Authorization', authToken), withCredentials: true });
    } else if (this.lStorageService.getitemfromLocalStorage('appId') && this.lStorageService.getitemfromLocalStorage('installId')) {
      let authToken = this.lStorageService.getitemfromLocalStorage('appId') + '-' + this.lStorageService.getitemfromLocalStorage('installId');
      req = req.clone({ headers: req.headers.append('Authorization', authToken), withCredentials: true });
    } else if (this.lStorageService.getitemfromLocalStorage('authToken') && !this.lStorageService.getitemfromLocalStorage('googleToken')) {
      let authToken = this.lStorageService.getitemfromLocalStorage('authToken');
      req = req.clone({headers: req.headers.append('Authorization', authToken), withCredentials: true });
    } else {
      if ((customId || this.lStorageService.getitemfromLocalStorage('login')) && !this.shared_functions.checkLogin()) {
        req = req.clone({ headers: req.headers.append('Authorization', 'browser'), withCredentials: true });
      } else if (customId && this.shared_functions.checkLogin()){
        this.lStorageService.removeitemfromLocalStorage('Authorization');
      }
    }
    if (this.lStorageService.getitemfromLocalStorage('googleToken')) {
      req = req.clone({ headers: req.headers.append('authToken', this.lStorageService.getitemfromLocalStorage('googleToken')), withCredentials: true });
    }
    req = req.clone({ url: url, responseType: 'json' });

    if (this.loggedUrls.length > 10) {
      this.loggedUrls.shift();
    }
    this.loggedUrls.push(req);
    // console.log(JSON.stringify(req));
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
