import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { NotificationListBoxComponent } from '../../shared/component/notification-list-box/notification-list-box.component';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { CheckInComponent } from '../../../shared/modules/check-in/check-in.component';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { ViewConsumerWaitlistCheckInBillComponent} from '../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-view-bill/consumer-waitlist-view-bill.component';
import { ConsumerWaitlistCheckInPaymentComponent } from '../../../shared/modules/consumer-checkin-history-list/components/consumer-waitlist-checkin-payment/consumer-waitlist-checkin-payment.component';
import { ConsumerRateServicePopupComponent } from '../../../shared/components/consumer-rate-service-popup/consumer-rate-service-popup';
import { AddManagePrivacyComponent } from '../add-manage-privacy/add-manage-privacy.component';

import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';


import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';

@Component({
  selector: 'app-consumer-home',
  templateUrl: './consumer-home.component.html',
  styleUrls: ['./consumer-home.component.scss'],
  animations: [
    trigger('hideShowAnimator', [
        state('true' , style({ opacity: 1 , height: '100%' })),
        state('false', style({ opacity: 0 , height: 0 })),
        transition('0 <=> 1', animate('.5s ease-out'))
    ])
  ]
})
export class ConsumerHomeComponent implements OnInit, OnDestroy {

  waitlists;
  fav_providers: any = [];
  history ;
  fav_providers_id_list = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  timeFormat = projectConstants.PIPE_DISPLAY_TIME_FORMAT;
  loadcomplete = {waitlist: false , fav_provider: false, history: false};

  pagination: any  = {
    startpageval: 1,
    totalCnt : 0,
    perPage : projectConstants.PERPAGING_LIMIT
  };

  s3url = null;
  settingsjson = null;
  settings_exists = false;
  futuredate_allowed = false;

  waitlistestimatetimetooltip  = Messages.SEARCH_ESTIMATE_TOOPTIP;
  public searchfields: SearchFields = new SearchFields();

  reload_history_api =  {status : true};

  cronHandle: Subscription;
  cronStarted;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  open_fav_div = null;
  hideShowAnimator = false;
  currentcheckinsTooltip = '';
  favTooltip = '';
  historyTooltip = '';

  constructor(private consumer_services: ConsumerServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private dialog: MatDialog, private router: Router,
  private consumer_datastorage: ConsumerDataStorageService) {}

  ngOnInit() {
    this.currentcheckinsTooltip = this.shared_functions.getProjectMesssages('CURRENTCHECKINS_TOOLTIP');
    this.favTooltip = this.shared_functions.getProjectMesssages('FAVORITE_TOOLTIP');
    this.historyTooltip = this.shared_functions.getProjectMesssages('HISTORY_TOOLTIP');
    this.gets3curl();
    this.getWaitlist();
   // this.getHistoryCount();
   // this.getFavouriteProvider();
   this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(x => {
    this.reloadAPIs();
   });


  }

