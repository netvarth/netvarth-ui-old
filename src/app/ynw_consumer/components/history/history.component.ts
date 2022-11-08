import { Component, OnInit, Inject, Input, Output, HostListener, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConsumerServices } from '../../services/consumer-services.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { EventEmitter } from '@angular/core';
import { Messages } from '../../../shared/constants/project-messages';
import { ViewRxComponent } from '../home/view-rx/view-rx.component';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { SubSink } from 'subsink';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { ConsumerWaitlistCheckInPaymentComponent } from '../../../shared/modules/consumer-checkin-history-list/components/checkin-payment/checkin-payment.component';
import { ConsumerRateServicePopupComponent } from '../../../shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { CheckInHistoryServices } from '../../../shared/modules/consumer-checkin-history-list/components/checkin-history-list/checkin-history-list.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../shared/services/auth-service';

@Component({
  selector: 'app-consumer-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class ConsumerHistoryComponent implements OnInit, OnDestroy {
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
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  small_device_display = false;
  screenWidth;
  viewrxdialogRef;
  accountId;
  showOrderHist = false;
  private subs = new SubSink();
  customId: any;
  theme: any;
  loggedIn = true;  // To check whether user logged in or not
  accountConfig: any;
  isOrder;
  constructor(public consumer_checkin_history_service: CheckInHistoryServices,
    public router: Router, public location: Location,
    public route: ActivatedRoute,
    public dialog: MatDialog, public activateroute: ActivatedRoute,
    private consumer_services: ConsumerServices,
    public shared_services: SharedServices, public translate: TranslateService,
    public shared_functions: SharedFunctions,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

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
    this.translate.use(JSON.parse(localStorage.getItem('translatevariable')))
    this.translate.stream('SERV_PROVIDER_CAP').subscribe(v => { this.service_provider_cap = v });
    this.translate.stream('PRO_SERVICE_CAP').subscribe(v => { this.service_cap = v });
    this.translate.stream('LOCATION_CAP').subscribe(v => this.location_cap = v);
    this.translate.stream('DATE_COL_CAP').subscribe(v => this.date_cap = v);
    this.translate.stream('PRO_STATUS_CAP').subscribe(v => this.status_cap = v);
    this.translate.stream('SEND_MSG_CAP').subscribe(v => this.send_message_cap = v);
    this.translate.stream('RATE_YOU_VISIT').subscribe(v => this.rate_your_visit = v);
    this.translate.stream('BILL_CAPTION').subscribe(v => this.bill_cap = v);

    this.subs.sink = this.activateroute.queryParams.subscribe(params => {
      if (params.accountId) {
        this.accountId = params.accountId;
      }
      if (params.customId) {
        this.customId = params.customId;
      }
      if (params.theme) {
        this.theme = params.theme;
      }
      if (params.is_orderShow === 'false') {
        this.isOrder = false;
      } else {
        this.isOrder = true;
        this.showOrderHist = true;
      }
      this.initHistory();
    });

  }
  initHistory() {
    this.authService.goThroughLogin().then((status) => {
      console.log("Status:", status);
      if (status) {
        this.loggedIn = true;
        if (this.isOrder) {
          this.getOrderHistory();
        } else {
          this.getHistroy();
        }
      } else {
        this.loggedIn = false;
      }
    });
  }

  actionPerformed(event) {
    this.shared_functions.sendMessage({ ttype: 'updateuserdetails' })
    this.initHistory();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  // Getting Checking History
  getHistroy() {
    this.loadcomplete.history = false;
    let api_filter = {};
    if (this.accountId) {
      api_filter['account-eq'] = this.accountId;
    }
    this.subs.sink = this.consumer_services.getWaitlistHistory(api_filter)
      .subscribe(
        data => {
          this.history = data;
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
    this.subs.sink = this.consumer_services.getAppointmentHistory(api_filter)
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
          this.loadcomplete.history = true;
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
    this.subs.sink = this.consumer_services.getHistoryWaitlistCount()
      .subscribe(
        data => {
          console.log(data);
          this.wtlist_count = data;
          this.getAppointmentHistoryCount();
        });
  }
  // Get Appointment history count
  getAppointmentHistoryCount() {
    this.subs.sink = this.consumer_services.getAppointmentHistoryCount()
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
    pass_ob['userId'] = waitlist.providerAccount.uniqueId;
    pass_ob['typeOfMsg'] = 'single';
    pass_ob['theme'] = this.theme;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    this.addNote(pass_ob);
  }
  addNote(pass_ob) {
    this.notedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'loginmainclass', 'smallform'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob,
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
    this.subs.sink = this.consumer_checkin_history_service.getWaitlistBill(params, waitlist.ynwUuid)
      .subscribe(
        data => {
          console.log(data);
          const bill_data = data;
          this.viewBill(waitlist, bill_data);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getOrderBill(orders) {
    console.log(orders);
    const params = {
      account: orders.providerAccount.id
    };
    this.subs.sink = this.consumer_checkin_history_service.getWaitlistBill(params, orders.uid)
      .subscribe(
        data => {
          console.log(data);
          const bill_data = data;
          this.viewOrderBill(orders, bill_data);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  viewOrderBill(order, type) {
    let queryParams = {
      uuid: order.uid,
      accountId: order.providerAccount.id,
      type: 'order',
      'paidStatus': false
    }
    if (this.customId) {
      // queryParams['accountId'] = this.accountId;
      queryParams['customId'] = this.customId;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    this.router.navigate(['consumer', 'order', 'order-bill'], navigationExtras);
  }
  viewBill(checkin, bill_data) {
    let queryParams = {
      uuid: checkin.ynwUuid,
      accountId: checkin.providerAccount.id,
      source: 'history'
    }
    if (this.customId) {
      // queryParams['accountId'] = this.accountId;
      queryParams['customId'] = this.customId;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParams
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
    pass_ob['userId'] = waitlist.providerAccount.uniqueId;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    pass_ob['theme'] = this.theme;
    pass_ob['typeOfMsg'] = 'single';
    pass_ob['appt'] = 'appt';
    this.addNote(pass_ob);
  }
  getApptBill(waitlist) {
    const params = {
      account: waitlist.providerAccount.id
    };
    this.subs.sink = this.consumer_checkin_history_service.getWaitlistBill(params, waitlist.uid)
      .subscribe(
        data => {
          const bill_data = data;
          this.viewApptBill(waitlist, bill_data);
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
      }
    });
  }
  rateOrderService(waitlist) {
    this.ratedialogRef = this.dialog.open(ConsumerRateServicePopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: {
        'detail': waitlist,
        'isFrom': 'order'
      }
    });
    this.ratedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  viewApptBill(checkin, bill_data) {
    let queryParams = {
      uuid: checkin.uid,
      accountId: checkin.providerAccount.id,
      source: 'history'
    }

    if (this.customId) {
      // queryParams['accountId'] = this.accountId;
      queryParams['customId'] = this.customId;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParams
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
  getOrderHistory() {
    this.loadcomplete.history = false;
    const api_filter = {};
    if (this.accountId) {
      api_filter['account-eq'] = this.accountId;
    }
    this.subs.sink = this.consumer_services.getOrderHistory(api_filter)
      .subscribe(
        data => {
          console.log(data);
          this.entire_history = data;
          this.loadcomplete.history = true;
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.loadcomplete.history = true;
        }
      );
  }
  showBookingDetails(booking, type?) {
    let queryParams = {};
    if (this.customId) {
      queryParams['accountId'] = this.accountId;
      queryParams['customId'] = this.customId;
      queryParams['theme'] = this.theme;
    }
    if (booking.apptStatus) {
      queryParams['uuid'] = booking.uid;
      queryParams['providerId'] = booking.providerAccount.id;
      queryParams['type'] = type;
      const navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      this.router.navigate(['consumer', 'apptdetails'], navigationExtras);
    } else if (booking.waitlistStatus) {
      queryParams['uuid'] = booking.ynwUuid;
      queryParams['providerId'] = booking.providerAccount.id;
      queryParams['type'] = type;
      const navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      this.router.navigate(['consumer', 'checkindetails'], navigationExtras);
    } else {
      console.log('this is order');
      console.log(booking);
      queryParams['uuid'] = booking.uid;
      queryParams['providerId'] = booking.providerAccount.id;
      const navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      this.router.navigate(['consumer', 'orderdetails'], navigationExtras);
    }
  }
  addordertMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.uid;
    pass_ob['user_id'] = waitlist.providerAccount.id;
    pass_ob['userId'] = waitlist.providerAccount.uniqueId;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    pass_ob['theme'] = this.theme;
    pass_ob['typeOfMsg'] = 'single';
    pass_ob['orders'] = 'orders';
    this.addNote(pass_ob);
  }
}