import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
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
import { SubSink } from 'subsink';

@Component({
    selector: 'app-consumer-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
})
export class ConsumerPaymentComponent implements OnInit,OnDestroy {
   private subs=new SubSink();
    uuid: any;
    accountId: any;
    prepayment_amnt_cap = Messages.PREPAYMENT_AMOUNT_CAP;
  
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
    paymentmodes: any;
    isPayment: boolean;
    indian_payment_modes: any;
    non_indian_modes: any;
    shownonIndianModes: boolean;
    selected_payment_mode: any;
    isInternatonal: boolean;
    isClickedOnce: boolean;
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
       this.subs.sink= this.route.params.subscribe(
            params => {
                this.uuid = params.id;
            });
            this.subs.sink= this.route.queryParams.subscribe(
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
        this.subs.sink=this.shared_services.getCheckinByConsumerUUID(this.uuid, this.accountId).subscribe(
            (wailist: any) => {
                this.activeWt = wailist;
                if (this.activeWt.service.serviceType === 'virtualService') {
                    switch (this.activeWt.service.virtualCallingModes[0].callingMode) {
                        case 'Zoom': {
                            this.iconClass = 'fa zoom-icon';
                            break;
                        }
                        case 'VideoCall': {
                            this.iconClass = 'fa jvideo-icon jvideo-icon-s jvideo-icon-mgm5';
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
    ngOnDestroy(): void {
       this.subs.unsubscribe();
    }
    getPaymentStatus(pid) {
        this.lStorageService.removeitemfromLocalStorage('acid');
        this.lStorageService.removeitemfromLocalStorage('uuid');
        this.subs.sink= this.shared_services.getPaymentStatus('consumer', pid)
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
     
        this.makeFailedPayment();
    }
    goBack() {
        this.router.navigate(['/consumer']);
    }
    getPaymentModes() {
   
        this.shared_services.getPaymentModesofProvider(this.accountId, this.sel_ser, 'prePayment')
            .subscribe(
                data => {
                    this.paymentmodes = data[0];
                    this.isPayment = true;
                    if (this.paymentmodes.indiaPay) {
                        this.indian_payment_modes = this.paymentmodes.indiaBankInfo;
                    }
                     if (this.paymentmodes.internationalPay) {
                        this.non_indian_modes = this.paymentmodes.internationalBankInfo;
 
                    }
                    if(!this.paymentmodes.indiaPay && this.paymentmodes.internationalPay){
                        this.shownonIndianModes=true;
                    }else{
                        this.shownonIndianModes=false;  
                    }

                },
                error => {
                    this.isPayment = false;
                    console.log(this.isPayment);
                }


            );
    }
    sel_ser(accountId: any, sel_ser: any, arg2: string) {
        throw new Error("Method not implemented.");
    }
    indian_payment_mode_onchange(event) {
        this.selected_payment_mode = event.value;
        this.isInternatonal = false;



    }
    non_indian_modes_onchange(event) {
        this.selected_payment_mode = event.value;
        this.isInternatonal = true;



    }
    togglepaymentMode(){
        this.shownonIndianModes=!this.shownonIndianModes;
    }
    

    getImageSrc(mode){
    
        return '../../../../../assets/images/payment-modes/'+mode+'.png';
    }
    makeFailedPayment() {
        this.isClickedOnce=true
        this.waitlistDetails.paymentMode = this.selected_payment_mode;
        this.lStorageService.setitemonLocalStorage('uuid', this.uuid);
        this.lStorageService.setitemonLocalStorage('acid', this.accountId);
        this.lStorageService.setitemonLocalStorage('p_src', 'c_c');
        this.subs.sink=this.shared_services.consumerPayment(this.waitlistDetails)
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
                     
                                this.document.getElementById('paytmform').submit();
                            
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
        this.razorModel.mode=this.selected_payment_mode;
        this.razorpayService.payWithRazor(this.razorModel, this.origin, this.checkIn_type, this.uuid, this.livetrack, this.accountId, this.prepayment, this.uuids);
    }
}
