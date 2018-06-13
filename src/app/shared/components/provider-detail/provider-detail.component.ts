import { Component, OnInit, Input } from '@angular/core';

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import { Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';

import { SearchFields } from '../../modules/search/searchfields';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ProviderDetailService } from '../provider-detail/provider-detail.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {
  AccessibilityConfig, Action, AdvancedLayout, ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType, Description, DescriptionStrategy,
  DotsConfig, GridLayout, Image, ImageModalEvent, LineLayout, PlainGalleryConfig, PlainGalleryStrategy, PreviewConfig
} from 'angular-modal-gallery';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';
import { CheckInComponent } from '../../modules/check-in/check-in.component';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.css']
})
export class ProviderDetailComponent implements OnInit {

  s3url;
  retval;
  kwdet: any = [];
  provider_id;
  provider_bussiness_id;
  settingsjson: any = [];
  businessjson: any = [];
  servicesjson: any = [];
  galleryjson: any = [];
  locationjson: any = [];
  waitlisttime_arr: any = [];
  favprovs: any = [];
  settings_exists = false;
  business_exists = false;
  service_exists = false;
  gallery_exists = false;
  location_exists = false;
  isInFav;
  terminologiesjson: any = [];
  futuredate_allowed = false;
  maxsize = 0;
  viewallServices = false;
  showmoreDesc = false;
  bNameStart = '';
  bNameEnd = '';
  image_list: any = [];
  image_list_popup: Image[];
  ratingenabledCnt = 0;
  ratingenabledHalf = false;
  ratingdisabledCnt = 0;
  ratingenabledArr;
  ratingdisabledArr;
  serMaxcnt = 3;
  inboxCntFetched = false;
  inboxUnreadCnt;
  changedate_req = false;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy:  ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };

// Edited//
  public domain;
