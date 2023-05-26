import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { ProviderServices } from '../../services/provider-services.service';
import { NavigationExtras, Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
// import { BookingActionsPopupComponent } from './booking-actions-popup/booking-actions-popup.component';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Messages } from '../../../shared/constants/project-messages';
import { AppointmentActionsComponent } from '../appointments/appointment-actions/appointment-actions.component';
import { MatDialog } from '@angular/material/dialog';
// import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  @Input() type;
  @Output() refreshParent = new EventEmitter();
  admin = false;
  providerId;
  bookingType: any;
  selectedLocation: any;
  locations: any[];
  selectedTimeStamp: any = {
    displayName: "Today",
    name: "today"
  };
  timeStamps: any = [
    {
      displayName: "Today",
      name: "today"
    },
    {
      displayName: "Future",
      name: "future"
    },
    {
      displayName: "History",
      name: "history"
    }
  ];
  doneCap = Messages.DONE_BTN;
  locationExist: any;
  scheduleExist: any;
  bookingStatus: any;
  requestsStatus: any;
  isAppointment: any;
  isCheckin: any;
  profileExist: any;
  businessName: any;
  serviceExist: any;
  message: any;
  apiLoading: any = false;
  showDashboard: any;
  users: any;
  selectedUser: any;
  schedules: any;
  tempActiveSchedules: any;
  screenWidth: any;
  smallDeviceDisplay: any;
  unAssignView: any = false;
  views: any;
  selectedView: any;
  activeUser: any;
  activeSchedules: any;
  bookings: any;
  totalBookingsCount: any;
  boardCount: any;
  consumerId: any;
  constructor(
    private groupStorageService: GroupStorageService,
    private providerServices: ProviderServices,
    private router: Router,
    private dialog: MatDialog,
    // private sharedFunctions: SharedFunctions,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService
  ) {

  }

  ngOnInit(): void {
    this.onResize();
    this.getBookingType();
    this.getLocationList();
    this.timeStampChange();
    this.getDisplayboardCount();
  }

  getBookingType() {
    if (this.type && this.type == 'appointments') {
      this.bookingType = "Appointment";
      this.isAppointment = true;
    } else if (this.type && this.type == 'checkins') {
      this.bookingType = "Token";
      this.isCheckin = true;
    }
  }

  createAppointment() {

  }

  getLocationList() {
    const loggedUser = this.groupStorageService.getitemFromGroupStorage('ynw-user');
    const _this = this;
    return new Promise<void>(function (resolve, reject) {
      _this.selectedLocation = null;
      _this.providerServices.getProviderLocations()
        .subscribe(
          (data: any) => {
            const locations = data;
            _this.locations = [];
            if (data.length > 0) {
              _this.locationExist = true;
              _this.getAllShedules();
            } else {
              _this.locationExist = false;
              _this.checkDashboardVisibility();
            }
            for (const loc of locations) {
              if (loc.status === 'ACTIVE') {
                if (loggedUser.accountType === 'BRANCH' && !loggedUser.adminPrivilege) {
                  const userObject = loggedUser.bussLocs.filter(id => parseInt(id) === loc.id);
                  if (userObject.length > 0) {
                    _this.locations.push(loc);
                  }
                } else {
                  _this.locations.push(loc);
                }

              }
            }
            const cookie_location_id = _this.groupStorageService.getitemFromGroupStorage('provider_selectedLocation'); // same in provider checkin button page
            if (cookie_location_id === '') {
              if (_this.locations[0]) {
                _this.locationSelected(_this.locations[0]).then(
                  (schedules: any) => {
                    // _this.initViews(schedules, 'changeLocation').then(
                    //   (view) => {
                    //     // _this.initView(view, 'changeLocation');
                    //   }
                    // );
                  }
                );
              }
            } else {
              _this.selectLocationFromCookies(parseInt(cookie_location_id, 10));
            }
            resolve();
          },
          () => {
            reject();
          },
          () => {
          }
        );
    },
    );
  }

  selectLocationFromCookie(cookie_location_id) {
    let selected_location = null;
    for (const location of this.locations) {
      if (location.id === cookie_location_id) {
        selected_location = location;
      }
    }
    if (selected_location !== null) {
      return selected_location;
    } else {
      const location = this.locations.filter(loc => loc.baseLocation);
      return location[0];
    }
  }

  selectLocationFromCookies(cookie_location_id) {
    // const _this = this;
    this.locationSelected(this.selectLocationFromCookie(cookie_location_id)).then(
      (schedules: any) => {
        // _this.initViews(schedules, '').then(
        //   (view) => {
        //     _this.initView(view, 'changeLocation');
        //   }
        // );
      }
    );
  }

  timeStampChange(event?) {
    const timeStampValue = this.selectedTimeStamp.name;
    const bookingSource = this.isAppointment ? 'appointment' : 'waitlist';
    let api_filter = {
      "from": 0,
      "count": 10
    };
    this.getBookings(bookingSource, timeStampValue, api_filter);
    this.getBookingsCount(bookingSource, timeStampValue);
  }


  getBookingStatus(booking) {
    let bookingStatus = this.isAppointment ? booking && booking.apptStatus : booking && booking.waitlistStatus;
    return bookingStatus;
  }

  stopprop(event) {
    event.stopPropagation();
  }

  loadBookings(event) {
    const timeStampValue = this.selectedTimeStamp.name;
    const bookingSource = this.isAppointment ? 'appointment' : 'waitlist';
    this.getBookingsCount(bookingSource, timeStampValue);
    let api_filter = this.providerServices.setFiltersFromPrimeTable(event);

    if (api_filter) {
      this.getBookingsCount(bookingSource, timeStampValue);
      this.getBookings(bookingSource, timeStampValue, api_filter);
    }
  }

  callingAppt(checkin) {
    const status = (checkin.callingStatus) ? 'Disable' : 'Enable';
    this.providerServices.setApptCallStatus(checkin.uid, status).subscribe(
      () => {
        this.ngOnInit();
      });
  }

  getBookings(source, timeStamp, filter = {}) {
    this.apiLoading = true;
    this.providerServices.getBookings(source, timeStamp, filter).subscribe((data: any) => {
      this.bookings = data;
      this.apiLoading = false;
    }, (error: any) => {
      this.apiLoading = false;
    })
  }

  getBookingsCount(source, timeStamp) {
    this.providerServices.getBookingsCount(source, timeStamp).subscribe((data: any) => {
      this.totalBookingsCount = data;
    }, (error: any) => {

    })
  }

  getGlobalSettings() {
    return new Promise<void>((resolve) => {
      this.providerServices.getAccountSettings().then(
        (data: any) => {
          this.bookingStatus = this.isAppointment ? data.appointment : data.waitlist;
          this.requestsStatus = data.appointmentRequest;
          resolve();
        });
    });
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.groupStorageService.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.businessName = bdetails.bn || '';
    }
    if (this.businessName === '') {
      this.profileExist = false;
    } else {
      this.profileExist = true;
    }
    setTimeout(() => {
      this.checkDashboardVisibility();
    }, 500);
  }
  getAllServices() {
    const filter1 = { 'serviceType-neq': 'donationService' };
    return new Promise<void>((resolve) => {
      this.providerServices.getServicesList(filter1)
        .subscribe(
          (data: any) => {
            if (data.length > 0) {
              this.serviceExist = true;
            } else {
              this.serviceExist = false;
            }
            resolve();
          },
          () => { }
        );
    });
  }

  getAllShedules() {
    const _this = this;
    this.providerServices.getProviderSchedules().subscribe(
      (schedules: any) => {
        if (schedules.length > 0) {
          this.scheduleExist = true;
          this.getGlobalSettings().then(
            () => {
              _this.getAllServices().then(
                () => {
                  _this.getBusinessdetFromLocalstorage();
                }
              );
            }
          );
        } else {
          this.scheduleExist = false;
          this.checkDashboardVisibility();
        }
      });
  }
  checkDashboardVisibility() {
    if (!this.bookingStatus || !this.profileExist || !this.locationExist || !this.serviceExist || !this.scheduleExist) {
      if (!this.profileExist || !this.locationExist || !this.serviceExist || !this.scheduleExist) {
        this.message = 'To access Appointments dashboard, set up the profile and turn on Jaldee Appointment Manager in Settings.';
      } else {
        this.message = 'Enable Jaldee Appointment Manager in your settings to access Appointments dashboard.';
      }
      this.apiLoading = false;
      this.showDashboard = false;
    } else {
      this.apiLoading = false;
      this.showDashboard = true;
    }
  }

  getProviders() {
    const apiFilter = {};
    apiFilter['userType-eq'] = 'PROVIDER';
    apiFilter['businessLocs-eq'] = this.selectedLocation.id
    this.providerServices.getUsers(apiFilter).subscribe(data => {
      this.users = data;
      this.users.sort((a: any, b: any) => (a.firstName).localeCompare(b.firstName))
      const tempUser = {};
      tempUser['firstName'] = 'All';
      tempUser['id'] = 'all';
      if (this.groupStorageService.getitemFromGroupStorage('appt-selectedUser')) {
        this.selectedUser = this.groupStorageService.getitemFromGroupStorage('appt-selectedUser');
      } else {
        this.selectedUser = tempUser;
      }
    });
  }


  showCheckinActions(status, checkin?) {
    let waitlist = [];
    if (checkin) {
      waitlist = checkin;
    }
    let multiSelection;
    if (checkin) {
      multiSelection = false;
    }
    const actiondialogRef = this.dialog.open(AppointmentActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        checkinData: waitlist,
        multiSelection: multiSelection
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {

    });
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
    } else {
      this.smallDeviceDisplay = false;
    }
    if (this.screenWidth <= 1040) {
      this.smallDeviceDisplay = true;
    } else {
      this.smallDeviceDisplay = false;
    }
  }


  getDisplayboardCount() {
    let layout_list: any = [];
    let displayboards: any = [];
    this.providerServices.getDisplayboardsAppointment()
      .subscribe(
        data => {
          displayboards = data;
          layout_list = displayboards.filter(displayboard => !displayboard.isContainer);
          this.boardCount = layout_list.length;
        });
  }


  locationSelected(location) {
    this.selectedLocation = location;
    this.getProviders();
    const _this = this;
    if (this.selectedLocation) {
      this.groupStorageService.setitemToGroupStorage('provider_selected_location', this.selectedLocation.id);
    }
    this.groupStorageService.setitemToGroupStorage('loc_id', this.selectedLocation);
    return new Promise(function (resolve, reject) {
      _this.getSchedules('all').then(
        (queues: any) => {
          _this.schedules = _this.tempActiveSchedules = queues;
          resolve(queues);
        },
        () => {
          resolve([]);
        }
      );
    });
  }

  getSchedules(date?) {
    const _this = this;
    const filterEnum = {};
    filterEnum['state-eq'] = 'ENABLED';
    if (date === 'all') {
      if (this.selectedLocation) {
        filterEnum['location-eq'] = this.selectedLocation.id;
      }
    }
    return new Promise((resolve) => {
      _this.providerServices.getProviderSchedules(filterEnum).subscribe(
        (schedules: any) => {
          const qList = schedules.filter(sch => sch.apptState !== 'EXPIRED');
          resolve(qList);
        });
    });
  }

  manageLocations() {
    this.router.navigate(['provider', 'settings', 'general', 'locations']);
  }


  showCallingModes(modes) {
    if (!modes.consumer) {
      this.consumerId = modes.providerConsumer.id;
    } else {
      this.consumerId = modes.consumer.id;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        waiting_id: modes.uid,
        type: 'appt'
      }
    };
    this.router.navigate(['provider', 'telehealth'], navigationExtras);
  }



  changeWaitlistStatus(action, booking) {
    let bookingUid = this.isAppointment ? booking && booking.uid : booking && booking.ynwUuid;
    return new Promise((resolve, reject) => {
      this.providerServices.changeProviderApptStatus(bookingUid, action)
        .subscribe(
          (data) => {
            resolve(data);
            let status_msg = '';
            switch (action) {
              case 'REPORT': status_msg = '[arrived]'; break;
              case 'STARTED': status_msg = '[started]'; break;
              case 'CANCEL': status_msg = '[cancelled]'; break;
              case 'CHECK_IN': status_msg = 'checked-in'; break;
              case 'DONE': status_msg = 'completed'; break;
            }
            if (booking.token) {
              const msg = this.wordProcessor.getProjectMesssages('WAITLISTTOKEN_STATUS_CHANGE').replace('[status]', status_msg);
              this.snackbarService.openSnackBar(msg);
              this.ngOnInit();
            } else {
              const msg = this.wordProcessor.getProjectMesssages('WAITLIST_STATUS_CHANGE').replace('[status]', status_msg);
              this.snackbarService.openSnackBar(msg);
              this.ngOnInit();

            }
          },
          (error: any) => {
            const errMsg = error.replace('[checkedIn]', 'checked-in');
            this.snackbarService.openSnackBar(errMsg, { 'panelClass': 'snackbarerror' });
            this.ngOnInit();
            reject(error);
          }
        );
    });
  }



}
