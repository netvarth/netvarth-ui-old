import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../../shared/modules/header/header.component';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { AdjustQueueDelayComponent } from '../adjust-queue-delay/adjust-queue-delay.component';
import { AddProviderCheckinComponent } from '../add-provider-checkin/add-provider-checkin.component';

import { SharedServices } from '../../../shared/services/shared-services';

import * as moment from 'moment';

@Component({
    selector: 'app-provider-home',
    templateUrl: './provider-home.component.html',
    styleUrls: ['./provider-home.component.scss']
})

export class ProviderHomeComponent implements OnInit {

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private router: Router,
    private shared_functions: SharedFunctions,
    private dialog: MatDialog,
    private shared_services: SharedServices) {}

  locations: any = [];
  queues: any = [];
  selected_location = null;
  selected_queue = null;
  future_waitlist_count: any = 0;
  today_waitlist_count: any = 0;
  histroy_waitlist_count: any = 0;
  time_type = 1;
  check_in_list: any = [];
  queue_date = moment(new Date()).format('YYYY-MM-DD');

  ngOnInit() {
    this.getLocationList();
  }

  getLocationList() {
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

  getQueueList() {
    this.selected_queue = null;
    if (this.selected_location.id) {
      this.provider_services.getProviderLocationQueuesByDate(
        this.selected_location.id, this.queue_date)
      .subscribe(
        data => {
          this.queues = data;
          if (this.queues[0]) {
            this.selectedQueue(this.queues[0]);
          }
        },
        error => {
        }
      );
    }
  }

  onChangeLocationSelect(event) {
    const value = event.target.value;
    this.changeLocation(this.locations[value] || []);
  }

  changeLocation(location) {

    this.selected_location = location;
    this.selected_queue = null;
    this.loadApiSwitch();
    this.shared_functions.setItemOnCookie('provider_selected_location', this.selected_location.id);

  }

  selectedQueue(selected_queue) {
    this.selected_queue = selected_queue;
    this.getTodayCheckIn();
  }

  getFutureCheckinCount() {
    this.provider_services.getWaitlistFutureCount(this.selected_queue.id)
    .subscribe(
      data => {
        this.future_waitlist_count = data || 0 ;
      },
      error => {

      });
  }

  getHistoryCheckinCount() {
    this.provider_services.getwaitlistHistoryCount(this.selected_queue.id)
    .subscribe(
      data => {
        this.histroy_waitlist_count = data || 0 ;
      },
      error => {

      });
  }

  getTodayCheckinCount() {
    this.provider_services.getwaitlistTodayCount(this.selected_queue.id)
    .subscribe(
      data => {
        this.today_waitlist_count = data || 0 ;
      },
      error => {

      });
  }

  getTodayCheckIn() {

    this.provider_services.getTodayWaitlist(this.selected_queue.id)
    .subscribe(
      data => {
        this.check_in_list = data;
      },
      error => {

      });
  }

  getFutureCheckIn() {
    this.provider_services.getFutureWaitlist(this.selected_queue.id)
    .subscribe(
      data => {
        this.check_in_list = data;
      },
      error => {

      });
  }

  getHistoryCheckIn() {
    this.provider_services.getHistroryWaitlist(this.selected_queue.id)
    .subscribe(
      data => {
        this.check_in_list = data;
      },
      error => {

      });
  }

  setTimeType(time_type) {
    this.time_type = time_type;
    this.check_in_list  = [];
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

  goPatient() {

  }
}
