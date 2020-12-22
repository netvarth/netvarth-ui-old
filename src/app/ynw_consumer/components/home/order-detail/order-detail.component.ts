import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
// import { ConsumerServices } from '../../../services/consumer-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { DOCUMENT, Location } from '@angular/common';
import { projectConstants } from '../../../../app.component';
import { ActionPopupComponent } from '../action-popup/action-popup.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  titlename = 'Order Details';
  ynwUuid: any;
  providerId: any;
  customer_label: any;
  provider_label: any;
  cust_notes_cap: any;
  checkin_label: string;
  waitlist;
  api_loading = true;
  dummyData: any = [
    {
      'uid': 'd55a9fd3-56a8-45a2-9997-eb34965c3a3c_or',
      'orderNumber': 'o-hmp-a',
      'homeDelivery': true,
      'storePickup': false,
      'homeDeliveryAddress': 'madathiparambil house po kozhukully tcr',
      'consumer': {
        'id': 260,
        'firstName': 'Aneesh',
        'lastName': 'mg',
        'gender': 'male',
        'favourite': false,
        'phone_verified': false,
        'email_verified': false,
        'jaldeeConsumer': 70,
        'jaldeeId': '1'
      },
      'providerAccount': {
        'branchId': 0,
        'businessName': 'Lavanya Hospital',
        'corpId': 0,
        'id': 78976,
        'licensePkgID': 0,
        'minimumCompleteness': false,
        'profileId': 0,
        'uniqueId': 101002,
        'userSubdomain': 0,
        'location': {
        'address': 'Thrissur, Kuruppam, Thekkinkadu Maidan, Thrissur, Kerala 680020, India',
        'googleMapUrl': 'https://www.google.com/maps/place/10.5276416,76.2144349/@10.5276416,76.2144349,15z',
        'id': 78303,
        'lattitude': '10.5276416',
        'longitude': '76.2144349',
        'place': 'Thekkinkadu Maidan'
        }
      },
      'jaldeeConsumer': {
        'id': 70,
        'favourite': false,
        'SignedUp': false
      },
      'catalog': {
        'id': 3,
        'catalogName': 'Lunch',
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
          'startDate': '2020-11-26',
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
        'id': 260,
        'firstName': 'Aneesh',
        'lastName': 'mg',
        'gender': 'male',
        'favourite': false,
        'phone_verified': false,
        'email_verified': false,
        'jaldeeConsumer': 0,
        'jaldeeId': '1'
      },
      'orderItem': [
        {
          'id': 1,
          'name': 'Biriyani',
          'quantity': 2,
          'price': 100,
          'status': 'FULFILLED',
          'totalPrice': 200
        },
        {
          'id': 2,
          'name': 'Beef Biriyani',
          'quantity': 1,
          'price': 100,
          'status': 'FULFILLED',
          'totalPrice': 100
        },
        {
          'id': 3,
          'name': 'Chicken Biriyani',
          'quantity': 5,
          'price': 100,
          'status': 'FULFILLED',
          'totalPrice': 500
        },
        {
          'id': 4,
          'name': 'Ice cream',
          'quantity': 1,
          'price': 100,
          'status': 'FULFILLED',
          'totalPrice': 100
        },
        {
          'id': 5,
          'name': 'Meals',
          'quantity': 1,
          'price': 100,
          'status': 'FULFILLED',
          'totalPrice': 600
        },
        {
          'id': 6,
          'name': 'Fried Rice',
          'quantity': 1,
          'price': 100,
          'status': 'FULFILLED',
          'totalPrice': 70
        },
        {
          'id': 7,
          'name': 'Beef Biriyani1',
          'quantity': 1,
          'price': 100,
          'status': 'FULFILLED',
          'totalPrice': 100
        },
        {
          'id': 8,
          'name': 'Gheer',
          'quantity': 1,
          'price': 100,
          'status': 'FULFILLED',
          'totalPrice': 100
        },
        {
          'id': 9,
          'name': 'Ketchup',
          'quantity': 1,
          'price': 100,
          'status': 'FULFILLED',
          'totalPrice': 10
        }
      ],
      'orderStatus': 'Accepted',
      'orderDate': '2020-12-01',
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
        'startDate': '2020-11-26',
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
      'timeSlot': {
        'sTime': '09:00 AM',
        'eTime': '08:00 PM'
      },
      'isAsap': false,
      'isFirstOrder': false,
      'coupons': [],
      'orderMode': 'ONLINE_ORDER',
      'phoneNumber': '8129630960',
      'email': 'aneesh.mg@jaldee.com',
      'advanceAmount': 0,
      'advanceAmountToPay': 2,
      'amount': 0,
      'totalAmount': 0,
      'cartAmount': 300,
      'accesScope': 1,
      'account': 0,
      'onlineRequest': false,
      'kioskRequest': false,
      'firstCheckIn': false,
      'active': false
    }
  ];
  fav_providers;
  fav_providers_id_list: any[];
  qr_value: string;
  path = projectConstants.PATH;
  view_more = false;
  actiondialogRef: any;
  elementType = 'url';
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  screenWidth: number;
  no_of_grids: any;
  showView = 'grid';
  showSide = false;
  storeContact: any;
  showNteSection = false;
  noteIndex: any;
  constructor(
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    public locationobj: Location,
    public shared_functions: SharedFunctions,
    private router: Router,
    @Inject(DOCUMENT) public document,
    // private consumer_services: ConsumerServices,
    private sharedServices: SharedServices
  ) {
    this.activated_route.queryParams.subscribe(
      (qParams) => {
        this.ynwUuid = qParams.uuid;
        this.providerId = qParams.providerId;
      });
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.provider_label = this.shared_functions.getTerminologyTerm('provider');
    this.cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP.replace('[customer]', this.customer_label);
    this.checkin_label = 'order';
    this.cust_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP.replace('[customer]', this.customer_label);
    this.onResize();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    let divider;
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
    this.no_of_grids = Math.round(divident / divider);
  }

  ngOnInit() {
    this.getCommunicationHistory();
    this.sharedServices.getOrderByConsumerUUID(this.ynwUuid, this.providerId).subscribe(
      (data) => {
        this.waitlist = data;
        console.log(this.waitlist);
      },
      (error) => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    this.getStoreContact();

   // this.getFavouriteProvider();
  }

  getCommunicationHistory() {
   // throw new Error('Method not implemented.');
  }
  gotoPrev() {
    this.locationobj.back();
  }
  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
  }
  checkIfFav(id) {
    let fav = false;
    this.fav_providers_id_list.map((e) => {
      if (e === id) {
        fav = true;
      }
    });
    return fav;
  }
  getFavouriteProvider() {
    this.sharedServices.getFavProvider()
      .subscribe(
        data => {
          this.fav_providers = data;
          this.fav_providers_id_list = [];
          this.setWaitlistTimeDetails();
        },
        error => {
        }
      );
  }
  setWaitlistTimeDetails() {
    for (const x of this.fav_providers) {
      this.fav_providers_id_list.push(x.id);
    }
  }
  doDeleteFavProvider(fav, event) {
    event.stopPropagation();
    if (!fav.id) {
      return false;
    }
    this.shared_functions.doDeleteFavProvider(fav, this)
      .then(
        data => {
          if (data === 'reloadlist') {
            this.getFavouriteProvider();
          }
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  addFavProvider(id, event) {
    event.stopPropagation();
    if (!id) {
      return false;
    }
    this.sharedServices.addProvidertoFavourite(id)
      .subscribe(
        data => {
          this.getFavouriteProvider();
        },
        error => {
        }
      );
  }
  viewMore() {
    this.view_more = !this.view_more;
  }
  gotoActions(booking) {
    console.log(booking);
    this.actiondialogRef = this.dialog.open(ActionPopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: { booking }
    });
    this.actiondialogRef.afterClosed().subscribe(data => {
    });
  }
  getValue(data) {
    this.showView = data;
  }
  sidebar() {
    this.showSide = true;
  }
  closeNav() {
    this.showSide = false;
  }
  getStoreContact() {
    console.log('store');
    this.sharedServices.getStoreContact(this.providerId)
      .subscribe((data: any) => {
        console.log(data);
        this.storeContact = data;
      });
  }
  showNote(index) {
    console.log(index);
    this.noteIndex = [];
    this.noteIndex = index;
    this.showNteSection = !this.showNteSection;
  }

}
