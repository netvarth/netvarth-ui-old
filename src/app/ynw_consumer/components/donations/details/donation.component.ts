import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { Messages } from '../../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-consumer-donate-payment',
    templateUrl: './payment.component.html'
})
export class ConsumerDonationPaymentComponent implements OnInit {
    uuid: any;
    accountId: any;
    prepayment_amnt_cap = Messages.PREPAYMENT_AMOUNT_CAP;
    breadcrumbs;
    breadcrumb_moreoptions: any = [];
    activeWt: any;
    prepaymentAmount: number;
    waitlistDetails: { 'amount': number; 'paymentMode': any; 'uuid': any; 'accountId': any; 'purpose': string; };
    payment_popup: any;
    pid: any;
    status: any;
    customer_data: any;

    constructor(public router: Router,
        public route: ActivatedRoute,
        public shared_functions: SharedFunctions,
        private shared_services: SharedServices,
        @Inject(DOCUMENT) public document,
        public _sanitizer: DomSanitizer
    ) {
        this.route.params.subscribe(
            params => {
                this.uuid = params.id;
            });
        this.route.queryParams.subscribe(
            params => {
                this.accountId = params.account_id;
                this.pid = params.pid;
            });
    }

    ngOnInit() {
        const activeUser = this.shared_functions.getitemFromGroupStorage('ynw-user');
        // this.api_loading = false;
        if (activeUser) {
            this.customer_data = activeUser;
        }
        this.breadcrumbs = [
            {
                title: 'Donation',
                url: ''
            },
            {
                title: 'Payment'
            }
        ];
        this.shared_services.getDonationByConsumerUUID(this.uuid, this.accountId).subscribe(
            (wailist: any) => {
                this.activeWt = wailist;
                this.prepaymentAmount = this.activeWt.donationAmount;
                this.waitlistDetails = {
                    'amount': this.activeWt.donationAmount,
                    'paymentMode': null,
                    'uuid': this.uuid,
                    'accountId': this.accountId,
                    'purpose': 'prePayment'
                };
                // if (this.pid) {
                //     this.getPaymentStatus(this.pid);
                // }
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
                this.router.navigate(['consumer', 'checkin', 'track']);
              } else {
                this.shared_functions.openSnackBar(Messages.PAY_FAILED_CAP, { 'panelClass': 'snackbarerror' });
              }
            },
            error => {
              this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
          );
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
            .subscribe(pData => {
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
            },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }

}
