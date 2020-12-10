import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { OrderActionsComponent } from '../order-actions/order-actions.component';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  uid;
  loading = false;
  orderDetails: any = [{
    'uid': 'h_0b4e4101-a2b1-4d67-92fc-342e485dd78b_odr',
    'orderNumber': 'o-2262166-2',
    'homeDelivery': false,
    'storePickup': true,
    'consumer': {
      'id': 3535,
      'firstName': 'Shiva',
      'lastName': 'Reddy',
      'favourite': false,
      'phone_verified': false,
      'email_verified': true,
      'jaldeeConsumer': 1907,
      'jaldeeId': '1'
    },
    'jaldeeConsumer': {
      'id': 1907,
      'favourite': false,
      'SignedUp': false
    },
    'catalog': {
      'id': 13,
      'catalogName': 'catalog one',
      'catalogSchedule': {
        'recurringType': 'Weekly',
        'repeatIntervals': ['1', '2', '3', '4', '5', '6', '7'],
        'startDate': '2020-12-08',
        'terminator': {
          'endDate': '2020-12-31',
          'noOfOccurance': 0
        },
        'timeSlots': [{
          'sTime': '09:00 AM',
          'eTime': '06:00 PM'
        }]
      },
      'advanceAmount': 0.0,
      'autoConfirm': false
    },
    'orderFor': {
      'id': 3535,
      'firstName': 'Shiva',
      'lastName': 'Reddy',
      'favourite': false,
      'phone_verified': false,
      'email_verified': false,
      'jaldeeConsumer': 0,
      'jaldeeId': '1'
    },
    'orderItem': [{
      'id': 805,
      'name': 'Biryani',
      'quantity': 2,
      'price': 400.0,
      'status': 'FULFILLED',
      'totalPrice': 800.0,
      'itemImages': [{
        'keyName': '1607471918260.jpg',
        'caption': '',
        'prefix': 'item/805',
        'url': 'http://jaldeetest.s3-website.ap-south-1.amazonaws.com/101130/item/805/1607471918260.jpg',
        'thumbUrl': 'http://jaldeetest.s3-website.ap-south-1.amazonaws.com/101130/item/805/thumbnail/1607471918260.jpg',
        'type': '.jpg',
        'imageSize': 0,
        'displayImage': true
      }]
    },{
      'id': 805,
      'name': 'Biryani',
      'quantity': 2,
      'price': 400.0,
      'status': 'FULFILLED',
      'totalPrice': 800.0,
      'itemImages': [{
        'keyName': '1607471918260.jpg',
        'caption': '',
        'prefix': 'item/805',
        'url': 'http://jaldeetest.s3-website.ap-south-1.amazonaws.com/101130/item/805/1607471918260.jpg',
        'thumbUrl': 'http://jaldeetest.s3-website.ap-south-1.amazonaws.com/101130/item/805/thumbnail/1607471918260.jpg',
        'type': '.jpg',
        'imageSize': 0,
        'displayImage': true
      }]
    },{
      'id': 805,
      'name': 'Biryani',
      'quantity': 2,
      'price': 400.0,
      'status': 'FULFILLED',
      'totalPrice': 800.0,
      'itemImages': [{
        'keyName': '1607471918260.jpg',
        'caption': '',
        'prefix': 'item/805',
        'url': 'http://jaldeetest.s3-website.ap-south-1.amazonaws.com/101130/item/805/1607471918260.jpg',
        'thumbUrl': 'http://jaldeetest.s3-website.ap-south-1.amazonaws.com/101130/item/805/thumbnail/1607471918260.jpg',
        'type': '.jpg',
        'imageSize': 0,
        'displayImage': true
      }]
    },{
      'id': 805,
      'name': 'Biryani',
      'quantity': 2,
      'price': 400.0,
      'status': 'FULFILLED',
      'totalPrice': 800.0,
      'itemImages': [{
        'keyName': '1607471918260.jpg',
        'caption': '',
        'prefix': 'item/805',
        'url': 'http://jaldeetest.s3-website.ap-south-1.amazonaws.com/101130/item/805/1607471918260.jpg',
        'thumbUrl': 'http://jaldeetest.s3-website.ap-south-1.amazonaws.com/101130/item/805/thumbnail/1607471918260.jpg',
        'type': '.jpg',
        'imageSize': 0,
        'displayImage': true
      }]
    }],
    'orderStatus': 'Order Received',
    'orderDate': '2020-12-09',
    'orderTimeWindow': {
      'recurringType': 'Weekly',
      'repeatIntervals': ['1', '2', '3', '4', '5', '6', '7'],
      'startDate': '2020-12-08',
      'terminator': {
        'endDate': '2020-12-31',
        'noOfOccurance': 0
      },
      'timeSlots': [{
        'sTime': '09:00 AM',
        'eTime': '06:00 PM'
      }]
    },
    'lastStatusUpdatedDate': '2020-12-09',
    'timeSlot': {
      'sTime': '03:08 PM',
      'eTime': '06:00 PM'
    },
    'isAsap': false,
    'isFirstOrder': false,
    'coupons': [],
    'orderMode': 'ONLINE_ORDER',
    'phoneNumber': '6303603789',
    'email': 'shiva.kumar@gmai.com',
    'advanceAmountPaid': 0.0,
    'advanceAmountToPay': 1.0,
    'totalAmountPaid': 0.0,
    'cartAmount': 800.0,
    'accesScope': 1,
    'account': 0,
    'onlineRequest': false,
    'kioskRequest': false,
    'firstCheckIn': false,
    'active': false
  }];
  selectedType = 'list';
  customerLabel = '';
  display_dateFormat = projectConstantsLocal.DATE_FORMAT_WITH_MONTH;
  screenWidth;
  small_device_display = false;
  no_of_grids: any;
  constructor(public activaterouter: ActivatedRoute,
    public providerservice: ProviderServices, private dialog: MatDialog,
    public location: Location, public sharedFunctions: SharedFunctions) {
    this.activaterouter.params.subscribe(param => {
      console.log(param);
      this.uid = param.id;
      this.customerLabel = this.sharedFunctions.getTerminologyTerm('customer');
      // this.getOrderDetails(this.uid);
      this.orderDetails = this.orderDetails[0];
      console.log(this.orderDetails);
    });
  }

  ngOnInit() {
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
    let divider;
    console.log(this.screenWidth);
    const divident = this.screenWidth / 37.8;
    if (this.screenWidth > 1000) {
       divider = divident / 6;
    } else if (this.screenWidth > 500 && this.screenWidth < 1000) {
      divider = divident / 4;
    } else if (this.screenWidth > 375 && this.screenWidth < 500) {
      divider = divident / 3;
    } else if (this.screenWidth < 375) {
      divider = divident / 2;
    }
    console.log(divident);
    console.log(divider);
    this.no_of_grids = Math.round(divident / divider);
    console.log(this.no_of_grids);
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
  selectViewType(type) {
    this.selectedType = type;
  }
  showOrderActions() {
    const actiondialogRef = this.dialog.open(OrderActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        selectedOrder: this.orderDetails
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {

    });
  }
  getItemImg(item) {
    if (item.itemImages) {
      const image = item.itemImages.filter(img => img.displayImage);
      if (image[0]) {
        return image[0].url;
      } else {
        return '../../../../assets/images/order/Items.svg';
      }
    } else {
      return '../../../../assets/images/order/Items.svg';
    }
  }
}
