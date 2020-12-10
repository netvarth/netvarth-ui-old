import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { Messages } from '../../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { RazorpayService } from '../../../../shared/services/razorpay.service';
import { RazorpayprefillModel } from '../../../../shared/components/razorpay/razorpayprefill.model';
import { WindowRefService } from '../../../../shared/services/windowRef.service';
import { Razorpaymodel } from '../../../../shared/components/razorpay/razorpay.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    uuid: any;
    accountId: any;
    prepayment_amnt_cap = Messages.PREPAYMENT_AMOUNT_CAP;
    activeCatalog: any;
    prepaymentAmount: number;
    orderDetails: { 'amount': number; 'paymentMode': any; 'uuid': any; 'accountId': any; 'purpose': string; };
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
    prepayment;
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
                // this.uuid = params.id;
                console.log(this.uuid);
            });
        this.route.queryParams.subscribe(
            params => {
                this.checkIn_type = params.type_check;
                this.accountId = params.account_id;
                this.pid = params.pid;
                this.prepayment = params.prepayment;
                this.uuid = params.uuid
                console.log(this.pid);
            });
    }
    goBack() {
        this.router.navigate(['/']);
    }
    ngOnInit() {
        this.shared_services.getOrderByConsumerUUID(this.uuid, this.accountId).subscribe(
            (order: any) => {
                this.activeCatalog = order;
                this.orderDetails = {
                    'amount': this.prepayment,
                    'paymentMode': null,
                    'uuid': this.uuid,
                    'accountId': this.accountId,
                    'purpose': 'prePayment'
                };
                if (this.pid) {
                    this.shared_functions.setitemonLocalStorage('returntyp', 'consumer');
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
                           this.router.navigate(['consumer']);
                       
                    } else {
                        this.shared_functions.openSnackBar(Messages.PAY_FAILED_CAP, { 'panelClass': 'snackbarerror' });
                        this.router.navigate(['consumer']);
                    }
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    payuPayment() {
        console.log('hi');
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
        this.orderDetails.paymentMode = paymentMode;
        this.shared_functions.setitemonLocalStorage('uuid', this.uuid);
        this.shared_functions.setitemonLocalStorage('acid', this.accountId);
        this.shared_functions.setitemonLocalStorage('p_src', 'c_c');
        console.log(this.orderDetails);
        this.shared_services.consumerPayment(this.orderDetails)
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
        this.razorpayService.payWithRazor(this.razorModel, this.origin, this.checkIn_type, this.livetrack, this.accountId, this.uuid, this.prepayment);
    }

}
