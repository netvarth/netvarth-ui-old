import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

import { CheckInHistoryServices } from '../../consumer-checkin-history-list.service';
import { AddInboxMessagesComponent } from '../../../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { ViewConsumerWaitlistCheckInBillComponent} from '../consumer-waitlist-view-bill/consumer-waitlist-view-bill.component';

@Component({
  selector: 'app-consumer-checkin-history-list',
  templateUrl: './consumer-checkin-history-list.component.html'
})

export class ConsumerCheckInHistoryListComponent implements OnInit, OnChanges {

  @Input()  params;
  @Output() getWaitlistBillEvent = new EventEmitter<any>();

  loadcomplete = {history: false};
  pagination: any  = {
    startpageval: 1,
    totalCnt : 0,
    perPage : projectConstants.PERPAGING_LIMIT
  };
  history: any = [];

  constructor(public consumer_checkin_history_service: CheckInHistoryServices,
  public dialog: MatDialog,
  public shared_functions: SharedFunctions ) {}
  ngOnInit() {
    this.getHistoryCount(this.params);
  }

  ngOnChanges() {

  }

  getHistroy(param) {
    const params = this.setPaginationFilter(param);
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

  getHistoryCount(params) {

    this.consumer_checkin_history_service.getHistoryWaitlistCount(params)
    .subscribe(
    data => {
      const count: any = data;
      this.pagination.totalCnt = data;
      if (count > 0) {
          this.getHistroy(params);
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
    this.getHistroy(this.params);
  }

  setPaginationFilter(params = {}) {
    const api_filter = {};

    if (params['account-eq']) {
      api_filter['account-eq'] = params['account-eq'];
    }

    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    api_filter['count'] = this.pagination.perPage;

    return api_filter;
  }

  addWaitlistMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.ynwUuid;
    pass_ob['user_id'] = waitlist.provider.id;
    this.addNote(pass_ob);

  }

  addNote(pass_ob) {
    const dialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: 'commonpopupmainclass',
      autoFocus: true,
      data: pass_ob
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }

  getWaitlistBill(waitlist) {

    this.consumer_checkin_history_service.getWaitlistBill(waitlist.ynwUuid)
    .subscribe(
      data => {
        const bill_data = data;
        this.viewBill(waitlist, bill_data);
      },
      error => {
        this.shared_functions.openSnackBar(error.error,  {'panelClass': 'snackbarerror'});
      }
    );
  }

  viewBill(checkin, bill_data) {
    const dialogRef = this.dialog.open(ViewConsumerWaitlistCheckInBillComponent, {
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
    });
  }


}
