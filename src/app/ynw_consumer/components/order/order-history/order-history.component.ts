import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { Router } from '@angular/router';
import { AddInboxMessagesComponent } from '../../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { MatDialog } from '@angular/material/dialog';
import { ConsumerRateServicePopupComponent } from '../../../../shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ConsumerServices } from '../../../../ynw_consumer/services/consumer-services.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  // dummyData: any = [
  //   {
  //     'uid': 'd55a9fd3-56a8-45a2-9997-eb34965c3a3c_or',
  //     'orderNumber': 'o-hmp-a',
  //     'homeDelivery': true,
  //     'storePickup': false,
  //     'homeDeliveryAddress': 'madathiparambil house po kozhukully tcr',
  //     'consumer': {
  //       'id': 260,
  //       'firstName': 'Aneesh',
  //       'lastName': 'mg',
  //       'gender': 'male',
  //       'favourite': false,
  //       'phone_verified': false,
  //       'email_verified': false,
  //       'jaldeeConsumer': 70,
  //       'jaldeeId': '1'
  //     },
  //     'providerAccount': {
  //       'branchId': 0,
  //       'businessName': 'Lavanya Hospital',
  //       'corpId': 0,
  //       'id': 125976,
  //       'licensePkgID': 0,
  //       'minimumCompleteness': false,
  //       'profileId': 0,
  //       'uniqueId': 152210,
  //       'userSubdomain': 0,
  //       'location': {
  //         'address': 'Thrissur, Kuruppam, Thekkinkadu Maidan, Thrissur, Kerala 680020, India',
  //         'googleMapUrl': 'https://www.google.com/maps/place/10.5276416,76.2144349/@10.5276416,76.2144349,15z',
  //         'id': 78303,
  //         'lattitude': '10.5276416',
  //         'longitude': '76.2144349',
  //         'place': 'Thekkinkadu Maidan'
  //       }
  //     },
  //     'jaldeeConsumer': {
  //       'id': 70,
  //       'favourite': false,
  //       'SignedUp': false
  //     },
  //     'catalog': {
  //       'id': 3,
  //       'catalogName': 'Lunch',
  //       'catalogSchedule': {
  //         'recurringType': 'Weekly',
  //         'repeatIntervals': [
  //           '1',
  //           '2',
  //           '3',
  //           '4',
  //           '5',
  //           '6',
  //           '7'
  //         ],
  //         'startDate': '2020-11-26',
  //         'terminator': {
  //           'endDate': '2022-01-01',
  //           'noOfOccurance': 0
  //         },
  //         'timeSlots': [
  //           {
  //             'sTime': '09:00 AM',
  //             'eTime': '08:00 PM'
  //           }
  //         ]
  //       },
  //       'advanceAmount': 0,
  //       'autoConfirm': false
  //     },
  //     'orderFor': {
  //       'id': 260,
  //       'firstName': 'Aneesh',
  //       'lastName': 'mg',
  //       'gender': 'male',
  //       'favourite': false,
  //       'phone_verified': false,
  //       'email_verified': false,
  //       'jaldeeConsumer': 0,
  //       'jaldeeId': '1'
  //     },
  //     'orderItem': [
  //       {
  //         'id': 1,
  //         'name': 'Biriyani',
  //         'quantity': 2,
  //         'price': 100,
  //         'status': 'FULFILLED',
  //         'totalPrice': 200
  //       },
  //       {
  //         'id': 2,
  //         'name': 'Beef Biriyani',
  //         'quantity': 1,
  //         'price': 100,
  //         'status': 'FULFILLED',
  //         'totalPrice': 100
  //       }
  //     ],
  //     'orderStatus': 'Accepted',
  //     'orderDate': '2020-12-01',
  //     'orderTimeWindow': {
  //       'recurringType': 'Weekly',
  //       'repeatIntervals': [
  //         '1',
  //         '2',
  //         '3',
  //         '4',
  //         '5',
  //         '6',
  //         '7'
  //       ],
  //       'startDate': '2020-11-26',
  //       'terminator': {
  //         'endDate': '2022-01-01',
  //         'noOfOccurance': 0
  //       },
  //       'timeSlots': [
  //         {
  //           'sTime': '09:00 AM',
  //           'eTime': '08:00 PM'
  //         }
  //       ]
  //     },
  //     'lastStatusUpdatedDate': '2020-12-01',
  //     'timeSlot': {
  //       'sTime': '09:00 AM',
  //       'eTime': '08:00 PM'
  //     },
  //     'isAsap': false,
  //     'isFirstOrder': false,
  //     'coupons': [],
  //     'orderMode': 'ONLINE_ORDER',
  //     'phoneNumber': '8129630960',
  //     'email': 'aneesh.mg@jaldee.com',
  //     'advanceAmount': 0,
  //     'advanceAmountToPay': 2,
  //     'amount': 0,
  //     'totalAmount': 0,
  //     'cartAmount': 300,
  //     'accesScope': 1,
  //     'account': 0,
  //     'onlineRequest': false,
  //     'kioskRequest': false,
  //     'firstCheckIn': false,
  //     'active': false
  //   }
  // ]; // delete
  loading = true;
  entire_history: any = [];
  service_provider_cap = Messages.SERV_PROVIDER_CAP;
  location_cap = Messages.LOCATION_CAP;
  date_cap = Messages.DATE_COL_CAP;
  status_cap = Messages.PRO_STATUS_CAP;
  send_message_cap = Messages.SEND_MSG_CAP;
  bill_cap = Messages.BILL_CAPTION;
  rate_your_visit = Messages.RATE_YOU_VISIT;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  notedialogRef: any;
  ratedialogRef: any;
  screenWidth;
  small_device_display = false;
  entire_history_data: any = [];

  constructor(
    public location: Location,
    public router: Router,
    public dialog: MatDialog,
    public shared_functions: SharedFunctions,
    private consumer_services: ConsumerServices,
  ) {
    this.onResize();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }

  ngOnInit() {
    this.loading = false; // delete
    // console.log(this.dummyData);
    // this.entire_history = this.dummyData; // delete
     this.getHistroy();
  }
  goback() {
    this.location.back();
  }
  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
  }
  addOrderMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.uid;
    pass_ob['user_id'] = waitlist.providerAccount.id;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    pass_ob['appt'] = 'appt';
    this.addNote(pass_ob);
  }
  addNote(pass_ob) {
    this.notedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });

    this.notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }
  getOrderBill(waitlist) {
    // const params = {
    //   account: waitlist.providerAccount.id
    // };
    // this.consumer_checkin_history_service.getWaitlistBill(params, waitlist.uid)
    //   .subscribe(
    //     data => {
    //       const bill_data = data;
    //       this.viewApptBill(waitlist, bill_data);
    //     },
    //     error => {
    //       this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //     }
    //   );
  }
  isRated(wait) {
    if (wait.hasOwnProperty('rating')) {
      return true;
    } else {
      return false;
    }
  }
  rateOrderService(waitlist) {
    this.ratedialogRef = this.dialog.open(ConsumerRateServicePopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: {
        'detail': waitlist,
        'isFrom': 'order'
      }
    });

    this.ratedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
         this.getHistroy();
      }
    });
  }
  getHistroy() {
    this.consumer_services.getOrderHistory()
      .subscribe(
        data => {
          this.entire_history = data;
          this.entire_history.forEach(order_history_details => {
            this.entire_history_data = order_history_details;
          });
          this.loading = false;
          
        },
        error => {
          this.loading = false;
        }
      );
  }

}
