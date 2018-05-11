import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Location } from '@angular/common';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ProviderInvoiceDetailComponent } from '../provider-invoice-detail/provider-invoice-detail.component';


@Component({
  selector: 'app-provider-payment-history',
  templateUrl: './provider-payment-history.component.html'
})
export class ProviderPaymentHistoryComponent implements OnInit {

    payment_history: any = [] ;
    load_complete = 0;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
    breadcrumbs = [
      {
        title: 'Settings',
        url: '/provider/settings'
      },
      {
        title: 'License & Invoice',
        url: '/provider/settings/license'
      },
      {
      title: 'Payment History'
      }
    ];

    constructor( private provider_servicesobj: ProviderServices,
      private router: Router, private dialog: MatDialog,
      private sharedfunctionObj: SharedFunctions,
      private locationobj: Location
    ) {}

    ngOnInit() {
      this.getPaymentHistory();
    }


    getPaymentHistory() {
      this.provider_servicesobj.getInvoicesWithStatus('Paid')
        .subscribe(data => {
          this.payment_history = data;
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});

        },
      () => {
        this.load_complete = 1;
      });
    }

    goback() {
      this.locationobj.back();
    }

    getInvoice (invoice) {
      // console.log(invoice.ynwUuid);
      const dialogRef = this.dialog.open(ProviderInvoiceDetailComponent, {
        width: '50%',
        data: {
          invoice : invoice
        },
        panelClass: ['commonpopupmainclass'],
      });

      dialogRef.afterClosed().subscribe(result => {

      });

    }
}
