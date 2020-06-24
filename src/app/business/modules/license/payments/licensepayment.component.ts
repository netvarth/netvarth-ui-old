import { Component, Inject, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { WindowRefService } from '../../../../shared//services/windowRef.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RazorpayService } from '../../../../shared//components/razorpay/razorpay.service';
import { RazorpayprefillModel } from '../../../../shared/components/razorpay/razorpayprefill.model';
import { SharedServices } from '../../../../shared/services/shared-services';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Razorpaymodel } from '../../../../shared/components/razorpay/razorpay.model';

@Component({
  selector: 'app-payments',
  templateUrl: './licensepayment.component.html',
  providers: [RazorpayService ,
              WindowRefService]
})
export class PaymentComponent implements OnInit {
  payment_popup = null;
  breadcrumbs;
  // breadcrumbs = [
  //   {
  //     title: 'License & Invoice',
  //     url: '/provider/license'
  //   },
  //   {
  //       title: 'Payments'
  //   }
  // ];
  // breadcrumbs = this.breadcrumbs_init;
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
  public paidStatus: boolean;
  razorpay_signature: any;

  constructor(
    private activated_route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public winRef: WindowRefService,
    @Inject(DOCUMENT) public document,
    public _sanitizer: DomSanitizer,
    public razorpayService: RazorpayService,
    public prefillmodel: RazorpayprefillModel ) {
    this.activated_route.queryParams.subscribe (qparams => {
       this.data = qparams;
       this.waitlistDetails = JSON.parse(this.data.details);
       this.razorpayService.changePaidStatus(this.data.paidStatus);
       this.razorpayService.currentStatus.subscribe( status => {
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
    // this.breadcrumbs = this.breadcrumbs_init;
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
            this.shared_functions.setitemonLocalStorage('p_src', 'p_lic');
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
  paywithRazorpay(pData: any ) {
    this.razorModel = new Razorpaymodel(this.prefillmodel);
    this.razorModel.key = pData.razorpayId;
    this.razorModel.amount = pData.amount;
    this.razorModel.order_id = pData.orderId;
    this.razorpayService.payWithRazor(this.razorModel , this.origin );
  }

}
