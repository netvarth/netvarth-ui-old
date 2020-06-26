import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { ProviderLicenceInvoiceDetailComponent } from '../provider-licence-invoice-detail/provider-licence-invoice-detail.component';
import { Messages } from '../../../shared/constants/project-messages';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-provider-payment-history',
  templateUrl: './provider-payment-history.component.html'
})
export class ProviderPaymentHistoryComponent implements OnInit {

  date_cap = Messages.DATE_COL_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  period_cap = Messages.PERIOD_CAP;
  invoice_cap = Messages.INVOICE_CAP;
  no_transaction = Messages.NO_TRANSACTION;
  payment_cap = Messages.PAYMENT_CAP;
  paid_cap = Messages.CHECK_DET_PAID_CAP;
  billing_cap = Messages.BILLIN_CAP;
  payment_history: any = [];
  load_complete = 0;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  isCheckin;
  breadcrumbs = [
    {
      title: 'License & Invoice',
      url: '/provider/license'
    },
    {
      title: 'Payment History'
    }
  ];

  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: projectConstants.PERPAGING_LIMIT
  };
  activated_route: any;
  data: any;

  constructor(private provider_servicesobj: ProviderServices,
    private dialog: MatDialog,
    private router: Router,
    private sharedfunctionObj: SharedFunctions,
    private locationobj: Location
  )  {}
  ngOnInit() {
    this.getPaymentHistoryCount();
    this.getPaymentHistory();
    this.isCheckin = this.sharedfunctionObj.getitemFromGroupStorage('isCheckin');
  }

  getPaymentHistoryCount() {
    this.provider_servicesobj.getInvoicesHistoryWithStatusCount()
      .subscribe(
        (data: any) => {
          this.pagination.totalCnt = data;
        },
        () => {

        }
      );
  }

  getPaymentHistory() {
    const api_filter = this.setPaginationFilter();
    this.provider_servicesobj.getInvoicesHistoryWithStatus(api_filter)
      .subscribe(data => {
        this.payment_history = data;
      },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.load_complete = 1;
        },
        () => {
          this.load_complete = 1;
        });
  }

  goback() {
    this.locationobj.back();
  }
   getInvoice(invoice){
    // console.log(invoice);
    // const dialogRef = this.dialog.open(ProviderLicenceInvoiceDetailComponent, {
    //   width: '50%',
    //   data: {
    //     invoice: invoice,
    //     source: 'payment-history'
    //   },
    //   panelClass: ['popup-class', 'commonpopupmainclass', 'smallform'],
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(() => {
    // });    
 
    const invoiceJson = JSON.stringify(invoice);
    const navigationExtras: NavigationExtras = {
      queryParams: { invoice: invoiceJson,
                     source: 'payment-history'},
                     skipLocationChange: true
     
        };
          //  console.log(navigationExtras);
       this.router.navigate(['provider', 'license', 'Statements'],navigationExtras);
      



       
  }

  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.getPaymentHistory();
  }

  setPaginationFilter() {
    const api_filter = {};
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    api_filter['count'] = this.pagination.perPage;

    return api_filter;
  }
  gotoStatements() {
    this.router.navigate(['provider', 'license', 'Statements']);
}
}