  ngOnDestroy() {
    if (this.cronHandle) {
     this.cronHandle.unsubscribe();
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
        const today = new Date();
        let i = 0;
        for (const waitlist of this.waitlists) {

            const waitlist_date = new Date(waitlist.date);

            today.setHours(0, 0, 0, 0);
            waitlist_date.setHours(0, 0, 0, 0);

            this.waitlists[i].future = false;

            if (today.valueOf() < waitlist_date.valueOf()) {
              this.waitlists[i].future = true;
              this.waitlists[i].estimated_time = (waitlist.appxWaitingTime || waitlist.appxWaitingTime === 0) ? this.getAppxTime(waitlist) : null;
            } else {
              this.waitlists[i].estimated_time = (waitlist.appxWaitingTime) ? this.getAppxTime(waitlist) : null;
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
      const count: any = data;
      this.pagination.totalCnt = data;
      if (count > 0) {
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
      locarr.push({'locid': provider.id + '-' + loc.id, 'locindx': i});
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
      .subscribe (data => {
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

        for (let i = 0; i < waitlisttime_arr.length; i++) {
          locindx = provids_locid[i].locindx;
          // console.log('locindx', locindx);
          this.fav_providers[index]['locations'][locindx]['waitingtime_res'] = waitlisttime_arr[i];
          this.fav_providers[index]['locations'][locindx]['estimatedtime_det'] = [];

          if (waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
            this.fav_providers[index]['locations'][locindx]['opennow'] = waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
            this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['cdate'] = waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
            this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['queue_available'] = 1;
            if (waitlisttime_arr[i]['nextAvailableQueue']['availableDate'] !== dtoday) {
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = 'Next Available Time ';
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['isFuture'] = 1;
              if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                  + ', ' + this.shared_functions.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
              } else {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                + ', ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              }
            } else {
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['caption'] = 'Estimated Waiting Time';
              this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['isFuture'] = 2;
              if (waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = this.shared_functions.convertMinutesToHourMinute(waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
              } else {
                this.fav_providers[index]['locations'][locindx]['estimatedtime_det']['time'] = 'Today, ' + waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
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

    this.shared_functions.doCancelWaitlist(waitlist)
    .then (
      data => {
        if (data === 'reloadlist') {
          this.getWaitlist();
        }
      },
      error => {
        this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }


  doDeleteFavProvider(fav) {

    if (!fav.id) {
      return false;
    }

    this.shared_functions.doDeleteFavProvider(fav)
    .then(
      data => {
        if (data === 'reloadlist') {
          this.getFavouriteProvider();
        }
      },
      error => {
        this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
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

  getAppxTime(waitlist) {
    // console.log('wait', waitlist.date, waitlist.queue.queueStartTime);
      if (!waitlist.future && waitlist.appxWaitingTime === 0) {
        return 'Now';
      } else if (!waitlist.future && waitlist.appxWaitingTime !== 0) {
        return this.shared_functions.convertMinutesToHourMinute(waitlist.appxWaitingTime);

      }  else {
        const moment_date =  this.AMHourto24(waitlist.date, waitlist.queue.queueStartTime);
        return moment_date.add(waitlist.appxWaitingTime, 'minutes') ;
      }
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

  goWaitlistDetail(waitlist) {
    this.router.navigate(['consumer/waitlist', waitlist.provider.id, waitlist.ynwUuid]);
  }

  openNotification(data) {
    if (!data) {
      return false;
    }

    const dialogRef = this.dialog.open(NotificationListBoxComponent, {
      width: '50%',
      data: {
        'messages' : data
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  checkIfFav(id) {
    let fav = false;

    this.fav_providers_id_list.map((e) => {
      if ( e === id) {
        fav =  true;
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

    const dialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      autoFocus: true,
      data: pass_ob
    });

    dialogRef.afterClosed().subscribe(result => {
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
    const location_data =  data.location_data;

    const dialogRef = this.dialog.open(CheckInComponent, {
       width: '50%',
       panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      data: {
        type : origin,
        is_provider : false,
        moreparams: { source: 'provdet_checkin',
                      bypassDefaultredirection: 1,
                      provider: provider_data,
                      location: location_data,
                      sel_date: data.sel_date
                    },
        datechangereq: data.chdatereq
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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
      'sel_date' : currdate,
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
    let  UTCstring = null ;

    if (section === 'settings' && this.fav_providers[index] && this.fav_providers[index]['settings']) {
      return false;
    }

    if (modDateReq) {
      UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(provider_id, this.s3url, section, UTCstring)
    .subscribe (res => {
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
    this.getWaitlist();
    this.reload_history_api = {status : true};
  }

  getWaitlistBill(waitlist) {

    this.consumer_services.getWaitlistBill(waitlist.ynwUuid)
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
    const dialogRef = this.dialog.open(ViewConsumerWaitlistCheckInBillComponent, {
      width: '50%',
      panelClass:  ['commonpopupmainclass', 'consumerpopupmainclass', 'width-100'],
      disableClose: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( result === 'makePayment') {
        this.makePayment(checkin, bill_data);
      }
    });
  }

  makePayment(checkin, bill_data) {
    const dialogRef = this.dialog.open(ConsumerWaitlistCheckInPaymentComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      disableClose: true,
      data: {
        checkin: checkin,
        bill_data: bill_data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadAPIs();
    });
  }

  rateService(waitlist) {
    const dialogRef = this.dialog.open(ConsumerRateServicePopupComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      autoFocus: true,
      data: waitlist
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
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
      setTimeout( () => {
        this.open_fav_div = open_fav_div;
      }, 500);
  }

  providerManagePrivacy(provider, i) {

    const dialogRef = this.dialog.open(AddManagePrivacyComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      data: {'provider': provider}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.message === 'reloadlist') {
        this.fav_providers[i]['revealPhoneNumber'] = result.data.revealPhoneNumber;
      }
    });

  }

}

