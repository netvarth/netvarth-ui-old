import { Component, OnInit, Inject, Input, Output, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
import { ViewRxComponent } from '../../../home/view-rx/view-rx.component';
import { Location } from '@angular/common';
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
  loading = true;
  apmt_history: any = [];
  entire_history: any = [];
  wtlist_count: any = [];
  appt_count: any = [];
  entire_count: any = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  small_device_display = false;
  screenWidth;
  viewrxdialogRef;
  accountId;
  constructor(public consumer_checkin_history_service: CheckInHistoryServices,
    public router: Router, public location: Location,
    public route: ActivatedRoute,
    public dialog: MatDialog, public activateroute: ActivatedRoute,
    private consumer_services: ConsumerServices,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.activateroute.queryParams.subscribe(params => {
      if (params.accountId) {
        this.accountId = params.accountId;
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  ngOnInit() {
    // this.getHistoryCount();
    this.getHistroy();
    // this.getAppointmentHistoryCount();
  }

  // Getting Checking History
  getHistroy() {
    this.loadcomplete.history = false;
    const api_filter = {};
    if (this.accountId) {
      api_filter['account-eq'] = this.accountId;
    }
    // const params = this.setPaginationFilter();
    this.consumer_services.getWaitlistHistory(api_filter)
      .subscribe(
        data => {
          this.history = data;
          this.loadcomplete.history = true;
          this.loading = false;
          this.getAppointmentHistory(api_filter);
        },
        error => {
          this.loading = false;
          this.loadcomplete.history = true;
        }
      );
  }

  // Getting Appointment History
  getAppointmentHistory(api_filter) {
    //  const params = this.setPaginationFilter();
    this.consumer_services.getAppointmentHistory(api_filter)
      .subscribe(
        data => {
          console.log(data);
          this.apmt_history = data;
          for (let i = 0; i < this.apmt_history.length; i++) {
            this.apmt_history[i].date = this.apmt_history[i]['appmtDate'];
            delete this.apmt_history[i].appmtDate;
          }
          this.entire_history = this.apmt_history.concat(this.history);
          this.sortCheckins(this.entire_history);
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }

  sortCheckins(checkins) {
    checkins.sort(function (message1, message2) {
      if (message1.date < message2.date) {
        return 11;
      } else if (message1.date > message2.date) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  // Get checkin history count
  getHistoryCount() {
    this.consumer_services.getHistoryWaitlistCount()
      .subscribe(
        data => {
          console.log(data);
          this.wtlist_count = data;
          // this.getHistroy();
          this.getAppointmentHistoryCount();
        });
  }
  // Get Appointment history count
  getAppointmentHistoryCount() {
    this.consumer_services.getAppointmentHistoryCount()
      .subscribe(
        data => {
          this.appt_count = data;
          this.entire_count = this.wtlist_count.concat(this.appt_count);
          console.log(this.entire_count);
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
          console.log(data);
          const bill_data = data;
          this.viewBill(waitlist, bill_data);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  viewBill(checkin, bill_data) {
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
      this.getHistroy();
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
  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
  }
  addApptMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.uid;
    pass_ob['user_id'] = waitlist.providerAccount.id;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    pass_ob['appt'] = 'appt';
    this.addNote(pass_ob);

  }
  getApptBill(waitlist) {
    const params = {
      account: waitlist.providerAccount.id
    };
    this.consumer_checkin_history_service.getWaitlistBill(params, waitlist.uid)
      .subscribe(
        data => {
          const bill_data = data;
          this.viewApptBill(waitlist, bill_data);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  rateApptService(waitlist) {
    this.ratedialogRef = this.dialog.open(ConsumerRateServicePopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: {
        'detail': waitlist,
        'isFrom': 'appointment'
      }
    });

    this.ratedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        // this.getHistroy();
      }
    });
  }
  viewApptBill(checkin, bill_data) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        uuid: checkin.uid,
        accountId: checkin.providerAccount.id,
        source: 'history'
      }
    };
    this.router.navigate(['consumer', 'appointment', 'bill'], navigationExtras);
  }
  viewprescription(checkin) {
    console.log(checkin);
    this.viewrxdialogRef = this.dialog.open(ViewRxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        accencUid: checkin.prescUrl
      }
    });
  }
  goback() {
    this.location.back();
  }
}
