import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  uid;
  loading = false;
  orderDetails: any = [{
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
      }, {
        'id': 1,
        'name': 'Hamlet1',
        'quantity': 2,
        'price': 100.22,
        'status': 'FULFILLED',
        'totalPrice': 200.44
      }, {
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
  constructor(public activaterouter: ActivatedRoute,
    public providerservice: ProviderServices,
    public location: Location) {
    this.activaterouter.params.subscribe(param => {
      console.log(param);
      this.uid = param.id;
      this.getOrderDetails(this.uid);
    });
  }

  ngOnInit() {
  }
  getOrderDetails(uid) {
    this.loading = true;
    this.providerservice.getProviderOrderById(uid).subscribe(data => {
      this.orderDetails = data;
      this.loading = false;
      console.log(data);
    });
  }
  goBack() {
    this.location.back();
  }
}
