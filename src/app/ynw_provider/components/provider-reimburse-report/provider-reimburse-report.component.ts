import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { RequestForComponent } from '../request-for/request-for.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ProviderServices } from '../../services/provider-services.service';


@Component({
  selector: 'app-provider-reimburse-report',
  templateUrl: './provider-reimburse-report.component.html',
  styleUrls: ['./provider-reimburse-report.component.css']
})
export class ProviderReimburseReportComponent implements OnInit {
  couponreport: any[];
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Coupons',
      url: '/provider/settings/coupons'
    },
    {
      title: 'Report'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  open_filter = false;
  requestdialogRef;
  constructor(private dialog: MatDialog, private router: Router, private provider_servicesobj: ProviderServices) {
  }
  ngOnInit() {
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
    this.couponreport = this.provider_servicesobj.getJaldeeCouponReports();
  }
  reportView() {
    this.router.navigate(['provider', 'settings', 'coupons', 'report', 'report_view']);
  }
}
