import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WindowRefService } from './windowRef.service';
import { SharedServices } from './shared-services';
import { SharedFunctions } from '../functions/shared-functions';


@Injectable()
// tslint:disable-next-line: component-class-suffix
export class RazorpayService {
  status_check: any;
  private paidStatus = new BehaviorSubject<string>('false');
  currentStatus = this.paidStatus.asObservable();
  paymentModes = [{ method: "netbanking" }, { method: "paylater" }, { method: "card" },
  { method: "upi" }, { method: "wallet" }];

  constructor(
    public winRef: WindowRefService,
    public sharedServices: SharedServices,
    public shared_functions: SharedFunctions,
    // public razorpayModel: Razorpaymodel,
    // private prefillmodel: RazorpayprefillModel
  ) { }

  changePaidStatus(value: string) {
    this.paidStatus.next(value);
  }

  payBillWithoutCredentials(pData) {
    const self = this;

    let prefillModel = {}

    prefillModel['name'] = pData.consumerName;
    prefillModel['email'] = pData.ConsumerEmail;
    prefillModel['contact'] = pData.consumerPhoneumber;

    let razorModel = {
      refill: prefillModel,
      key: pData.razorpayId,
      amount: pData.amount,
      currency: 'INR',
      order_id: pData.orderId,
      name: pData.providerName,
      description: pData.description,
      mode: pData.paymentMode,
      retry: false,
      theme: {
        color: '#F37254'
      },
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false
      },
      notes: {
        // include notes if any
      }
    }
    let selectedmode = pData.paymentMode;
    if (selectedmode === 'DC' || selectedmode === 'CC') {
      selectedmode = 'CARD';
    }
    const hiddenObject = this.paymentModes.filter((mode) => mode.method !== selectedmode.toLowerCase());
    razorModel['config'] = {
      display: {
        hide: hiddenObject
      }
    }
    return new Promise(function (resolve) {
      const options = razorModel;
      options['handler'] = ((response, error) => {
        options['response'] = response;

        resolve(response);
      });
      const rzp = new self.winRef.nativeWindow.Razorpay(options);
      rzp.open();
    });
  }
  // payWithRazor(pData, usertype, checkin_type?, uuid?, livetrack?, account_id?, prepayment?, uuids?, from?, isfrom?) {

  // }
  onReloadPage() {
    window.location.reload();
  }
  updateRazorPay(payload, account_id, usertype) {
    const self = this;
    if (usertype === 'consumer') {
      return new Promise((resolve, reject) => {
        self.sharedServices.updateRazorPay(payload, account_id)
          .subscribe(result => {
            console.log('result' + result);
            resolve(result);
          }, error => {
            reject(false);
          })
      })
    } else {
      return new Promise((resolve, reject) => {
        self.sharedServices.updateRazorPayForProvider(payload)
          .subscribe(result => {
            console.log('result' + result);
            resolve(result);
          }, error => {
            reject(false);
          })
      })
    }
  }

  initializePayment(pData: any, accountId, referrer, type?) {

    // if (type === 'provider') {
    //   this.prefillmodel.name = pData.providerName;
    // } else {
    //   this.prefillmodel.name = pData.consumerName;
    // }
    // this.prefillmodel.email = pData.ConsumerEmail;
    // this.prefillmodel.contact = pData.consumerPhoneumber;
    // let razorModel = new Razorpaymodel(this.prefillmodel);
    // razorModel.key = pData.razorpayId;
    // razorModel.amount = pData.amount;
    // razorModel.order_id = pData.orderId;
    // razorModel.name = pData.providerName;
    // razorModel.description = pData.description;

    let razorInterval;
    // razorModel.retry = false;
    let prefillModel = {}
    if (type === 'provider') {
      prefillModel['name'] = pData.providerName;
      } else {
        prefillModel['name'] = pData.consumerName;
      }
    prefillModel['name'] = pData.consumerName;
    prefillModel['email'] = pData.ConsumerEmail;
    prefillModel['contact'] = pData.consumerPhoneumber;

    let razorModel = {
      refill: prefillModel,
      key: pData.razorpayId,
      amount: pData.amount,
      currency: 'INR',
      order_id: pData.orderId,
      name: pData.providerName,
      description: pData.description,
      mode: pData.paymentMode,
      retry: false,
      theme: {
        color: '#F37254'
      },
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false
      },
      notes: {
        // include notes if any
      }
    }
    let selectedmode = pData.paymentMode;

    if (selectedmode === 'DC' || selectedmode === 'CC') {
      selectedmode = 'CARD';
    }
    if (selectedmode === 'NB') {
      selectedmode = 'NETBANKING';
    }
    //   theme: {
    //     color: '#F37254'
    //   }
    // };
    console.log(selectedmode);
    const hiddenObject = this.paymentModes.filter((mode) => mode.method !== selectedmode.toLowerCase());
    console.log('hideenobject' + JSON.stringify(hiddenObject));
    razorModel['config'] = {
      display: {
        hide: hiddenObject
      }
    }
    // razorModel.retry = false;
    // razorModel.modal = {
    //   escape: false
    // };
    const options = razorModel;

    options['handler'] = ((response, error) => {
      options['response'] = response;
      console.log('orpitons.response' + JSON.stringify(options['response']));

      const razorpay_payload = {
        "paymentId": response.razorpay_payment_id,
        "orderId": response.razorpay_order_id,
        "signature": response.razorpay_signature
      };

      let successResponse = {
        STATUS: 'TXN_SUCCESS',
        SRC: 'razorPay'
      }
      clearTimeout(razorInterval);
      referrer.transactionCompleted(successResponse, razorpay_payload, accountId);
      //   call your backend api to verify payment signature & capture transaction
      // });
      // options.modal.ondismiss = (() => {
      //   // handle the case when user closes the form while transaction is in progress
    });

    options.modal['ondismiss'] = (() => {
      let failureResponse = {
        STATUS: 'TXN_FAILURE',
        SRC: 'razorPay'
      }
      referrer.transactionCompleted(failureResponse, null, accountId);
    });

    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
    razorInterval = setTimeout(() => {
      rzp.close();
      location.reload();
    }, 540000);
  }
}
