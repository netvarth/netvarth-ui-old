import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WindowRefService } from './windowRef.service';
import { Router, NavigationExtras } from '@angular/router';
import { SharedServices } from './shared-services';
import { SharedFunctions } from '../functions/shared-functions';
import { Razorpaymodel } from '../components/razorpay/razorpay.model';
import { MatDialog } from '@angular/material/dialog';
import { Messages } from '../constants/project-messages';
import { SnackbarService } from './snackbar.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
// tslint:disable-next-line: component-class-suffix
export class RazorpayService {
  status_check: any;
  private paidStatus = new BehaviorSubject<string>('false');
  currentStatus = this.paidStatus.asObservable();


  constructor(
    public dialog: MatDialog,
    public winRef: WindowRefService,
    private router: Router,
    public sharedServices: SharedServices,
    public shared_functions: SharedFunctions,
    public razorpayModel: Razorpaymodel,
    private snackbarService: SnackbarService,
    private lStorageService: LocalStorageService,
    private ngZone: NgZone
  ) { }

  changePaidStatus(value: string) {
    this.paidStatus.next(value);
  }

  payBillWithoutCredentials(razorModel) {
    const self = this;
    razorModel.retry = false;
    return new Promise(function (resolve) {
      const options = razorModel;
      options.handler = ((response, error) => {
        options.response = response;
        resolve(response);
      });
      const rzp = new self.winRef.nativeWindow.Razorpay(options);
      rzp.open();
    });
  }
  payWithRazor(razorModel, usertype, checkin_type?, uuid?, livetrack?, account_id?, prepayment?, uuids?, from?) {
    let razorInterval;
    razorModel.retry = false;
    //   theme: {
    //     color: '#F37254'
    //   }
    // };
    razorModel.retry = false;
    razorModel.modal = {
      escape: false
    };
    const options = razorModel;
    options.handler = ((response, error) => {
      options.response = response;
      clearTimeout(razorInterval);
      let queryParams = {
        'details': JSON.stringify(options.response),
        'paidStatus': true,
        account_id: account_id,
        uuid: uuid
      };
      if(from) {
        queryParams['customId']= from;
      }
      let navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      if (usertype === 'consumer') {
        if (checkin_type === 'appointment') {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
        } else if (checkin_type === 'waitlist') {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
        } else if (checkin_type === 'order') {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
        } else if (checkin_type === 'appt_historybill') {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'history'],{ queryParams: { 'is_orderShow': 'false'}} ));
        } else if (checkin_type === 'checkin_historybill') {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'history'],{ queryParams: { 'is_orderShow': 'false'}} ));
        } else if (checkin_type === 'donations') {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          let queryParams = {
            account_id: account_id,
            uuid: uuid
          };
          if(from) {
            queryParams['customId']= from;
          }
          let navigationExtras: NavigationExtras = {
            queryParams: queryParams
          };
          this.ngZone.run(() => this.router.navigate(['consumer', 'donations', 'confirm'], navigationExtras));
        } else if (checkin_type === 'payment_link') {
          this.ngZone.run(() => this.router.navigate(['pay', livetrack], navigationExtras));
        } else if (checkin_type === 'checkin_prepayment') {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          let multiple;
          if (uuids && uuids.length > 1) {
            multiple = true;
          } else {
            multiple = false;
          }
          let queryParams = {
            'multiple': multiple,
            'prepayment': prepayment,
            'account_id': account_id,
            'uuid': uuids
          };
          if(from) {
            queryParams['customId']= from;
          }
          let navigationExtras: NavigationExtras = {
            queryParams: queryParams
          }
          setTimeout(() => {
          this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras));
          },700);
        } else if (checkin_type === 'appt_prepayment') {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          let queryParams = {
            'prepayment': prepayment,
            'account_id': account_id,
            'uuid': uuid
          };
          if(from) {
            queryParams['customId']= from;
          }
          let navigationExtras: NavigationExtras = {
            queryParams: queryParams
          }
          setTimeout(() => {
            this.ngZone.run(() => this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras));
          },700);
         
        } else if (checkin_type === 'order_prepayment') {
          this.lStorageService.removeitemfromLocalStorage('order_sp');
          this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
          this.lStorageService.removeitemfromLocalStorage('order_spId');
          this.lStorageService.removeitemfromLocalStorage('order');
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          this.ngZone.run(() => this.router.navigate(['consumer'] ,{ queryParams: { 'source': 'order'}}));
        }
      } else {
        this.router.navigate(['provider', 'license', 'payments'], navigationExtras);
      }
      //   call your backend api to verify payment signature & capture transaction
      // });
      // options.modal.ondismiss = (() => {
      //   // handle the case when user closes the form while transaction is in progress
    });

    options.modal.ondismiss = (() => {
      if (usertype === 'consumer') {
        if (checkin_type === 'checkin_prepayment') {
          this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
          this.ngZone.run(() => this.router.navigate(['consumer']));
        }
      }
      if (checkin_type === 'appt_prepayment') {
        this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
        this.ngZone.run(() => this.router.navigate(['consumer']));
      }
      if (checkin_type === 'order_prepayment') {
        this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
        this.ngZone.run(() => this.router.navigate(['consumer']));
      }
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
    razorInterval = setTimeout(() => {
      rzp.close();
      location.reload();
    }, 540000);
  }
}
