import { Component, OnInit, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsumerServices } from '../../../../../ynw_consumer/services/consumer-services.service';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../../shared/constants/project-constants';
import { CheckInHistoryServices } from '../../../../../shared/modules/consumer-checkin-history-list/consumer-checkin-history-list.service';
import { EventEmitter } from '@angular/core';
import { ViewConsumerWaitlistCheckInBillComponent } from '../../../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-view-bill/consumer-waitlist-view-bill.component';
import { ConsumerWaitlistCheckInPaymentComponent } from '../../../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-checkin-payment/consumer-waitlist-checkin-payment.component';
import { ConsumerRateServicePopupComponent } from '../../../../../shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { AddInboxMessagesComponent } from '../../../../../shared/components/add-inbox-messages/add-inbox-messages.component';




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
        () => {
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
        () => {
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

    // if (params['account-eq']) {
    //   api_filter['account-eq'] = params['account-eq'];
    // }

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

    this.consumer_checkin_history_service.getWaitlistBill(waitlist.ynwUuid)
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
    if (!this.billdialogRef) {
      bill_data['passedProvname'] = checkin['provider']['businessName'];
      this.billdialogRef = this.dialog.open(ViewConsumerWaitlistCheckInBillComponent, {
        width: '50%',
        // panelClass: ['commonpopupmainclass', 'billpopup'],
        panelClass: ['commonpopupmainclass', 'popup-class', 'billpopup'],
        disableClose: true,
        autoFocus: true,
        data: {
          checkin: checkin,
          bill_data: bill_data
        }
      });

      this.billdialogRef.afterClosed().subscribe(result => {
        if (result === 'makePayment') {
          this.makePayment(checkin, bill_data);
        }
        if (this.billdialogRef) {
          this.billdialogRef = null;
        }
      });
    }
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
      this.getHistoryCount(this.params);
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
      data: waitlist
    });

    this.ratedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getHistroy(this.params);
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
