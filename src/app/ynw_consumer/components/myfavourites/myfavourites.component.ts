import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConsumerServices } from '../../services/consumer-services.service';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { AddManagePrivacyComponent } from '../add-manage-privacy/add-manage-privacy.component';

@Component({
  selector: 'app-myfavourites',
  templateUrl: './myfavourites.component.html',
  styleUrls: ['./myfavourites.component.css']
})
export class MyfavouritesComponent implements OnInit {
  loadcomplete = { waitlist: false, fav_provider: false, history: false, donations: false, appointment: false };
  fav_providers;
  fav_providers_id_list: any[];
  open_fav_div: any;
  hideShowAnimator = false;
  s3url = null;
  terminologiesJson: any = [];
  server_date: any;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  appttime_arr: any = [];
  send_msg_cap = Messages.SEND_MSG_CAP;
  remove_fav_cap = Messages.REMOVE_FAV;
  view_cap = Messages.VIEW_CAP;
  manage_privacy_cap = Messages.MANAGE_PRIVACY;
  open_now_cap = Messages.OPEN_NOW_CAP;
  checkindisablemsg = Messages.DASHBOARD_PREPAY_MSG;
  checkindisablemsg1 = Messages.DASHBOARD_PREPAY_MSG1;
  appointmentdisablemsg = Messages.DASHBOARD_PREPAY_MSG2;
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
  addnotedialogRef: any;
  privacydialogRef: MatDialogRef<unknown, any>;

  constructor(
    public shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    private consumer_services: ConsumerServices,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getFavouriteProvider();
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    this.setSystemDate();
  }

  // Get system date
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

  // Get Fav Providers
  getFavouriteProvider() {
    this.loadcomplete.fav_provider = false;
    this.shared_services.getFavProvider()
      .subscribe(
        data => {
          this.loadcomplete.fav_provider = true;
          this.fav_providers = data;
          this.fav_providers_id_list = [];
          this.setWaitlistTimeDetails();
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
    this.getApptTime(locarr, k);
  }

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
          // const locationjson: any = [];
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
          // const ctoday = cday + '/' + cmon + '/' + yyyy;
          let locindx;
          // const check_dtoday = new Date(dtoday);
          // let cdate;
          for (let i = 0; i < waitlisttime_arr.length; i++) {
            locindx = provids_locid[i].locindx;
            this.fav_providers[index]['locations'][locindx]['waitingtime_res'] = waitlisttime_arr[i];
            this.fav_providers[index]['locations'][locindx]['estimatedtime_det'] = [];
            this.fav_providers[index]['locations'][locindx]['waitlist'] = waitlisttime_arr[i]['waitlistEnabled'];
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

  getApptTime(provids_locid, index) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
        post_provids_locid.push(provids_locid[i].locid);
      }
      if (post_provids_locid.length === 0) {
        return;
      }
      this.consumer_services.getApptTime(post_provids_locid)
        .subscribe(data => {
          this.appttime_arr = data;
          let locindx;
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
          for (let i = 0; i < this.appttime_arr.length; i++) {
            if (provids_locid[i]) {
              locindx = provids_locid[i].locindx;
              this.fav_providers[index]['locations'][locindx]['apptAllowed'] = this.appttime_arr[i]['apptEnabled'];
              if (this.appttime_arr[i]['availableSchedule']) {
                this.fav_providers[index]['locations'][locindx]['futureAppt'] = this.appttime_arr[i]['availableSchedule']['futureAppt'];
                this.fav_providers[index]['locations'][locindx]['todayAppt'] = this.appttime_arr[i]['availableSchedule']['todayAppt'];
                this.fav_providers[index]['locations'][locindx]['apptopennow'] = this.appttime_arr[i]['availableSchedule']['openNow'];
                if (dtoday === this.appttime_arr[i]['availableSchedule']['availableDate']) {
                  this.fav_providers[index]['locations'][locindx]['apptAvailableToday'] = true;
                } else {
                  this.fav_providers[index]['locations'][locindx]['apptAvailableToday'] = false;
                }
              }
            }
          }
        });
    }
  }

  providerDetail(provider) {
    this.router.navigate(['searchdetail', provider.uniqueId]);
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
}
