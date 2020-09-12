import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { Messages } from '../../../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { RazorpayService } from '../../../../../shared/services/razorpay.service';
import { RazorpayprefillModel } from '../../../../../shared/components/razorpay/razorpayprefill.model';
import { WindowRefService } from '../../../../../shared/services/windowRef.service';
import { Razorpaymodel } from '../../../../../shared/components/razorpay/razorpay.model';

@Component({
    selector: 'app-consumer-payment',
    templateUrl: './payment.component.html'
})
export class ConsumerAppointmentPaymentComponent implements OnInit {
    uuid: any;
    accountId: any;
    prepayment_amnt_cap = Messages.PREPAYMENT_AMOUNT_CAP;
    breadcrumbs = [
        {
            title: 'My Jaldee',
            url: '/consumer'
        },
        {
            title: 'Payment'
        }
    ];
    breadcrumb_moreoptions: any = [];
    activeWt: any;
    prepaymentAmount: number;
    waitlistDetails: { 'amount': number; 'paymentMode': any; 'uuid': any; 'accountId': any; 'purpose': string; };
    payment_popup: any;
    pid: any;
    status: any;
    razorModel: Razorpaymodel;
    checkIn_type: any;
    origin: string;
    pGateway: any;
    livetrack: any;
    consumer_name: any;
    iconClass: string;

    constructor(public router: Router,
        public route: ActivatedRoute,
        public shared_functions: SharedFunctions,
        private shared_services: SharedServices,
        @Inject(DOCUMENT) public document,
        public _sanitizer: DomSanitizer,
        public razorpayService: RazorpayService,
        public prefillmodel: RazorpayprefillModel,
        public winRef: WindowRefService,
    ) {
        this.route.params.subscribe(
            params => {
                this.uuid = params.id;
            });
        this.route.queryParams.subscribe(
            params => {
                this.checkIn_type = params.type_check;
                this.accountId = params.account_id;
                this.pid = params.pid;
            });
    }

    ngOnInit() {
        this.shared_services.getAppointmentByConsumerUUID(this.uuid, this.accountId).subscribe(
            (wailist: any) => {
                this.activeWt = wailist;
                if (this.activeWt.service.serviceType === 'virtualService') {
                    switch (this.activeWt.service.virtualCallingModes[0].callingMode) {
                      case 'Zoom': {
                        this.iconClass = 'fa zoom-icon';
                        break;
                      }
                      case 'GoogleMeet': {
                        this.iconClass = 'fa meet-icon';
                        break;
                      }
                      case 'WhatsApp': {
                        if (this.activeWt.service.virtualServiceType === 'audioService') {
                          this.iconClass = 'fa wtsapaud-icon';
                        } else {
                          this.iconClass = 'fa wtsapvid-icon';
                        }
                        break;
                      }
                      case 'Phone': {
                        this.iconClass = 'fa phon-icon';
                        break;
                      }
                    }
                  }
                this.consumer_name = this.activeWt.appmtFor[0].userName;
                this.livetrack = this.activeWt.service.livetrack;
                this.prepaymentAmount = this.activeWt.service.minPrePaymentAmount * this.activeWt.appmtFor.length;
                this.waitlistDetails = {
                    'amount': this.prepaymentAmount,
                    'paymentMode': null,
                    'uuid': this.uuid,
                    'accountId': this.accountId,
                    'purpose': 'prePayment'
                };
                if (this.pid) {
                    this.getPaymentStatus(this.pid);
                }
            },
            () => {
            }
        );
    }
    getPaymentStatus(pid) {
        this.shared_functions.removeitemfromLocalStorage('acid');
        this.shared_functions.removeitemfromLocalStorage('uuid');
        this.shared_services.getPaymentStatus('consumer', pid)
          .subscribe(
            data => {
              this.status = data;
              this.status = this.status.toLowerCase();
              if (this.status === 'success') {
                this.shared_functions.openSnackBar(Messages.PAY_DONE_SUCCESS_CAP);
                if (this.activeWt.service.livetrack) {
                    this.router.navigate(['consumer', 'appointment', 'track']);
                } else {
                    this.router.navigate(['consumer']);
                }
              } else {
                this.shared_functions.openSnackBar(Messages.PAY_FAILED_CAP, { 'panelClass': 'snackbarerror' });
                this.router.navigate(['consumer']);
              }
            },
            error => {
              this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
        /*this.user_type = 'consumer';
        this.loading = 0;
        this.status = 'Success'; // Success // 'Failed' // 'NoResult'
        this.status = this.status.toLowerCase();*/
      }
    payuPayment() {
        let paymentWay;
        paymentWay = 'DC';
        this.makeFailedPayment(paymentWay);
    }
    paytmPayment() {
        let paymentWay;
        paymentWay = 'PPI';
        this.makeFailedPayment(paymentWay);
    }
    makeFailedPayment(paymentMode) {
        this.waitlistDetails.paymentMode = paymentMode;
        this.shared_functions.setitemonLocalStorage('uuid', this.uuid);
        this.shared_functions.setitemonLocalStorage('acid', this.accountId);
        this.shared_functions.setitemonLocalStorage('p_src', 'c_c');
        this.shared_services.consumerPayment(this.waitlistDetails)
            .subscribe((pData: any) => {
                this.origin = 'consumer';
                this.pGateway = pData.paymentGateway;
                if (this.pGateway === 'RAZORPAY') {
                    this.paywithRazorpay(pData);
                   } else {

                if (pData['response']) {
                    this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
                    this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
                    setTimeout(() => {
                        if (paymentMode === 'DC') {
                            this.document.getElementById('payuform').submit();
                        } else {
                            this.document.getElementById('paytmform').submit();
                        }
                    }, 2000);
                } else {
                    this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
                }
            }
            },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    paywithRazorpay(pData: any) {
        this.prefillmodel.name = pData.consumerName;
        this.prefillmodel.email = pData.ConsumerEmail;
        this.prefillmodel.contact = pData.consumerPhoneumber;
        this.razorModel = new Razorpaymodel(this.prefillmodel);
        this.razorModel.key = pData.razorpayId;
        this.razorModel.amount = pData.amount;
           this.razorModel.order_id = pData.orderId;
           this.razorModel.name = pData.providerName;
           this.razorModel.description = pData.description;
        this.razorpayService.payWithRazor(this.razorModel , this.origin , this.checkIn_type ,  this.livetrack  ,  this.accountId , this.uuid);
    }

}
