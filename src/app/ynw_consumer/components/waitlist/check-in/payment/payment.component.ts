import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { Messages } from '../../../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-consumer-payment',
    templateUrl: './payment.component.html'
})
export class ConsumerPaymentComponent implements OnInit {
    uuid: any;
    accountId: any;
    prepayment_amnt_cap = Messages.PREPAYMENT_AMOUNT_CAP;
    breadcrumbs;
    breadcrumb_moreoptions: any = [];
    activeWt: any;
    prepaymentAmount: number;
    waitlistDetails: { 'amount': number; 'paymentMode': any; 'uuid': any; 'accountId': any; 'purpose': string; };
    payment_popup: any;

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
            });
    }

    ngOnInit() {
        this.breadcrumbs = [
            {
                title: 'Checkin',
                url: ''
            },
            {
                title: 'Payment'
            }
        ];
        this.shared_services.getCheckinByConsumerUUID(this.uuid, this.accountId).subscribe(
            (wailist: any) => {
                this.activeWt = wailist;
                console.log(this.activeWt);
                this.prepaymentAmount = this.activeWt.service.minPrePaymentAmount * this.activeWt.waitlistingFor.length;
                this.waitlistDetails = {
                    'amount': this.prepaymentAmount,
                    'paymentMode': null,
                    'uuid': this.uuid,
                    'accountId': this.accountId,
                    'purpose': 'prePayment'
                };
            },
            () => {
            }
        );
    }
    payuPayment() {
        console.log('payupayment');
        let paymentWay;
        paymentWay = 'DC';
        this.makeFailedPayment(paymentWay);
    }
    paytmPayment() {
        console.log('paytmPayment');
        let paymentWay;
        paymentWay = 'PPI';
        this.makeFailedPayment(paymentWay);
    }

    makeFailedPayment(paymentMode) {
        this.waitlistDetails.paymentMode = paymentMode;
        console.log(this.waitlistDetails);
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
