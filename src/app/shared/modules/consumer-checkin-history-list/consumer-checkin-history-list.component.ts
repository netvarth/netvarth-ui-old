import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { CheckInHistoryServices } from './consumer-checkin-history-list.service';

@Component({
  selector: 'app-consumer-checkin-history-list',
  templateUrl: './consumer-checkin-history-list.component.html'
})

export class ConsumerCheckInHistoryListComponent implements OnInit, OnChanges {

  @Input() history;
  @Output() addNoteEvent = new EventEmitter<any>();
  @Output() getWaitlistBillEvent = new EventEmitter<any>();

  loadcomplete = {history: false};
  pagination: any  = {
    startpageval: 1,
    totalCnt : 0,
    perPage : projectConstants.PERPAGING_LIMIT
  };

  constructor(public consumer_checkin_history_service: CheckInHistoryServices,
  public dialog: MatDialog,
  public shared_functions: SharedFunctions ) {}
  ngOnInit() {
    this.getHistoryCount();
  }

  ngOnChanges() {

  }

  getHistroy() {
    const params = this.setPaginationFilter();
    this.consumer_checkin_history_service.getWaitlistHistory(params)
    .subscribe(
    data => {
        this.history = data;
        this.loadcomplete.history = true;
    },
    error => {
      this.loadcomplete.history = true;
    }
    );
  }

  getHistoryCount() {

    this.consumer_checkin_history_service.getHistoryWaitlistCount()
    .subscribe(
    data => {
      const count: any = data;
      this.pagination.totalCnt = data;
      if (count > 0) {
          this.getHistroy();
      } else {
        this.loadcomplete.history = true;
      }
    },
    error => {
      this.loadcomplete.history = true;
    }
    );
  }


  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.getHistroy();
  }

  setPaginationFilter() {
    const api_filter = {};
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    api_filter['count'] = this.pagination.perPage;

    return api_filter;
  }

  addWaitlistMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['checkin_id'] = waitlist.ynwUuid;
    pass_ob['user_id'] = waitlist.provider.id;
    this.addNote(pass_ob);

  }

  addNote(pass_ob) {
    this.addNoteEvent.emit(pass_ob);
  }

  getWaitlistBill(waitlist) {
    this.getWaitlistBillEvent.emit(waitlist);
  }



}
