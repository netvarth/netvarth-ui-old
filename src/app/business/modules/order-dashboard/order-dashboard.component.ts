import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { OrderActionsComponent } from './order-actions/order-actions.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';

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
    'homeDeliveryAddress': 'Thayattuparambil h,Kaipamangalam',
    'consumer': {
      'id': 1,
      'firstName': 'Layana',
      'lastName': 'T S',
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
      'firstName': 'Layana',
      'lastName': 'T S',
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
    'phoneNumber': '5550002028',
    'email': 'asd@netvarth.com',
    'advanceAmount': 0,
    'advanceAmountToPay': 2,
    'amount': 0,
    'totalAmount': 0,
    'cartAmount': 100.00,
    'accesScope': 1,
    'account': 0,
    'onlineRequest': false,
    'kioskRequest': false,
    'firstCheckIn': false,
    'active': false
  },
  {
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
  }, {
    'uid': '6cd37128-4593-4b92-9bc7-22e130d8f576_or',
    'orderNumber': 'o-32525t4-2',
    'homeDelivery': true,
    'storePickup': false,
    'homeDeliveryAddress': 'Thayattuparambil h,Kaipamangalam',
    'consumer': {
      'id': 1,
      'firstName': 'Layana',
      'lastName': 'T S',
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
      'firstName': 'Layana',
      'lastName': 'T S',
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
    'phoneNumber': '5550002028',
    'email': 'asd@netvarth.com',
    'advanceAmount': 0,
    'advanceAmountToPay': 2,
    'amount': 0,
    'totalAmount': 0,
    'cartAmount': 100.00,
    'accesScope': 1,
    'account': 0,
    'onlineRequest': false,
    'kioskRequest': false,
    'firstCheckIn': false,
    'active': false
  },
  {
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
  }, {
    'uid': '6cd37128-4593-4b92-9bc7-22e130d8f576_or',
    'orderNumber': 'o-32525t4-2',
    'homeDelivery': true,
    'storePickup': false,
    'homeDeliveryAddress': 'Thayattuparambil h,Kaipamangalam',
    'consumer': {
      'id': 1,
      'firstName': 'Layana',
      'lastName': 'T S',
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
      'firstName': 'Layana',
      'lastName': 'T S',
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
    'phoneNumber': '5550002028',
    'email': 'asd@netvarth.com',
    'advanceAmount': 0,
    'advanceAmountToPay': 2,
    'amount': 0,
    'totalAmount': 0,
    'cartAmount': 100.00,
    'accesScope': 1,
    'account': 0,
    'onlineRequest': false,
    'kioskRequest': false,
    'firstCheckIn': false,
    'active': false
  },
  {
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
  }];
  display_dateFormat = projectConstantsLocal.DATE_FORMAT_WITH_MONTH;
  ordersCount;
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
    schedule: 'all',
    service: 'all',
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
    schedule: false,
    service: false,
    payment_status: false,
    orderNumber: false,
    orderStatus: false,
    orderMode: false
  };
  customerIdTooltip = '';
  customer_label = '';
  selected_type = 'homeDelivery';
  orderStatusFilter = projectConstantsLocal.ORDER_STATUSES_FILTER;
  orderModesList = projectConstantsLocal.ORDER_MODES;
  allOrderStatusSelected = false;
  orderStatuses: any = [];
  allOrderModesSelected = false;
  orderModes: any = [];
  constructor(public sharedFunctions: SharedFunctions,
    public router: Router, private dialog: MatDialog,
    public providerservices: ProviderServices,
    public shared_functions: SharedFunctions) { }

  ngOnInit(): void {
    const businessdetails = this.sharedFunctions.getitemFromGroupStorage('ynwbp');
    this.businessName = businessdetails.bn;
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.customerIdTooltip = this.customer_label + ' id';
    // this.getProviderOrders();
    // this.getProviderOrdersCount();
    // this.getProviderHistoryOrdersCount();
    // this.getProviderHistoryOrders();
    console.log(this.orders);
  }
  tabChange(event) {
    console.log(event);
  }
  gotoDetails(order) {
    this.router.navigate(['provider', 'order', order.uid]);
  }
  showActionPopup() {
    const actiondialogRef = this.dialog.open(OrderActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {

      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
    });
  }
  stopprop(event) {
    event.stopPropagation();
  }
  getProviderOrders() {
    this.loading = true;
    this.providerservices.getProviderOrders().subscribe(data => {
      console.log(data);
      this.orders = data;
      this.loading = false;
    });
  }
  getProviderOrdersCount() {
    this.providerservices.getProviderOrdersCount().subscribe(data => {
      console.log(data);
      this.ordersCount = data;
    });
  }
  getProviderHistoryOrders() {
    this.loading = true;
    this.providerservices.getProviderHistoryOrders().subscribe(data => {
      console.log(data);
      this.historyOrders = data;
      this.loading = false;
    });
  }
  getProviderHistoryOrdersCount() {
    this.providerservices.getProviderHistoryOrdersCount().subscribe(data => {
      console.log(data);
      this.historyOrdersCount = data;
    });
  }
  checkOrder(index, event) {
    console.log(event);
    this.orderSelected[index] = event.checked;
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
  }
  resetFilter() {
    this.filters = {
      first_name: false,
      last_name: false,
      phone_number: false,
      patientId: false,
      service: false,
      schedule: false,
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
      service: 'all',
      payment_status: 'all',
      schedule: 'all',
      orderNumber: '',
      orderStatus: 'all',
      orderMode: 'all'
    };
  }
  doSearch() {
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.patientId || this.filter.service !== 'all' ||
      this.filter.payment_status !== 'all' || this.filter.orderNumber || this.filter.orderStatus !== 'all' || this.filter.orderMode !== 'all') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  keyPressed(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }
  handleOrderType(type) {
    this.selected_type = type;
  }
  resetFilterValues() {
    this.orderStatuses = [];
    this.orderModes = [];
    this.allOrderStatusSelected = false;
    this.allOrderModesSelected = false;
  }
  setFilterDataCheckbox(type, value, event) {
    this.filter[type] = value;
    if (type === 'orderStatus') {
      if (value === 'all') {
        this.orderStatuses = [];
        this.allOrderStatusSelected = false;
        if (event.checked) {
          for (const status of this.orderStatusFilter) {
            if (this.orderStatuses.indexOf(status.value) === -1) {
              this.orderStatuses.push(status.value);
            }
          }
          this.allOrderStatusSelected = true;
        }
      } else {
        this.allOrderStatusSelected = false;
        const indx = this.orderStatuses.indexOf(value);
        if (indx === -1) {
          this.orderStatuses.push(value);
        } else {
          this.orderStatuses.splice(indx, 1);
        }
      }
      if (this.orderStatuses.length === this.orderStatusFilter.length) {
        this.filter['orderStatus'] = 'all';
        this.allOrderStatusSelected = true;
      }
    }
    if (type === 'orderMode') {
      if (value === 'all') {
        this.orderModes = [];
        this.allOrderModesSelected = false;
        if (event.checked) {
          for (const status of this.orderStatusFilter) {
            if (this.orderModes.indexOf(status.value) === -1) {
              this.orderModes.push(status.value);
            }
          }
          this.allOrderModesSelected = true;
        }
      } else {
        this.allOrderModesSelected = false;
        const indx = this.orderModes.indexOf(value);
        if (indx === -1) {
          this.orderModes.push(value);
        } else {
          this.orderModes.splice(indx, 1);
        }
      }
      if (this.orderModes.length === this.orderStatusFilter.length) {
        this.filter['orderMode'] = 'all';
        this.allOrderModesSelected = true;
      }
    }
    this.doSearch();
  }
}
