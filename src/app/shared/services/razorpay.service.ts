import { Injectable, Component, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WindowRefService } from './windowRef.service';
import { Router, NavigationExtras } from '@angular/router';
import { SharedServices } from './shared-services';
import { SharedFunctions } from '../functions/shared-functions';
import { ProviderServices } from '../../ynw_provider/services/provider-services.service';
import { Razorpaymodel } from '../components/razorpay/razorpay.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Messages } from '../constants/project-messages';
// import { ConsumerPaymentmodeComponent } from '../components/consumer-paymentmode/consumer-paymentmode.component';


@Injectable()
// tslint:disable-next-line: component-class-suffix
export class RazorpayService {
  status_check: any;
  private paidStatus = new BehaviorSubject<string>('false');
  currentStatus = this.paidStatus.asObservable();


  constructor(
    // public dialogRef: MatDialogRef<ConsumerPaymentmodeComponent>,
    public dialog: MatDialog,
    public winRef: WindowRefService,
    private router: Router,
    public sharedServices: SharedServices,
    // public sharedfunctionObj: SharedFunctions,
    public shared_functions: SharedFunctions,
    private provider_servicesobj: ProviderServices,
    public razorpayModel: Razorpaymodel,
    private ngZone: NgZone
  ) { }

  changePaidStatus(value: string) {
    this.paidStatus.next(value);
    console.log(value);
  }
  payWithRazor(razorModel, usertype, checkin_type?, livetrack?, account_id?, uuid?) {
    //   theme: {
    //     color: '#F37254'
    //   }
    // };
    const options = razorModel;
    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options.response);
      const dataToSend: FormData = new FormData();
      dataToSend.append('razorpay_payment_id', response.razorpay_payment_id);
      dataToSend.append('razorpay_order_id', response.razorpay_order_id);
      dataToSend.append('razorpay_signature', response.razorpay_signature);
      dataToSend.append('status', 'SUCCESS');
      dataToSend.append('txnid', '');
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'details': JSON.stringify(options.response),
          'paidStatus': true,
          account_id: account_id,
          uuid: uuid
        }
      };
      console.log(usertype);
      console.log(checkin_type);
      if (usertype === 'consumer') {
        this.sharedServices.consumerPaymentStatus(dataToSend)
          .subscribe(
            data => {
              this.status_check = data;
              if (this.status_check === 'success') {
                if (checkin_type === 'appointment') {
                  this.shared_functions.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                  this.ngZone.run(() => this.router.navigate(['consumer', 'appointment', 'bill'], navigationExtras));
                } else if (checkin_type === 'waitlist') {
                  this.shared_functions.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                  this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'bill'], navigationExtras));
                } else if (checkin_type === 'donations') {
                  this.shared_functions.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                  this.ngZone.run(() => this.router.navigate(['consumer', 'donations']));
                } else if (checkin_type === 'checkin_prepayment') {
                  console.log(livetrack);
                  if (livetrack === true) {
                    console.log(uuid);
                    this.shared_functions.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                    this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'track', uuid], navigationExtras));
                  } else {
                    this.shared_functions.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                    this.ngZone.run(() => this.router.navigate(['consumer'], { queryParams: { 'source': 'checkin_prepayment' } }));
                  }
                } else if (checkin_type === 'appt_prepayment') {
                  console.log(livetrack);
                  if (livetrack === true) {
                    console.log(uuid);
                    this.shared_functions.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                    this.ngZone.run(() => this.router.navigate(['consumer', 'appointment', 'track', uuid], navigationExtras));
                  } else {
                    this.shared_functions.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
                    this.ngZone.run(() => this.router.navigate(['consumer'], { queryParams: { 'source': 'appt_prepayment' } }));
                  }
                }
              }
            });
      } else {
        this.provider_servicesobj.providerPaymentStatus(dataToSend)
          .subscribe(
            data => {
              this.status_check = data;
              if (this.status_check === 'success') {
                this.router.navigate(['provider', 'license', 'payments'], navigationExtras);
              }
            }
          );
      }
      //   call your backend api to verify payment signature & capture transaction
      // });
      // options.modal.ondismiss = (() => {
      //   // handle the case when user closes the form while transaction is in progress
      //   console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }
}
