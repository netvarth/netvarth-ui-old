import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { Messages } from '../../../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Razorpaymodel } from '../../../../../shared/components/razorpay/razorpay.model';
import { RazorpayprefillModel } from '../../../../../shared/components/razorpay/razorpayprefill.model';
import { RazorpayService } from '../../../../../shared/services/razorpay.service';
import { WindowRefService } from '../../../../../shared/services/windowRef.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';

@Component({
    selector: 'app-consumer-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
})
export class ConsumerPaymentComponent implements OnInit {
    uuid: any;
    accountId: any;
    prepayment_amnt_cap = Messages.PREPAYMENT_AMOUNT_CAP;
    // breadcrumbs = [
    //     {
    //         title: 'My Jaldee',
    //         url: '/consumer'
    //     },
    //     {
    //         title: 'Payment'
    //     }
    // ];
    // breadcrumb_moreoptions: any = [];
    activeWt: any;
    livetrack: any;
    prepaymentAmount: number;
    waitlistDetails: { 'amount': number; 'paymentMode': any; 'uuid': any; 'accountId': any; 'purpose': string; };
    payment_popup: any;
    pid: any;
    status: any;
    pGateway: any;
    razorModel: Razorpaymodel;
    origin: string;
    checkIn_type: any;
    members;
    iconClass: string;
    prepayment;
    uuids: any = [];
    constructor(public router: Router,
        public route: ActivatedRoute,
        public shared_functions: SharedFunctions,
        private shared_services: SharedServices,
        private wordProcessor: WordProcessor,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
        @Inject(DOCUMENT) public document,
        public _sanitizer: DomSanitizer,
        public razorpayService: RazorpayService,
        public prefillmodel: RazorpayprefillModel,
        public winRef: WindowRefService,
        // private cdRef: ChangeDetectorRef,
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
                this.members = params.members;
                this.prepayment = params.prepayment;
                this.uuids = params.uuids;
            });
    }

    ngOnInit() {
        this.shared_services.getCheckinByConsumerUUID(this.uuid, this.accountId).subscribe(
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
                this.livetrack = this.activeWt.service.livetrack;
                // this.prepaymentAmount = this.activeWt.service.minPrePaymentAmount * this.members.length;
                this.prepaymentAmount = this.prepayment;
                this.waitlistDetails = {
                    'amount': this.prepaymentAmount,
                    'paymentMode': null,
                    'uuid': this.uuid,
                    'accountId': this.accountId,
                    'purpose': 'prePayment'
                };
                if (this.pid) {
                    this.lStorageService.setitemonLocalStorage('returntyp', 'consumer');
                    this.getPaymentStatus(this.pid);
                }
            },
            () => {
            }
        );
    }
    getPaymentStatus(pid) {
        this.lStorageService.removeitemfromLocalStorage('acid');
        this.lStorageService.removeitemfromLocalStorage('uuid');
        this.shared_services.getPaymentStatus('consumer', pid)
            .subscribe(
                data => {
                    this.status = data;
                    this.status = this.status.toLowerCase();
                    if (this.status === 'success') {
                        this.snackbarService.openSnackBar(Messages.PAY_DONE_SUCCESS_CAP);
                        if (this.activeWt.service.livetrack) {
                            this.router.navigate(['consumer', 'checkin', 'track']);
                        } else {
                            this.router.navigate(['consumer']);
                        }
                    } else {
                        this.snackbarService.openSnackBar(Messages.PAY_FAILED_CAP, { 'panelClass': 'snackbarerror' });
                        this.router.navigate(['consumer']);
                    }
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
    goBack() {
        this.router.navigate(['/consumer']);
    }
    paytmPayment() {
        let paymentWay;
        paymentWay = 'PPI';
        this.makeFailedPayment(paymentWay);
    }
    makeFailedPayment(paymentMode) {
        this.waitlistDetails.paymentMode = paymentMode;
        this.lStorageService.setitemonLocalStorage('uuid', this.uuid);
        this.lStorageService.setitemonLocalStorage('acid', this.accountId);
        this.lStorageService.setitemonLocalStorage('p_src', 'c_c');
        this.shared_services.consumerPayment(this.waitlistDetails)
            .subscribe((pData: any) => {
                this.origin = 'consumer';
                this.pGateway = pData.paymentGateway;
                if (this.pGateway === 'RAZORPAY') {
                    this.paywithRazorpay(pData);
                } else {
                    if (pData['response']) {
                        this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
                        setTimeout(() => {
                            if (paymentMode === 'DC') {
                                this.document.getElementById('payuform').submit();
                            } else {
                                this.document.getElementById('paytmform').submit();
                            }
                        }, 2000);
                    } else {
                        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
                    }
                }
            },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
        this.razorpayService.payWithRazor(this.razorModel, this.origin, this.checkIn_type, this.livetrack, this.accountId, this.uuid, this.prepayment, this.uuids);
    }
}
