import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';
import {SharedFunctions} from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-invoice-detail',
  templateUrl: './provider-invoice-detail.component.html'
})
export class ProviderInvoiceDetailComponent implements OnInit {

  api_error = null;
  api_success = null;
  invoice: any  = null;
  payment_modes: any = [];
  payment_detail = null;
  payment_status = null;

  constructor(
    public dialogRef: MatDialogRef<ProviderInvoiceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions
    ) {
       this.invoice = data.invoice || null;
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

}
