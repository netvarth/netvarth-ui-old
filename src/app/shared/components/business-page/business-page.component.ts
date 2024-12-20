import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';
import { CheckInComponent } from '../../modules/check-in/check-in.component';
import { CouponsComponent } from '../coupons/coupons.component';
import { ProviderDetailService } from '../provider-detail/provider-detail.service';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from 'angular-modal-gallery';
import { ExistingCheckinComponent } from '../existing-checkin/existing-checkin.component';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { LoginComponent } from '../login/login.component';
import { SignUpComponent } from '../signup/signup.component';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.css'],
  animations: [
    trigger('search_data', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('10ms', [
          animate('.4s ease-out', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ])

  ]
})
export class BusinessPageComponent implements OnInit, OnDestroy {
  go_back_cap = Messages.GO_BACK_CAP;
  more_cap = Messages.MORE_CAP;
  less_cap = Messages.LESS_CAP;
  contact_details_cap = Messages.CONTACT_DETAILS_CAP;
  add_to_fav_cap = Messages.ADD_TO_FAV;
  rem_from_fav_cap = Messages.REM_FROM_FAV_CAP;
  send_msg_cap = Messages.SEND_MSG_CAP;
  you_have_cap = Messages.YOU_HAVE_CAP;
  at_this_loc_cap = Messages.AT_THIS_LOC_CAP;
  get_directions_cap = Messages.GET_DIRECTIONS_CAP;
  workig_hrs_cap = Messages.WORKING_HRS_CAP;
  services_offered = Messages.SERV_OFFERED_CAP;
  coupons_offered = Messages.COUPONS_OFFERED_CAP;
  open_now_cap = Messages.OPEN_NOW_CAP;
  do_you_want_to_cap = Messages.DO_YOU_WANT_TO_CAP;
  for_cap = Messages.FOR_CAP;
  different_date_cap = Messages.DIFFERENT_DATE_CAP;
  sorry_cap = Messages.SORRY_CAP;
  not_allowed_cap = Messages.NOT_ALLOWED_CAP;
  get_token_btn = Messages.GET_TOKEN;
  people_ahead = Messages.PEOPLE_AHEAD_CAP;
  no_people_ahead = Messages.NO_PEOPLE_AHEAD;
  one_person_ahead = Messages.ONE_PERSON_AHEAD;
  get_token_cap = Messages.GET_FIRST_TOKEN;
  claim_my_business_cap = Messages.CLAIM_BUSINESS_CAP;
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
  showDepartments = false;
  gender = '';
  bLogo = '';
  orgsocial_list;
  emaillist: any = [];
  phonelist: any = [];
  showEmailPhonediv = false;
  coupondialogRef;
  departmentlist: any = [];
  testuserQry;
  latitude;
  longitude;
  loctype;
  search_data;
  searchCount;
  search_return;
  q_str;
  loc_details;
  account_Type;
  newarr: any = [];
  groubedByTeam: any = [];
  branch_id;
  femaleTooltip = projectConstants.TOOLTIP_FEMALE;
  maleTooltip = projectConstants.TOOLTIP_MALE;
  virtualsectionHeader = 'Click here to View More Details';
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
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
  waitlistestimatetimetooltip = Messages.SEARCH_ESTIMATE_TOOPTIP;

