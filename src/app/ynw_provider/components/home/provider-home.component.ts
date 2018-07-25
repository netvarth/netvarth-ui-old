import {Component, OnInit, OnDestroy} from '@angular/core';
import {HeaderComponent} from '../../../shared/modules/header/header.component';
import { Subscription, ISubscription } from 'rxjs/Subscription';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { AdjustQueueDelayComponent } from '../adjust-queue-delay/adjust-queue-delay.component';
import { ProviderWaitlistCheckInCancelPopupComponent } from '../provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { AddProviderWaitlistCheckInBillComponent } from '../add-provider-waitlist-checkin-bill/add-provider-waitlist-checkin-bill.component';
import { ViewProviderWaitlistCheckInBillComponent } from '../view-provider-waitlist-checkin-bill/view-provider-waitlist-checkin-bill.component';
import { ProviderWaitlistCheckInPaymentComponent } from '../provider-waitlist-checkin-payment/provider-waitlist-checkin-payment.component';

import { SharedServices } from '../../../shared/services/shared-services';

import * as moment from 'moment';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {FormControl} from '@angular/forms';
import { projectConstants } from '../../../shared/constants/project-constants';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'app-provider-home',
    templateUrl: './provider-home.component.html',
    styleUrls: ['./provider-home.component.scss']
})

export class ProviderHomeComponent implements OnInit, OnDestroy {


  locations: any = [];
  queues: any = [];
  all_queues: any = [];
  services: any = [];
  selected_location = null;
  selected_location_index = null;
  selected_queue = null;
  future_waitlist_count: any = 0;
  today_waitlist_count: any = 0;
  histroy_waitlist_count: any = 0;
  time_type = 1;
  check_in_list: any = [];
  check_in_filtered_list: any = [];
  status_type = 'all';
  queue_date = moment(new Date()).format(projectConstants.POST_DATE_FORMAT);
  edit_location = 0;

  load_locations = 0;
  load_queue = 0;
  load_waitlist = 0 ;

  open_filter = false;
  waitlist_status = [];

  filter = {
    first_name: '',
    queue: 'all',
    service: 'all',
    waitlist_status: 'all',
    check_in_start_date: null,
    check_in_end_date: null,
    location_id: 'all',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  }; // same in resetFilter Fn

  // filter_date_max = moment(new Date()).add(-1, 'days');
  // filter_date_min = moment(new Date()).add(+1, 'days');

  filter_date_start_min = null;
  filter_date_start_max = null;
  filter_date_end_min = null;
  filter_date_end_max = null;

  customer_label = '';
  provider_label = '';
  arrived_label = '';
  arrived_upper = '';
  checkedin_label = '';
  checkedin_upper = '';
  done_label = '';
  done_upper = '';
  started_label = '';
  started_upper = '';
  cancelled_label = '';
  cancelled_upper = '';
  checkin_label  = '';
  start_label = '';

  pagination: any  = {
    startpageval: 1,
    totalCnt : 0,
    perPage : this.filter.page_count
  };

