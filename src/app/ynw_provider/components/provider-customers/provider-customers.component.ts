import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
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
  name_cap = Messages.COMMN_NAME_CAP;
  mobile_cap = Messages.CUSTOMER_MOBILE_CAP;
  last_visit_cap = Messages.LAST_VISIT_CAP;
  customers: any = [];
  customer_count: any = 0;
  filterapplied = false;
  open_filter = false;
  filter = {
    first_name: '',
    date: null,
    mobile: '',
    email: '',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  }; // same in resetFilter Fn
  customer_label = '';
  no_customer_cap = '';
  checkin_label = '';
  checkedin_label = '';
  breadcrumb_moreoptions: any = [];
  breadcrumbs_init = [
    {
      title: this.customer_label
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  isCheckin;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  loadComplete = false;
  minday= new Date(2015, 0, 1);
  filtericonTooltip = this.shared_functions.getProjectMesssages('FILTERICON_TOOPTIP');
  filtericonclearTooltip = this.shared_functions.getProjectMesssages('FILTERICON_CLEARTOOLTIP');
  tooltipcls = projectConstants.TOOLTIP_CLS;
  constructor(private provider_services: ProviderServices,
    private shared_functions: SharedFunctions) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.no_customer_cap = Messages.NO_CUSTOMER_CAP.replace('[customer]', this.customer_label);
    this.breadcrumbs_init = [
      {
        title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1).toLowerCase() + 's'
      }
    ];
    this.breadcrumbs = this.breadcrumbs_init;
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
    // this.checkedin_label = this.shared_functions.getTerminologyTerm('waitlisted');
    this.checkedin_label = Messages.CHECKED_IN_LABEL;
  }

  ngOnInit() {
    this.getCustomersList(true);
    this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'customer', 'subKey': 'services' };
    this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
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
  clearFilter() {
    this.resetFilter();
    this.filterapplied = false;
    this.getCustomersList(true);
  }
  getCustomersListCount(filter) {
    return new Promise((resolve, reject) => {
      this.provider_services.getProviderCustomersCount(filter)
        .subscribe(
          data => {
            this.pagination.totalCnt = data;
            this.customer_count = this.pagination.totalCnt;
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
    if (this.filter.first_name || this.filter.date || this.filter.mobile || this.filter.email) {
      this.filterapplied = true;
    }
    else {
      this.filterapplied = false;
    }
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
