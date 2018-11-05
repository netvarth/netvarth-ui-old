
import { interval as observableInterval, Observable, Subscription, SubscriptionLike as ISubscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { NotificationListBoxComponent } from '../../shared/component/notification-list-box/notification-list-box.component';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { CheckInComponent } from '../../../shared/modules/check-in/check-in.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { ViewConsumerWaitlistCheckInBillComponent } from '../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-view-bill/consumer-waitlist-view-bill.component';
import { ConsumerWaitlistCheckInPaymentComponent } from '../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-checkin-payment/consumer-waitlist-checkin-payment.component';
import { ConsumerRateServicePopupComponent } from '../../../shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { AddManagePrivacyComponent } from '../add-manage-privacy/add-manage-privacy.component';

import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { startWith, map, count } from 'rxjs/operators';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { appendFile } from 'fs';
import { CouponsComponent } from '../../../shared/components/coupons/coupons.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-consumer-home',
  templateUrl: './consumer-home.component.html',
  styleUrls: ['./consumer-home.component.scss'],
  animations: [
    trigger('hideShowAnimator', [
      state('true', style({ opacity: 1, height: '100%' })),
      state('false', style({ opacity: 0, height: 0 })),
      transition('0 <=> 1', animate('.5s ease-out'))
    ])
  ]
})
export class ConsumerHomeComponent implements OnInit, OnDestroy {

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

  cronHandle: Subscription;
  countercronHandle: Subscription;
  cronStarted;
  refreshTime = projectConstants.CONSUMER_DASHBOARD_REFRESH_TIME;
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
  coupondialogRef: MatDialogRef<{}, any>;
  constructor(private consumer_services: ConsumerServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog, private router: Router,
    @Inject(DOCUMENT) public document,
    public _sanitizer: DomSanitizer,
    private consumer_datastorage: ConsumerDataStorageService) { }

