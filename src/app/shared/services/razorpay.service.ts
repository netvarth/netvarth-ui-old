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
declare var RazorpayCheckout: any;

@Injectable()
// tslint:disable-next-line: component-class-suffix
export class RazorpayService {
  status_check: any;
  private paidStatus = new BehaviorSubject<string>('false');
  currentStatus = this.paidStatus.asObservable();
  paymentModes = [
    {
      method: "netbanking"
    },
    {
      method: "paylater"
    },
    {
      method: "card"
    },
    {
      method: "upi"
    },
    {
      method: "wallet"
    }

  ];


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
    let selectedmode = razorModel.mode;
    if (selectedmode === 'DC' || selectedmode === 'CC') {
      selectedmode = 'CARD';
    }

    const hiddenObject = this.paymentModes.filter((mode) => mode.method !== selectedmode.toLowerCase());
    razorModel.config = {
      display: {
        hide: hiddenObject
      }
    }
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

  payWithRazor(razorModel, usertype, checkin_type?, uuid?, livetrack?, account_id?, prepayment?, uuids?, from?, isfrom?) {
    let razorInterval;
    razorModel.retry = false;
    let selectedmode = razorModel.mode;
    console.log(selectedmode);
    if (selectedmode === 'DC' || selectedmode === 'CC') {
      selectedmode = 'CARD';
    }
    if (selectedmode === 'NB') {
      selectedmode = 'NETBANKING';
    }
    console.log(selectedmode);
    const hiddenObject = this.paymentModes.filter((mode) => mode.method !== selectedmode.toLowerCase());
    console.log('hideenobject' + JSON.stringify(hiddenObject));
    razorModel.config = {
      display: {
        hide: hiddenObject
      }
    }
    razorModel.retry = false;
    razorModel.modal = {
      escape: false
    };
    console.log('hoooiii' + JSON.stringify(razorModel.config));
    const options = razorModel;

    var successCallback = (response) => {
      console.log(response);
      clearTimeout(razorInterval);
      // alert('payment_id: ' + payment_id);
      // console.log(order_id);
      console.log(response);
      const razorpay_payload = {

        "paymentId": response.razorpay_payment_id,
        "orderId": response.razorpay_order_id,
        "signature": response.razorpay_signature

      };
      let queryParams = {
        'details': JSON.stringify(options.response),
        'paidStatus': true,
        account_id: account_id,
        uuid: uuid
      };
      if (from) {
        queryParams['customId'] = from;
      }
      if (isfrom) {
        queryParams['isFrom'] = isfrom;
      }
      let navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      this.updateRazorPay(razorpay_payload, account_id, usertype).then((data) => {

        if (data) {
          this.paymentCompleted(usertype, checkin_type, navigationExtras, livetrack, uuids, prepayment, account_id, from, isfrom, uuid);
        }
      });
      //Navigate to another page using the nav controller
      //this.navCtrl.setRoot(SuccessPage)
      //Inject the necessary controller to the constructor
    };

    var cancelCallback = (error) => {
      clearTimeout(razorInterval);
      console.log(error.description + ' (Error ' + error.code + ')');

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
      if (checkin_type === 'appointment') {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            uuid: uuid,
            accountId: livetrack,
            type: 'appointment',
            'paidStatus': false
          }
        };
        console.log(navigationExtras)
        this.onReloadPage();
      }
      if (checkin_type === 'waitlist') {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            uuid: uuid,
            accountId: livetrack,
            type: 'waitlist',
            'paidStatus': false
          }
        };
        console.log(navigationExtras)
        this.onReloadPage();
      }
      if (checkin_type === 'order') {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            uuid: uuid,
            accountId: livetrack,
            type: 'order',
            'paidStatus': false
          }
        };
        console.log(navigationExtras);
        this.onReloadPage();
      }
      if (checkin_type === 'donations') {
        this.ngZone.run(() => {
          const snackBar = this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
          snackBar.onAction().subscribe(() => {
            snackBar.dismiss();
          })
        });
      }
    };
    RazorpayCheckout.open(options, successCallback, cancelCallback);
    razorInterval = setTimeout(() => {
      RazorpayCheckout.close();
        location.reload();
      }, 540000);

    // options.handler = ((response, error) => {
    //   options.response = response;
    //   console.log('orpitons.response' + JSON.stringify(options.response));
    //   const razorpay_payload = {

    //     "paymentId": response.razorpay_payment_id,
    //     "orderId": response.razorpay_order_id,
    //     "signature": response.razorpay_signature

    //   };

    //   clearTimeout(razorInterval);
    //   let queryParams = {
    //     'details': JSON.stringify(options.response),
    //     'paidStatus': true,
    //     account_id: account_id,
    //     uuid: uuid
    //   };
    //   if (from) {
    //     queryParams['customId'] = from;
    //   }
    //   if (isfrom) {
    //     queryParams['isFrom'] = isfrom;
    //   }
    //   let navigationExtras: NavigationExtras = {
    //     queryParams: queryParams
    //   };

    //   this.updateRazorPay(razorpay_payload, account_id, usertype).then((data) => {

    //     if (data) {
    //         this.paymentCompleted(usertype, checkin_type, navigationExtras,livetrack,uuids,prepayment,account_id,from, isfrom,uuid);
    //     }
    //   });
    // });

    // options.modal.ondismiss = (() => {
    //   if (usertype === 'consumer') {
    //     if (checkin_type === 'checkin_prepayment') {
    //       this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
    //       this.ngZone.run(() => this.router.navigate(['consumer']));
    //     }
    //   }
    //   if (checkin_type === 'appt_prepayment') {
    //     this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
    //     this.ngZone.run(() => this.router.navigate(['consumer']));
    //   }
    //   if (checkin_type === 'order_prepayment') {
    //     this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
    //     this.ngZone.run(() => this.router.navigate(['consumer']));
    //   }
    //   if (checkin_type === 'appointment') {
    //     const navigationExtras: NavigationExtras = {
    //       queryParams: {
    //         uuid: uuid,
    //         accountId: livetrack,
    //         type: 'appointment',
    //         'paidStatus': false
    //       }
    //     };
    //     console.log(navigationExtras)
    //     this.onReloadPage();
    //   }
    //   if (checkin_type === 'waitlist') {
    //     const navigationExtras: NavigationExtras = {
    //       queryParams: {
    //         uuid: uuid,
    //         accountId: livetrack,
    //         type: 'waitlist',
    //         'paidStatus': false
    //       }
    //     };
    //     console.log(navigationExtras)
    //     this.onReloadPage();
    //   }
    //   if (checkin_type === 'order') {
    //     const navigationExtras: NavigationExtras = {
    //       queryParams: {
    //         uuid: uuid,
    //         accountId: livetrack,
    //         type: 'order',
    //         'paidStatus': false
    //       }
    //     };
    //     console.log(navigationExtras);
    //     this.onReloadPage();
    //   }
    //   if (checkin_type === 'donations') {
    //     this.ngZone.run(() => {
    //       const snackBar = this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
    //       snackBar.onAction().subscribe(() => {
    //         snackBar.dismiss();
    //       })
    //     });
    //   }
    // });
    // const rzp = new this.winRef.nativeWindow.Razorpay(options);
    // rzp.open();
    // razorInterval = setTimeout(() => {
    //   rzp.close();
    //   location.reload();
    // }, 540000);
  }
  onReloadPage() {
    window.location.reload();

  }
  updateRazorPay(payload, account_id, usertype) {
    if (usertype === 'consumer') {
      return new Promise((resolve, reject) => {
        this.sharedServices.updateRazorPay(payload, account_id)
          .subscribe(result => {
            console.log('result' + result);
            resolve(result);
          }, error => {
            reject(false);
          })

      })
    } else {
      return new Promise((resolve, reject) => {
        this.sharedServices.updateRazorPayForPtovider(payload)
          .subscribe(result => {
            console.log('result' + result);
            resolve(result);
          }, error => {
            reject(false);
          })
      })
    }
  }
  paymentCompleted(usertype, checkin_type, navigationExtras, livetrack, uuids, prepayment, account_id, from, isfrom, uuid) {
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
        this.ngZone.run(() => this.router.navigate(['consumer', 'history'], { queryParams: { 'is_orderShow': 'false' } }));
      } else if (checkin_type === 'checkin_historybill') {
        this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
        this.ngZone.run(() => this.router.navigate(['consumer', 'history'], { queryParams: { 'is_orderShow': 'false' } }));
      } else if (checkin_type === 'donations') {
        this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
        this.ngZone.run(() => this.router.navigate(['consumer', 'donations', 'confirm'], { queryParams: { 'uuid': uuid } }));
      } else if (checkin_type === 'payment_link') {
        this.ngZone.run(() => this.router.navigate(['pay', livetrack], navigationExtras));
      } else if (checkin_type === 'checkin_prepayment') {

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
        if (from) {
          queryParams['customId'] = from;
        }
        if (isfrom) {
          queryParams['isFrom'] = isfrom;
        }
        let navigationExtras: NavigationExtras = {
          queryParams: queryParams
        }
        setTimeout(() => {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras));
        }, 700);
      } else if (checkin_type === 'appt_prepayment') {

        let queryParams = {
          'prepayment': prepayment,
          'account_id': account_id,
          'uuid': uuid
        };
        if (from) {
          queryParams['customId'] = from;
        }
        if (isfrom) {
          queryParams['isFrom'] = isfrom;
        }
        let navigationExtras: NavigationExtras = {
          queryParams: queryParams
        }
        setTimeout(() => {
          this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
          this.ngZone.run(() => this.router.navigate(['consumer', 'appointment', 'confirm'], navigationExtras));
        }, 700);

      } else if (checkin_type === 'order_prepayment') {
        this.lStorageService.removeitemfromLocalStorage('order_sp');
        this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
        this.lStorageService.removeitemfromLocalStorage('order_spId');
        this.lStorageService.removeitemfromLocalStorage('order');
        this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
        let queryParams = {
          'source': 'order',
        };
        if (uuids) {
          queryParams['customId'] = uuids;
          queryParams['accountId'] = account_id;
        }
        if (isfrom) {
          queryParams['isFrom'] = isfrom;
        }
        let navigationExtras: NavigationExtras = {
          queryParams: queryParams
        }
        this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
        // this.ngZone.run(() => this.router.navigate(['consumer'] ,{ queryParams: { 'source': 'order'}}));
      }
    } else {
      this.router.navigate(['provider', 'license', 'payments'], navigationExtras);
    }
  }
}
