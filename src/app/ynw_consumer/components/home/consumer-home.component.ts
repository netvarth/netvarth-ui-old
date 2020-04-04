import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ConsumerServices } from '../../services/consumer-services.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { NotificationListBoxComponent } from '../../shared/component/notification-list-box/notification-list-box.component';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { CheckInComponent } from '../../../shared/modules/check-in/check-in.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { ViewConsumerWaitlistCheckInBillComponent } from '../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-view-bill/consumer-waitlist-view-bill.component';
import { ConsumerRateServicePopupComponent } from '../../../shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { AddManagePrivacyComponent } from '../add-manage-privacy/add-manage-privacy.component';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { CouponsComponent } from '../../../shared/components/coupons/coupons.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgxCarousel } from 'ngx-carousel';
import { ConsumerPaymentmodeComponent } from '../../../shared/components/consumer-paymentmode/consumer-paymentmode.component';

@Component({
  selector: 'app-consumer-home',
  templateUrl: './consumer-home.component.html',
  animations: [
    trigger('hideShowAnimator', [
      state('true', style({ opacity: 1, height: '100%' })),
      state('false', style({ opacity: 0, height: 0 })),
      transition('0 <=> 1', animate('.5s ease-out'))
    ])
  ]
})
export class ConsumerHomeComponent implements OnInit, OnDestroy {
  active_cap = Messages.ACTIVE_CHECKINS_CAP;
  no_checkins_cap = Messages.NO_CHECKINS_CAP;
  send_msg_cap = Messages.SEND_MSG_CAP;
  make_pay_cap = Messages.MAKE_PAYMENT_CAP;
  status_cancelled_cap = Messages.STATUS_CANCELLED;
  status_started_cap = Messages.STATUS_STARTED;
  status_done_cap = Messages.STATUS_DONE;
  persons_ahead = Messages.PERSONS_AHEAD;
  token_no = Messages.TOKEN_NO;
  party_size = Messages.PARTY_SIZE;
  bill_cap = Messages.BILL_CAPTION;
  add_to_fav = Messages.ADD_TO_FAV;
  rate_visit = Messages.RATE_VISIT;
  cancel_checkin_cap = Messages.CANCEL_CHECKIN;
  my_fav_cap = Messages.MY_FAV_CAP;
  remove_fav_cap = Messages.REMOVE_FAV;
  view_cap = Messages.VIEW_CAP;
  manage_privacy_cap = Messages.MANAGE_PRIVACY;
  open_now_cap = Messages.OPEN_NOW_CAP;
  checkindisablemsg = Messages.DASHBOARD_PREPAY_MSG;
  checkindisablemsg1 = Messages.DASHBOARD_PREPAY_MSG1;
  do_you_want_to_cap = Messages.DO_YOU_WANT_TO_CAP;
  for_cap = Messages.FOR_CAP;
  different_date_cap = Messages.DIFFERENT_DATE_CAP;
  you_hav_added_caption = Messages.YOU_HAVENT_ADDED_CAP;
  history_cap = Messages.HISTORY_CAP;
  get_token_btn = Messages.GET_TOKEN;
  people_ahead = Messages.PEOPLE_AHEAD_CAP;
  no_people_ahead = Messages.NO_PEOPLE_AHEAD;
  one_person_ahead = Messages.ONE_PERSON_AHEAD;
  first_person = Messages.FIRST_PEOPLE_AHEAD;
  get_token_cap = Messages.GET_FIRST_TOKEN;
  sorry_cap = Messages.SORRY_CAP;
  not_allowed_cap = Messages.NOT_ALLOWED_CAP;
  server_date;
  trackMode: any = [];
  waitlists;
  fav_providers: any = [];
  history;
  fav_providers_id_list = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  timeFormat = projectConstants.PIPE_DISPLAY_TIME_FORMAT;
  loadcomplete = { waitlist: false, fav_provider: false, history: false };
  tooltipcls = projectConstants.TOOLTIP_CLS;
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: projectConstants.PERPAGING_LIMIT
  };

  s3url = null;
  settingsjson = null;
  settings_exists = false;
  futuredate_allowed = false;
  waitlistestimatetimetooltip = Messages.SEARCH_ESTIMATE_TOOPTIP;
  public searchfields: SearchFields = new SearchFields();
  reload_history_api = { status: true };
  subscription: Subscription;
  cronHandle: Subscription;
  countercronHandle: Subscription;
  tracksubscription: Subscription;
  cronHandleTrack: Subscription;
  cronStarted;
  refreshTime = projectConstants.CONSUMER_DASHBOARD_REFRESH_TIME;
  refreshTimeForTracking = 600000;
  counterrefreshTime = 60; // seconds, set to reduce the counter every minute, if required
  open_fav_div = null;
  hideShowAnimator = false;
  currentcheckinsTooltip = '';
  favTooltip = '';
  historyTooltip = '';
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  estimatesmallCaption = Messages.ESTIMATED_TIME_SMALL_CAPTION;
  checkinCaption = Messages.CHECKIN_TIME_CAPTION;
  notificationdialogRef;
  addnotedialogRef;
  checkindialogRef;
  billdialogRef;
  paydialogRef;
  ratedialogRef;
  privacydialogRef;
  canceldialogRef;
  remfavdialogRef;
  payment_popup = null;
  servicesjson: any = [];
  public time = 300;
  public mode = 'horizontal';
  public perspective = 2000;
  public init = 0;
  isCheckinEnabled = true;
  coupondialogRef: MatDialogRef<{}, any>;
  nextAvailDate;
  terminologiesJson: any = [];
  mins;
  trackData: any;
  distance: any;
  KmOrMe: any;
  travelTime: any;
  timeUnit: any;
  changemode: any = [];
  lat_lng = {
    latitude: 0,
    longitude: 0
  };
  driving: boolean;
  walking: boolean;
  statusOfTrack: any = [];
  status: Boolean;
  pollingSet: any = [];
  constructor(private consumer_services: ConsumerServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog, private router: Router,
    public sharedfunctionObj: SharedFunctions,
    @Inject(DOCUMENT) public document,
    public _sanitizer: DomSanitizer) {
  }
  public carouselOne: NgxCarousel;

  ngOnInit() {
    this.setSystemDate();
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    this.carouselOne = {
      grid: { xs: 1, sm: 1, md: 2, lg: 3, all: 0 },
      slide: 3,
      speed: 400,
      interval: 1000,
      point: {
        visible: false
      },
      load: 2,
      touch: true,
      loop: false,
      easing: 'ease'
    };
    this.currentcheckinsTooltip = this.shared_functions.getProjectMesssages('CURRENTCHECKINS_TOOLTIP');
    this.favTooltip = this.shared_functions.getProjectMesssages('FAVORITE_TOOLTIP');
    this.historyTooltip = this.shared_functions.getProjectMesssages('HISTORY_TOOLTIP');
    this.gets3curl();
    this.getWaitlist();
    this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(x => {
      this.reloadAPIs();
    });

    this.countercronHandle = Observable.interval(this.counterrefreshTime * 1000).subscribe(x => {
      this.recheckwaitlistCounters();
    });
    this.cronHandleTrack = Observable.interval(this.refreshTime * 2000).subscribe(x => {
      this.liveTrackPolling();
    });

    this.subscription = this.shared_functions.getSwitchMessage().subscribe(message => {
      switch (message.ttype) {
        case 'fromconsumer': {
          this.closeCounters();
        }
      }
    });
  }
  public myfunc(event: Event) {
    // carouselLoad will trigger this funnction when your load value reaches
    // it is helps to load the data by parts to increase the performance of the app
    // must use feature to all carousel
  }
  closeCounters() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.countercronHandle) {
      this.countercronHandle.unsubscribe();
    }

  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.countercronHandle) {
      this.countercronHandle.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.notificationdialogRef) {
      this.notificationdialogRef.close();
    }
    if (this.addnotedialogRef) {
      this.addnotedialogRef.close();
    }
    if (this.checkindialogRef) {
      this.checkindialogRef.close();
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
    if (this.privacydialogRef) {
      this.privacydialogRef.close();
    }
    if (this.canceldialogRef) {
      this.canceldialogRef.close();
    }
    if (this.remfavdialogRef) {
      this.remfavdialogRef.close();
    }
    if (this.cronHandleTrack) {
      this.cronHandleTrack.unsubscribe();
    }
  }
  setSystemDate() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getSystemDate()
        .subscribe(
          res => {
            _this.server_date = res;
            _this.shared_functions.setitemonLocalStorage('sysdate', res);
            resolve();
          },
          () => {
            reject();
          }
        );
    });
  }
  getWaitlist() {
    this.pollingSet = [];
    this.loadcomplete.waitlist = false;
    const params = {
    };
    this.consumer_services.getWaitlist(params)
      .subscribe(
        data => {
          this.waitlists = data;
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          let i = 0;
          let retval;
          for (const waitlist of this.waitlists) {
            this.trackMode[i] = false;
            this.changemode[i] = false;
            const waitlist_date = new Date(waitlist.date);
            today.setHours(0, 0, 0, 0);
            waitlist_date.setHours(0, 0, 0, 0);
            this.waitlists[i].future = false;
            retval = this.getAppxTime(waitlist);
            if (today.valueOf() < waitlist_date.valueOf()) {
              this.waitlists[i].future = true;
              this.waitlists[i].estimated_time = retval.time;
              this.waitlists[i].estimated_timenow = retval.timenow;
              this.waitlists[i].estimated_timeslot = retval.timeslot;
              this.waitlists[i].estimated_caption = retval.caption;
              this.waitlists[i].estimated_date = retval.date;
              this.waitlists[i].estimated_date_type = retval.date_type;
              this.waitlists[i].estimated_autocounter = retval.autoreq;
            } else {
              if (waitlist.jaldeeWaitlistDistanceTime && waitlist.waitlistStatus === 'checkedIn') {
                this.statusOfLiveTrack(waitlist, i);
                this.pollingSet.push(waitlist);
              }
              this.waitlists[i].estimated_time = retval.time;
              this.waitlists[i].estimated_timenow = retval.timenow;
              this.waitlists[i].estimated_timeslot = retval.timeslot;
              this.waitlists[i].estimated_caption = retval.caption;
              this.waitlists[i].estimated_date = retval.date;
              this.waitlists[i].estimated_date_type = retval.date_type;
              this.waitlists[i].estimated_autocounter = retval.autoreq;
              this.waitlists[i].estimated_timeinmins = retval.time_inmins;
            }
            this.waitlists[i].cancelled_caption = retval.cancelled_caption;
            this.waitlists[i].cancelled_date = retval.cancelled_date;
            this.waitlists[i].cancelled_time = retval.cancelled_time;
            if (waitlist.waitlistStatus === 'prepaymentPending') {
              this.waitlists[i].counter = this.prepaymentCounter(waitlist);
            }
            i++;
          }
          this.loadcomplete.waitlist = true;
        },
        error => {
          this.loadcomplete.waitlist = true;
        }
      );
  }

  getAppxTime(waitlist) {
    const appx_ret = { 'caption': '', 'date': '', 'date_type': 'string', 'time': '', 'timenow': '', 'timeslot': '', 'autoreq': false, 'time_inmins': waitlist.appxWaitingTime, 'cancelled_time': '', 'cancelled_date': '', 'cancelled_caption': '' };
    if (waitlist.waitlistStatus !== 'cancelled') {
      if (waitlist.hasOwnProperty('serviceTime') || waitlist.calculationMode === 'NoCalc') {
        appx_ret.caption = 'Checked in for'; // 'Check-In Time';
        if (waitlist.calculationMode === 'NoCalc') {
          appx_ret.time = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
        } else {
          appx_ret.time = waitlist.serviceTime;
        }
        const waitlist_date = new Date(waitlist.date);
        const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const today = new Date(todaydt);
        today.setHours(0, 0, 0, 0);
        waitlist_date.setHours(0, 0, 0, 0);
        if (today.valueOf() < waitlist_date.valueOf()) {
          appx_ret.date = waitlist.date;
          appx_ret.date_type = 'date';
          appx_ret.timeslot = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
        } else {
          appx_ret.date = 'Today';
          appx_ret.date_type = 'string';
          appx_ret.timeslot = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
        }
      } else {
        if (waitlist.appxWaitingTime === 0) {
          appx_ret.caption = this.estimatesmallCaption; // 'Estimated Time';
          appx_ret.time = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
          appx_ret.timenow = 'Now';
        } else if (waitlist.appxWaitingTime !== 0) {
          appx_ret.caption = this.estimatesmallCaption; // 'Estimated Time';
          appx_ret.date = '';
          appx_ret.time = this.shared_functions.convertMinutesToHourMinute(waitlist.appxWaitingTime);
          appx_ret.autoreq = true;
        }
      }
    } else {
      let time = [];
      let time1 = [];
      let t2;
      appx_ret.caption = 'Checked in for';
      appx_ret.date = waitlist.date;
      appx_ret.time = waitlist.queue.queueStartTime + ' - ' + waitlist.queue.queueEndTime;
      appx_ret.cancelled_date = moment(waitlist.statusUpdatedTime, 'YYYY-MM-DD').format();
      time = waitlist.statusUpdatedTime.split('-');
      time1 = time[2].trim();
      t2 = time1.slice(2);
      appx_ret.cancelled_time = t2;
      appx_ret.cancelled_caption = 'Cancelled on ';
    }
    return appx_ret;
  }

  formatTime(time) {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  AMHourto24(date, time12) {
    const time = time12;
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === 'PM' && hours < 12) { hours = hours + 12; }
    if (AMPM === 'AM' && hours === 12) { hours = hours - 12; }
    const sHours = hours;
    const sMinutes = minutes;
    const mom_date = moment(date);
    mom_date.set('hour', sHours);
    mom_date.set('minute', sMinutes);
    return mom_date;
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
    const date = moment().format(projectConstants.POST_DATE_FORMAT);
    this.consumer_services.getHistoryWaitlistCount()
      .subscribe(
        data => {
          const counts: any = data;
          this.pagination.totalCnt = data;
          if (counts > 0) {
            this.getHistroy();
          } else {
            this.loadcomplete.waitlist = true;
          }
        },
        error => {
          this.loadcomplete.waitlist = true;
        }
      );
  }

  getFavouriteProvider() {
    this.loadcomplete.fav_provider = false;
    let k = 0;
    this.shared_services.getFavProvider()
      .subscribe(
        data => {
          this.loadcomplete.fav_provider = true;
          this.fav_providers = data;
          this.fav_providers_id_list = [];
          // this.setWaitlistTimeDetails();
          for (const x of this.fav_providers) {
            this.fav_providers_id_list.push(x.id);
            this.setWaitlistTimeDetailsProvider(x, k);
            k++;
          }
        },
        error => {
          this.loadcomplete.fav_provider = true;
        }
      );
  }

  setWaitlistTimeDetails() {
    let k = 0;
    for (const x of this.fav_providers) {
      this.fav_providers_id_list.push(x.id);
      this.toogleDetail(x, k);
      k++;
    }
  }

  setWaitlistTimeDetailsProvider(provider, k) {
    if (this.s3url) {
      this.getbusinessprofiledetails_json(provider.uniqueId, 'settings', true, k);
      this.getbusinessprofiledetails_json(provider.uniqueId, 'terminologies', true, k);
    }
    const locarr = [];
    let i = 0;
    for (const loc of provider.locations) {
      locarr.push({ 'locid': provider.id + '-' + loc.id, 'locindx': i });
      i++;
    }
    this.getWaitingTime(locarr, k);
  }

  getWaitingTime(provids_locid, index) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
        post_provids_locid.push(provids_locid[i].locid);
      }
      if (post_provids_locid.length === 0) {
        return;
      }
      this.consumer_services.getEstimatedWaitingTime(post_provids_locid)
        .subscribe(data => {
          let waitlisttime_arr: any = data;
          const locationjson: any = [];
          if (waitlisttime_arr === '"Account doesn\'t exist"') {
            waitlisttime_arr = [];
          }
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          const dd = today.getDate();
          const mm = today.getMonth() + 1; // January is 0!
          const yyyy = today.getFullYear();
          let cday = '';
          if (dd < 10) {
            cday = '0' + dd;
          } else {
            cday = '' + dd;
          }
          let cmon;
          if (mm < 10) {
            cmon = '0' + mm;
          } else {
            cmon = '' + mm;
          }
          const dtoday = yyyy + '-' + cmon + '-' + cday;
          const ctoday = cday + '/' + cmon + '/' + yyyy;
          let locindx;
          const check_dtoday = new Date(dtoday);
          let cdate;
          for (let i = 0; i < waitlisttime_arr.length; i++) {
            locindx = provids_locid[i].locindx;
            this.fav_providers[index]['locations'][locindx]['waitingtime_res'] = waitlisttime_arr[i];
            this.fav_providers[index]['locations'][locindx]['estimatedtime_det'] = [];
            if (waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              this.fav_providers[index]['locations'][locindx]['isCheckinAllowed'] = waitlisttime_arr[i]['isCheckinAllowed'];
              this.fav_providers[index]['locations'][locindx]['personAhead'] = waitlisttime_arr[i]['nextAvailableQueue']['personAhead'];
              this.fav_providers[index]['locations'][locindx]['calculationMode'] = waitlisttime_arr[i]['nextAvailableQueue']['calculationMode'];
              this.fav_providers[index]['locations'][locindx]['showToken'] = waitlisttime_arr[i]['nextAvailableQueue']['showToken'];
              this.fav_providers[index]['locations'][locindx]['onlineCheckIn'] = waitlisttime_arr[i]['nextAvailableQueue']['onlineCheckIn'];
              this.fav_providers[index]['locations'][locindx]['isAvailableToday'] = waitlisttime_arr[i]['nextAvailableQueue']['isAvailableToday'];
              this.fav_providers[index]['locations'][locindx]['opennow'] = waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['cdate'] = waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['queue_available'] = 1;
              cdate = new Date(waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
              if (dtoday === waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                this.fav_providers[index]['locations'][locindx]['availableToday'] = true;
              } else {
                this.fav_providers[index]['locations'][locindx]['availableToday'] = false;
              }
              if (!this.fav_providers[index]['locations'][locindx]['opennow']) {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] = 'Today';
                  } else {
                    this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' });
                  }
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date']
                    + ', ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                } else {
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.shared_functions.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['nextAvailDate'] = this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] + ',' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              } else {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = this.estimateCaption; // 'Estimated Waiting Time';
                if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] = 'Today';
                  } else {
                    this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' });
                  }
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['date']
                    + ', ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                  // this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = 'Today, ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                } else {
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
              }
            } else {
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['queue_available'] = 0;
            }
            if (waitlisttime_arr[i]['message']) {
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['message'] = waitlisttime_arr[i]['message'];
            }
          }
        });
    }
  }

  doCancelWaitlist(waitlist) {
    if (!waitlist.ynwUuid || !waitlist.provider.id) {
      return false;
    }
    this.shared_functions.doCancelWaitlist(waitlist, this)
      .then(
        data => {
          if (data === 'reloadlist') {
            this.getWaitlist();
          }
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  doDeleteFavProvider(fav) {
    if (!fav.id) {
      return false;
    }
    this.shared_functions.doDeleteFavProvider(fav, this)
      .then(
        data => {
          if (data === 'reloadlist') {
            this.getFavouriteProvider();
          }
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  addFavProvider(id) {
    if (!id) {
      return false;
    }
    this.shared_services.addProvidertoFavourite(id)
      .subscribe(
        data => {
          this.getFavouriteProvider();
        },
        error => {
        }
      );
  }

  goWaitlistDetail(waitlist) {
    this.router.navigate(['consumer/waitlist', waitlist.provider.id, waitlist.ynwUuid]);
  }

  openNotification(data) {
    if (!data) {
      return false;
    }
    this.notificationdialogRef = this.dialog.open(NotificationListBoxComponent, {
      width: '50%',
      disableClose: true,
      data: {
        'messages': data
      }
    });
    this.notificationdialogRef.afterClosed().subscribe(result => {
    });
  }

  checkIfFav(id) {
    let fav = false;
    this.fav_providers_id_list.map((e) => {
      if (e === id) {
        fav = true;
      }
    });
    return fav;
  }

  addWaitlistMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.ynwUuid;
    pass_ob['user_id'] = waitlist.provider.id;
    pass_ob['name'] = waitlist.provider.businessName;
    this.addNote(pass_ob);
  }

  addCommonMessage(provider) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-common';
    pass_ob['user_id'] = provider.id;
    pass_ob['name'] = provider.businessName;
    this.addNote(pass_ob);
  }

  addNote(pass_ob) {
    this.addnotedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
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

  showCheckin(data, origin = 'consumer') {
    const provider_data = data.provider_data;
    const location_data = data.location_data;
    this.checkindialogRef = this.dialog.open(CheckInComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'checkin-consumer'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        moreparams: {
          source: 'provdet_checkin',
          bypassDefaultredirection: 1,
          provider: provider_data,
          location: location_data,
          sel_date: data.sel_date
        },
        datechangereq: data.chdatereq
      }
    });
    this.checkindialogRef.afterClosed().subscribe(result => {
      // if (result === 'reloadlist') {
      this.getWaitlist();
      // }
    });
  }

  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
  }

  goCheckin(data, location, currdata, chdatereq, type) {
    let provider_data = null;
    if (type === 'fav_provider') {
      provider_data = data;
    } else {
      provider_data = data.provider || null;
    }
    this.setCheckinData(provider_data, location, currdata, chdatereq);
  }

  setCheckinData(provider, location, currdate, chdatereq = false) {
    const post_data = {
      'provider_data': null,
      'location_data': null,
      'sel_date': currdate,
      'chdatereq': chdatereq
    };
    post_data.provider_data = {
      'unique_id': provider.uniqueId,
      'account_id': provider.id,
      'name': provider.businessName
    };
    post_data.location_data = {
      'id': location.id,
      'name': location.place
    };
    this.showCheckin(post_data);
  }
  gets3curl() {
    this.shared_functions.getS3Url('provider')
      .then(
        res => {
          this.s3url = res;
          this.getFavouriteProvider();
        },
        error => {
          this.shared_functions.apiErrorAutoHide(this, error);
        }
      );
  }
  // gets the various json files based on the value of "section" parameter
  getbusinessprofiledetails_json(provider_id, section, modDateReq: boolean, index) {
    let UTCstring = null;
    if (section === 'settings' && this.fav_providers[index] && this.fav_providers[index]['settings']) {
      return false;
    }
    if (modDateReq) {
      UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(provider_id, this.s3url, section, UTCstring)
      .subscribe(res => {
        switch (section) {
          case 'settings': {
            this.fav_providers[index]['settings'] = res;
            break;
          }
          case 'terminologies': {
            this.terminologiesJson = res;
            break;
          }
        }
      },
        error => {
        }
      );
  }

  showcheckInButton(provider) {
    if (provider.settings && provider.settings.onlineCheckIns) {
      return true;
    }
  }
  reloadAPIs() {
    this.getWaitlist();
    this.reload_history_api = { status: true };
  }

  prepaymentCounter(list) {
    // this.setSystemDate();
    let server_time;
    let checkinTime;
    let currentTime;
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          server_time = res;
          this.shared_functions.setitemonLocalStorage('sysdate', res);
        });
    checkinTime = moment(list.checkInTime, ['h:mm A']).format('HH:mm:ss');
    currentTime = moment(server_time).format('HH:mm:ss');
    this.mins = moment.utc(moment(currentTime, 'HH:mm').diff(moment(checkinTime, 'HH:mm'))).format('mm');
    this.mins = 15 - this.mins;
    return this.mins;
  }

  recheckwaitlistCounters() {
    for (let i = 0; i < this.waitlists.length; i++) {
      if (this.waitlists[i].estimated_autocounter) {
        if (this.waitlists[i].estimated_timeinmins > 0) {
          this.waitlists[i].estimated_timeinmins = (this.waitlists[i].estimated_timeinmins - 1);
          if (this.waitlists[i].estimated_timeinmins === 0) {
            this.waitlists[i].estimated_time = 'Now';
          } else {
            this.waitlists[i].estimated_time = this.shared_functions.convertMinutesToHourMinute(this.waitlists[i].estimated_timeinmins);
          }
        }
      }
    }
  }

  viewBill(checkin) {
    if (!this.billdialogRef) {
      this.billdialogRef = this.dialog.open(ViewConsumerWaitlistCheckInBillComponent, {
        width: '40%',
        panelClass: ['commonpopupmainclass', 'popup-class', 'billpopup'],
        disableClose: true,
        data: {
          checkin: checkin
        }
      });
      this.billdialogRef.afterClosed().subscribe(result => {
        if (this.billdialogRef) {
          this.billdialogRef = null;
        }
      });
    }
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
        this.getWaitlist();
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
  toogleDetail(provider, i) {
    let open_fav_div = null;
    if (this.open_fav_div === i) {
      this.hideShowAnimator = false;
      open_fav_div = null;
    } else {
      this.hideShowAnimator = true;
      open_fav_div = i;
      this.setWaitlistTimeDetailsProvider(provider, i);
    }
    setTimeout(() => {
      this.open_fav_div = open_fav_div;
    }, 500);
  }
  providerManagePrivacy(provider, i) {
    this.privacydialogRef = this.dialog.open(AddManagePrivacyComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: { 'provider': provider }
    });
    this.privacydialogRef.afterClosed().subscribe(result => {
      if (result.message === 'reloadlist') {
        this.fav_providers[i]['revealPhoneNumber'] = result.data.revealPhoneNumber;
      }
    });
  }
  openCoupons() {
    this.coupondialogRef = this.dialog.open(CouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
      disableClose: true,
      data: {}
    });
    this.coupondialogRef.afterClosed().subscribe(result => {
    });
  }

  confirmSettleBill(waitlist) {
    const dialogrefd = this.dialog.open(ConsumerPaymentmodeComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'details': waitlist,
        'origin': 'consumer'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
    });
  }
  makeFailedPayment(waitlist) {
    let prepayamt = 0;
    this.shared_services.getServicesByLocationId(waitlist.queue.location.id)
      .subscribe(data => {
        this.servicesjson = data;
        for (let i = 0; i < this.servicesjson.length; i++) {
          if (this.servicesjson[i].id === waitlist.service.id) {
            prepayamt = waitlist.partySize * this.servicesjson[i].minPrePaymentAmount || 0;
            if (prepayamt > 0) {
              const payData = {
                'amount': prepayamt,
                // 'paymentMode': 'DC',
                'uuid': waitlist.ynwUuid,
                'accountId': waitlist.provider.id,
                'purpose': 'prePayment'
              };
              const dialogrefd = this.dialog.open(ConsumerPaymentmodeComponent, {
                width: '50%',
                panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
                disableClose: true,
                data: {
                  'details': payData,
                  'origin': 'consumer'
                }
              });
            } else {
              this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('PREPAYMENT_ERROR'), { 'panelClass': 'snackbarerror' });
            }
          }
        }
      },
        error => {
        });
  }
  getTerminologyTerm(term) {
    if (this.terminologiesJson) {
      const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
      if (this.terminologiesJson) {
        return this.shared_functions.firstToUpper((this.terminologiesJson[term_only]) ? this.terminologiesJson[term_only] : ((term === term_only) ? term_only : term));
      } else {
        return this.shared_functions.firstToUpper((term === term_only) ? term_only : term);
      }
    } else {
      return term;
    }
  }
  editmodeOn(i) {
    this.changemode[i] = true;
  }
  getTravelMod(uid, id, type, i) {
    const passdata = {
      'travelMode': type
    };
    this.shared_services.updateTravelMode(uid, id, passdata)
      .subscribe(data => {
        this.changemode[i] = false;
        this.getWaitlist();
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  getMintuesToHour(time) {
    return this.shared_functions.providerConvertMinutesToHourMinute(time);
  }
  statusOfLiveTrack(waitlist, i) {
    this.shared_services.statusOfLiveTrack(waitlist.ynwUuid, waitlist.provider.id)
      .subscribe(data => {
        this.statusOfTrack[i] = data;
        waitlist.trackStatus = data;
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  getCurrentLocation() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lat_lng.longitude = +pos.coords.longitude;
        this.lat_lng.latitude = +pos.coords.latitude;
      },
        error => {
        });
    }
  }
  updateLatLong(uid, id, passdata) {
    this.shared_services.updateLatLong(uid, id, passdata)
      .subscribe(data => {
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });

  }
  changeTrackstatus(uid, id, i, event) {
    if (event.checked === true) {
      this.startTracking(uid, id, i);
    } else {
      this.stopTracking(uid, id, i);
    }
  }
  startTracking(uid, id, i) {
    this.shared_services.startLiveTrack(uid, id)
      .subscribe(data => {
        this.getWaitlist();
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  stopTracking(uid, id, i) {
    this.shared_services.stopLiveTrack(uid, id)
      .subscribe(data => {
        this.getWaitlist();
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  getTrackMessage(waitlist) {
    let message = '';
    if (waitlist.jaldeeWaitlistDistanceTime.jaldeeDistanceTime.jaldeeDistance.distance === 0) {
      message += 'You are about to reach ' + waitlist.provider.businessName;
    } else {
      message += 'You are ' + waitlist.jaldeeWaitlistDistanceTime.jaldeeDistanceTime.jaldeeDistance.distance + ' ' + projectConstants.LIVETRACK_CONST[waitlist.jaldeeWaitlistDistanceTime.jaldeeDistanceTime.jaldeeDistance.unit] + ' away and will take around';
      message += ' ' + this.getMintuesToHour(waitlist.jaldeeWaitlistDistanceTime.jaldeeDistanceTime.jaldeelTravelTime.travelTime);
      message += ' to reach ' + waitlist.provider.businessName;
    }
    return message;
  }
  liveTrackPolling() {
    const _this = this;
    if (_this.pollingSet && _this.pollingSet.length > 0) {
      _this.setSystemDate().then(
        () => {
          for (const waitlist of _this.pollingSet) {
            if (waitlist.jaldeeWaitlistDistanceTime) {
              let pollingDtTim = '';
              let pollingDateTime = '';
              if (waitlist.jaldeeStartTimeType !== 'AFTERSTART') {
                pollingDtTim = waitlist.date + ' ' + waitlist.jaldeeWaitlistDistanceTime.pollingTime;
                pollingDateTime = moment(pollingDtTim).format('YYYY-MM-DD HH:mm');
                const serverDateTime = moment(_this.server_date).format('YYYY-MM-DD HH:mm');
                if (serverDateTime >= pollingDateTime) {
                  _this.getCurrentLocation();
                  _this.shared_services.updateLatLong(waitlist.ynwUuid, waitlist.provider.id, _this.lat_lng)
                    .subscribe(data => { },
                      error => {
                        _this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                      });
                }
              } else {
                if (waitlist.trackStatus) {
                  _this.shared_services.updateLatLong(waitlist.ynwUuid, waitlist.provider.id, _this.lat_lng)
                    .subscribe(data => { },
                      error => {
                        _this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                      });
                }
              }
            }
          }
        },
        () => {

        });
    }
  }
}
