import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HeaderComponent } from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { AddProviderWaitlistQueuesComponent } from '../add-provider-waitlist-queues/add-provider-waitlist-queues.component';

import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

@Component({
  selector: 'app-provider-waitlist-queues',
  templateUrl: './provider-waitlist-queues.component.html',
  styleUrls: ['./provider-waitlist-queues.component.css']
})

export class ProviderWaitlistQueuesComponent implements OnInit, OnDestroy {

  loc_cap = Messages.LOCATION_CAP;
  schedule_cap = Messages.WAITLIST_SCHEDULE_CAP;
  no_service_cap = Messages.NO_SERVICE_CAP;
  new_serv_cap = Messages.QUEUE_NEW_SERVICE_WIND_CAP;
  max_capacity_cap = Messages.QUEUE_MAX_CAPACITY_CAP;
  queue_list: any = [];
  query_executed = false;

  api_error = null;
  api_success = null;

  api_load_complete = 0;
  tooltip_queueedit = Messages.QUEUENAME_TOOLTIP;
  breadcrumb_moreoptions: any = [];
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'Waitlist Manager',
      url: '/provider/settings/waitlist-manager'
    },
    {
      title: 'Service Time Windows'
    }
  ];
  queuedialogRef;

  constructor(
    private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private shared_Functionsobj: SharedFunctions,
    private dialog: MatDialog,
    private router: Router,
    public provider_shared_functions: ProviderSharedFuctions) { }

  ngOnInit() {
    // calling the method to get the list of locations
    this.getProviderQueues();
    this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'waitlistmanager', 'subKey': 'timewindow', 'classname': 'b-queue' };
  }

  ngOnDestroy() {
    if (this.queuedialogRef) {
      this.queuedialogRef.close();
    }
  }

  // get the list of locations added for the current provider
  getProviderQueues() {
    const activeQueues: any = [];
    this.provider_services.getProviderQueues()
      .subscribe(data => {
        this.queue_list = data;
        for (let ii = 0; ii < this.queue_list.length; ii++) {
          let schedule_arr = [];
          // extracting the schedule intervals
          if (this.queue_list[ii].queueSchedule) {
            schedule_arr = this.shared_Functionsobj.queueSheduleLoop(this.queue_list[ii].queueSchedule);
          }
          let display_schedule = [];
          display_schedule = this.shared_Functionsobj.arrageScheduleforDisplay(schedule_arr);
          this.queue_list[ii]['displayschedule'] = display_schedule;
          if (this.queue_list[ii].queueState === 'ENABLED') {
            activeQueues.push(display_schedule[0]);
          }
        }
        this.provider_shared_functions.setActiveQueues(activeQueues);
        this.query_executed = true;
      },
        complete => {
          this.api_load_complete = 1;
        });
  }
  addEditProviderQueue(type, queue = null) {
    this.provider_shared_functions.addEditQueuePopup(this, type, 'queue_list', queue, this.provider_shared_functions.getActiveQueues());
  }
  changeProviderQueueStatus(obj) {
    this.provider_shared_functions.changeProviderQueueStatus(this, obj, 'queue_list');
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  goQueueDetail(queue) {
    this.router.navigate(['provider', 'settings', 'waitlist-manager',
      'queue-detail', queue.id]);
  }
  learnmore_clicked(mod, e) {
    /* const dialogRef = this.dialog.open(LearnmoreComponent, {
           width: '50%',
           panelClass: 'commonpopupmainclass',
           autoFocus: true,
           data: {
               moreOptions : this.getMode(mod)
           }
         });
         dialogRef.afterClosed().subscribe(result => {
         });*/
    e.stopPropagation();
    const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
    this.shared_Functionsobj.sendMessage(pdata);
        }
getMode(mod) {
    let moreOptions = {};
    moreOptions = { 'show_learnmore': true, 'scrollKey': 'bprofile', 'subKey': mod };
    return moreOptions;
  }
}