  // Edited//
  public domain;
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  // Edited//
  commdialogRef;
  remdialogRef;
  checkindialogRef;
  extChecindialogRef;
  servicedialogRef;
  s3CouponList: any = [];
  isfirstCheckinOffer;
  server_date;
  isLoggedIn = false;
  showToken = false;
  services: any = [];
  deptlist: any = [];
  selectedDepartment;
  showServices = false;
  constructor(
    private activaterouterobj: ActivatedRoute,
    private providerdetailserviceobj: ProviderDetailService,
    public sharedFunctionobj: SharedFunctions,
    private shared_services: SharedServices,
    private routerobj: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.sharedFunctionobj.setitemonLocalStorage('sysdate', res);
          const activeUser = this.sharedFunctionobj.getitemfromLocalStorage('ynw-user');
          if (activeUser) {
            this.isLoggedIn = true;
            this.isfirstCheckinOffer = activeUser.firstCheckIn;
          }
          this.orgsocial_list = projectConstants.SOCIAL_MEDIA;
          this.activaterouterobj.paramMap
            .subscribe(params => {
              this.provider_id = params.get('id');
              this.shared_services.getBusinessUniqueId(params.get('id')).subscribe(
                id => {
                  this.provider_id = id;
                  this.gets3curl();
                },
                error => {
                  this.routerobj.navigate(['/not-found']);
                }
              );
            });
        });
  }
  ngOnDestroy() {
    if (this.commdialogRef) {
      this.commdialogRef.close();
    }
    if (this.remdialogRef) {
      this.remdialogRef.close();
    }
    if (this.servicedialogRef) {
      this.servicedialogRef.close();
    }
    if (this.checkindialogRef) {
      this.checkindialogRef.close();
    }
    if (this.extChecindialogRef) {
      this.extChecindialogRef.close();
    }
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
          this.getbusinessprofiledetails_json('businessProfile', true);
          this.getbusinessprofiledetails_json('settings', true);
          this.getbusinessprofiledetails_json('terminologies', true);
          this.getbusinessprofiledetails_json('virtualFields', true);
          this.getbusinessprofiledetails_json('coupon', true);
          this.getbusinessprofiledetails_json('services', true);
        },
        error => {
          this.sharedFunctionobj.apiErrorAutoHide(this, error);
        }
      );
  }
  // gets the various json files based on the value of "section" parameter
  // Some of functions copied to Consumer Home also.
  getbusinessprofiledetails_json(section, modDateReq: boolean) {
    let UTCstring = null;
    if (modDateReq) {
      UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
      .subscribe(res => {
        switch (section) {
          case 'businessProfile': {
            this.businessjson = res;
            this.business_exists = true;
            this.provider_bussiness_id = this.businessjson.id;
            if (this.businessjson.logo !== null && this.businessjson.logo !== undefined) {
              if (this.businessjson.logo.url !== undefined && this.businessjson.logo.url !== '') {
                this.bLogo = this.businessjson.logo.url + '?' + new Date();
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
            const holdbName = this.businessjson.businessDesc || '';
            const maxCnt = 120;
            if (holdbName.length > maxCnt) {
              this.bNameStart = holdbName.substr(0, maxCnt);
              this.bNameEnd = holdbName.substr(maxCnt, holdbName.length);
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
            for (let i = 0; i < this.servicesjson.length; i++) {
              if (this.servicesjson[i].hasOwnProperty('departmentName')) {
                this.showDepartments = true;
              }
            }
            break;
          }
          case 'gallery': {
            this.tempgalleryjson = res;
            let indx = 0;
            if (this.bLogo !== '') {
              this.galleryjson[0] = { keyName: 'logo', caption: '', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
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
                    img: this.galleryjson[i].url,
                    description: this.galleryjson[i].caption || ''
                  });
                this.image_list_popup.push(imgobj);
              }
            }
            break;
          }
          case 'settings': {
            this.settingsjson = res;
            this.showToken = this.settingsjson.showTokenId;
            this.settings_exists = true;
            this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
            this.maxsize = this.settingsjson.maxPartySize;
            if (this.maxsize === undefined) {
              this.maxsize = 1;
            }
            break;
          }
          case 'location': {
            this.locationjson = res;
            this.location_exists = true;
            let schedule_arr: any = [];
            const locarr = [];
            for (let i = 0; i < this.locationjson.length; i++) {
              schedule_arr = [];
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
              display_schedule = this.sharedFunctionobj.arrageScheduleforDisplay(schedule_arr);
              this.locationjson[i]['display_schedule'] = display_schedule;
              this.locationjson[i]['services'] = [];
              this.getServiceByLocationid(this.locationjson[i].id, i);
              // this.getProviderDepart(this.provider_bussiness_id);
              this.locationjson[i]['checkins'] = [];
              if (localStorage.getItem('ynw-user')) {
                this.getExistingCheckinsByLocation(this.locationjson[i].id, i);
              }
              locarr.push({ 'locid': this.businessjson.id + '-' + this.locationjson[i].id, 'locindx': i });
            }
            this.getWaitingTime(locarr);
            break;
          }
          case 'terminologies': {
            this.terminologiesjson = res;
            break;
          }
          case 'coupon': {
            this.s3CouponList = res;
            break;
          }
          case 'virtualFields': {
            this.virtualfieldsjson = res;
            // this.virtualfieldsjson = []; // dummy
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
            if (this.virtualfieldsCombinedjson.length > 0) {
              this.showVirtualfieldsSection = true;
            }
            break;
          }
        }
      },
        () => {
          if (this.bLogo !== '') {
            this.galleryjson[0] = { keyName: 'logo', caption: '', prefix: '', url: this.bLogo, thumbUrl: this.bLogo, type: '' };
          }
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
      let str = '';
      dataF[i]['type'] = typeof dataF[i].value;
      switch (dataF[i].dataType) {
        case 'Gender':
          this.genderType = dataF[i].value;
          break;
        case 'Enum':
        case 'EnumList':
          str = '';
          temp3 = [];
          for (let jj = 0; jj < dataF[i].value.length; jj++) {
            if (str !== '') {
              str += ', ';
            }
            str += dataF[i].value[jj].displayName;
          }
          temp3.push(str);
          temp2.push(temp3);
          dataF[i].value = temp2;
          temp1.push(dataF[i]);
          break;
        case 'DataGrid':
          for (let ii = 0; ii < dataF[i].value.length; ii++) {
            temp3 = [];
            Object.keys(dataF[i].value[ii]).forEach(nkeys => {
              temp3.push(dataF[i].value[ii][nkeys]);
            });
            temp2.push(temp3);
          }
          dataF[i].value = temp2;
          temp1.push(dataF[i]);
          break;
        case 'Boolean':
          if (dataF[i].value === 'true') {
            dataF[i].value = 'Yes';
          } else {
            dataF[i].value = 'No';
          }
          temp1.push(dataF[i]);
          break;
        default:
          temp1.push(dataF[i]);
          break;
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
  ORGsortVfields(dataF) {
    let temp;
    const temp1 = new Array();
    let temp2 = new Array();
    let temp3 = new Array();
    for (let i = 0; i < dataF.length; i++) {
      temp2 = [];
      dataF[i]['type'] = typeof dataF[i].value;
      if (dataF[i].name !== 'gender') {
        if (dataF[i]['type'] === 'object') {
          let str = '';
          temp3 = [];
          if (typeof dataF[i].value[0] === 'string') {
            for (let jj = 0; jj < dataF[i].value.length; jj++) {
              str += ' ' + dataF[i].value[jj];
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
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }

  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }

  getServiceByLocationid(locid, passedIndx) {
    this.shared_services.getServicesByLocationId(locid)
      .subscribe(data => {
        this.locationjson[passedIndx]['services'] = data;
      },
        error => {
          this.sharedFunctionobj.apiErrorAutoHide(this, error);
        });
  }

  getExistingCheckinsByLocation(locid, passedIndx) {
    this.shared_services.getExistingCheckinsByLocation(locid)
      .subscribe(data => {
        this.locationjson[passedIndx]['checkins'] = data;
      },
        error => {
          this.sharedFunctionobj.apiErrorAutoHide(this, error);
        });
  }
  getWaitlistingFor(obj) {
    let str = '';
    if (obj.length > 0) {
      for (let i = 0; i < obj.length; i++) {
        if (str !== '') {
          str += ', ';
        }
        str += obj[i].firstName;
      }
    }
    return str;
  }
  getServicesByDepartment(location, dept) {
    const servicesByDept: any = [];
    for (let i = 0; i < location['services'].length; i++) {
      if (location['services'][i].department === dept.departmentId) {
        servicesByDept.push(location['services'][i]);
      }
    }
    this.services = servicesByDept;
    this.deptlist = this.groubedByTeam[dept.departmentName];
    this.selectedDepartment = dept;
    // if (this.deptlist) {
    this.showServices = true;
    // } else {
    //   this.showServices = false;
    // }
    // return this.groubedByTeam[dept.departmentName];
  }

  backtoDetails() {
    this.showServices = false;
  }

  getDateDisplay(dt) {
    let str = '';
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
      .subscribe(data => {
        this.inboxCntFetched = true;
        this.inboxUnreadCnt = data;
      },
        () => {
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
    this.commdialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: 'consumerpopupmainclass',
      disableClose: true,
      data: {
        user_id: provid,
        source: 'consumer-common',
        type: 'send',
        terminologies: this.terminologiesjson,
        name: this.businessjson.businessName
      }
    });
    this.commdialogRef.afterClosed().subscribe(() => {
    });
  }
  getFavProviders() {
    this.shared_services.getFavProvider()
      .subscribe(data => {
        this.favprovs = data;
        this.isInFav = false;
        if (this.favprovs.length > 0) {
          for (let i = 0; i < this.favprovs.length; i++) {
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
        .subscribe(() => {
          this.isInFav = true;
        },
          error => {
            this.sharedFunctionobj.apiErrorAutoHide(this, error);
          });
    } else if (mod === 'remove') {
      this.shared_services.removeProviderfromFavourite(accountid)
        .subscribe(() => {
          this.isInFav = false;
        },
          error => {
            this.sharedFunctionobj.apiErrorAutoHide(this, error);
          });
    }
  }
  doRemoveFav() {
    this.remdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['consumerpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to remove this provider from your favourite list?'
      }
    });
    this.remdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handle_Fav('remove');
      }
    });
  }
  checkinClicked(locid, locname, cdate, chdatereq) {
    this.changedate_req = chdatereq;
    const usertype = this.sharedFunctionobj.isBusinessOwner('returntyp');
    if (usertype === 'consumer' || usertype === 'provider') {
      this.showCheckin(locid, locname, cdate, 'consumer');
    } else if (usertype === '') {
      const passParam = { callback: '' };
      this.doLogin(locid, locname, cdate, 'consumer', passParam);
    }
  }
  doLogin(locid, locname, cdate, origin?, passParam?) {
    const is_test_account = true;
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '50%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: 'false',
        test_account: is_test_account,
        moreparams: { source: 'business_page', bypassDefaultredirection: 1 }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        this.isLoggedIn = true;
        this.showCheckin(locid, locname, cdate, 'consumer');
      } else if (result === 'showsignup') {
        this.doSignup(locid, locname, cdate, passParam);
      }
    });
  }
  doSignup(locid, locname, cdate, passParam?) {
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: 'false',
        moreParams: { source: 'business_page', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        this.isLoggedIn = true;
        this.showCheckin(locid, locname, cdate, 'consumer');
      }
    });
  }
  showCheckin(locid, locname, curdate, origin?) {
    this.checkindialogRef = this.dialog.open(CheckInComponent, {
      width: '50%',
      panelClass: ['consumerpopupmainclass', 'checkin-consumer'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        moreparams: {
          source: 'provdet_checkin',
          bypassDefaultredirection: 1,
          provider: {
            unique_id: this.provider_id,
            account_id: this.provider_bussiness_id,
            name: this.businessjson.businessName
          },
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
    this.checkindialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getbusinessprofiledetails_json('location', true);
      }
    });
  }
  showcheckInButton(servcount?) {
    if (this.settingsjson && this.settingsjson.onlineCheckIns && this.settings_exists && this.business_exists && this.location_exists && (servcount > 0)) {
      return true;
    }
  }

  // Some of functions copied to Consumer Home also.
  private getWaitingTime(provids_locid) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
        post_provids_locid.push(provids_locid[i].locid);
      }
      if (post_provids_locid.length === 0) {
        return;
      }
      this.providerdetailserviceobj.getEstimatedWaitingTime(post_provids_locid)
        .subscribe(data => {
          this.waitlisttime_arr = data;
          if (this.waitlisttime_arr === '"Account doesn\'t exist"') {
            this.waitlisttime_arr = [];
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
          let locindx;
          const check_dtoday = new Date(dtoday);
          let cdate;
          for (let i = 0; i < this.waitlisttime_arr.length; i++) {
            locindx = provids_locid[i].locindx;
            this.locationjson[locindx]['waitingtime_res'] = this.waitlisttime_arr[i];
            this.locationjson[locindx]['estimatedtime_det'] = [];
            if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              this.locationjson[locindx]['calculationMode'] = this.waitlisttime_arr[i]['nextAvailableQueue']['calculationMode'];
              this.locationjson[locindx]['onlineCheckIn'] = this.waitlisttime_arr[i]['nextAvailableQueue']['onlineCheckIn'];
              this.locationjson[locindx]['isAvailableToday'] = this.waitlisttime_arr[i]['nextAvailableQueue']['isAvailableToday'];
              this.locationjson[locindx]['personAhead'] = this.waitlisttime_arr[i]['nextAvailableQueue']['personAhead'];
              this.locationjson[locindx]['isCheckinAllowed'] = this.waitlisttime_arr[i]['isCheckinAllowed'];
              this.locationjson[locindx]['opennow'] = this.waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
              this.locationjson[locindx]['estimatedtime_det']['cdate'] = this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
              this.locationjson[locindx]['estimatedtime_det']['queue_available'] = 1;
              cdate = new Date(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
              if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                this.locationjson[locindx]['availableToday'] = true;
              } else {
                this.locationjson[locindx]['availableToday'] = false;
              }
              if (!this.locationjson[locindx]['opennow']) {
                this.locationjson[locindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.locationjson[locindx]['estimatedtime_det']['date'] = 'Today';
                  } else {
                    this.locationjson[locindx]['estimatedtime_det']['date'] = this.sharedFunctionobj.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' });
                  }
                  this.locationjson[locindx]['estimatedtime_det']['time'] = this.locationjson[locindx]['estimatedtime_det']['date']
                    + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                } else {
                  this.locationjson[locindx]['estimatedtime_det']['time'] = this.sharedFunctionobj.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.sharedFunctionobj.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
                this.locationjson[locindx]['estimatedtime_det']['nextAvailDate'] = this.locationjson[locindx]['estimatedtime_det']['date'] + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              } else {
                this.locationjson[locindx]['estimatedtime_det']['caption'] = this.estimateCaption; // 'Estimated Waiting Time';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  this.locationjson[locindx]['estimatedtime_det']['time'] = this.sharedFunctionobj.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
                
                else {
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.locationjson[locindx]['estimatedtime_det']['date'] = 'Today';
                  } else {
                    this.locationjson[locindx]['estimatedtime_det']['date'] = this.sharedFunctionobj.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' });
                  }
                  this.locationjson[locindx]['estimatedtime_det']['time'] = this.locationjson[locindx]['estimatedtime_det']['date']
                    + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                  this.locationjson[locindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' ';
                  // this.locationjson[locindx]['estimatedtime_det']['time'] = 'Today, ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                }
                // else {
                //   this.locationjson[locindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' ';
                //   this.locationjson[locindx]['estimatedtime_det']['time'] = 'Today, ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                // }
              }
            } else {
              this.locationjson[locindx]['estimatedtime_det']['queue_available'] = 0;
            }
            if (this.waitlisttime_arr[i]['message']) {
              this.locationjson[locindx]['estimatedtime_det']['message'] = this.waitlisttime_arr[i]['message'];
            }

          }
        });
    }
  }
  // Edited//
  handlesearchClick() {
  }

  onButtonBeforeHook() {
  }

  onButtonAfterHook() { }
  // Edited//

  showExistingCheckin(obj) {
    this.extChecindialogRef = this.dialog.open(ExistingCheckinComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      disableClose: true,
      data: {
        locdet: obj,
        terminologies: this.terminologiesjson,
        settings: this.settingsjson
      }
    });

    this.extChecindialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getbusinessprofiledetails_json('location', true);
      }
    });
  }

  showServiceDetail(serv, busname) {
    this.servicedialogRef = this.dialog.open(ServiceDetailComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'specialclass'],
      disableClose: true,
      data: {
        bname: busname,
        serdet: serv
      }
    });

    this.servicedialogRef.afterClosed().subscribe(() => {

    });
  }

  getTerminologyTerm(term) {
    if (this.terminologiesjson) {
      const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
      if (this.terminologiesjson) {
        return this.sharedFunctionobj.firstToUpper((this.terminologiesjson[term_only]) ? this.terminologiesjson[term_only] : ((term === term_only) ? term_only : term));
      } else {
        return this.sharedFunctionobj.firstToUpper((term === term_only) ? term_only : term);
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
    this.virtualsectionHeader = 'Click here to view more details';
  }
  handlepanelOpen() {
    this.virtualsectionHeader = 'Click here to hide details';
  }
  converNewlinetoBr(value: any): any {
    return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
  openCoupons(type) {
    this.coupondialogRef = this.dialog.open(CouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'specialclass'],
      disableClose: true,
      data: {
        couponsList: this.s3CouponList,
        type: type
      }
    });
    this.coupondialogRef.afterClosed().subscribe(() => {
    });
  }


  getProviderDepart(id) {
    this.shared_services.getProviderDept(id).
      subscribe(data => {
        this.departmentlist = data;
        this.showDepartments = this.departmentlist.filterByDept;
        // if (this.departmentlist.filterByDept === true) {
        //   this.showDepartments = true;
        // }
        if (this.branch_id && this.account_Type === 'BRANCH') {
          this.getDoctors();
        }
      });
  }

  getCount(e) {
    this.searchCount = e.leng;
    for (let i = 0; i < this.departmentlist.departments.length; i++) {
      if (e.depart === this.departmentlist.departments[i].departmentCode) {
        this.departmentlist.departments[i].count = e.leng;
      }
      if (this.departmentlist.departments[i].count === 1) {
        this.departmentlist.departments[i].name = 'Doctor';
      } else {
        this.departmentlist.departments[i].name = 'Doctors';
      }
    }
  }

  getDoctors() {
    const userobj = this.sharedFunctionobj.getitemfromLocalStorage('ynw-user');
    const loc_det = this.sharedFunctionobj.getitemfromLocalStorage('ynw-locdet');
    this.latitude = loc_det.lat;
    this.longitude = loc_det.lon;
    this.loctype = loc_det.typ;
    let q_str = '';
    let locstr = '';
    if (this.latitude) { // case of location is selected
      const retcoordinates = this.sharedFunctionobj.getNearByLocation(this.latitude, this.longitude, this.loctype);
      const coordinates = retcoordinates['locationRange'];
      projectConstants.searchpass_criteria.distance = 'haversin(' + this.latitude + ',' + this.longitude + ',location1.latitude,location1.longitude)';
      locstr = 'location1:' + coordinates;
      q_str = q_str + locstr;
    }
    let testUser = false;
    if (userobj !== null) {
      const phno = (userobj.primaryPhoneNumber.toString());
      if (phno.startsWith('55')) {
        testUser = true;
      }
    }
    if (!testUser) {
      this.testuserQry = ' (not test_account:1) ';
    } else {
      this.testuserQry = ' test_account:1 ';
    }
    this.q_str = '(and ' + 'account_type:' + 1 + ' branch_id:' + this.branch_id + ')';
    this.sharedFunctionobj.getCloudUrl()
      .then(url => {
        projectConstants.searchpass_criteria.fq = '(and ' + this.testuserQry + ')';
        projectConstants.searchpass_criteria.distance = 'haversin(' + this.loc_details.lat + ',' + this.loc_details.lon + ',location1.latitude,location1.longitude)';
        projectConstants.searchpass_criteria.q = this.q_str;
        this.search_return = this.shared_services.DocloudSearch(url, projectConstants.searchpass_criteria)
          .subscribe(res => {
            this.search_data = res;
            this.getDoctorListbyDept(this.search_data);
          }, error => {
            this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          });
      });
  }

  getDoctorListbyDept(data) {
    this.newarr = [];
    this.groubedByTeam = [];
    for (let i = 0; i < data.hits.hit.length; i++) {
      this.newarr.push(data.hits.hit[i].fields);
      this.newarr[i].id = data.hits.hit[i].id;
    }
    for (let i = 0; i < this.newarr.length; i++) {
      for (let j = 0; j < this.departmentlist.departments.length; j++) {
        if (this.departmentlist.departments[j].departmentCode === this.newarr[i].department_code) {
          this.newarr[i].department_code = this.newarr[i].department_code.replace(this.newarr[i].department_code, this.departmentlist.departments[j].departmentName); // Replacing the domain name to it's display name
        }
      }
    }
    var groupBy = function (xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    this.groubedByTeam = groupBy(this.newarr, 'department_code');
  }
}
