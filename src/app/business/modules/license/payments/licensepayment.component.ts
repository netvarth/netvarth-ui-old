import { Component, Inject, ViewChild, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { WindowRefService } from '../../../../shared//services/windowRef.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RazorpayprefillModel } from '../../../../shared/components/razorpay/razorpayprefill.model';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Razorpaymodel } from '../../../../shared/components/razorpay/razorpay.model';
import { RazorpayService } from '../../../../shared/services/razorpay.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { projectConstantsLocal } from '../../../../../../src/app/shared/constants/project-constants';
import { PaytmService } from '../../../../../../src/app/shared/services/paytm.service';
import { Messages } from '../../../../../../src/app/shared/constants/project-messages';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
@Component({
  selector: 'app-payments',
  templateUrl: './licensepayment.component.html'
})
export class PaymentComponent implements OnInit {
  payment_popup = null;
  waitlistDetails: any = [];
  paymentresponse: any = [];
  origin;
  pGateway: any;
  razorModel: any;
  data: any;
  prepayAmount: any;
  orderid: any;
  razorpay_payment_id: any;
  razorpay_order_id: any;
  paidStatus = 'false';
  razorpay_signature: any;
  isClickedOnce = false;
  order_id: any;
  payment_id: any;
  @ViewChild('license_paylink') paytmview;
  accountId: any;
  paymentmodes: any;
  isPayment: boolean;
  indian_payment_modes: any;
  non_indian_modes: any;
  shownonIndianModes: boolean;
  selected_payment_mode: any;
  isInternatonal: boolean;
  constructor(
    private activated_route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private provider_services:ProviderServices,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private paytmService: PaytmService,
    public winRef: WindowRefService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) public document,
    public _sanitizer: DomSanitizer,
    public razorpayService: RazorpayService,
    public prefillmodel: RazorpayprefillModel,
    public location: Location, public router: Router) {
    this.activated_route.queryParams.subscribe(qparams => {
      this.data = qparams;
      this.waitlistDetails = JSON.parse(this.data.details);
      this.accountId = this.waitlistDetails.accountId;
      this.razorpayService.changePaidStatus(this.data.paidStatus);
      this.razorpayService.currentStatus.subscribe(status => {
        this.razorpay_order_id = this.waitlistDetails.razorpay_order_id;
        this.razorpay_payment_id = this.waitlistDetails.razorpay_payment_id;
        this.razorpay_signature = this.waitlistDetails.razorpay_signature;
        this.paidStatus = status;
        this.cdRef.detectChanges();
      });
      if (this.waitlistDetails.amount) {
        this.prepayAmount = this.waitlistDetails.amount;
      }
    });
  }
  ngOnInit() {
    this.getPaymentModes();
  }
  getPaymentModes() {

    this.provider_services.getPaymentModes()
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
indian_payment_mode_onchange(event) {
    this.selected_payment_mode = event.value;
    this.isInternatonal = false;



}
non_indian_modes_onchange(event) {
    this.selected_payment_mode = event.value;
    this.isInternatonal = true;



}
getImageSrc(mode){
    
  return 'assets/images/payment-modes/'+mode+'.png';
}
togglepaymentMode(){
    this.shownonIndianModes=!this.shownonIndianModes;
}

  makeFailedPayment() {
this.waitlistDetails.isInternational=this.isInternatonal;
this.waitlistDetails.paymentMode=this.selected_payment_mode;
this.waitlistDetails.serviceId=0;
    this.shared_services.providerPayment(this.waitlistDetails)
      .subscribe((pData: any) => {
        this.origin = 'provider';
        this.pGateway = pData.paymentGateway;
        if (this.pGateway === 'RAZORPAY') {
          this.paywithRazorpay(pData);
        } else {
          if (pData['response']) {
            this.lStorageService.setitemonLocalStorage('p_src', 'p_lic');
            this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
            pData.paymentMode=this.selected_payment_mode;
            setTimeout(() => {
              // if (paymentMode === 'DC') {
              //   this.document.getElementById('payuform').submit();
              // } else {
                this.paytmService.initializePayment(pData, projectConstantsLocal.PAYTM_URL, this.accountId, this);
             // }
            }, 2000);
          } else {
            this.isClickedOnce = false;
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
          }
        }
      },
        error => {
          this.isClickedOnce = false;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  paywithRazorpay(pData: any) {
    this.prefillmodel.name = pData.providerName;
    this.prefillmodel.email = pData.ConsumerEmail;
    this.prefillmodel.contact = pData.consumerPhoneumber;
    this.razorModel = new Razorpaymodel(this.prefillmodel);
    this.razorModel.key = pData.razorpayId;
    this.razorModel.amount = pData.amount;
    this.razorModel.order_id = pData.orderId;
    this.razorModel.description = pData.description;
    this.razorModel.name = pData.providerName;
    this.razorModel.mode=this.selected_payment_mode;
    this.razorpayService.payWithRazor(this.razorModel, this.origin);
    this.isClickedOnce = false;
  }
  transactionCompleted(response, payload, accountId) {
    if (response.STATUS == 'TXN_SUCCESS') {
      this.paytmService.updatePaytmPayForProvider(payload)
        .then((data) => {
          if (data) {
            this.paidStatus = 'true';
            this.order_id = response.ORDERID;
            this.payment_id = response.TXNID;
            this.cdRef.detectChanges();
            this.snackbarService.openSnackBar(Messages.PROVIDER_BILL_PAYMENT);
            this.ngZone.run(() => console.log('Transaction success'));
          }
        },
        error=>{
          this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' }); 
        })


    } else if (response.STATUS == 'TXN_FAILURE') {
      this.isClickedOnce = false;
      this.paidStatus = 'false';
      this.cdRef.detectChanges();
      this.snackbarService.openSnackBar("Transaction failed", { 'panelClass': 'snackbarerror' });
      this.ngZone.run(() => console.log('Transaction failed'));
    }
  }
  closeloading() {
    this.isClickedOnce = false;
    this.cdRef.detectChanges();
    this.snackbarService.openSnackBar('Your payment attempt was cancelled.', { 'panelClass': 'snackbarerror' });
    this.ngZone.run(() => console.log('cancelled'));
  }
  goBack() {
    if (this.paidStatus === 'true') {
      this.router.navigate(['provider', 'license']);
    } else {
      this.location.back();
    }
  }
}
