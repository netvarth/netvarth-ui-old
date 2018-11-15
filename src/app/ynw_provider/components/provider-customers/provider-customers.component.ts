import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/modules/header/header.component';

import { ProviderServices } from '../../services/provider-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { SharedServices } from '../../../shared/services/shared-services';

import * as moment from 'moment';

import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-provider-customers',
  templateUrl: './provider-customers.component.html'
})

export class ProviderCustomersComponent implements OnInit {

  first_name_cap = Messages.FIRST_NAME_CAP;
  email_cap = Messages.SERVICE_EMAIL_CAP;
  date_cap = Messages.DATE_COL_CAP;
  name_cap = Messages.PRO_NAME_CAP;
  mobile_cap = Messages.CUSTOMER_MOBILE_CAP;
  last_visit_cap = Messages.LAST_VISIT_CAP;
  no_customer_cap = Messages.NO_CUSTOMER_CAP;
  customers: any = [];
  customer_count: any = 0;
  open_filter = false;
  filter = {
    first_name: '',
    date: null,
    mobile: '',
    email: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  }; // same in resetFilter Fn

  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  loadComplete = false;
  customer_label = '';
  checkin_label = '';
  checkedin_label = '';
  filtericonTooltip = this.shared_functions.getProjectMesssages('FILTERICON_TOOPTIP');
  tooltipcls = projectConstants.TOOLTIP_CLS;
  constructor(private provider_services: ProviderServices,
    private router: Router,
    private shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private shared_services: SharedServices) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
    this.checkedin_label = this.shared_functions.getTerminologyTerm('waitlisted');
  }

  ngOnInit() {
    this.getCustomersList(true);
  }

  getCustomersList(from_oninit = false) {

    let filter = this.setFilterForApi();

    this.getCustomersListCount(filter)
      .then(
        result => {

          if (from_oninit) { this.customer_count = result; }

          filter = this.setPaginationFilter(filter);
          this.provider_services.getProviderCustomers(filter)
            .subscribe(
              data => {
                this.customers = data;
                this.loadComplete = true;
              },
              error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              }
            );
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

  }

  getCustomersListCount(filter) {
    return new Promise((resolve, reject) => {
      this.provider_services.getProviderCustomersCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            resolve(data);
          },
          error => {
            reject(error);
          }
        );
    });

  }


  toggleFilter() {
    this.open_filter = !this.open_filter;
  }

  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.doSearch();
  }

  doSearch() {
    this.getCustomersList();
  }

  resetFilter() {
    this.filter = {
      first_name: '',
      date: null,
      mobile: '',
      email: '',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
    };
  }

  setPaginationFilter(api_filter) {

    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;

    return api_filter;
  }

  setFilterForApi() {
    const api_filter = {};


    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }

    if (this.filter.date != null) {
      api_filter['date-eq'] = this.filter.date.format('YYYY-MM-DD');
    }

    if (this.filter.email !== '') {
      api_filter['email-eq'] = this.filter.email;
    }

    if (this.filter.mobile !== '') {
      const pattern = projectConstants.VALIDATOR_NUMBERONLY;
      const mval = pattern.test(this.filter.mobile);
      if (mval) {
        api_filter['primaryMobileNo-eq'] = this.filter.mobile;
      } else {
        this.filter.mobile = '';
      }

    }

    return api_filter;
  }
  focusInput(ev, input) {
    const kCode = parseInt(ev.keyCode, 10);
    if (kCode === 13) {
      input.focus();
    }
  }
}
