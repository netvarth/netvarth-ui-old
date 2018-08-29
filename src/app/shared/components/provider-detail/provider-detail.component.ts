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
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderDetailService } from '../provider-detail/provider-detail.service';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {
  AccessibilityConfig, Action, AdvancedLayout, ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType, Description, DescriptionStrategy,
  DotsConfig, GridLayout, Image, ImageModalEvent, LineLayout, PlainGalleryConfig, PlainGalleryStrategy, PreviewConfig
} from 'angular-modal-gallery';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';
import { ExistingCheckinComponent } from '../existing-checkin/existing-checkin.component';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { CheckInComponent } from '../../modules/check-in/check-in.component';

import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.css'],
  animations: [
    trigger('locationjson', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])

  ]
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
  tempgalleryjson: any = [];
  locationjson: any = [];
  virtualfieldsjson = null;
  virtualfieldsDomainjson = null;
  virtualfieldsSubdomainjson = null;
  virtualfieldsCombinedjson = null;
  genderType = null;
  showVirtualfieldsSection = false;
  waitlisttime_arr: any = [];
  favprovs: any = [];
  specializationslist: any = [];
  socialMedialist: any = [];
  settings_exists = false;
  business_exists = false;
  service_exists = false;
  gallery_exists = false;
  location_exists = false;
  isInFav;
  terminologiesjson: any = null;
  futuredate_allowed = false;
  maxsize = 0;
  viewallServices = false;
  viewallSpec = false;
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
  specMaxcnt = 5;
  inboxCntFetched = false;
  inboxUnreadCnt;
  changedate_req = false;
  gender = '';
  bLogo = '';
  orgsocial_list;
  emaillist: any = [];
  phonelist: any = [];
  showEmailPhonediv = false;
  femaleTooltip = projectConstants.TOOLTIP_FEMALE;
  maleTooltip = projectConstants.TOOLTIP_MALE;
  virtualsectionHeader = 'Click here to View More Details';
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
  waitlistestimatetimetooltip  = Messages.SEARCH_ESTIMATE_TOOPTIP;

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
    this.orgsocial_list = projectConstants.SOCIAL_MEDIA;
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
  getSocialdet(key, field) {
    const retdet = this.orgsocial_list.filter(
      soc => soc.key === key);
    const returndet = retdet[0][field];
    return returndet;
  }
  gets3curl() {
    this.retval = this.sharedFunctionobj.getS3Url('provider')
                .then(
                  res => {
                    this.s3url = res;
                    // console.log('s3', this.s3url);
                    this.getbusinessprofiledetails_json('businessProfile', true);
                    // this.getbusinessprofiledetails_json('services', true);
                    // this.getbusinessprofiledetails_json('gallery', true);
                    this.getbusinessprofiledetails_json('settings', true);
                    this.getbusinessprofiledetails_json('terminologies', true);
                    this.getbusinessprofiledetails_json('virtualFields', true);
                  },
                  error => {
                    this.sharedFunctionobj.apiErrorAutoHide(this, error);
                  }
                );
  }
  // gets the various json files based on the value of "section" parameter
  // Some of functions copied to Consumer Home also.
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
            if (this.businessjson.logo !== null && this.businessjson.logo !== undefined) {
              if (this.businessjson.logo.url !== undefined && this.businessjson.logo.url !== '') {
                this.bLogo = this.businessjson.logo.url;
              }
            }
            if (this.businessjson.specialization) {
              this.specializationslist = this.businessjson.specialization;
            }
            if (this.businessjson.socialMedia) {
              this.socialMedialist = this.businessjson.socialMedia;
            }
            if (this.businessjson.emails) {
              this.emaillist = this.businessjson.emails;
            }
            if (this.businessjson.phoneNumbers) {
              this.phonelist = this.businessjson.phoneNumbers;
            }
            this.getbusinessprofiledetails_json('gallery', true);
            this.getFavProviders();
            const holdbName = this.businessjson.businessDesc || '';
            const maxCnt = 120;
            if (holdbName.length > maxCnt ) {
              this.bNameStart = holdbName.substr(0, maxCnt);
              this.bNameEnd = holdbName.substr(maxCnt , holdbName.length);
            } else {
              this.bNameStart = holdbName;
            }
            this.ratingenabledCnt = this.businessjson.avgRating || 0;
            if (this.ratingenabledCnt > 0) {
              this.ratingenabledCnt = this.sharedFunctionobj.ratingRounding(this.ratingenabledCnt);
            }
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
            this.tempgalleryjson = res;
            let indx = 0;
            if (this.bLogo !== '') {
              this.galleryjson[0] = { keyName: 'logo', caption: '', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: ''};
              indx = 1;
            }
            for (let i = 0; i < this.tempgalleryjson.length; i++) {
              this.galleryjson[(i + indx)] = this.tempgalleryjson[i];
            }
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
            // console.log('locarr', locarr);
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
          case 'virtualFields' : {
            this.virtualfieldsjson = res;
            this.virtualfieldsCombinedjson = [];
            this.virtualfieldsDomainjson = [];
            this.virtualfieldsSubdomainjson = [];
            if (this.virtualfieldsjson.domain) {
              this.virtualfieldsDomainjson = this.sortVfields(this.virtualfieldsjson.domain);
            }
            if (this.virtualfieldsjson.subdomain) {
              this.virtualfieldsSubdomainjson = this.sortVfields(this.virtualfieldsjson.subdomain);
            }

            if (this.virtualfieldsSubdomainjson.length && this.virtualfieldsDomainjson.length) {
              this.virtualfieldsCombinedjson = this.virtualfieldsSubdomainjson.concat(this.virtualfieldsDomainjson);
            } else if (this.virtualfieldsSubdomainjson.length && !this.virtualfieldsDomainjson.length) {
              this.virtualfieldsCombinedjson = this.virtualfieldsSubdomainjson;
            } else if (!this.virtualfieldsSubdomainjson.length && this.virtualfieldsDomainjson.length) {
              this.virtualfieldsCombinedjson = this.virtualfieldsDomainjson;
            }
            // console.log('domain', this.virtualfieldsDomainjson, 'subdomain', this.virtualfieldsSubdomainjson);
            // console.log('virtual', this.virtualfieldsjson);
           // console.log('combined', this.virtualfieldsCombinedjson);
            // console.log('dd', this.objectToVal(this.virtualfieldsCombinedjson));

            if (this.virtualfieldsCombinedjson.length > 0) {
              this.showVirtualfieldsSection = true;
            }
          break;
          }
        }
    },
    error => {

    }
  );
  }
  sortVfields(dataF) {
    let temp;
    const temp1 = new Array();
    let temp2 = new Array();
    let temp3 = new Array();
    for (let i = 0; i < dataF.length; i++) {
      temp2 = [];
      // console.log(dataF[i].name, typeof dataF[i].value);
      dataF[i]['type'] = typeof dataF[i].value;
      if (dataF[i].name !== 'gender') {
        if (dataF[i]['type'] === 'object') {
          const tempVals = new Array();
          // console.log('typ', dataF[i].value, typeof dataF[i].value[0]);
          let str = '';
          temp3 = [];
          if (typeof dataF[i].value[0] === 'string') {
            for ( let jj = 0; jj < dataF[i].value.length; jj++) {
                str +=  ' ' + dataF[i].value[jj];
            }
            temp3.push(str);
            temp2.push(temp3);
          } else {
            for (let ii = 0; ii < dataF[i].value.length; ii++) {
              temp3 = [];
              if (typeof dataF[i].value[ii] === 'string') {
                temp3.push(dataF[i].value[ii]);
              } else {
                Object.keys(dataF[i].value[ii]).forEach(nkeys => {
                  // console.log('keys', nkeys, dataF[i].value[ii]);
                  temp3.push(dataF[i].value[ii][nkeys]);
                });
              }
              temp2.push(temp3);
            }
          }
          dataF[i].value = temp2;
        }
        temp1.push(dataF[i]);
      } else {
          this.genderType = dataF[i].value;
      }
    }
    dataF = temp1;
    for (let i = 0; i < dataF.length; i++) {
      for (let j = i + 1; j < dataF.length; j++) {
        if (parseInt(dataF[i].order, 10) > parseInt(dataF[j].order, 10)) {
          temp = dataF[i];
          dataF[i] = dataF[j];
          dataF[j] = temp;
        }
      }
    }
    return dataF;
  }
  objectToVal(dataF) {
    const retval = new Array();
    for (let i = 0; i < dataF.length; i++) {
      if (dataF[i]['type'] === 'object') {
        Object.keys(dataF[i].value).forEach(key => {
          Object.keys(dataF[i].value[key]).forEach(keys => {
            retval.push(keys);
          });
        });
      }
    }
    return retval;
  }

  showallServices() {
    if (this.viewallServices) {
      this.viewallServices = false;
    } else {
      this.viewallServices = true;
    }
  }
  showallSpecial() {
    if (this.viewallSpec) {
      this.viewallSpec = false;
    } else {
      this.viewallSpec = true;
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
    // console.log('Opening modal gallery from custom plain gallery row, with image: ', image);
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
        // console.log('locjson', this.locationjson);
      },
      error => {
        this.sharedFunctionobj.apiErrorAutoHide(this, error);
      });
  }

  getExistingCheckinsByLocation(locid, passedIndx) {
    this.shared_services.getExistingCheckinsByLocation(locid)
    .subscribe (data => {
      this.locationjson[passedIndx]['checkins'] = data;
     // console.log('locjsoncheckin', this.locationjson[passedIndx]['checkins']);
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
        this.routerobj.navigate(['searchdetail', this.provider_bussiness_id, 'history']);
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
       type: 'send',
       terminologies: this.terminologiesjson,
       name: this.businessjson.businessName
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
            // console.log('here', this.favprovs[i].id, this.provider_bussiness_id);
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
  doRemoveFav() {

    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass : ['consumerpopupmainclass', 'confirmationmainclass'],
      data: {
        'message' : 'Do you want to remove this provider from your favourite list?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.handle_Fav('remove');
      }

    });

  }
  checkinClicked(locid, locname, cdate, chdatereq) {
    this.changedate_req = chdatereq;
    this.showCheckin(locid, locname, cdate, 'consumer');
  }
  showCheckin(locid, locname, curdate, origin?) {
    /*const  cdate = new Date();
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
    const curdate = cdate.getFullYear() + '-' + mon + '-' + day;*/
    const dialogRef = this.dialog.open(CheckInComponent, {
       width: '50%',
       panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
       disableClose: true,
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
                      sel_date: curdate,
                      terminologies: this.terminologiesjson
                    },
        datechangereq: this.changedate_req
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getbusinessprofiledetails_json('location', true);
      }
    });
  }
  showcheckInButton(servcount?) {
    // console.log('ddd', this.settingsjson, this.settingsjson.onlineCheckIns, this.settings_exists, this.business_exists, this.service_exists, this.location_exists);
    if (this.settingsjson && this.settingsjson.onlineCheckIns && this.settings_exists && this.business_exists && this.location_exists && (servcount > 0)) {
      return true;
    }
  }

  // Some of functions copied to Consumer Home also.
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
          this.locationjson[locindx]['estimatedtime_det'] = [];

          if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
            this.locationjson[locindx]['opennow'] = this.waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
            this.locationjson[locindx]['estimatedtime_det']['cdate'] = this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
            this.locationjson[locindx]['estimatedtime_det']['queue_available'] = 1;
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
          } else {
            this.locationjson[locindx]['estimatedtime_det']['queue_available'] = 0;
          }
          if (this.waitlisttime_arr[i]['message']) {
            this.locationjson[locindx]['estimatedtime_det']['message'] = this.waitlisttime_arr[i]['message'];
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

 showExistingCheckin(obj) {
    const dialogRef = this.dialog.open(ExistingCheckinComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
    data: {
      locdet: obj,
      terminologies: this.terminologiesjson,
      settings: this.settingsjson
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
        this.getbusinessprofiledetails_json('location', true);
    }
  });
 }

 showServiceDetail(serv, busname) {
  const dialogRef = this.dialog.open(ServiceDetailComponent, {
    width: '50%',
    panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
  data: {
    bname: busname,
    serdet: serv
  }
  });

  dialogRef.afterClosed().subscribe(result => {

  });
}

getTerminologyTerm(term) {
  // console.log('term', term, fields, 'terminologies', terminologies);
  if (this.terminologiesjson) {
    const term_only = term.replace(/[\[\]']/g, '' ); // term may me with or without '[' ']'
    // const terminologies = this.common_datastorage.get('terminologies');
    if (this.terminologiesjson) {
      return this.sharedFunctionobj.firstToUpper((this.terminologiesjson[term_only]) ? this.terminologiesjson[term_only] :  (( term === term_only) ? term_only : term  ));
    } else {
      return this.sharedFunctionobj.firstToUpper(( term === term_only) ? term_only : term);
    }
  } else {
      return term;
  }
}
handleEmailPhonediv() {
  if (this.showEmailPhonediv) {
    this.showEmailPhonediv = false;
  } else {
    this.showEmailPhonediv = true;
  }
}
handlepanelClose() {
  this.virtualsectionHeader = 'Click here to View More Details';
}
handlepanelOpen() {
  this.virtualsectionHeader = 'Click here to View Less Details';
}
converNewlinetoBr(value: any): any {
  return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

}
