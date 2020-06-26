import { Injectable, Component, NgZone } from '@angular/core';
// import { WindowRefService } from '../../services/windowRef.service';
// import { Razorpaymodel } from './razorpay.model';
// import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
// import { SharedFunctions } from '../../functions/shared-functions';
// import { Router, NavigationExtras } from '@angular/router';
// import { MatDialogRef, MatDialog } from '@angular/material';
// import { ConsumerPaymentmodeComponent } from '../consumer-paymentmode/consumer-paymentmode.component';
// import { SharedServices } from '../../services/shared-services';
import { BehaviorSubject } from 'rxjs';
import { WindowRefService } from './windowRef.service';
import { Router, NavigationExtras } from '@angular/router';
import { SharedServices } from './shared-services';
import { SharedFunctions } from '../functions/shared-functions';
import { ProviderServices } from '../../ynw_provider/services/provider-services.service';
import { Razorpaymodel } from '../components/razorpay/razorpay.model';
import { MatDialog, MatDialogRef } from '@angular/material';
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
        public  winRef: WindowRefService,
        private router: Router,
        public sharedServices: SharedServices,
        public shared_functions: SharedFunctions,
        private provider_servicesobj: ProviderServices,
         public razorpayModel: Razorpaymodel,
         private ngZone: NgZone
        ) { }

  changePaidStatus(value: string) {
    this.paidStatus.next(value);
    console.log(value);
  }
    payWithRazor(razorModel , usertype , checkin_type? ) {
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
          dataToSend.append ('razorpay_payment_id', response.razorpay_payment_id);
          dataToSend.append ('razorpay_order_id', response.razorpay_order_id);
          dataToSend.append ('razorpay_signature', response.razorpay_signature);
          dataToSend.append ('status' , 'SUCCESS');
          dataToSend.append ('txnid' , '' );
          const navigationExtras: NavigationExtras = {
            queryParams: {
              'details': JSON.stringify(options.response),
              'paidStatus': true
            }
          };
          console.log(usertype);
          console.log(checkin_type);
          if (usertype === 'consumer') {
            console.log('in');
            this.sharedServices.consumerPaymentStatus(dataToSend)
            .subscribe(
                data => {
                  this.status_check = data;
                if ( this.status_check === 'success' ) {

                  if ( checkin_type === 'appointment') {
                    this.ngZone.run(() => this.router.navigate(['consumer', 'appointment', 'bill'], navigationExtras));
                  } else if (checkin_type === 'waitlist') {
                    this.ngZone.run(() => this.router.navigate(['consumer', 'checkin', 'bill'], navigationExtras));
                  } else if (checkin_type === 'checkin_prepayment') {
                    this.ngZone.run(() => this.router.navigate(['consumer']));
                    // this.ngZone.run(() => this.router.navigate(['consumer'], navigationExtras));
                  } else if (checkin_type === 'appt_prepayment') {
                    // this.router.navigate(['consumer']);
                    this.ngZone.run(() => this.router.navigate(['consumer']));
                  }
                  }
          });
          } else {
            this.provider_servicesobj.providerPaymentStatus(dataToSend)
            .subscribe(
                data => {
                  this.status_check = data;
                if ( this.status_check === 'success' ) {
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