// Edited//

  constructor(
    private activaterouterobj: ActivatedRoute,
    private providerdetailserviceobj: ProviderDetailService,
    public sharedFunctionobj: SharedFunctions,
    private locationobj: Location,
    private shared_services: SharedServices,
    private dialogobj: MatDialog,
    private routerobj: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getInboxUnreadCnt();
    this.activaterouterobj.paramMap
    .subscribe(params => {
      this.provider_id = params.get('id');
      this.gets3curl();
    });
  }
  backtoSearchResult() {
    this.locationobj.back();
  }
  gets3curl() {
    this.retval = this.sharedFunctionobj.getS3Url('provider')
                .then(
                  res => {
                    this.s3url = res;
                    // console.log('s3', this.s3url);
                    this.getbusinessprofiledetails_json('businessProfile', true);
                    this.getbusinessprofiledetails_json('services', true);
                    this.getbusinessprofiledetails_json('gallery', true);
                    this.getbusinessprofiledetails_json('settings', true);
                    // this.getbusinessprofiledetails_json('terminologies', true);
                  },
                  error => {
                    this.sharedFunctionobj.apiErrorAutoHide(this, error);
                  }
                );
  }
  // gets the various json files based on the value of "section" parameter
  getbusinessprofiledetails_json(section, modDateReq: boolean) {
    let  UTCstring = null ;
    if (modDateReq) {
      UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
    .subscribe (res => {
        switch (section) {
         case 'businessProfile': {
            this.businessjson = res;
            // console.log('bprofile', JSON.stringify(this.businessjson));
            this.business_exists = true;
            this.provider_bussiness_id = this.businessjson.id;
            this.getFavProviders();
            const holdbName = this.businessjson.businessDesc;
            const maxCnt = 20;
            if (holdbName.length > maxCnt ) {
              this.bNameStart = holdbName.substr(0, maxCnt);
              this.bNameEnd = holdbName.substr(maxCnt , holdbName.length);
            } else {
              this.bNameStart = holdbName;
            }
            this.ratingenabledCnt = this.businessjson.avgRating || 0;
            const ratingenabledInt = parseInt(this.ratingenabledCnt.toString(), 10);
            if (ratingenabledInt < this.ratingenabledCnt) {
              this.ratingenabledHalf = true;
              this.ratingenabledCnt = ratingenabledInt;
              this.ratingdisabledCnt = 5 - (ratingenabledInt + 1);
            } else {
              this.ratingdisabledCnt = 5 - ratingenabledInt;
            }
            this.ratingenabledArr = [];
            this.ratingdisabledArr = [];
            for (let i = 0; i < this.ratingenabledCnt; i++) {
              this.ratingenabledArr.push(i);
            }
            for (let i = 0; i < this.ratingdisabledCnt; i++) {
              this.ratingdisabledArr.push(i);
            }
            this.getbusinessprofiledetails_json('location', true);
          break;
          }
          case 'services': {
            this.servicesjson = res;
            this.service_exists = true;
          break;
          }
          case 'gallery': {
            this.galleryjson = res;
            this.gallery_exists = true;
            this.image_list_popup = [];
            if (this.galleryjson.length > 0) {
              for (let i = 0; i < this.galleryjson.length; i++) {
                  const imgobj = new Image(
                    i,
                    { // modal
                      img: this.galleryjson[i].url
                    });
                  this.image_list_popup.push(imgobj);
                }
            }
          break;
          }
          case 'settings': {
            this.settingsjson = res;
            this.settings_exists = true;
            this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
            this.maxsize = this.settingsjson.maxPartySize;
            if (this.maxsize === undefined) {
              this.maxsize = 1;
            }
            // this.getbusinessprofiledetails_json('services', true);
          break;
          }
          case 'location': {
            this.locationjson = res;
            this.location_exists = true;
            let schedule_arr: any = [];
            const locarr = [];
            for (let i = 0; i < this.locationjson.length; i++) {
                  if (this.locationjson[i].bSchedule) {
                    if (this.locationjson[i].bSchedule.timespec) {
                      if (this.locationjson[i].bSchedule.timespec.length > 0) {
                        schedule_arr = [];
                          // extracting the schedule intervals
                          for (let j = 0; j < this.locationjson[i].bSchedule.timespec.length; j++) {
                            for (let k = 0; k < this.locationjson[i].bSchedule.timespec[j].repeatIntervals.length; k++) {
                              // pushing the schedule details to the respective array to show it in the page
                              schedule_arr.push({
                                day: this.locationjson[i].bSchedule.timespec[j].repeatIntervals[k],
                                sTime: this.locationjson[i].bSchedule.timespec[j].timeSlots[0].sTime,
                                eTime: this.locationjson[i].bSchedule.timespec[j].timeSlots[0].eTime
                              });
                            }
                          }
                      }
                    }
                  }
                  let display_schedule = [];
                  display_schedule =  this.sharedFunctionobj.arrageScheduleforDisplay(schedule_arr);
                  this.locationjson[i]['display_schedule'] = display_schedule;
                  this.locationjson[i]['services'] = [];
                  this.getServiceByLocationid(this.locationjson[i].id, i);
                  this.locationjson[i]['checkins'] = [];
                  this.getExistingCheckinsByLocation(this.locationjson[i].id, i);
                  // this.locationjson[i].fields = [];
                  locarr.push({'locid': this.businessjson.id + '-' + this.locationjson[i].id, 'locindx': i});
            }
            console.log('locarr', locarr);
            this.getWaitingTime(locarr);
          break;
          }
          /* case 'menu': {
            this.menujson = res;
          break;
          }*/
          case 'terminologies': {
            this.terminologiesjson = res;
          break;
          }
        }
    },
    error => {

    }
  );
  }

  showallServices() {
    if (this.viewallServices) {
      this.viewallServices = false;
    } else {
      this.viewallServices = true;
    }
  }
  showDesc() {
    if (this.showmoreDesc) {
      this.showmoreDesc = false;
    } else {
      this.showmoreDesc = true;
    }
  }
  openImageModalRow(image: Image) {
    console.log('Opening modal gallery from custom plain gallery row, with image: ', image);
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }

  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }

  getServiceByLocationid(locid, passedIndx) {
    this.shared_services.getServicesByLocationId(locid)
      .subscribe (data => {
        this.locationjson[passedIndx]['services'] = data;
        console.log('locjson', this.locationjson);
      },
      error => {
        this.sharedFunctionobj.apiErrorAutoHide(this, error);
      });
  }

  getExistingCheckinsByLocation(locid, passedIndx) {
    this.shared_services.getExistingCheckinsByLocation(locid)
    .subscribe (data => {
      this.locationjson[passedIndx]['checkins'] = data;
      console.log('locjsoncheckin', this.locationjson[passedIndx]['checkins']);
    },
    error => {
      this.sharedFunctionobj.apiErrorAutoHide(this, error);
    });
  }
  getWaitlistingFor(obj) {
    let str = '';
    if (obj.length > 0) {
      for (let i = 0; i < obj.length ; i++) {
        if (str !== '') {
          str += ', ';
        }
        str += obj[i].firstName;
      }
    }
    return str;
  }
  getDateDisplay(dt) {
    let str = '';
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

    if (dtoday === dt) {
      str = 'Today';
    } else {
      const dtr = dt.split('-');
      str = dtr[2] + '-' + dtr[1] + '-' + dtr[0];
    }
    return str;
  }
  redirectMe(opt) {
    switch (opt) {
      case 'dashboard':
        this.routerobj.navigate(['consumer']);
      break;
      case 'inbox':
        this.routerobj.navigate(['consumer', 'inbox']);
      break;
      case 'history':
        this.routerobj.navigate(['searchdetail', this.provider_id, 'history']);
      break;
    }
  }
  getInboxUnreadCnt() {
    const usertype = 'consumer';
    this.shared_services.getInboxUnreadCount(usertype)
      .subscribe (data => {
        this.inboxCntFetched = true;
        // console.log('inboxcnt', data);
        this.inboxUnreadCnt = data;
      },
    error => {
    });
  }

  communicateHandler() {
      const providforCommunicate = this.provider_bussiness_id;
      // check whether logged in as consumer
      if (this.sharedFunctionobj.checkLogin()) {
          this.showCommunicate(providforCommunicate);
      } else { // show consumer login

      }
  }
  showCommunicate(provid) {
    const dialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: 'consumerpopupmainclass',
     data: {
       user_id : provid,
       source: 'consumer-common',
       type: 'send'
     }
   });

   dialogRef.afterClosed().subscribe(result => {

   });
  }
  getFavProviders() {
    this.shared_services.getFavProvider()
      .subscribe(data => {
        this.favprovs = data;
        this.isInFav = false;
        if (this.favprovs.length > 0) {
          for (let i = 0; i < this.favprovs.length; i++) {
            console.log('here', this.favprovs[i].id, this.provider_bussiness_id);
            if (this.favprovs[i].id === this.provider_bussiness_id) {
              this.isInFav = true;
            }
          }
        } else {
            this.isInFav = false;
        }
      }, error => {
        this.sharedFunctionobj.apiErrorAutoHide(this, error);
    });
  }
  handle_Fav(mod) {
    const accountid = this.provider_bussiness_id;
    if (mod === 'add') {
      this.shared_services.addProvidertoFavourite(accountid)
        .subscribe (data => {
            this.isInFav = true;
        },
      error => {
        this.sharedFunctionobj.apiErrorAutoHide(this, error);
      });
    } else if (mod === 'remove') {
        this.shared_services.removeProviderfromFavourite(accountid)
        .subscribe (data => {
          this.isInFav = false;
        },
        error => {
          this.sharedFunctionobj.apiErrorAutoHide(this, error);
        });
    }
  }
  checkinClicked(locid, locname, chdatereq) {
    this.changedate_req = chdatereq;
    this.showCheckin(locid, locname, 'consumer');
  }
  showCheckin(locid, locname, origin?) {
    const  cdate = new Date();
    const  mn = cdate.getMonth() + 1;
    const  dy = cdate.getDate();
    let mon = '';
    let day = '';
    if (mn < 10) {
      mon = '0' + mn;
    } else {
      mon = '' + mn;
    }
    if (dy < 10) {
      day = '0' + dy;
    } else {
      day = '' + dy;
    }
    const curdate = cdate.getFullYear() + '-' + mon + '-' + day;
    const dialogRef = this.dialog.open(CheckInComponent, {
       width: '50%',
       panelClass: 'consumerpopupmainclass',
      data: {
        type : origin,
        is_provider : false,
        moreparams: { source: 'provdet_checkin',
                      bypassDefaultredirection: 1,
                      provider: {
                                  unique_id: this.provider_id,
                                  account_id: this.provider_bussiness_id,
                                  name: this.businessjson.businessName},
                      location: {
                                  id: locid,
                                  name: locname
                                },
                      sel_date: curdate
                    },
        datechangereq: this.changedate_req
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  showcheckInButton(obj) {
    if (this.settingsjson && this.settingsjson.onlineCheckIns && this.settings_exists && this.business_exists && this.service_exists && this.gallery_exists && this.location_exists) {
      return true;
    }
  }

  private getWaitingTime(provids_locid) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
          // if (provids[i] !== undefined) {
            post_provids_locid.push(provids_locid[i].locid);
         // }
      }
    // console.log('wtime', post_provids_locid);
    this.providerdetailserviceobj.getEstimatedWaitingTime(post_provids_locid)
      .subscribe (data => {
        // console.log('waitingtime api', data);
        this.waitlisttime_arr = data;
        if (this.waitlisttime_arr === '"Account doesn\'t exist"') {
          this.waitlisttime_arr = [];
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
        for (let i = 0; i < this.waitlisttime_arr.length; i++) {
          locindx = provids_locid[i].locindx;
          // console.log('locindx', locindx);
          this.locationjson[locindx]['waitingtime_res'] = this.waitlisttime_arr[i];
          this.locationjson[locindx]['opennow'] = this.waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
          this.locationjson[locindx]['estimatedtime_det'] = [];

          if (this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'] !== dtoday) {
            this.locationjson[locindx]['estimatedtime_det']['caption'] = 'Next Available Time ';
            this.locationjson[locindx]['estimatedtime_det']['isFuture'] = 1;
            if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
              this.locationjson[locindx]['estimatedtime_det']['time'] = this.sharedFunctionobj.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                 + ', ' + this.sharedFunctionobj.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
            } else {
              this.locationjson[locindx]['estimatedtime_det']['time'] = this.sharedFunctionobj.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
              + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
            }
          } else {
            this.locationjson[locindx]['estimatedtime_det']['caption'] = 'Estimated Waiting Time';
            this.locationjson[locindx]['estimatedtime_det']['isFuture'] = 2;
            if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
              this.locationjson[locindx]['estimatedtime_det']['time'] = this.sharedFunctionobj.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
            } else {
              this.locationjson[locindx]['estimatedtime_det']['time'] = 'Today, ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
            }
          }
        }
        // console.log('loc final', this.locationjson);
      });
    }
  }
  // Edited//
  handlesearchClick(obj) {
  }

  onButtonBeforeHook(event: ButtonEvent) {
  }

  onButtonAfterHook(event: ButtonEvent) {}
 // Edited//
}

