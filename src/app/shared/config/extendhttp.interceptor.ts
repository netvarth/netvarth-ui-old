
import {tap} from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';




import { base_url } from './../constants/urls';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { SharedFunctions } from '../functions/shared-functions';
import { Messages } from '../constants/project-messages';

@Injectable()
export class ExtendHttpInterceptor implements HttpInterceptor {


    no_redirect_path = [
                          base_url +  'consumer/login',
                          base_url +   'provider/login',
                          base_url +   'consumer/login/reset/\d{10,12}'
                       ];
    reload_path = [
                      base_url +  'consumer/communications/unreadCount',
                      base_url +  'consumer/waitlist',
                      base_url +  'provider/communications/unreadCount',
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
    constructor(private slimLoadingBarService: SlimLoadingBarService,
    private router: Router, private shared_functions: SharedFunctions) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        let url = '';
        if (req.url.substr(0, 4) === 'http') {
          url =  req.url;
        } else {

          url =  base_url + req.url;
          // console.log('req' + url);
          if (!this.checkLoaderHideUrl(url)) {
            // console.log('req' + url);
            this.loaderDisplayed = true;
            // this.showLoader();
          }

          if (!req.headers.has('Content-Type')) {
          // req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
          }
          req = req.clone({ headers: req.headers.set('Accept', 'application/json'), withCredentials : true });

        }

        req = req.clone({url: url, responseType: 'json'});


        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (this.loaderDisplayed) {
              // this.hideLoader();
            }
            this.loaderDisplayed = false;
            // console.log('---> status:', event.status);
            // console.log('---> filter:', req.params.get('filter'));
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            // this.hideLoader();
            if ((err.status === 401 || err.status === 419) &&
              !this.checkUrl(url)) {
               this.shared_functions.logout();
              // redirect to the login route
              // or show a modal
            } else if (err.status === 0) {
              console.log( 'NETWORK ERROR');
              this.shared_functions.openSnackBar(Messages.API_ERROR, {'panelClass': 'snackbarerror'});
            }
          }
        }));

    }

    checkLoaderHideUrl(url) {
      let check = false;
      this.reload_path.forEach(element => {
        element = element.replace(/[\/]/g, '\\$&');

        if (url.match(element)) {
          // console.log('match', url.match(element));
          // if (check === false) { check = true; }
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
      setTimeout(() => {  this.slimLoadingBarService.start(() => {
            // console.log('Loading complete');
        }); } , 10);
    }

    private hideLoader(): void {
        this.slimLoadingBarService.complete();
    }
}
