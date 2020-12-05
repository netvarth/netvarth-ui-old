import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { OrderActionsComponent } from './order-actions/order-actions.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { projectConstants } from '../../../app.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';

@Component({
  selector: 'app-order-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.scss']
})
export class OrderDashboardComponent implements OnInit {
  businessName;
  historyOrders: any = [];
  orders: any = [{
    'uid': '6cd37128-4593-4b92-9bc7-22e130d8f576_or',
    'orderNumber': 'o-32525t4-2',
    'homeDelivery': true,
    'storePickup': false,
    'homeDeliveryAddress': 'chakaakal h,irinjalakuda po',
    'consumer': {
      'id': 1,
      'firstName': 'AAA',
      'lastName': 'AAA',
      'favourite': false,
      'phone_verified': false,
      'email_verified': true,
      'jaldeeConsumer': 4,
      'jaldeeId': '1'
    },
    'jaldeeConsumer': {
      'id': 4,
      'favourite': false,
      'SignedUp': false
    },
    'catalog': {
      'id': 2,
      'catalogName': 'Lunchs',
      'catalogSchedule': {
        'recurringType': 'Weekly',
        'repeatIntervals': [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7'
        ],
        'startDate': '2020-11-20',
        'terminator': {
          'endDate': '2022-01-01',
          'noOfOccurance': 0
        },
        'timeSlots': [
          {
            'sTime': '09:00 AM',
            'eTime': '08:00 PM'
          }
        ]
      },
      'advanceAmount': 0,
      'autoConfirm': false
    },
    'orderFor': {
      'id': 1,
      'firstName': 'AAA',
      'lastName': 'AAA',
      'favourite': false,
      'phone_verified': false,
      'email_verified': false,
      'jaldeeConsumer': 0,
      'jaldeeId': '1'
    },
    'orderItem': [
      {
        'id': 1,
        'name': 'Hamlet1',
        'quantity': 2,
        'price': 100.22,
        'status': 'FULFILLED',
        'totalPrice': 200.44
      },
      {
        'id': 2,
        'name': 'Hamlet2',
        'quantity': 1,
        'price': 100.22,
        'status': 'FULFILLED',
        'totalPrice': 100.22
      }
    ],
    'orderStatus': 'Accepted',
    'orderDate': '2020-12-03',
    'orderTimeWindow': {
      'recurringType': 'Weekly',
      'repeatIntervals': [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7'
      ],
      'startDate': '2020-11-20',
      'terminator': {
        'endDate': '2022-01-01',
        'noOfOccurance': 0
      },
      'timeSlots': [
        {
          'sTime': '09:00 AM',
          'eTime': '08:00 PM'
        }
      ]
    },
    'lastStatusUpdatedDate': '2020-12-01',
    'isAsap': false,
    'isFirstOrder': true,
    'coupons': [],
    'orderMode': 'ONLINE_ORDER',
    'phoneNumber': '5550001023',
    'email': 'asd@netvarth.com',
    'advanceAmount': 0,
    'advanceAmountToPay': 2,
    'amount': 0,
    'totalAmount': 0,
    'cartAmount': 300.66,
    'accesScope': 1,
    'account': 0,
    'onlineRequest': false,
    'kioskRequest': false,
    'firstCheckIn': false,
    'active': false
  }
  ];
  display_dateFormat = projectConstantsLocal.DATE_FORMAT_WITH_MONTH;
  historyOrdersCount;
  loading = false;
  orderSelected: any = [];
  showFilterSection = false;
  filterapplied = false;
  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    patientId: '',
    payment_status: 'all',
    orderNumber: '',
    orderStatus: 'all',
    orderMode: 'all'
  }; // same in resetFilter Fn
  filters = {
    first_name: false,
    last_name: false,
    phone_number: false,
    patientId: false,
    payment_status: false,
    orderNumber: false,
    orderStatus: false,
    orderMode: false
  };
  customerIdTooltip = '';
  customer_label = '';
  selected_type = 'all';
  orderStatusFilter = projectConstantsLocal.ORDER_STATUSES_FILTER;
  orderModesList = projectConstantsLocal.ORDER_MODES;
  paymentStatusList = projectConstantsLocal.PAYMENT_STATUSES;
  orderStatuses: any = [];
  orderModes: any = [];
  paymentStatuses: any = [];
  selectedOrders: any = [];
  selectedTab;
  historyOrdertype = '';
  server_date;
  todayOrdersCount;
  futureOrdersCount;
  orderstatus;
  constructor(public sharedFunctions: SharedFunctions,
    public router: Router, private dialog: MatDialog,
    public providerservices: ProviderServices,
    public shared_functions: SharedFunctions,
    public dateformat: DateFormatPipe) { }

  ngOnInit() {
    const businessdetails = this.sharedFunctions.getitemFromGroupStorage('ynwbp');
    this.businessName = businessdetails.bn;
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.customerIdTooltip = this.customer_label + ' id';
    if (this.sharedFunctions.getitemFromGroupStorage('orderTab')) {
      this.selectedTab = this.sharedFunctions.getitemFromGroupStorage('orderTab');
    } else {
      this.selectedTab = 1;
    }
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    // this.getOrderStatus();
    this.doSearch();
    this.getProviderTodayOrdersCount();
    this.getProviderFutureOrdersCount();
  }
  setTabSelection(type) {
    this.selectedTab = type;
    this.shared_functions.setitemToGroupStorage('orderTab', this.selectedTab);
    switch (type) {
      case 1: {
        this.getProviderOrders();
        break;
      }
      case 2: {
        this.getProviderOrders();
        break;
      }
      case 3: {
        // this.getProviderHistoryOrders();
        break;
      }
    }
  }
  tabChange(event) {
    this.hideFilterSidebar();
    this.resetFilter();
    this.resetFilterValues();
    this.filterapplied = false;
    this.setTabSelection(event.index + 1);
  }
  gotoDetails(order) {
    this.router.navigate(['provider', 'orders', order.uid]);
  }
  showActionPopup(order?) {
    if (order) {
      this.selectedOrders = order;
    }
    const actiondialogRef = this.dialog.open(OrderActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        selectedOrder: this.selectedOrders
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
      this.resetList();
    });
  }
  stopprop(event) {
    event.stopPropagation();
  }
  getTodayDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    return this.dateformat.transformTofilterDate(server)
  }
  getProviderOrders() {
    this.loading = true;
    let filter = {};
    filter = this.setFilterForApi();
    if (this.selectedTab === 1) {
      filter['orderDate-eq'] = this.getTodayDate();
    } else {
      filter['orderDate-gt'] = this.getTodayDate();
    }
    this.providerservices.getProviderOrders(filter).subscribe(data => {
      console.log(data);
      // this.orders = data;
      this.loading = false;
    });
  }
  getProviderFutureOrdersCount() {
    const filter = {};
    filter['orderDate-gt'] = this.getTodayDate();
    this.providerservices.getProviderOrdersCount(filter).subscribe(data => {
      console.log(data);
      this.todayOrdersCount = data;
    });
  }
  getProviderTodayOrdersCount() {
    const filter = {};
    filter['orderDate-eq'] = this.getTodayDate();
    this.providerservices.getProviderOrdersCount(filter).subscribe(data => {
      console.log(data);
      this.futureOrdersCount = data;
    });
  }
  getProviderHistoryOrders() {
    this.loading = true;
    let filter = {};
    filter = this.setFilterForApi();
    // this.getProviderHistoryOrdersCount(filter);
    this.providerservices.getProviderHistoryOrders(filter).subscribe(data => {
      console.log(data);
      this.historyOrders = data;
      this.loading = false;
    });
  }
  getProviderHistoryOrdersCount(filter) {
    this.providerservices.getProviderHistoryOrdersCount(filter).subscribe(data => {
      console.log(data);
      this.historyOrdersCount = data;
    });
  }
  checkOrder(order, index) {
    if (!this.orderSelected[index]) {
      this.orderSelected[index] = true;
      this.selectedOrders.push(order);
    } else {
      this.orderSelected[index] = false;
      const indx = this.selectedOrders.indexOf(order);
      this.selectedOrders.splice(indx, 1);
    }
    console.log(this.selectedOrders);
    console.log(this.orderSelected);
  }
  showFilter() {
    this.showFilterSection = true;
  }
  hideFilterSidebar() {
    this.showFilterSection = false;
  }
  clearFilter() {
    this.resetFilter();
    this.resetFilterValues();
    this.filterapplied = false;
    this.doSearch();
  }
  resetList() {
    this.selectedOrders = [];
    this.orderSelected = [];
  }
  resetFilter() {
    this.filters = {
      first_name: false,
      last_name: false,
      phone_number: false,
      patientId: false,
      orderNumber: false,
      orderStatus: false,
      orderMode: false,
      payment_status: false
    };
    this.filter = {
      first_name: '',
      last_name: '',
      phone_number: '',
      patientId: '',
      payment_status: 'all',
      orderNumber: '',
      orderStatus: 'all',
      orderMode: 'all'
    };
  }
  doSearch() {
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.patientId ||
      this.filter.payment_status !== 'all' || this.filter.orderNumber || this.orderStatuses.length > 0 || this.orderModes.length > 0 || this.paymentStatuses.length > 0) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    this.setTabSelection(this.selectedTab);
  }
  keyPressed(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }
  handleOrderType(type) {
    this.selected_type = type;
    this.doSearch();
  }
  resetFilterValues() {
    this.orderStatuses = [];
    this.orderModes = [];
    this.paymentStatuses = [];
  }
  setFilterDataCheckbox(type, value?) {
    if (type === 'homeDelivery' || 'storePickup') {
      this.historyOrdertype = type;
    }
    if (type === 'orderStatus') {
      const indx = this.orderStatuses.indexOf(value);
      this.orderStatuses = [];
      if (indx === -1) {
        this.orderStatuses.push(value);
      }
    }
    if (type === 'orderMode') {
      const indx = this.orderModes.indexOf(value);
      this.orderModes = [];
      if (indx === -1) {
        this.orderModes.push(value);
      }
    }
    if (type === 'payment') {
      const indx = this.paymentStatuses.indexOf(value);
      this.paymentStatuses = [];
      if (indx === -1) {
        this.paymentStatuses.push(value);
      }
    }
    this.doSearch();
  }
  setFilterForApi() {
    const api_filter = {};
    if (this.selectedTab === 3) {
      if (this.historyOrdertype === 'homeDelivery') {
        api_filter['homeDelivery-eq'] = true;
      }
      if (this.historyOrdertype === 'storePickup') {
        api_filter['storePickup-eq'] = true;
      }
    } else {
      if (this.selected_type === 'homeDelivery') {
        api_filter['homeDelivery-eq'] = true;
      }
      if (this.selected_type === 'storePickup') {
        api_filter['storePickup-eq'] = true;
      }
    }
    if (this.orderStatuses.length > 0) {
      api_filter['orderStatus-eq'] = this.orderStatuses.toString();
    }
    if (this.orderModes.length > 0) {
      api_filter['orderMode-eq'] = this.orderModes.toString();
    }
    if (this.paymentStatuses.length > 0) {
      api_filter['paymentStatus-eq'] = this.paymentStatuses.toString();
    }
    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }
    if (this.filter.last_name !== '') {
      api_filter['lastName-eq'] = this.filter.last_name;
    }
    if (this.filter.orderNumber !== '') {
      api_filter['orderNumber-eq'] = this.filter.orderNumber;
    }
    if (this.filter.patientId !== '') {
      api_filter['jaldeeId-eq'] = this.filter.patientId;
    }
    if (this.filter.phone_number !== '') {
      api_filter['phoneNumber-eq'] = this.filter.phone_number;
    }
    console.log(api_filter);
    return api_filter;
  }
  getOrderStatus() {
    this.providerservices.getProviderOrderStatus().subscribe(data => {
      this.orderstatus = data;
      if (this.orderstatus) {
        this.doSearch();
        this.getProviderTodayOrdersCount();
        this.getProviderFutureOrdersCount();
      }
    });
  }
}
