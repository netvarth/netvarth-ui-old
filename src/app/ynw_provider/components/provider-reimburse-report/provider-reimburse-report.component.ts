import { Component, OnInit } from '@angular/core';
import { projectConstants } from '../../../shared/constants/project-constants';
import { RequestForComponent } from '../request-for/request-for.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import * as moment from 'moment';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { from } from 'rxjs';
@Component({
  selector: 'app-provider-reimburse-report',
  templateUrl: './provider-reimburse-report.component.html',
  styleUrls: ['./provider-reimburse-report.component.css']
})
export class ProviderReimburseReportComponent implements OnInit {
  no_reports_msg = Messages.NO_REPORTS_MSG;
  date_from_cap = Messages.DATE_FROM_CAP;
  date_to_cap = Messages.DATE_TO_CAP;
  coupon_amt_cap = Messages.REPORT_COUPON_AMT_CAP;
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
  report_statuses = projectConstants.REPORT_STATUSES;
  report_status_filter = projectConstants.REPORT_STATUS_FILTER;
  api_error = null;
  api_success = null;
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
  filter = {
    from_date: null,
    to_date: null,
    pay_status: 'all',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  }; // same in resetFilter Fn
  filter_date_start_min = null;
  filter_date_start_max = null;
  filter_date_end_min = null;
  filter_date_end_max = null;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  reportsCount;
  requestdialogRef;
  constructor(private dialog: MatDialog, private router: Router,
    private sharedfunctionObj: SharedFunctions, private provider_servicesobj: ProviderServices) {
  }

  ngOnInit() {
    this.setFilterDateMaxMin();
    this.resetFilter();
    console.log('I am Here');
    this.getCouponReport();
  }
  getJSONfromString(jsonString) {
      return JSON.parse(jsonString);
  }
  /**
   * Open Modal for Request for Payment
   * @param reportId Report Id
   */
  openrequestModal(reportId) {
    this.requestdialogRef = this.dialog.open(RequestForComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        id: reportId
      }
    });
    this.requestdialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        // this.sharedfunctionObj.openSnackBar(Messages.SCCESS_MSG);
        this.getCouponReport();
      }
    });
  }

  /** Filter Related Functions*/
  /**
   * Toggle Filter
   */
  toggleFilter() {
    this.open_filter = !this.open_filter;
  }
  /**
   * Reset Filter Values
   */
  resetFilter() {
    this.filter = {
      from_date: null,
      to_date: null,
      pay_status: 'all',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
    };
  }
  /**
   * Set Max and Min Value for Date Filter
   */
  setFilterDateMaxMin() {
    this.filter_date_start_min = null;
    this.filter_date_start_max = null;
    this.filter_date_end_min = null;
    this.filter_date_end_max = null;
    this.filter_date_start_max = moment(new Date()).add(-1, 'days');
    this.filter_date_end_max = moment(new Date()).add(0, 'days');
  }
  /**
   * Set Pagination Parameters for API Call
   * @param api_filter Filter Parameters
   */
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  /**
   * Reset Pagination Parameters
   */
  resetPaginationData() {
    this.filter.page = 1;
    this.pagination.startpageval = 1;
  }
  /**
   * Check Filter Max and Min Date
   * @param type From/To Date
   */
  checkFilterDateMaxMin(type) {
    if (type === 'from_date') {
      this.filter_date_end_min = this.filter.from_date;
      // if (this.filter.to_date < this.filter.from_date) {
      //   this.filter.to_date = this.filter.from_date;
      // }
    } else if (type === 'to_date') {
      this.filter_date_start_max = this.filter.to_date;
      // if (this.filter.to_date < this.filter.from_date) {
      //   this.filter.from_date = this.filter.to_date;
      // }
    }
    this.doSearch();
  }
  /**
   * set Filter Values for Rest API Coupon List
   */
  setFilterForApi() {
    const api_filter = {};
    if (this.filter.pay_status !== 'all') {
      api_filter['status-eq'] = this.filter.pay_status;
    }
    if (this.filter.from_date != null) {
      api_filter['reportFromDate-ge'] = this.filter.from_date.format('YYYY-MM-DD');
    }
    if (this.filter.to_date != null) {
      api_filter['reportEndDate-le'] = this.filter.to_date.format('YYYY-MM-DD');
    }
    return api_filter;
  }
  /**
   * Set Filter Values
   * @param type Filter Key eg. status-eq
   * @param value Filter Value eg. PAYMENTPENDING
   */
  setFilterData(type, value) {
    this.filter[type] = value;
    this.resetPaginationData();
    this.doSearch();
  }
  /**
   * To Get Focus to Fields While Enter Key Pressed
   * @param ev Event eg. KeyUp
   * @param input Field Name eg. TextBox
   */
  focusInput(ev, input) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      input.focus();
    }
  }
  /**
   * Search When Enter Key Pressed
   * @param ev Event
   */
  focusInputSp(ev) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      this.doSearch();
    }
  }
  /**
   * When Pagination Next/Previous Clicked
   * @param pg Page Number
   */
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.doSearch();
  }
  /**
   * Perform Search Action
   */
  doSearch() {
    this.loadApiSwitch('doSearch');
  }
  /**
   * Perform Rest Call for Getting Reports
   */
  getCouponReport() {
    this.query_executed = false;
    let filter = this.setFilterForApi();
    const promise = this.getCouponReportCount(filter);
    promise.then(
      result => {
        this.pagination.totalCnt = result;
        filter = this.setPaginationFilter(filter);
        this.provider_servicesobj.getJaldeeCouponReports(filter)
          .subscribe(data => {
            this.couponreport = data;
            this.query_executed = true;
          });
      }
    );
  }
  /**
   * Call Report View Page
   * @param invoiceId Report/Invoice Id
   */
  reportView(invoiceId) {
    this.router.navigate(['provider', 'settings', 'coupons', 'report', invoiceId]);
  }
  /**
   * Format a Date to DD/MM/YYYY
   * @param dateStr Date String
   */
  formatDateDisplay(dateStr) {
    return this.sharedfunctionObj.formatDateDisplay(dateStr);
  }
  /**
   * Reload APIs
   */
  reloadAPIs() {
    this.countApiCall();
    this.loadApiSwitch('reloadAPIs');
  }
  /**
   * Call Count API Call
   */
  countApiCall() {
    this.getCouponReportCount();
  }
  /**
   * Perform Rest Count API
   * @param filter Filter
   */
  getCouponReportCount(filter = null) {
    return new Promise((resolve, reject) => {
      this.provider_servicesobj.getJaldeeCouponReportsCount(filter)
        .subscribe(
          count => {
            this.reportsCount = count;
            resolve(count);
          },
          error => {
          });
    });
  }
  /**
   * Load APIs
   * @param source Perform Filter/Reload APIs
   */
  loadApiSwitch(source) {
    if (source !== 'doSearch' && source !== 'reloadAPIs') {
      this.resetFilter();
    }
    this.getCouponReport();
  }
}
