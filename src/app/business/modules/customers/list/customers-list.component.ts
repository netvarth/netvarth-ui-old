import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { Router, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { LastVisitComponent } from '../../medicalrecord/last-visit/last-visit.component';
import { VoicecallDetailsSendComponent } from '../../appointments/voicecall-details-send/voicecall-details-send.component';
@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html'
})

export class CustomersListComponent implements OnInit {
  first_name_cap = Messages.FIRST_NAME_CAP;
  email_cap = Messages.SERVICE_EMAIL_CAP;
  date_cap = Messages.DATE_COL_CAP;
  name_cap = Messages.COMMN_NAME_CAP;
  mobile_cap = Messages.CUSTOMER_MOBILE_CAP;
  last_visit_cap = Messages.LAST_VISIT_CAP;
  customers: any = [];
  customer_count: any = 0;
  filter_sidebar = false;
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
  customer_labels = '';
  no_customer_cap = '';
  checkin_label = '';
  checkedin_label = '';
  domain;
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
  minday = new Date(1900, 0, 1);
  maxday = new Date();
  filtericonTooltip = this.shared_functions.getProjectMesssages('FILTERICON_TOOPTIP');
  filtericonclearTooltip = this.shared_functions.getProjectMesssages('FILTERICON_CLEARTOOLTIP');
  tooltipcls = projectConstants.TOOLTIP_CLS;
  apiloading = false;
  srchcustdialogRef;
  crtCustdialogRef;
  calculationmode;
  showToken = false;
  filters: any = {
    'first_name': false,
    'date': false,
    'mobile': false,
    'email': false
  };
  customerselection = 0;
  customerSelected: any = [];
  selectedcustomersformsg: any[];
  showcustomer: any = [];
  customer: any = [];
  providerLabels: any;
  selectedIndex: any = [];
  hide_msgicon = false;
  mrdialogRef: any;
  selectedcustomersforcall: any[];
  customerlist: any;
  customerDetails: any;
  voicedialogRef: any;
  constructor(private provider_services: ProviderServices,
    private router: Router,
    public dialog: MatDialog,
    private provider_shared_functions: ProviderSharedFuctions,
    public dateformat: DateFormatPipe,
    private routerobj: Router,
    private shared_functions: SharedFunctions) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.no_customer_cap = Messages.NO_CUSTOMER_CAP.replace('[customer]', this.customer_label);
    this.customer_labels = this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1).toLowerCase() + 's';
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
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.getCustomersList(true);
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
  }
  filterClicked(type) {
    this.filters[type] = !this.filters[type];
    if (!this.filters[type]) {
      if (type === 'date') {
        this.filter[type] = null;
      } else {
        this.filter[type] = '';
      }
      this.doSearch();
    }
  }
  routeLoadIndicator(e) {
    this.apiloading = e;
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/customer']);
    }
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/customer']);
  }
  getCustomersList(from_oninit = true) {
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
                this.loadComplete = true;
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
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  doSearch() {
    this.getCustomersList();
    if (this.filter.first_name || this.filter.date || this.filter.mobile || this.filter.email) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  resetFilter() {
    this.filters = {
      'first_name': false,
      'date': false,
      'mobile': false,
      'email': false
    };
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
    if (this.customer_count <= 10) {
      this.pagination.startpageval = 1;
    }
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
      api_filter['dob-eq'] = this.shared_functions.transformToYMDFormat(this.filter.date);
    }
    if (this.filter.email !== '') {
      api_filter['email-eq'] = this.filter.email;
    }
    if (this.filter.mobile !== '') {
      const pattern = projectConstantsLocal.VALIDATOR_NUMBERONLY;
      const mval = pattern.test(this.filter.mobile);
      if (mval) {
        api_filter['phoneNo-eq'] = this.filter.mobile;
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
      this.doSearch();
    }
  }
  createCustomer() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        source: 'clist'
      }
    };
    this.router.navigate(['provider', 'customers', 'add'], navigationExtras);
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }

  selectcustomers(index, detail) {
    this.hide_msgicon = false;
    this.selectedcustomersformsg = [];
    this.selectedcustomersforcall = [];
    if (this.customerSelected[index]) {
      delete this.customerSelected[index];
      this.customerselection--;
    } else {
      this.customerSelected[index] = true;
      this.customerselection++;
    }
    for (let i = 0; i < this.customerSelected.length; i++) {
      if (this.customerSelected[i]) {
        if (this.selectedcustomersformsg.indexOf(this.customers[i]) === -1) {
          this.selectedcustomersformsg.push(this.customers[i]);
        }
      }
    }
    if (this.customerselection === 1) {
      if (!this.selectedcustomersformsg[0].phoneNo && !this.selectedcustomersformsg[0].email) {
        this.hide_msgicon = true;
      }
    }
    for (let i = 0; i < this.customerSelected.length; i++) {
      if (this.customerSelected[i]) {
        if (this.selectedcustomersforcall.indexOf(this.customers[i]) === -1) {
          this.selectedcustomersforcall.push(this.customers[i]);
        }
      }
    }
  }
  CustomersInboxMessage() {
    let customerlist = [];
    customerlist = this.selectedcustomersformsg;
    this.provider_shared_functions.ConsumerInboxMessage(customerlist, 'customer-list')
      .then(
        () => { },
        () => { }
      );
  }
  CreateVoiceCall() {
    this.customerlist = this.selectedcustomersforcall;
    for (let i in this.customerlist) {
      this.customerDetails = this.customerlist[i];
    }
    this.voicedialogRef = this.dialog.open(VoicecallDetailsSendComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        custId: this.customerDetails.id
      }
    });
  }
  editCustomer(customer) {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'edit' }
    };
    this.router.navigate(['/provider/customers/' + customer.id], navigationExtras);
  }
  viewCustomer(customer) {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'view' }
    };
    this.router.navigate(['/provider/customers/' + customer.id], navigationExtras);
  }
  searchCustomer() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        source: 'clist'
      }
    };
    this.router.navigate(['provider', 'customers', 'find'], navigationExtras);
  }
  lastvisits(customerDetail) {
    this.mrdialogRef = this.dialog.open(LastVisitComponent, {
      width: '80%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        patientId: customerDetail.id,
        customerDetail: customerDetail,
        back_type: 'consumer'
      }
    });
    this.mrdialogRef.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
      if (result.type === 'prescription') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['provider', 'customers', 'medicalrecord', 'prescription'], result.navigationParams);
      } else if (result.type === 'clinicalnotes') {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['provider', 'customers', 'medicalrecord', 'clinicalnotes'], result.navigationParams);
      }
    });

  }
  listMedicalrecords(customer) {
    const customerDetails = customer;
    const customerId = customerDetails.id;
    const mrId = 0;
    const bookingType = 'FOLLOWUP';
    const bookingId = 0;

    this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'list']);
  }
  medicalRecord(customerDetail) {
    const customerDetails = customerDetail;
    const customerId = customerDetails.id;
    const mrId = 0;
    const bookingType = 'FOLLOWUP';
    const bookingId = 0;

    this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'clinicalnotes']);
  }
  prescription(customerDetail) {
    const customerDetails = customerDetail;
    const customerId = customerDetails.id;
    const mrId = 0;
    const bookingType = 'FOLLOWUP';
    const bookingId = 0;

    this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
  }
  stopprop(event) {
    event.stopPropagation();
  }
}