  ngOnInit() {
    this.currentcheckinsTooltip = this.shared_functions.getProjectMesssages('CURRENTCHECKINS_TOOLTIP');
    this.favTooltip = this.shared_functions.getProjectMesssages('FAVORITE_TOOLTIP');
    this.historyTooltip = this.shared_functions.getProjectMesssages('HISTORY_TOOLTIP');
    this.gets3curl();
    this.getWaitlist();
    // this.getHistoryCount();
    // this.getFavouriteProvider();
    this.cronHandle = observableInterval(this.refreshTime * 1000).subscribe(x => {
      this.reloadAPIs();
    });

    this.countercronHandle = observableInterval(this.counterrefreshTime * 1000).subscribe(x => {
      this.recheckwaitlistCounters();
    });


  }

  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.countercronHandle) {
      this.countercronHandle.unsubscribe();
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
  }

  getWaitlist() {

    this.loadcomplete.waitlist = false;

    const params = {
      //  'sort_id': 'asc',
      // 'waitlistStatus-eq': 'checkedIn,arrived'
    };

    this.consumer_services.getWaitlist(params)
      .subscribe(
        data => {
          this.waitlists = data;
          // console.log('waitlist', this.waitlists);
          const today = new Date();
          let i = 0;
          let retval;
          for (const waitlist of this.waitlists) {

            const waitlist_date = new Date(waitlist.date);

            today.setHours(0, 0, 0, 0);
            waitlist_date.setHours(0, 0, 0, 0);

            this.waitlists[i].future = false;
            retval = this.getAppxTime(waitlist);
            // console.log('waitlist', waitlist, 'retval', retval);
            if (today.valueOf() < waitlist_date.valueOf()) {
              this.waitlists[i].future = true;
              this.waitlists[i].estimated_time = retval.time;
              this.waitlists[i].estimated_caption = retval.caption;
              this.waitlists[i].estimated_date = retval.date;
              this.waitlists[i].estimated_date_type = retval.date_type;
              this.waitlists[i].estimated_autocounter = retval.autoreq;
            } else {
              this.waitlists[i].estimated_time = retval.time;
              this.waitlists[i].estimated_caption = retval.caption;
              this.waitlists[i].estimated_date = retval.date;
              this.waitlists[i].estimated_date_type = retval.date_type;
              this.waitlists[i].estimated_autocounter = retval.autoreq;
              this.waitlists[i].estimated_timeinmins = retval.time_inmins;
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
    const appx_ret = { 'caption': '', 'date': '', 'date_type': 'string', 'time': '', 'autoreq': false, 'time_inmins': waitlist.appxWaitingTime };
    // console.log('wait', waitlist.date, waitlist.queue.queueStartTime);
    // console.log('inside', waitlist.hasOwnProperty('serviceTime'));
    if (waitlist.hasOwnProperty('serviceTime')) {
      appx_ret.caption = this.checkinCaption; // 'Check-In Time';
      // appx_ret.date = waitlist.date;
      appx_ret.time = waitlist.serviceTime;

      const waitlist_date = new Date(waitlist.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      waitlist_date.setHours(0, 0, 0, 0);
      if (today.valueOf() < waitlist_date.valueOf()) {
        appx_ret.date = waitlist.date;
        appx_ret.date_type = 'date';
      } else {
        appx_ret.date = 'Today';
        appx_ret.date_type = 'string';
      }

    } else {
      if (waitlist.appxWaitingTime === 0) {
        appx_ret.caption = this.estimatesmallCaption; // 'Estimated Time';
        appx_ret.time = 'Now';
      } else if (waitlist.appxWaitingTime !== 0) {
        appx_ret.caption = this.estimatesmallCaption; // 'Estimated Time';
        appx_ret.date = '';
        appx_ret.time = this.shared_functions.convertMinutesToHourMinute(waitlist.appxWaitingTime);
        appx_ret.autoreq = true;
      }
    }
    return appx_ret;
    /*if (!waitlist.future && waitlist.appxWaitingTime === 0) {
      return 'Now';
    } else if (!waitlist.future && waitlist.appxWaitingTime !== 0) {
      return this.shared_functions.convertMinutesToHourMinute(waitlist.appxWaitingTime);

    }  else {
      const moment_date =  this.AMHourto24(waitlist.date, waitlist.queue.queueStartTime);
      return moment_date.add(waitlist.appxWaitingTime, 'minutes') ;
    }*/
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
    // alert(sHours + ':' + sMinutes);
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

    this.shared_services.getFavProvider()
      .subscribe(
        data => {

          this.loadcomplete.fav_provider = true;

          this.fav_providers = data;
          this.fav_providers_id_list = [];
          this.setWaitlistTimeDetails();
          // console.log( this.fav_providers);
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
      /// setWaitlistTimeDetailsProvider
      k++;

    }
  }

  setWaitlistTimeDetailsProvider(provider, k) {
    if (this.s3url) {
      this.getbusinessprofiledetails_json(provider.uniqueId, 'settings', true, k);
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
        // if (provids[i] !== undefined) {
        post_provids_locid.push(provids_locid[i].locid);
        // }
      }

      this.consumer_services.getEstimatedWaitingTime(post_provids_locid)
        .subscribe(data => {
          // console.log('waitingtime api', data);
          let waitlisttime_arr: any = data;
          const locationjson: any = [];

          if (waitlisttime_arr === '"Account doesn\'t exist"') {
            waitlisttime_arr = [];
          }
          const today = new Date();
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
          let cdate = new Date();
          for (let i = 0; i < waitlisttime_arr.length; i++) {
            locindx = provids_locid[i].locindx;
            // console.log('locindx', locindx);
            this.fav_providers[index]['locations'][locindx]['waitingtime_res'] = waitlisttime_arr[i];
            this.fav_providers[index]['locations'][locindx]['estimatedtime_det'] = [];

            if (waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              this.fav_providers[index]['locations'][locindx]['opennow'] = waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['cdate'] = waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['queue_available'] = 1;
              cdate = new Date(waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
              // if (waitlisttime_arr[i]['nextAvailableQueue']['availableDate'] !== dtoday) {
              if (cdate.getTime() !== check_dtoday.getTime()) {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['isFuture'] = 1;
                // if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                //   this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                //     + ', ' + this.shared_functions.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                // } else {
                //   this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                //   + ', ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                // }
                if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                } else {
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.shared_functions.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
              } else {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = this.estimateCaption; // 'Estimated Waiting Time';
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['isFuture'] = 2;
                // if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                //   this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                // } else {
                //   this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = 'Next Available Time ';
                //   this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = 'Today, ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                // }
                if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                  this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = 'Today, ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
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
          // console.log('loc final', this.fav_providers[index]['locations']);
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

  addCommonMessage(provider) { // console.log(provider);
    const pass_ob = {};
    pass_ob['source'] = 'consumer-common';
    pass_ob['user_id'] = provider.id;
    pass_ob['name'] = provider.businessName;
    this.addNote(pass_ob);
  }

  addNote(pass_ob) {

    this.addnotedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
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

    // const  cdate = new Date();
    // const  mn = cdate.getMonth() + 1;
    // const  dy = cdate.getDate();
    // let mon = '';
    // let day = '';
    // if (mn < 10) {
    //   mon = '0' + mn;
    // } else {
    //   mon = '' + mn;
    // }
    // if (dy < 10) {
    //   day = '0' + dy;
    // } else {
    //   day = '' + dy;
    // }
    // const curdate = cdate.getFullYear() + '-' + mon + '-' + day;

    const provider_data = data.provider_data;
    const location_data = data.location_data;

    this.checkindialogRef = this.dialog.open(CheckInComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
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
      if (result === 'reloadlist') {
        this.getWaitlist();
      }

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
    // console.log('reload api' + this.getCurtime());
    this.getWaitlist();
    this.reload_history_api = { status: true };
  }
  recheckwaitlistCounters() {
    // console.log('reload counter' + this.getCurtime());
    for (let i = 0; i < this.waitlists.length; i++) {
      if (this.waitlists[i].estimated_autocounter) {
        // console.log('time', this.waitlists[i].estimated_time);
        if (this.waitlists[i].estimated_timeinmins > 0) {
          // console.log('iamhere');
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
  getWaitlistBill(waitlist) {
    // console.log('waitlist', waitlist);
    this.consumer_services.getWaitlistBill(waitlist.ynwUuid)
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
    bill_data['passedProvname'] = checkin['provider']['businessName'];
    this.billdialogRef = this.dialog.open(ViewConsumerWaitlistCheckInBillComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'billpopup'],
      disableClose: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });
    this.billdialogRef.afterClosed().subscribe(result => {
      if (result === 'makePayment') {
        this.makePayment(checkin, bill_data);
      }
    });
  }
  makePayment(checkin, bill_data) {
    this.paydialogRef = this.dialog.open(ConsumerWaitlistCheckInPaymentComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      disableClose: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });
    this.paydialogRef.afterClosed().subscribe(result => {
      this.reloadAPIs();
    });
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
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
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
    // alert('Clicked coupon');
    this.coupondialogRef = this.dialog.open(CouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'specialclass'],
      disableClose: true,
      data: {}
    });
    this.coupondialogRef.afterClosed().subscribe(result => {
    });
  }
  showPersonsAhead(waitlist) {
    let retstat = false;
    if (waitlist.hasOwnProperty('personsAhead')) {
      switch (waitlist.waitlistStatus) {
        case 'cancelled':
        case 'started':
        case 'done':
          retstat = false;
          break;
        default:
          retstat = true;
      }
    } else {
      retstat = false;
    }
    return retstat;
  }
  makeFailedPayment(waitlist) {
    // console.log('pay', waitlist.queue.location.id, waitlist.service.id, waitlist.ynwUuid);
    let prepayamt = 0;
    this.shared_services.getServicesByLocationId(waitlist.queue.location.id)
      .subscribe(data => {
        this.servicesjson = data;
        // console.log('service', this.servicesjson);
        for (let i = 0; i < this.servicesjson.length; i++) {
          if (this.servicesjson[i].id === waitlist.service.id) {
            prepayamt = this.servicesjson[i].minPrePaymentAmount || 0;
            if (prepayamt > 0) {
              const payData = {
                'amount': prepayamt,
                'paymentMode': 'DC',
                'uuid': waitlist.ynwUuid
              };
              this.shared_services.consumerPayment(payData)
                .subscribe(pData => {
                  if (pData['response']) {
                    this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
                    this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
                    setTimeout(() => {
                      this.document.getElementById('payuform').submit();
                    }, 2000);
                  } else {
                    this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
                  }
                },
                  error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
}
