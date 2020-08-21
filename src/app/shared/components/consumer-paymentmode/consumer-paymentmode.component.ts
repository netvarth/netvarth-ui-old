import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-consumer-paymentmode',
  templateUrl: './consumer-paymentmode.component.html',
  // styleUrls: ['./home.component.scss']
})
export class ConsumerPaymentmodeComponent implements OnInit {

  servicesjson: any = [];
  payment_popup = null;
  waitlistDetails: any = [];
  prepayAmount: any;
  origin;

  constructor(public dialogRef: MatDialogRef<ConsumerPaymentmodeComponent>,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) public document,
    public _sanitizer: DomSanitizer) { }



  ngOnInit() {
    this.waitlistDetails = this.data.details;
    this.prepayAmount = this.data.details.amount;
    this.origin = this.data.origin;

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
    if (this.origin === 'consumer') {
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
    } else {
      this.shared_services.providerPayment(this.waitlistDetails)
        .subscribe(pData => {
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
        },
          error => {
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          });
    }
  }
}
