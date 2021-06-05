import { catchError, switchMap, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, EMPTY } from 'rxjs';
import { base_url } from './../constants/urls';
import { SharedFunctions } from '../functions/shared-functions';
import { Messages } from '../constants/project-messages';
import { SharedServices } from '../services/shared-services';
// import { ForceDialogComponent } from '../components/force-dialog/force-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MaintenanceMsgComponent } from '../components/maintenance-msg/maintenance-msg.component';
import { SnackbarService } from '../services/snackbar.service';
import { LocalStorageService } from '../services/local-storage.service';
// import { Router } from '@angular/router';
// import { version } from '../constants/version' ;

@Injectable()
export class ExtendHttpInterceptor implements HttpInterceptor {
  no_redirect_path = [
    base_url + 'consumer/login',
    base_url + 'consumer/login/reset/\d{10,12}'
  ];
  reload_path = [
    base_url + 'consumer/communications/unreadCount',
    base_url + 'consumer/waitlist',
    base_url + 'provider/alerts/count',
    base_url + 'provider/communications/unreadCount'
  ];
  loaderDisplayed = false;
  loginAttempted = false;
  loginCompleted = false;
  forceUpdateCalled = false;
  stopThisRequest = false;

  constructor(private shared_functions: SharedFunctions,
    public shared_services: SharedServices, 
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private lStorageService: LocalStorageService) { }

  private _maintananceSubject: Subject<any> = new Subject<any>();
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
  private _checkMaintanance(error: HttpErrorResponse): boolean {
    return (
      error.status &&
      error.status === 405
    );
  }
  private _handleErrors(error: HttpErrorResponse): boolean {
    return;
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
                return throwError(error);
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
      }
      return next.handle(this.updateHeader(req, url)).pipe(
        catchError((error, caught) => {
          this._handleErrors(error);
          if (error instanceof HttpErrorResponse) {
            this.shared_services.callHealth(error.message);
            if (this._checkMaintanance(error)) {
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
                  });
                  return EMPTY;
                })
              );
            } else if (error.status === 0) {
              retry(2),
                this.snackbarService.openSnackBar(Messages.NETWORK_ERROR, { 'panelClass': 'snackbarerror' });
              return EMPTY;
            } else if (error.status === 404) {
              return throwError(error);
            } else if (error.status === 401) {
              this.shared_functions.logout();
              return EMPTY;
            } else if (error.status === 301) {
                return throwError(error);
            }  else {
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
    if(this.lStorageService.getitemfromLocalStorage('pre-header') && this.lStorageService.getitemfromLocalStorage('authToken')) {
      let authToken = this.lStorageService.getitemfromLocalStorage('pre-header') + "-" + this.lStorageService.getitemfromLocalStorage('authToken');
      req = req.clone({ headers: req.headers.append('Authorization', authToken), withCredentials: true });
    } 
    req = req.clone({ url: url, responseType: 'json' });
    console.log(req);
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

