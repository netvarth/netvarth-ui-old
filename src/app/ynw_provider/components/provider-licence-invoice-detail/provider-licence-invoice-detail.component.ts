import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';
import {SharedFunctions} from '../../../shared/functions/shared-functions';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-provider-licence-invoice-detail',
  templateUrl: './provider-licence-invoice-detail.component.html'
})
export class ProviderLicenceInvoiceDetailComponent implements OnInit {

  @ViewChild('div') div: ElementRef;

  api_error = null;
  api_success = null;
  invoice: any  = null;
  payment_modes: any = [];
  payment_detail = null;
  payment_status = null;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  pay_data = {
    amount: 0,
    paymentMode: null,
    uuid: null
  };
  payment_popup = null;
  constructor(
    public dialogRef: MatDialogRef<ProviderLicenceInvoiceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) public document
    ) {
       this.invoice = data.invoice || null;
       this.pay_data.amount = this.invoice.amount;
       this.pay_data.uuid = this.invoice.ynwUuid;
     }

  ngOnInit() {
    console.log(this.invoice);

    this.payment_status = this.invoice.licensePaymentStatus || null;

    this.invoiceDetail();
    if (this.payment_status === 'NotPaid') {
      this.getPaymentModes();
    } else if (this.payment_status === 'Paid') {
      this.getPaymentDetails();
    } else {
      this.dialogRef.close();
    }

  }

  invoiceDetail() {
    this.provider_services.getInvoice(this.invoice.ynwUuid)
    .subscribe(
      data => {
        this.invoice = data;
      },
      error => {
        this.shared_functions.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  getPaymentModes() {
    this.provider_services.getPaymentModes()
    .subscribe(
      data => {
        this.payment_modes = data;
      },
      error => {
        this.shared_functions.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  getPaymentDetails() {
    this.provider_services.getPaymentDetail(this.invoice.ynwUuid)
    .subscribe(
      data => {
        this.payment_detail = data;
      },
      error => {
        this.shared_functions.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  makePayment() {

    if (this.pay_data.uuid && this.pay_data.amount &&
      this.pay_data.amount !== 0 && this.pay_data.paymentMode) {

      this.provider_services.providerPayment(this.pay_data)
      .subscribe(
        data => {

          this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(data['response']);
          setTimeout(() => {
            console.log(this.document.getElementById('payuform'));
            this.document.getElementById('payuform').submit();
          }, 2000);
        },
        error => {
          this.shared_functions.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );

    }


  }
}
