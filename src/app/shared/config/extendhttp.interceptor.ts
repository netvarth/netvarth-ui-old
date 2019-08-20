import { catchError } from 'rxjs/operators/catchError';
import { switchMap } from 'rxjs/operators/switchMap';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { base_url } from './../constants/urls';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { SharedFunctions } from '../functions/shared-functions';
import { Messages } from '../constants/project-messages';
import { projectConstants } from '../constants/project-constants';
import { SharedServices } from '../services/shared-services';
import { Subject } from 'rxjs/Subject';
import { throwError } from 'rxjs';
import { ForceDialogComponent } from '../components/force-dialog/force-dialog.component';
import { MatDialog } from '@angular/material';
import { retry } from 'rxjs/operators';

@Injectable()
export class ExtendHttpInterceptor implements HttpInterceptor {
  no_redirect_path = [
    base_url + 'consumer/login',
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
  constructor(private slimLoadingBarService: SlimLoadingBarService,
    private router: Router, private shared_functions: SharedFunctions,
    public shared_services: SharedServices, private dialog: MatDialog) { }


  private _refreshSubject: Subject<any> = new Subject<any>();

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

      const ynw_user = this.shared_functions.getitemfromLocalStorage('ynw-credentials');
      const phone_number = ynw_user.loginId;
      const enc_pwd = this.shared_functions.getitemfromLocalStorage('jld');
      const password = this.shared_services.get(enc_pwd, projectConstants.KEY);
      const post_data = {
        'countryCode': '+91',
        'loginId': phone_number,
        'password': password,
        'mUniqueId': ynw_user.mUniqueId
      };
      const activeuser = this.shared_functions.getitemfromLocalStorage('ynw-user');
      if (activeuser.isProvider) {
        this.shared_services.ProviderLogin(post_data).subscribe(this._refreshSubject);
      } else {
        this.shared_services.ConsumerLogin(post_data).subscribe(this._refreshSubject);
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

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.substr(0, 4) === 'http') {
      return next.handle(req);
    }
    const url = base_url + req.url;
    if (this.checkUrl(url)) {
      return next.handle(this.updateHeader(req, url));
    } else {
      if (!this.checkLoaderHideUrl(url)) {
        this.loaderDisplayed = true;
        // this.showLoader();
      }
      return next.handle(this.updateHeader(req, url)).pipe(
        catchError((error, caught) => {
          if (error instanceof HttpErrorResponse) {
            if (this._checkSessionExpiryErr(error)) {
              window.location.reload();
              return this._ifSessionExpired().pipe(
                switchMap(() => {
                  return next.handle(this.updateHeader(req, url));
                })
              );
            } else if (error.status === 405) {
              this.router.navigate(['/maintenance']);
            } else if (error.status === 0) {
              // retry(2);
              // this.shared_functions.openSnackBar(Messages.NETWORK_ERROR, { 'panelClass': 'snackbarerror' });
              // return next.handle(req);
              return next.handle(req).pipe(
                retry(1),
                catchError((errorn: HttpErrorResponse) => {
                  // if (errorn.status !== 401) {
                  // 401 handled in auth.interceptor
                  this.shared_functions.openSnackBar(Messages.NETWORK_ERROR, { 'panelClass': 'snackbarerror' });
                  // }
                  return next.handle(req);
                })
              );
            } else if (error.status === 404) {
              return next.handle(req);
              // this.shared_functions.logout();
            } else if (error.status === 401) {
              this.shared_functions.logout();
              // return next.handle(req);
            } else if (error.status === 301) {
              const dialogRef = this.dialog.open(ForceDialogComponent, {
                width: '50%',
                panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
                disableClose: true,
                data: {
                  'message': 'This app version is not supported any longer. Please update your app from the Play Store',
                  'heading': 'Confirm'
                }
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                }
              });
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

