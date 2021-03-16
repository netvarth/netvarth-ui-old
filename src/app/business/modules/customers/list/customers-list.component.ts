import { Component, OnInit, ViewChild } from '@angular/core';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { LastVisitComponent } from '../../medicalrecord/last-visit/last-visit.component';
import { VoicecallDetailsSendComponent } from '../../appointments/voicecall-details-send/voicecall-details-send.component';
import { CustomerActionsComponent } from '../customer-actions/customer-actions.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ConfirmBoxComponent } from '../../../../shared/components/confirm-box/confirm-box.component';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
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
    jaldeeid: '',
    last_name: '',
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
  filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
  filtericonclearTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_CLEARTOOLTIP');
  tooltipcls = projectConstants.TOOLTIP_CLS;
  apiloading = false;
  srchcustdialogRef;
  crtCustdialogRef;
  calculationmode;
  showToken = false;
  filters: any = {
    'first_name': false,
    'jaldeeid': false,
    'last_name': false,
    'date': false,
    'mobile': false,
    'email': false
  };
  customerselection = 0;
  customerSelected: any = [];
  selectedcustomersformsg: any = [];
  showcustomer: any = [];
  customer: any = [];
  providerLabels: any;
  selectedIndex: any = [];
  hide_msgicon = false;
  mrdialogRef: any;
  selectedcustomersforcall: any = [];
  customerlist: any;
  customerDetails: any;
  voicedialogRef: any;
  subdomain;
  allCustomerSelected = false;
  selectedLabels: any = [];
  labelFilterData = '';
  allLabels: any = [];
  visibility = false;
  groups: any = [];
  selectedGroup;
  showCustomers = false;
  groupCustomers;
  groupDescription = '';
  groupName = '';
  groupEdit = false;
  @ViewChild('closebutton') closebutton;
  apiError = '';
  groupLoaded = false;
  groupIdEdit = '';
  showAddCustomerHint = false;
  newlyCreatedGroupId;
  constructor(private provider_services: ProviderServices,
    private router: Router,
    public dialog: MatDialog,
    private provider_shared_functions: ProviderSharedFuctions,
    public dateformat: DateFormatPipe,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private dateTimeProcessor:DateTimeProcessor) {
      if (this.groupService.getitemFromGroupStorage('group')) {
        this.selectedGroup = this.groupService.getitemFromGroupStorage('group');
      } else {
        this.selectedGroup = 'all';
      }
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.no_customer_cap = Messages.NO_CUSTOMER_CAP.replace('[customer]', this.customer_label);
    this.customer_labels = this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1).toLowerCase() + 's';
    this.breadcrumbs_init = [
      {
        title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1).toLowerCase() + 's'
      }
    ];
    this.breadcrumbs = this.breadcrumbs_init;
    this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');
    this.checkedin_label = Messages.CHECKED_IN_LABEL;
    this.activated_route.queryParams.subscribe(qparams => {
      if (qparams.selectedGroup && qparams.selectedGroup !== 'all') {
        this.addNewCustomertoGroup(qparams.customerId);
      }
    });
  }
  ngOnInit() {
    if (this.selectedGroup == 'all') {
      this.getCustomersList(true);
    } else {
      this.getCustomerListByGroup();
    }
    if (this.groupService.getitemFromGroupStorage('customerPage')) {
      this.pagination.startpageval = this.groupService.getitemFromGroupStorage('customerPage');
    }
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.subdomain = user.subSector;
    this.getLabel();
    this.getCustomerGroup();
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
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
    this.apiloading = true;
    this.customers = [];
    let filter = this.setFilterForApi();
    this.getCustomersListCount(filter)
      .then(
        result => {
          if (from_oninit) { this.customer_count = result; }
          if (!this.showCustomers) {
            filter = this.setPaginationFilter(filter);
          }
          this.provider_services.getProviderCustomers(filter)
            .subscribe(
              data => {
                this.customers = data;
                this.apiloading = false;
                this.loadComplete = true;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.apiloading = false;
                this.loadComplete = true;
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  clearFilter() {
    this.resetFilter();
    this.filterapplied = false;
    this.resetList();
    if (this.selectedGroup == 'all') {
      this.getCustomersList(true);
    } else {
      this.getCustomerListByGroup();
    }
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
    this.groupService.setitemToGroupStorage('customerPage', pg);
    this.filter.page = pg;
    this.doSearch('pageclick');
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  doSearch(type?) {
    if (!type) {
      this.resetList();
    }
    if (this.selectedGroup == 'all') {
      this.getCustomersList();
    } else {
      this.getCustomerListByGroup();
    }
    if (this.filter.jaldeeid || this.filter.first_name || this.filter.last_name || this.filter.date || this.filter.mobile || this.filter.email || this.labelFilterData !== '') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  resetFilter() {
    this.labelFilterData = '';
    this.selectedLabels = [];
    this.filters = {
      'first_name': false,
      'jaldeeid': false,
      'last_name': false,
      'date': false,
      'mobile': false,
      'email': false
    };
    this.filter = {
      jaldeeid: '',
      first_name: '',
      last_name: '',
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
    if (this.filter.jaldeeid !== '') {
      api_filter['jaldeeId-eq'] = this.filter.jaldeeid;
    }
    if (this.filter.last_name !== '') {
      api_filter['lastName-eq'] = this.filter.last_name;
    }
    if (this.filter.date != null) {
      api_filter['dob-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.date);
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
    if (this.labelFilterData !== '') {
      api_filter['label-eq'] = this.labelFilterData;
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

  selectcustomers(customer) {
    this.hide_msgicon = false;
    const custArr = this.selectedcustomersformsg.filter(cust => cust.id === customer.id);
    if (custArr.length === 0) {
      this.selectedcustomersformsg.push(customer);
    } else {
      this.selectedcustomersformsg.splice(this.selectedcustomersformsg.indexOf(customer), 1);
    }
    if (this.selectedcustomersformsg.length === 1) {
      if (!this.selectedcustomersformsg[0].phoneNo && !this.selectedcustomersformsg[0].email) {
        this.hide_msgicon = true;
      }
    } else {
      const customerList = this.selectedcustomersformsg.filter(customer => customer.phoneNo || customer.email);
      if (customerList.length === 0) {
        this.hide_msgicon = true;
      }
    }
    const custArr1 = this.selectedcustomersforcall.filter(cust => cust.id === customer.id);
    if (custArr1.length === 0) {
      this.selectedcustomersforcall.push(customer);
    } else {
      this.selectedcustomersforcall.splice(this.selectedcustomersforcall.indexOf(customer), 1);
    }
    if (this.selectedcustomersformsg.length === this.customers.length) {
      this.allCustomerSelected = true;
    } else {
      this.allCustomerSelected = false;
    }
  }
  isAllCustomerSelected() {
    let customers = 0;
    for (let customer of this.customers) {
      const custArr = this.selectedcustomersformsg.filter(cust => cust.id === customer.id);
      if (custArr.length > 0) {
        customers++;
      }
    }
    if (customers === this.customers.length) {
      return true;
    }
  }
  CustomersInboxMessage(customer?) {
    let customers = [];
    if (customer) {
      customers.push(customer);
    } else {
      customers = this.selectedcustomersformsg;
    }
    this.provider_shared_functions.ConsumerInboxMessage(customers, 'customer-list')
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
      queryParams: { action: 'edit', id: customer.id }
    };
    this.router.navigate(['/provider/customers/create'], navigationExtras);
  }
  viewCustomer(customer) {
    this.router.navigate(['/provider/customers/' + customer.id]);
  }
  searchCustomer() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        source: 'clist',
        selectedGroup: (this.selectedGroup !== 'all') ? this.selectedGroup.id : 'all'
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
    });
  }
  listMedicalrecords(customer) {
    const customerDetails = customer;
    const customerId = customerDetails.id;
    const mrId = 0;
    const bookingType = 'FOLLOWUP';
    const bookingId = 0;
    this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'list'], { queryParams: { 'calledfrom': 'list' } });
  }
  medicalRecord(customerDetail) {
    const customerDetails = customerDetail;
    const customerId = customerDetails.id;
    const mrId = 0;
    const bookingType = 'FOLLOWUP';
    const bookingId = 0;
    this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'clinicalnotes'], { queryParams: { 'calledfrom': 'patient' } });
  }
  prescription(customerDetail) {
    const customerDetails = customerDetail;
    const customerId = customerDetails.id;
    const mrId = 0;
    const bookingType = 'FOLLOWUP';
    const bookingId = 0;
    this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription'], { queryParams: { 'calledfrom': 'patient' } });
  }
  stopprop(event) {
    event.stopPropagation();
  }
  showLabelPopup(customer?) {
    let customers = [];
    if (customer) {
      customers.push(customer);
    } else {
      customers = this.selectedcustomersformsg;
    }
    const notedialogRef = this.dialog.open(CustomerActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        customer: customers,
        type: 'label'
      }
    });
    notedialogRef.afterClosed().subscribe(result => {
      this.getLabel();
      this.resetList();
      if (this.selectedGroup == 'all') {
        this.getCustomersList();
      } else {
        this.getCustomerListByGroup();
      }
    });
  }
  selectAllcustomers(event) {
    if (event.target.checked) {
      for (let i = 0; i < this.customers.length; i++) {
        const customer = this.selectedcustomersformsg.filter(customer => customer.id === this.customers[i].id);
        if (customer.length === 0 && !this.showText(this.customers[i])) {
          this.selectedcustomersformsg.push(this.customers[i]);
        }
      }
    } else {
      for (let i = 0; i < this.customers.length; i++) {
        const customer = this.selectedcustomersformsg.filter(customer => customer.id === this.customers[i].id);
        if (customer.length > 0) {
          this.selectedcustomersformsg = this.selectedcustomersformsg.filter(cust => cust.id !== customer[0].id);
        }
      }
    }
  }
  setLabelFilter(label, event) {
    const value = event.checked;
    if (this.selectedLabels[label.label]) {
      this.selectedLabels = [];
      this.labelFilterData = '';
    } else {
      this.selectedLabels = [];
      this.selectedLabels[label.label] = [];
      this.selectedLabels[label.label] = value;
      this.labelFilterData = label.label + '::' + value;
    }
    this.doSearch();
  }
  getLabel() {
    this.providerLabels = [];
    this.provider_services.getLabelList().subscribe((data: any) => {
      this.allLabels = data;
      this.providerLabels = data.filter(label => label.status === 'ENABLED');
    });
  }
  resetList() {
    this.selectedcustomersformsg = [];
    this.customerSelected = [];
    this.allCustomerSelected = false;
  }
  getDisplayname(label) {
    for (let i = 0; i < this.allLabels.length; i++) {
      if (this.allLabels[i].label === label) {
        return this.allLabels[i].displayName;
      }
    }
  }
  seeVisible() {
    this.visibility = true;
  }
  customerGroupSelection(group, type?) {
    this.selectedGroup = group;
    this.groupService.setitemToGroupStorage('group', this.selectedGroup);
    this.resetFilter();
    this.resetList();
    this.customers = this.groupCustomers = [];
    if (!type) {
      this.showCustomers = false;
      if (this.selectedGroup === 'all') {
        this.getCustomersList();
      } else {
        this.getCustomerListByGroup();
      }
    }
  }
  getCustomerGroup(groupId?) {
    this.groupLoaded = true;
    this.provider_services.getCustomerGroup().subscribe((data: any) => {
      this.groups = data;
      this.groupLoaded = false;
      if (groupId) {
        if (groupId === 'update') {
          if (this.selectedGroup !== 'all' && this.selectedGroup.id === this.groupIdEdit) {
            const grp = this.groups.filter(group => group.id === this.selectedGroup.id);
            this.selectedGroup = grp[0];
          }
        } else {
          const grp = this.groups.filter(group => group.id === groupId);
          this.customerGroupSelection(grp[0], 'show');
        }
      }
    });
  }
  search(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }
  addCustomerToGroup(customerId?) {
    const ids = [];
    if (customerId) {
      ids.push(customerId);
    } else {
      for (let customer of this.selectedcustomersformsg) {
        ids.push(customer.id);
      }
    }
    this.provider_services.addCustomerToGroup(this.selectedGroup.groupName, ids).subscribe(
      (data: any) => {
        this.showCustomers = false;
        this.resetList();
        this.getCustomerListByGroup();
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  removeCustomerFromGroup(customer?) {
    const ids = [];
    let customers = [];
    if (customer) {
      customers.push(customer);
    } else {
      customers = this.selectedcustomersformsg;
    }
    for (let customer of customers) {
      ids.push(customer.id);
    }
    const removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Are you sure want to remove?',
        'type': 'yes/no'
      }
    });
    removeitemdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.provider_services.removeCustomerFromGroup(this.selectedGroup.groupName, ids).subscribe(
          (data: any) => {
            this.showCustomers = false;
            this.resetList();
            this.getCustomerListByGroup();
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          });
      }
    });
  }
  showCustomerstoAdd(type?) {
    this.showCustomers = true;
    this.resetList();
    this.resetFilter();
    this.getCustomersList();
    if (type) {
      this.closeGroupDialog();
      this.showCustomerHint();
    }
  }
  getCustomerListByGroup() {
    this.apiloading = true;
    this.customers = this.groupCustomers = [];
    let api_filter = this.setFilterForApi();
    api_filter['groups-eq'] = this.selectedGroup.id;
    this.getCustomersListCount(api_filter)
      .then(
        result => {
          this.customer_count = result;
          api_filter = this.setPaginationFilter(api_filter);
          this.provider_services.getProviderCustomers(api_filter)
            .subscribe(
              data => {
                this.customers = this.groupCustomers = data;
                this.apiloading = false;
              },
              error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.apiloading = false;
              }
            );
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.apiloading = false;
        }
      );
  }
  showText(customer) {
    if (this.selectedGroup !== 'all' && this.showCustomers) {
      const fitlerArray = this.groupCustomers.filter(custom => custom.id === customer.id);
      if (fitlerArray[0]) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  changeGroupStatus(group) {
    let status;
    if (group.status === 'ENABLE') {
      status = 'DISABLE';
    } else {
      status = 'ENABLE';
    }
    this.provider_services.updateCustomerGroupStatus(group.id, status).subscribe(
      (data: any) => {
        this.getCustomerGroup();
      },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  editGroup(group?) {
    this.groupEdit = true;
    this.groupIdEdit = '';
    if (group) {
      this.groupName = group.groupName;
      this.groupDescription = group.description;
      this.groupIdEdit = group.id;
    } else {
      this.groupName = this.selectedGroup.groupName;
      this.groupDescription = this.selectedGroup.description;
    }
  }
  customerGroupAction() {
    if (this.groupName === '') {
      this.apiError = 'Please enter the group name';
    } else {
      const postData = {
        'groupName': this.groupName,
        'description': this.groupDescription
      };
      if (!this.groupEdit) {
        this.createGroup(postData);
      } else {
        postData['id'] = (this.groupIdEdit !== '') ? this.groupIdEdit : this.selectedGroup.id;
        this.updateGroup(postData);
      }
    }
  }
  createGroup(data) {
    this.newlyCreatedGroupId = null;
    this.provider_services.createCustomerGroup(data).subscribe(data => {
      this.showAddCustomerHint = true;
      this.newlyCreatedGroupId = data;
    },
      error => {
        this.apiError = error.error;
      });
  }
  updateGroup(data) {
    this.provider_services.updateCustomerGroup(data).subscribe(data => {
      this.getCustomerGroup('update');
      this.resetGroupFields();
      this.closeGroupDialog();
    },
      error => {
        this.apiError = error.error;
      });
  }
  resetGroupFields() {
    this.groupName = '';
    this.groupDescription = '';
    this.groupEdit = false;
  }
  closeGroupDialog() {
    this.closebutton.nativeElement.click();
    this.resetError();
  }
  cancelAdd() {
    this.showCustomers = false;
    this.resetList();
    this.getCustomerListByGroup();
  }
  resetError() {
    this.apiError = '';
  }
  checkSelection(customer) {
    const custom = this.selectedcustomersformsg.filter(cust => cust.id === customer.id);
    if (custom.length > 0) {
      return true;
    }
  }
  showCustomerHint() {
    this.showAddCustomerHint = false;
    this.getCustomerGroup(this.newlyCreatedGroupId);
    this.resetGroupFields();
    this.resetError();
  }
  addNewCustomertoGroup(customerId) {
    const removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to add this ' + this.customer_label + ' to ' + this.selectedGroup.groupName + '?',
        'type': 'yes/no'
      }
    });
    removeitemdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['provider', 'customers']);
        this.addCustomerToGroup(customerId);
      }
    });
  }
}
