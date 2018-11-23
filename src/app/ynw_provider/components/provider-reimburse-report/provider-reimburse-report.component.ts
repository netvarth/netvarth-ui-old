import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { RequestForComponent } from '../request-for/request-for.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-reimburse-report',
  templateUrl: './provider-reimburse-report.component.html',
  styleUrls: ['./provider-reimburse-report.component.css']
})
export class ProviderReimburseReportComponent implements OnInit {
  status_cap = Messages.PRO_STATUS_CAP;
  all_cap = Messages.ALL_CAP;
  reimburse_report_cap = Messages.REIMBUSE_REPORT_CAP;
  report_id_cap = Messages.REPORT_ID_CAP;
  time_period_cap = Messages.TIME_PERIOD_CAP;
  coup_use_cap = Messages.COUP_USE_CAP;
  j_acc_cap = Messages.J_ACC_CAP;
  reimburse_amt_cap = Messages.REIMBURSE_AMT_CAP;
  req_payment_cap = Messages.REQ_PAYMENT_CAP;
  couponreport: any = [];
  query_executed = false;
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'Coupons',
      url: '/provider/settings/coupons'
    },
    {
      title: 'Reports'
    }
  ];
  open_filter = false;
  requestdialogRef;
  constructor(private dialog: MatDialog, private router: Router, private provider_servicesobj: ProviderServices) {
  }
  ngOnInit() {
    console.log('I am Here');
     this.getCouponReport();
  }
  toggleFilter() {
    this.open_filter = !this.open_filter;
  }
  openrequest() {
    this.requestdialogRef = this.dialog.open(RequestForComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
      }
    });
    this.requestdialogRef.afterClosed().subscribe(result => {
    });
  }
  getCouponReport() {
    this.couponreport = this.provider_servicesobj.getJaldeeCouponReports()
      .subscribe(data => {
        this.couponreport = data;
        this.query_executed = true;
      });
  }
  reportView(invoiceId) {
    // this.router.navigate(['provider', 'settings', 'coupons', 'report', invoiceId]);
  }
}
