import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';


import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

import { CheckInHistoryServices } from '../../consumer-checkin-history-list.service';
import { AddInboxMessagesComponent } from '../../../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { ViewConsumerWaitlistCheckInBillComponent} from '../consumer-waitlist-view-bill/consumer-waitlist-view-bill.component';
import { ConsumerRateServicePopupComponent} from '../../../../components/consumer-rate-service-popup/consumer-rate-service-popup';
import { ConsumerWaitlistCheckInPaymentComponent } from '../../../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-checkin-payment/consumer-waitlist-checkin-payment.component';

@Component({
  selector: 'app-consumer-checkin-history-list',
  templateUrl: './consumer-checkin-history-list.component.html'
})

export class ConsumerCheckInHistoryListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() reloadapi;
  @Input()  params;
  @Output() getWaitlistBillEvent = new EventEmitter<any>();

  service_provider_cap = Messages.SERV_PROVIDER_CAP;
  service_cap =Messages.PRO_SERVICE_CAP;
  location_cap =Messages.LOCATION_CAP;
  date_cap = Messages.DATE_COL_CAP;
  status_cap = Messages.PRO_STATUS_CAP;
  send_message_cap = Messages.SEND_MSG_CAP;
  bill_cap = Messages.BILL_CAPTION;
  rate_your_visit = Messages.RATE_YOU_VISIT;
  no_prev_checkins_avail_cap = Messages.NO_PREV_CHECKINS_AVAIL_CAP;
  

  loadcomplete = {history: false};
  pagination: any  = {
    startpageval: 1,
    totalCnt : 0,
    perPage : projectConstants.PERPAGING_LIMIT
  };
  history: any = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  notedialogRef;
  billdialogRef;
  paydialogRef;
  ratedialogRef;

  constructor(public consumer_checkin_history_service: CheckInHistoryServices,
  public dialog: MatDialog,
  public shared_functions: SharedFunctions,
  private router: Router ) {}
  ngOnInit() {
    this.getHistoryCount(this.params);
  }

  ngOnChanges() {
   // console.log('reloadapi', this.reloadapi);
  }
  ngOnDestroy() {
    if (this.notedialogRef) {
      this.notedialogRef.close();
    }
    if (this.billdialogRef) {
      this.billdialogRef.close();
    }
    if (this.paydialogRef) {
      this.paydialogRef.close();
    }
    if (this.ratedialogRef) {
      this.ratedialogRef.close();
    }
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
    pass_ob['name'] = waitlist.provider.businessName;
    this.addNote(pass_ob);

  }

  addNote(pass_ob) {
    this.notedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: 'commonpopupmainclass',
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });

    this.notedialogRef.afterClosed().subscribe(result => {
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
        this.shared_functions.openSnackBar(error,  {'panelClass': 'snackbarerror'});
      }
    );
  }

  viewBill(checkin, bill_data) {
    // console.log('viewbill');
    bill_data['passedProvname'] = checkin['provider']['businessName'];
    this.billdialogRef = this.dialog.open(ViewConsumerWaitlistCheckInBillComponent, {
      width: '50%',
      // panelClass: ['commonpopupmainclass', 'billpopup'],
      panelClass:  ['commonpopupmainclass', 'consumerpopupmainclass', 'billpopup'],
      disableClose: true,
      autoFocus: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });

    this.billdialogRef.afterClosed().subscribe(result => {
      if ( result === 'makePayment') {
        this.makePayment(checkin, bill_data);
      }
    });
  }

  makePayment(checkin, bill_data) {
    alert('in history');
    this.paydialogRef = this.dialog.open(ConsumerWaitlistCheckInPaymentComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });

    this.paydialogRef.afterClosed().subscribe(result => {
      this.getHistoryCount(this.params);
    });
  }

  getStatusLabel(status) {
    let label_status = status;
    switch (status) {
      case 'cancelled' : label_status = 'Cancelled'; break;
      case 'arrived' : label_status = 'Arrived'; break;
      case 'done' : label_status = 'Done'; break;
      case 'checkedIn' : label_status = 'Checked In'; break;
      case 'started' : label_status = 'Started'; break;
    }
    return label_status;
  }

  rateService(waitlist) {
    this.ratedialogRef = this.dialog.open(ConsumerRateServicePopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: waitlist
    });

    this.ratedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getHistroy(this.params);
      }
    });
  }
  isRated(wait) {
    if (wait.hasOwnProperty('rating') ) {
      return true;
    } else {
      return false;
    }
  }
  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
  }

}
