import { Component, Inject, ChangeDetectorRef, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-payments',
  templateUrl: './licensepayment.component.html'
})
export class PaymentComponent implements OnInit {
  payment_popup = null;
  breadcrumbs = [];
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

  constructor(
    private activated_route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    public winRef: WindowRefService,
    @Inject(DOCUMENT) public document,
    public _sanitizer: DomSanitizer,
    public razorpayService: RazorpayService,
    public prefillmodel: RazorpayprefillModel,
    public location: Location, public router: Router) {
    this.activated_route.queryParams.subscribe(qparams => {
      this.data = qparams;
      this.waitlistDetails = JSON.parse(this.data.details);
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
    this.breadcrumbs = [
      {
        title: 'License & Invoice',
        url: '/provider/license'
      },
      {
        title: 'Payments'
      }
    ];
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
    this.prefillmodel.name = pData.providerName;
    this.prefillmodel.email = pData.ConsumerEmail;
    this.prefillmodel.contact = pData.consumerPhoneumber;
    this.razorModel = new Razorpaymodel(this.prefillmodel);
    this.razorModel.key = pData.razorpayId;
    this.razorModel.amount = pData.amount;
    this.razorModel.order_id = pData.orderId;
    this.razorModel.description = pData.description;
    this.razorModel.name = pData.providerName;
    this.razorpayService.payWithRazor(this.razorModel, this.origin);
  }
  goBack() {
    if (this.paidStatus === 'true') {
      this.router.navigate(['provider', 'license']);
    } else {
      this.location.back();
    }
  }
}
