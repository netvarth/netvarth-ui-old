import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../../shared/modules/header/header.component';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { AdjustQueueDelayComponent } from '../adjust-queue-delay/adjust-queue-delay.component';
import { AddProviderCheckinComponent } from '../add-provider-checkin/add-provider-checkin.component';
import { ProviderWaitlistCheckInCancelPopupComponent } from '../provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';

import { SharedServices } from '../../../shared/services/shared-services';

import * as moment from 'moment';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {FormControl} from '@angular/forms';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
    selector: 'app-provider-home',
    templateUrl: './provider-home.component.html',
    styleUrls: ['./provider-home.component.scss']
})

export class ProviderHomeComponent implements OnInit {


  locations: any = [];
  queues: any = [];
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
  queue_date = moment(new Date()).format('YYYY-MM-DD');
  edit_location = 0;

  load_locations = 0;
  load_queue = 0;
  load_waitlist = 0 ;

  open_filter = false;
  waitlist_status = [
    {name : 'Check Ins', value: 'CheckedIn'},
    {name : 'Cancelled', value: 'Cancelled'},
    {name : 'Started', value: 'Started'},
    {name : 'Arrived', value: 'Arrived'},
    {name : 'Done', value: 'Done'}];

  filter = {
    first_name: '',
    queue: 'all',
    service: 'all',
    waitlist_status: 'all',
    check_in_date: moment(new Date()).format('YYYY-MM-DD'),
    location_id: 'all'
  };

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private provider_shared_functions: ProviderSharedFuctions,
    private router: Router,
    private shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private shared_services: SharedServices) {
    }


  ngOnInit() {
    this.getLocationList();
    this.getServiceList();
  }

  getLocationList() {

    this.load_locations = 0;
    this.selected_location = null;
    this.provider_services.getProviderLocations()
    .subscribe(
      data => {
        this.locations = data;
        const cookie_location_id = this.shared_functions.getItemOnCookie('provider_selected_location');
        if ( cookie_location_id === '') {
          if (this.locations[0]) {
            this.changeLocation(this.locations[0]);
          }
        } else {
          this.selectLocationFromCookie(parseInt(cookie_location_id, 10));
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
    this.loadApiSwitch();
    this.shared_functions.setItemOnCookie('provider_selected_location', this.selected_location.id);

    this.getFutureCheckinCount();
    this.getTodayCheckinCount();
    // this.getHistoryCheckinCount();
  }

  selectedQueue(selected_queue) {
    this.selected_queue = selected_queue;
    this.getTodayCheckIn();
  }

  getFutureCheckinCount() {
    this.provider_services.getWaitlistFutureCount()
    .subscribe(
      data => {
        this.future_waitlist_count = data || 0 ;
      },
      error => {

      });
  }

  getHistoryCheckinCount() {
    this.provider_services.getwaitlistHistoryCount()
    .subscribe(
      data => {
        this.histroy_waitlist_count = data || 0 ;
      },
      error => {

      });
  }

  getTodayCheckinCount() {
    this.provider_services.getwaitlistTodayCount()
    .subscribe(
      data => {
        this.today_waitlist_count = data || 0 ;
      },
      error => {

      });
  }

  getTodayCheckIn() {
    this.load_waitlist = 0;
    const filter = this.setFilterForApi();

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
    this.provider_services.getFutureWaitlist()
    .subscribe(
      data => {
        this.check_in_list = this.check_in_filtered_list = data;
        this.future_waitlist_count = this.check_in_list.length || 0;
      },
      error => {
        this.load_waitlist = 1;
      },
      () => {
        this.load_waitlist = 1;
      });
  }

  getHistoryCheckIn() {
    this.load_waitlist = 0;
    this.provider_services.getHistroryWaitlist()
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

  setTimeType(time_type) {
    this.check_in_list  = this.check_in_filtered_list = [];
    this.time_type = time_type;
    // this.queues = [];
    this.loadApiSwitch();
  }

  loadApiSwitch() {
    switch (this.time_type) {

      case 0 : this.getHistoryCheckIn(); break;
      case 1 : this.getQueueList(); break;
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

  goCheckIn() {


    const dialogRef = this.dialog.open(AddProviderCheckinComponent, {
      width: '50%',
      data: {
        locations : this.locations,
        selected_location : this.selected_location,
        queues: this.queues,
        selected_queue: this.selected_queue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getTodayCheckIn();
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
    this.loadApiSwitch();
  }

  changeStatusType(type) {


  this.status_type = type;
  let status: any = this.status_type ;

  switch (type) {
    case 'all' : status = ['checkedIn', 'arrived'];
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

    if (action === 'CANCEL') {

      const dialogRef = this.dialog.open(ProviderWaitlistCheckInCancelPopupComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass'],
        data: {
          waitlist: waitlist
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.cancelReason) {
          this.changeWaitlistStatusApi(waitlist, action, result);
        }
      });

    } else {
      this.changeWaitlistStatusApi(waitlist, action);
    }
  }

  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.provider_services.changeProviderWaitlistStatus(waitlist.ynwUuid, action, post_data)
    .subscribe(
      data => {
        this.loadApiSwitch();
        let status_msg = '';
        switch (action) {
          case 'REPORT' : status_msg = 'ARRIVED'; break;
          case 'STARTED' : status_msg = 'STARTED'; break;
          case 'CANCEL' : status_msg = 'CANCELLED'; break;
          case 'CHECK_IN' : status_msg = 'CHECK IN'; break;
          case 'DONE': status_msg = 'COMPLETED'; break;
        }
        const msg = Messages.WAITLIST_STATUS_CHANGE.replace('[status]', status_msg);
        this.provider_shared_functions.openSnackBar (msg);
      },
      error => {
        this.provider_shared_functions.openSnackBar (error.error);
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
    console.log(this.filter);
  }

  setFilterForApi() {
    let filter = {
      'queue-eq' : this.selected_queue.id
    };
    return filter;
  }

  doSearch() {

  }

}
