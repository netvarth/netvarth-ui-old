import { Component, OnInit, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConsumerServices } from '../../../../../ynw_consumer/services/consumer-services.service';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../../app.component';
import { CheckInHistoryServices } from '../../../../../shared/modules/consumer-checkin-history-list/consumer-checkin-history-list.service';
import { EventEmitter } from '@angular/core';
// import { ViewConsumerWaitlistCheckInBillComponent } from '../../../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-view-bill/consumer-waitlist-view-bill.component';
import { ConsumerWaitlistCheckInPaymentComponent } from '../../../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-checkin-payment/consumer-waitlist-checkin-payment.component';
import { ConsumerRateServicePopupComponent } from '../../../../../shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { AddInboxMessagesComponent } from '../../../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { Messages } from '../../../../../shared/constants/project-messages';
// import * as moment from 'moment';



@Component({
  selector: 'app-consumer-checkin-history',
  templateUrl: './checkin-history.component.html'
})

export class ConsumerCheckinHistoryComponent implements OnInit {


  @Input() reloadapi;
  @Input() params;
  @Output() getWaitlistBillEvent = new EventEmitter<any>();
  loadcomplete = { history: false };
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: projectConstants.PERPAGING_LIMIT
  };
  history: any = [];
  notedialogRef;
  billdialogRef;
  paydialogRef;
  ratedialogRef;
  service_provider_cap = Messages.SERV_PROVIDER_CAP;
  service_cap = Messages.PRO_SERVICE_CAP;
  location_cap = Messages.LOCATION_CAP;
  date_cap = Messages.DATE_COL_CAP;
  status_cap = Messages.PRO_STATUS_CAP;
  send_message_cap = Messages.SEND_MSG_CAP;
  bill_cap = Messages.BILL_CAPTION;
  rate_your_visit = Messages.RATE_YOU_VISIT;
  no_prev_checkins_avail_cap = Messages.NO_PREV_CHECKINS_AVAIL_CAP;
  breadcrumbs = [
    {
      title: 'My Jaldee',
      url: '/consumer'
    },
    //  {
    //   title: 'Checkins'
    // },
    {
      title: 'Checkins History'
    }
  ];
  breadcrumb_moreoptions: any = [];

  constructor(public consumer_checkin_history_service: CheckInHistoryServices,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private consumer_services: ConsumerServices,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.getHistoryCount();
  }

  getHistroy() {
    this.loadcomplete.history = false;
    const params = this.setPaginationFilter();
    this.consumer_services.getWaitlistHistory(params)
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
    this.consumer_services.getHistoryWaitlistCount()
      .subscribe(
        data => {
          this.pagination.totalCnt = data;
          this.getHistroy();
        });
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.getHistroy();
  }

  setPaginationFilter(params = {}) {
    const api_filter = {};
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.pagination.perPage : 0;
    api_filter['count'] = this.pagination.perPage;
    return api_filter;
  }

  addWaitlistMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.ynwUuid;
    pass_ob['user_id'] = waitlist.providerAccount.id;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    this.addNote(pass_ob);

  }

  addNote(pass_ob) {
    this.notedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
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
    const params = {
      account: waitlist.providerAccount.id
    };
    this.consumer_checkin_history_service.getWaitlistBill(params, waitlist.ynwUuid)
      .subscribe(
        data => {
          const bill_data = data;
          this.viewBill(waitlist, bill_data);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  viewBill(checkin, bill_data) {
    // if (!this.billdialogRef) {
    //   bill_data['passedProvname'] = checkin['providerAccount']['businessName'];
    //   this.billdialogRef = this.dialog.open(ViewConsumerWaitlistCheckInBillComponent, {
    //     width: '50%',
    //     // panelClass: ['commonpopupmainclass', 'billpopup'],
    //     panelClass: ['commonpopupmainclass', 'popup-class', 'billpopup'],
    //     disableClose: true,
    //     autoFocus: true,
    //     data: {
    //       checkin: checkin,
    //       bill_data: bill_data,
    //       isFrom: 'checkin'
    //     }
    //   });

    //   this.billdialogRef.afterClosed().subscribe(result => {
    //     if (result === 'makePayment') {
    //       this.makePayment(checkin, bill_data);
    //     }
    //     if (this.billdialogRef) {
    //       this.billdialogRef = null;
    //     }
    //   });
    // }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: checkin.ynwUuid,
        accountId: checkin.providerAccount.id,
        source: 'history'
      }
    };
    this.router.navigate(['consumer', 'checkin', 'bill'], navigationExtras);
  }
  makePayment(checkin, bill_data) {
    this.paydialogRef = this.dialog.open(ConsumerWaitlistCheckInPaymentComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });

    this.paydialogRef.afterClosed().subscribe(() => {
      this.getHistoryCount();
    });
  }

  getStatusLabel(status) {
    let label_status = status;
    switch (status) {
      case 'cancelled': label_status = 'Cancelled'; break;
      case 'arrived': label_status = 'Arrived'; break;
      case 'done': label_status = 'Done'; break;
      case 'checkedIn': label_status = 'checked in'; break;
      case 'started': label_status = 'Started'; break;
    }
    return label_status;
  }


  rateService(waitlist) {
    this.ratedialogRef = this.dialog.open(ConsumerRateServicePopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: {
        'detail': waitlist,
        'isFrom': 'checkin'
      }
    });

    this.ratedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getHistroy();
      }
    });
  }
  isRated(wait) {
    if (wait.hasOwnProperty('rating')) {
      return true;
    } else {
      return false;
    }
  }
}