  cronHandle: Subscription;
  cronStarted;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private common_datastorage: CommonDataStorageService,
    private provider_shared_functions: ProviderSharedFuctions,
    private router: Router,
    private shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private shared_services: SharedServices) {

      this.customer_label = this.shared_functions.getTerminologyTerm('customer');
      this.provider_label = this.shared_functions.getTerminologyTerm('provider');

      this.arrived_label = this.shared_functions.getTerminologyTerm('arrived');
      this.arrived_upper = this.shared_functions.firstToUpper(this.arrived_label);

      this.checkedin_label = this.shared_functions.getTerminologyTerm('waitlisted');
      this.checkedin_upper = this.shared_functions.firstToUpper(this.checkedin_label);

      this.done_label = this.shared_functions.getTerminologyTerm('done');
      this.done_upper = this.shared_functions.firstToUpper(this.done_label);

      this.started_label = this.shared_functions.getTerminologyTerm('started');
      this.started_upper = this.shared_functions.firstToUpper(this.started_label);

      this.start_label = this.shared_functions.getTerminologyTerm('start');

      this.cancelled_label = this.shared_functions.getTerminologyTerm('cancelled');
      this.cancelled_upper = this.shared_functions.firstToUpper(this.cancelled_label);

      this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');

      this.waitlist_status = [
        {name :  this.checkedin_upper, value: 'checkedIn'},
        {name : this.cancelled_upper, value: 'cancelled'},
        {name : this.started_upper, value: 'started'},
        {name : this.arrived_upper, value: 'arrived'},
        {name : this.done_upper, value: 'done'}];

    }


  ngOnInit() {
    this.shared_functions.setBusinessDetailsforHeaderDisp('', '', '');
    this.getBusinessProfile();
    this.getLocationList();
    this.getServiceList();

    this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(x => {
        this.reloadAPIs();
    });
  }

  ngOnDestroy() {
     if (this.cronHandle) {
      this.cronHandle.unsubscribe();
     }
  }

  getBusinessProfile() {
    let bProfile: any = [];

    this.getBussinessProfileApi()
    .then(
      data => {
        bProfile = data;
        if (bProfile['serviceSector'] && bProfile['serviceSector']['domain']) {
          // calling function which saves the business related details to show in the header
          this.shared_functions.setBusinessDetailsforHeaderDisp(bProfile['businessName']
           || '', bProfile['serviceSector']['displayName'] || '', '');
           this.getProviderLogo(bProfile['businessName'] || '', bProfile['serviceSector']['displayName'] || '');

           const pdata = { 'ttype': 'updateuserdetails' };
           this.shared_functions.sendMessage(pdata);
          }
      },
      error => {

      }
    );

  }

  getBussinessProfileApi() {
    const _this = this;
    return new Promise(function (resolve, reject) {

      _this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          resolve(data);
        },
        error => {
          reject();
        }
      );

    });
  }
   // get the logo url for the provider
   getProviderLogo(bname = '', bsector = '') {
    let blogo;
    this.provider_services.getProviderLogo()
      .subscribe(
      data => {
        blogo = data;
        // console.log('here logo', this.blogo);
        let logo = '';
        if (blogo[0]) {
          logo = blogo[0].url;
        } else {
          logo = '';
        }
        // calling function which saves the business related details to show in the header
        this.shared_functions.setBusinessDetailsforHeaderDisp(bname || '', bsector || '', logo );
        const pdata = { 'ttype': 'updateuserdetails' };
        this.shared_functions.sendMessage(pdata);
      },
      error => {

      }
      );
  }

  getLocationList() {

    this.load_locations = 0;
    this.selected_location = null;
    this.provider_services.getProviderLocations()
    .subscribe(
      (data: any) => {
        const locations = data;
        this.locations = [];

        for ( const loc of locations) {
          if (loc.status === 'ACTIVE') {
            this.locations.push(loc);
          }
        }

        const cookie_location_id = this.shared_functions.getItemOnCookie('provider_selected_location'); // same in provider checkin button page
        if ( cookie_location_id === '') {
          if (this.locations[0]) {
            this.changeLocation(this.locations[0]);
          }
        } else {
          this.selectLocationFromCookie(parseInt(cookie_location_id, 10));
          this.getQueueList();
        }

      },
      error => {
        this.load_locations = 1;
      },
      () => {
        this.load_locations = 1;
      }
    );
  }

  selectLocationFromCookie (cookie_location_id) {
    let selected_location = null;
    for (const location of this.locations) {
      if (location.id === cookie_location_id) {
        selected_location = location;
      }
    }

    (selected_location !== null) ? this.changeLocation(selected_location) :
    this.changeLocation(this.locations[0]);

  }

  getServiceList() {
    this.provider_services.getServicesList()
    .subscribe(
      data => {
        this.services = data;
      },
      error => {

      }
    );
  }

  getQueueList() {
    this.provider_services.getProviderLocationQueues(this.selected_location.id)
    .subscribe(
      data => {
        this.all_queues = data;

        for (let ii = 0; ii < this.all_queues.length; ii++) {
          let schedule_arr = [];
          // extracting the schedule intervals
          if (this.all_queues[ii].queueSchedule) {
           schedule_arr = this.shared_functions.queueSheduleLoop(this.all_queues[ii].queueSchedule);
          }
          let display_schedule = [];
          display_schedule =  this.shared_functions.arrageScheduleforDisplay(schedule_arr);
          this.all_queues[ii]['displayschedule'] = display_schedule[0];
        }
        // console.log(this.all_queues);
      },
      error => {
      },
      () => {
      }
    );
  }

  getQueueListByDate() {

    this.load_queue = 0;
    if (!this.selected_queue) {

      if (this.selected_location.id) {
        this.provider_services.getProviderLocationQueuesByDate(
          this.selected_location.id, this.queue_date)
        .subscribe(
          data => {
            this.queues = data;
            if (this.queues[0] && this.selected_queue == null) {
              this.selectedQueue(this.queues[0]);
            }
          },
          error => {
            this.queues = [];
            this.load_queue = 1;
          },
          () => {
            this.load_queue = 1;
          }
        );
      }
    } else {
      this.selectedQueue(this.selected_queue);
    }
  }


  changeLocation(location) {

    this.selected_location = location;
    this.selected_queue = null;
    this.loadApiSwitch('changeLocation');
    this.shared_functions.setItemOnCookie('provider_selected_location', this.selected_location.id);

    this.getQueueList();

    this.getFutureCheckinCount()
    .then(
      (result) => {
        this.future_waitlist_count = result;
      }
    );

    // this.getTodayCheckinCount()
    // .then(
    //   result => {
    //     this.today_waitlist_count = result;
    //   }
    // );
    // this.getHistoryCheckinCount();
  }

  selectedQueue(selected_queue) {
    this.selected_queue = selected_queue;
    this.getTodayCheckIn();
    this.getTodayCheckinCount()
      .then(
        result => {
          this.today_waitlist_count = result;
        }
      );
  }

  getFutureCheckinCount(filter = null) {

    let no_filter = false;
    if (!filter) {
      filter = {
        'location-eq' : this.selected_location.id,
      };
      no_filter = true;
    }

    return new Promise((resolve, reject) => {
      this.provider_services.getWaitlistFutureCount(filter)
      .subscribe(
        data => {
          resolve(data);
          if (no_filter) { this.future_waitlist_count = data; }
        },
        error => {

        });
    });


  }

  getHistoryCheckinCount(filter = null) {

    let no_filter = false;
    if (!filter) {
      filter = {
        'location-eq' : this.selected_location.id
      };
      no_filter = true;
    }
    // console.log(filter);
    return new Promise((resolve, reject) => {

    this.provider_services.getwaitlistHistoryCount(filter)
    .subscribe(
      data => {
        resolve(data);
        if (no_filter) { this.histroy_waitlist_count = data; }
      },
      error => {

      });

    });
  }

  getTodayCheckinCount(filter = null) {

    let no_filter = false;

    if (!filter) {
      filter = {
        'location-eq' : this.selected_location.id,
        'queue-eq' : this.selected_queue.id
      };

      no_filter = true;
    }

    return new Promise((resolve, reject) => {

      this.provider_services.getwaitlistTodayCount(filter)
      .subscribe(
        data => {
          if (no_filter) { this.today_waitlist_count = data; }
          resolve(data);
        },
        error => {

        });

    });
  }

  getTodayCheckIn() {
    this.load_waitlist = 0;
    const filter = this.setFilterForApi();
    this.resetPaginationData();

    this.pagination.startpageval =  1;
    this.pagination.totalCnt = 0; // no need of pagination in today

    this.provider_services.getTodayWaitlist(filter)
    .subscribe(
      data => {
        this.check_in_list = data;
        if (this.status_type) {
            this.changeStatusType(this.status_type);
        } else {
          this.changeStatusType('all');
        }
      },
      error => {
        this.load_waitlist = 1;
      },
      () => {
        this.load_waitlist = 1;
      });
  }

  getFutureCheckIn() {
    this.load_waitlist = 0;
    let filter = this.setFilterForApi();


    const promise = this.getFutureCheckinCount(filter);

    promise.then(
      result => {
        this.pagination.totalCnt = result;
        filter = this.setPaginationFilter(filter);

        this.provider_services.getFutureWaitlist(filter)
        .subscribe(
          data => {
            this.check_in_list = this.check_in_filtered_list = data;
            // this.future_waitlist_count = this.check_in_list.length || 0;
          },
          error => {
            this.load_waitlist = 1;
          },
          () => {
            this.load_waitlist = 1;
          });

      });

  }

  getHistoryCheckIn() {
    this.load_waitlist = 0;
    let filter = this.setFilterForApi();

    const promise = this.getHistoryCheckinCount(filter);

    promise.then(
      result => {
        this.pagination.totalCnt = result;
        filter = this.setPaginationFilter(filter);

        this.provider_services.getHistroryWaitlist(filter)
        .subscribe(
          data => {
            this.check_in_list = this.check_in_filtered_list = data;
          },
          error => {
            this.load_waitlist = 1;
          },
          () => {
            this.load_waitlist = 1;
          });

      }
    );



  }

  setTimeType(time_type) {
    this.check_in_list  = this.check_in_filtered_list = [];
    this.time_type = time_type;
    this.status_type = 'all';
    this.setFilterDateMaxMin();
    // this.queues = [];
    this.loadApiSwitch('setTimeType');
  }

  setFilterDateMaxMin() {

    this.filter_date_start_min = null;
    this.filter_date_start_max = null;
    this.filter_date_end_min = null;
    this.filter_date_end_max = null;

    if (this.time_type === 0) {
      this.filter_date_start_max = moment(new Date()).add(-1, 'days');
      this.filter_date_end_max = moment(new Date()).add(-1, 'days');
    } else if (this.time_type === 2) {
      this.filter_date_start_min = moment(new Date()).add(+1, 'days');
      this.filter_date_end_min = moment(new Date()).add(+1, 'days');
    }

  }

  checkFilterDateMaxMin(type) {
    if (type === 'check_in_start_date') {
      this.filter_date_end_min = this.filter.check_in_start_date;
      if (this.filter.check_in_end_date < this.filter.check_in_start_date) {
        this.filter.check_in_end_date = this.filter.check_in_start_date;
      }
    } else if (type === 'check_in_end_date') {
      this.filter_date_start_max = this.filter.check_in_end_date;

      if (this.filter.check_in_end_date < this.filter.check_in_start_date) {
        this.filter.check_in_start_date = this.filter.check_in_end_date;
      }

    }
    this.doSearch();

  }

  loadApiSwitch(source) {
    if (source !== 'doSearch' && source !== 'reloadAPIs' && source !== 'changeWaitlistStatusApi') {
      this.resetFilter();
    }

    switch (this.time_type) {

      case 0 : this.getHistoryCheckIn(); break;
      case 1 : this.getQueueListByDate(); break;
      case 2 : this.getFutureCheckIn(); break;
    }
  }

  showAdjustDelay() {

    if (this.queues.length === 0 || !this.selected_queue.id) {
      return false;
    }

    const dialogRef = this.dialog.open(AdjustQueueDelayComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      data: {
        queues: this.queues,
        queue_id: this.selected_queue.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }


  editLocation() {
     this.locations.forEach((loc, index) => {
      if (this.selected_location.id === loc.id) {
        this.selected_location_index = index;
      }
    });
    this.edit_location = 1;

  }

  cancellocationChange() {
    this.edit_location = 0;
  }

  onChangeLocationSelect(event) {
    const value = event.value;
    this.changeLocation(this.locations[value] || []);
  }

  reloadAPIs() {
    this.countApiCall();
    this.loadApiSwitch('reloadAPIs');
  }

  countApiCall() {

    this.getHistoryCheckinCount();
    this.getFutureCheckinCount();
    this.getTodayCheckinCount();
  }
  changeStatusType(type) {


    this.status_type = type;
    let status: any = this.status_type ;

    switch (type) {
      case 'all' : status = ['checkedIn', 'arrived', 'prepaymentPending'];
    }

    this.check_in_filtered_list = this.check_in_list.filter(
        check_in => {
          if (typeof(status) === 'string' &&
          check_in.waitlistStatus === status) {
            return check_in;
          } else if (typeof(status) === 'object') {

            const index = status.indexOf(check_in.waitlistStatus);
            if (index !== -1) {
              return check_in;
            }

          }

        });
  }

  changeWaitlistStatus(waitlist, action) {
  this.provider_shared_functions.changeWaitlistStatus(this, waitlist, action);
  }

  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
    .then(
      result => {
        this.loadApiSwitch(result);
      }
    );
  }

  showConsumerNote (checkin) {
    const dialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      data: {
        checkin: checkin
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }

  toggleFilter() {
    this.open_filter = !this.open_filter;
  }

  setFilterData(type, value) {
    this.filter[type] = value;
    this.resetPaginationData();
    this.doSearch();
  }

  setFilterForApi() {
    const api_filter = {};

    if (this.time_type === 1) {
      api_filter['queue-eq'] = this.selected_queue.id;
    } else if (this.filter.queue !== 'all') {
      api_filter['queue-eq'] = this.filter.queue;
    }

    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }

    if (this.filter.service !== 'all') {
      api_filter['service-eq'] = this.filter.service;
    }

    if (this.time_type !== 1 ) {
      if (this.filter.waitlist_status !== 'all') {
        api_filter['waitlistStatus-eq'] = this.filter.waitlist_status;
      }

      // if (this.filter.check_in_date != null) {
      //   api_filter['date-eq'] = this.filter.check_in_date.format('YYYY-MM-DD');
      // }

      if (this.filter.check_in_start_date != null) {
        api_filter['date-ge'] = this.filter.check_in_start_date.format('YYYY-MM-DD');
      }

      if (this.filter.check_in_end_date != null) {
        api_filter['date-le'] = this.filter.check_in_end_date.format('YYYY-MM-DD');
      }

    }

    api_filter['location-eq'] = this.selected_location.id;

    return api_filter;
  }

  setPaginationFilter(api_filter) {

    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;

    return api_filter;
  }

  doSearch() {
    this.loadApiSwitch('doSearch');
  }

  resetFilter() {
    this.filter = {
      first_name: '',
      queue: 'all',
      service: 'all',
      waitlist_status: 'all',
      check_in_start_date: null,
      check_in_end_date: null,
      location_id: 'all',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 0
    };
  }

  goCheckinDetail(checkin) {
    this.router.navigate(['provider', 'checkin-detail', checkin.ynwUuid]);
  }

  addProviderNote(checkin) {
    const dialogRef = this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      data: {
        checkin_id: checkin.ynwUuid
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }

  getWaitlistBill(checkin, type = 'bill') {
    this.provider_services.getWaitlistBill(checkin.ynwUuid)
    .subscribe(
      data => {
        if (type === 'bill') {
          this.viewBill(checkin , data);
        } else {
          this.makePayment(checkin , data);
        }
      },
      error => {
        console.log(error);
        if (error.status === 422 && this.time_type === 1) {
          this.addEditBill(checkin , null);
        } else {
          this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      },
      () => {
      }
    );
  }

  addEditBill(checkin, bill_data) {
    const dialogRef = this.dialog.open(AddProviderWaitlistCheckInBillComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'width-100'],
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.reloadAPIs();
      }
    });
  }

  viewBill(checkin, bill_data) {
    const dialogRef = this.dialog.open(ViewProviderWaitlistCheckInBillComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'width-100'],
      disableClose: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'updateBill') {
        this.addEditBill(checkin, bill_data);
      } else if (result === 'reloadlist') {
        this.reloadAPIs();
      } else if ( result === 'makePayment') {
        this.makePayment(checkin, bill_data);
      }
    });
  }

  makePayment(checkin, bill_data) {
    const dialogRef = this.dialog.open(ProviderWaitlistCheckInPaymentComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadAPIs();
    });
  }

  resetPaginationData() {
    this.filter.page = 1;
    this.pagination.startpageval = 1;
  }

  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    console.log('page', pg);
    this.doSearch();
  }

  addConsumerInboxMessage(waitlist) {

    const uuid = waitlist.ynwUuid || null;

    this.provider_shared_functions.addConsumerInboxMessage(uuid)
    .then(
      result => {

      },
      error => {

      }
    );
  }

  reloadActionSubheader(data) {
    this.reloadAPIs();
  }

  getStatusLabel(status) {
    const label_status = this.shared_functions.firstToUpper(this.shared_functions.getTerminologyTerm(status));
    return label_status;
  }

}
