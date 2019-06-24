import { tap } from 'rxjs/operators';
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
    public shared_services: SharedServices) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.loginAttempted || (this.loginCompleted && req.url.indexOf('/login') === -1) || (this.loginAttempted && req.url.indexOf('/login') !== -1)) {
      let url = '';
      if (req.url.substr(0, 4) === 'http') {
        url = req.url;
      } else {
        url = base_url + req.url;
        if (!this.checkLoaderHideUrl(url)) {
          this.loaderDisplayed = true;
          // this.showLoader();
        }
        if (!req.headers.has('Content-Type')) {
          // req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }
        req = req.clone({ headers: req.headers.set('Accept', 'application/json'), withCredentials: true });
        req = req.clone({ headers: req.headers.append('Source', 'Desktop'), withCredentials: true });
      }
      req = req.clone({ url: url, responseType: 'json' });
      return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (req.url.indexOf('/login') !== -1) {
            this.loginAttempted = false;
            this.loginCompleted = true;
          }
          if (this.loaderDisplayed) {
            // this.hideLoader();
          }
          this.loaderDisplayed = false;
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          // this.hideLoader();
          if (err.status === 301) {
            // navigator.notification.confirm('This app version is not supported any longer. Please update your app from the Play Store', this.updateDialog, 'Jaldee for Business', ['Update']);
          }
          if ((err.status === 401) &&
            !this.checkUrl(url)) {
            //  this.shared_functions.logout();
            // redirect to the login route
            // or show a modal
          } else if (err.status === 0) {
            // this.shared_functions.openSnackBar(Messages.NETWORK_ERROR, {'panelClass': 'snackbarerror'});
          } else if (err.status === 419) {
            if (!this.loginAttempted) {
              this.loginCompleted = false;
              this.loginAttempted = true;
              const ynw_user = this.shared_functions.getitemfromLocalStorage('ynw-credentials');
              const phone_number = ynw_user.loginId;
              const enc_pwd = this.shared_functions.getitemfromLocalStorage('jld');
              const password = this.shared_services.get(enc_pwd, projectConstants.KEY);
              const post_data = {
                'countryCode': '+91',
                'loginId': phone_number,
                'password': password,
                'mUniqueId': null
              };
              this.shared_services.ProviderLogin(post_data).subscribe(
                data => {
                  return next.handle(req);
                });
            } else {
              return next.handle(req);
            }
          } else if (err.status === 405) {
            // this.shared_functions.logout();
            this.router.navigate(['/maintenance']);
          }
        }
      }));
    }
  }
  updateDialog() {
    window.location.href = 'market://details?id=com.jaldee.jaldeeBusiess';
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
  private showLoader(): void {
    setTimeout(() => {
      this.slimLoadingBarService.start(() => {
      });
    }, 10);
  }
  private hideLoader(): void {
    this.slimLoadingBarService.complete();
  }
}
