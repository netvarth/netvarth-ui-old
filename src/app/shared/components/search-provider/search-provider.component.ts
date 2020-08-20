import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { SharedServices } from '../../services/shared-services';
import { SearchDetailServices } from '../search-detail/search-detail-services.service';
import { Messages } from '../../constants/project-messages';
import { MatDialog } from '@angular/material';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';
import { CouponsComponent } from '../coupons/coupons.component';
import { SignUpComponent } from '../signup/signup.component';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { Location } from '@angular/common';
import { JdnComponent } from '../jdn-detail/jdn-detail-component';
import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';

@Component({
  selector: 'app-search-provider',
  templateUrl: './search-provider.component.html',
  styleUrls: ['./search-provider.component.css'],
})
export class SearchProviderComponent implements OnInit, OnChanges {
  userType: any;
  provider_id;
  selectedDepartment: any;
  retval;
  s3url;
  businessjson: any = [];
  tempservicejson: any = [];
  go_back_cap = Messages.GO_BACK_CAP;
  services_offered = Messages.SERV_OFFERED_CAP;
  appttime_arr: any = [];
  terminologiesjson: any = [];
  s3CouponList: any;
  frstChckinCupnCunt: any;
  jdnlength: number;
  kwdet: any = [];
  search_data;
  search_return;
  q_str;
  loc_details;
  testuserQry;
  latitude;
  longitude;
  loctype;
  waitlisttime_arr: any = [];
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  found_cap = Messages.FOUND_CAP;
  open_now_cap = Messages.OPEN_NOW_CAP;
  sorry_cap = Messages.SORRY_CAP;
  not_allowed_cap = Messages.NOT_ALLOWED_CAP;
  do_you_want_to_cap = Messages.DO_YOU_WANT_TO_CAP;
  for_cap = Messages.FOR_CAP;
  different_date = Messages.DIFFERENT_DATE_CAP;
  no_ynw_results_found = Messages.NO_YNW_RES_FOUND_CAP;
  get_token_btn = Messages.GET_TOKEN;
  people_ahead = Messages.PEOPLE_AHEAD_CAP;
  no_people_ahead = Messages.NO_PEOPLE_AHEAD;
  one_person_ahead = Messages.ONE_PERSON_AHEAD;
  get_token_cap = Messages.GET_FIRST_TOKEN;
  basic_cap = Messages.BASIC_CAP;
  basic_plus_cap = Messages.BASIC_PLUS_CAP;
  premium_cap = Messages.PREMIUM_CAP;
  send_messages = Messages.SEND_MSG;
  claim_my_business_cap = Messages.CLAIM_BUSINESS_CAP;
  jaldee_coupon = Messages.JALDEE_COUPON;
  first_time_coupon = Messages.FIRST_TIME_COUPON;
  server_date;
  result_providdet: any = [];
  locationjson: any = [];
  current_provider;
  changedate_req;
  checkindialogRef;
  commdialogRef;
  coupondialogRef;
  btn_clicked = false;
  claimdialogRef;
  servicedialogRef;
  searchResults: any = [];
  usersList: any = [];
  showService = true;
  public domain;
  settingsjson: any = [];
  jdndialogRef;
  jaldeediscountJson;
  domainList: any = [];
  subDomainList: any = [];
  page_source;
  api_loading = false;
  @Input() id;
  @Input() psource;
  @Input() bprofile;
  @Input() settings;
  @Input() terminologies;
  @Input() coupon;
  @Input() serviceJson;
  @Input() jaldeediscount;
  @Input() location;
  @Input() selectedDeptOrUser;
  @Input() fiterByDept;
  futureAllowed = true;
  constructor(private routerobj: Router, private shared_functions: SharedFunctions,
    private searchdetailserviceobj: SearchDetailServices,
    private shared_service: SharedServices,
    private activaterouterobj: ActivatedRoute,
    private locationobj: Location,
    private dialog: MatDialog) {
    this.api_loading = true;
    this.domainList = this.shared_functions.getitemfromLocalStorage('ynw-bconf');
    // this.activaterouterobj.params.subscribe(params => {
    //   this.api_loading = true;
    //   this.provider_id = params.id;
    //   this.departmentId = params.deptId;
    //   this.gets3curl();
    // });
    // this.activaterouterobj.queryParams.subscribe(qparams => {
    //   if (qparams.source) {
    //     this.page_source = qparams.source;
    //   }
    // });
  }
  ngOnInit() {
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    this.loc_details = this.shared_functions.getitemfromLocalStorage('ynw-locdet');
  }
  ngOnChanges() {
    if (this.psource) {
      this.provider_id = this.id;
    }
    if (this.bprofile) {
      this.businessjson = this.bprofile;
      if (this.domainList && this.domainList.bdata && this.businessjson.serviceSector && this.businessjson.serviceSector.id) {
        const dom = this.domainList.bdata.filter(domain => domain.id === this.businessjson.serviceSector.id);
        this.subDomainList = dom[0].subDomains;
      }
    }
    if (this.location) {
      let schedule_arr: any = [];
      const locarr = [];
      this.locationjson = this.location;
      for (let i = 0; i < this.locationjson.length; i++) {
        schedule_arr = [];
        if (this.locationjson[i].bSchedule) {
          if (this.locationjson[i].bSchedule.timespec) {
            if (this.locationjson[i].bSchedule.timespec.length > 0) {
              schedule_arr = [];
              for (let j = 0; j < this.locationjson[i].bSchedule.timespec.length; j++) {
                for (let k = 0; k < this.locationjson[i].bSchedule.timespec[j].repeatIntervals.length; k++) {
                  schedule_arr.push({
                    day: this.locationjson[i].bSchedule.timespec[j].repeatIntervals[k],
                    sTime: this.locationjson[i].bSchedule.timespec[j].timeSlots[0].sTime,
                    eTime: this.locationjson[i].bSchedule.timespec[j].timeSlots[0].eTime,
                    recurrtype: this.locationjson[i].bSchedule.timespec[j].recurringType
                  });
                }
              }
            }
          }
        }
        let display_schedule = [];
        display_schedule = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
        this.locationjson[i]['display_schedule'] = display_schedule;
        // this.locationjson[i]['services'] = [];
        // this.getServiceByLocationid(this.locationjson[i].id, i);
        this.locationjson[i]['checkins'] = [];
        if (this.businessjson.id) {
          locarr.push({ 'locid': this.businessjson.id + '-' + this.locationjson[i].id, 'locindx': i });
        }
      }
    }
    if (this.settings) {
      this.settingsjson = this.settings;
    }
    if (this.terminologies) {
      this.terminologiesjson = this.terminologies;
    }
    if (this.coupon) {
      this.s3CouponList = this.coupon;
      this.firstChckinCuponCunt(this.s3CouponList);
    }
    if (this.jaldeediscount) {
      this.jaldeediscountJson = this.jaldeediscount;
      this.jdnlength = Object.keys(this.jaldeediscountJson).length;
    }
    if (this.selectedDeptOrUser) {
      this.selectedDepartment = this.selectedDeptOrUser;
      if (this.fiterByDept) {
        if (this.selectedDeptOrUser && this.selectedDeptOrUser.users) {
        this.usersList = this.selectedDeptOrUser.users;
        }
      } else {
        this.usersList = this.selectedDeptOrUser;
      }
      this.showService = false;
      if (this.usersList.length === 0) {
        this.showService = true;
        this.api_loading = false;
      } else {
        this.gets3curl().then(
          () => {
            for (let i = 0; i < this.usersList.length; i++) {
              const waitTimearr = [];
              const apptTimearr = [];
              this.getUserbusinessprofiledetails_json('providerBusinessProfile', this.usersList[i], true);
              this.getUserbusinessprofiledetails_json('providerservices', this.usersList[i], true);
              this.getUserbusinessprofiledetails_json('providerApptServices', this.usersList[i], true);
              apptTimearr.push({ 'locid': this.businessjson.id + '-' + this.locationjson[0].id + '-' + this.usersList[i].id, 'locindx': i });
              waitTimearr.push({ 'locid': this.usersList[i].id + '-' + this.locationjson[0].id, 'locindx': i });
              this.getUserWaitingTime(waitTimearr, this.usersList[i]);
              this.getUserApptTime(apptTimearr, this.usersList[i]);
            }
          });
      }

    }
  }

  gets3curl() {
    return new Promise((resolve) => {
      this.retval = this.shared_functions.getS3Url('provider')
        .then(
          res => {
            this.s3url = res;
            resolve();
          });
    });

  }
  getTerminologyTerm(term) {
    if (this.terminologiesjson) {
      const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
      if (this.terminologiesjson) {
        return this.shared_functions.firstToUpper((this.terminologiesjson[term_only]) ? this.terminologiesjson[term_only] : ((term === term_only) ? term_only : term));
      } else {
        return this.shared_functions.firstToUpper((term === term_only) ? term_only : term);
      }
    } else {
      return term;
    }
  }
  handlesearchClick() {
  }
  providerDetClicked(obj) {
    this.routerobj.navigate([this.provider_id], { queryParams: { userId: obj.id, pId: this.businessjson.id, psource: this.psource } });
  }
  getUserWaitingTime(provids, user) {
    if (provids.length > 0) {
      const post_provids: any = [];
      for (let i = 0; i < provids.length; i++) {
        post_provids.push(provids[i].locid);
      }
      if (post_provids.length === 0) {
        return;
      }
      this.searchdetailserviceobj.getUserEstimatedWaitingTime(post_provids)
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
          const check_dtoday = new Date(dtoday);
          let cdate;
          for (let i = 0; i < this.waitlisttime_arr.length; i++) {
            user['waitingtime_res'] = this.waitlisttime_arr[i];
            user['estimatedtime_det'] = [];
            user['waitingtime_res'] = this.waitlisttime_arr[i];
            if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              user['estimatedtime_det']['calculationMode'] = this.waitlisttime_arr[i]['nextAvailableQueue']['calculationMode'];
              user['estimatedtime_det']['waitlist'] = this.waitlisttime_arr[i]['nextAvailableQueue']['waitlistEnabled'];
              user['estimatedtime_det']['showToken'] = this.waitlisttime_arr[i]['nextAvailableQueue']['showToken'];
              user['estimatedtime_det']['onlineCheckIn'] = this.waitlisttime_arr[i]['nextAvailableQueue']['onlineCheckIn'];
              user['estimatedtime_det']['futureWaitlist'] = this.waitlisttime_arr[i]['nextAvailableQueue']['futureWaitlist'];
              user['estimatedtime_det']['isAvailableToday'] = this.waitlisttime_arr[i]['nextAvailableQueue']['isAvailableToday'];
              user['estimatedtime_det']['isCheckinAllowed'] = this.waitlisttime_arr[i]['isCheckinAllowed'];
              user['estimatedtime_det']['personAhead'] = this.waitlisttime_arr[i]['nextAvailableQueue']['personAhead'];
              user['estimatedtime_det']['cdate'] = this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
              user['estimatedtime_det']['queue_available'] = 1;
              user['opennow'] = this.waitlisttime_arr[i]['nextAvailableQueue']['openNow'] || false;
              cdate = new Date(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
              if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                user['estimatedtime_det']['availableToday'] = true;
              } else {
                user['estimatedtime_det']['availableToday'] = false;
              }
              if (!user['opennow']) {
                user['estimatedtime_det']['caption'] = this.nextavailableCaption + ' ';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    user['estimatedtime_det']['date'] = 'Today';
                  } else {
                    user['estimatedtime_det']['date'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' });
                  }
                  user['estimatedtime_det']['time'] = user['estimatedtime_det']['date']
                    + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                } else {
                  user['estimatedtime_det']['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
                user['estimatedtime_det']['nextAvailDate'] = user['estimatedtime_det']['date'] + ',' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              } else {
                user['estimatedtime_det']['caption'] = this.estimateCaption; // 'Estimated Waiting Time';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  user['estimatedtime_det']['time'] = this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                } else {
                  user['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                  user['estimatedtime_det']['time'] = 'Today, ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                }
              }
            } else {
              user['estimatedtime_det']['queue_available'] = 0;
            }
            if (this.waitlisttime_arr[i]['message']) {
              user['estimatedtime_det']['message'] = this.waitlisttime_arr[i]['message'];
            }
          }
        });
    }
  }
  checkinClicked(obj) {
    this.current_provider = obj;
    let chdatereq;
    if (obj['estimatedtime_det']['onlineCheckIn'] && obj['estimatedtime_det']['isAvailableToday'] && obj['estimatedtime_det']['availableToday']) {
      chdatereq = false;
    } else {
      chdatereq = true;
    }
    this.changedate_req = chdatereq;
    this.userType = this.shared_functions.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      this.showCheckin();
    } else if (this.userType === '') {
      const passParam = { callback: '', current_provider: this.current_provider };
      this.doLogin('consumer', passParam);
    }
  }
  appointmentClicked(obj) {
    this.futureAllowed = true;
    this.current_provider = obj;
    if (obj.todayAppt && obj['apptAvailableToday']) {
      this.changedate_req = false;
    } else {
      this.changedate_req = true;
    }
    if (!obj.futureAppt) {
      this.futureAllowed = false;
    }
    this.userType = this.shared_functions.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      this.showAppointment();
    } else if (this.userType === '') {
      const passParam = { callback: 'appointment', current_provider: this.current_provider };
      this.doLogin('consumer', passParam);
    }
  }

  payClicked(search_result) {
    this.current_provider = search_result;
    this.showDonation(false, search_result.fields.unique_id, search_result.bProfile.id);
  }
  showDonation(curdate, unique_id, accountId) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        loc_id: this.locationjson[0].id,
        sel_date: curdate,
        cur: this.changedate_req,
        unique_id: unique_id,
        account_id: accountId
      }
    };
    this.routerobj.navigate(['consumer', 'donations', 'new'], navigationExtras);
  }
  showCheckin() {
    let deptId;
    if (this.current_provider.wtlstservices[0] && this.current_provider.wtlstservices[0].department) {
      deptId = this.current_provider.wtlstservices[0].department;
    }
    const seldate = this.current_provider['estimatedtime_det']['cdate'];
    const navigationExtras: NavigationExtras = {
      queryParams: {
        loc_id: this.locationjson[0].id,
        sel_date: seldate,
        cur: this.changedate_req,
        unique_id: this.provider_id,
        account_id: this.businessjson.id,
        tel_serv_stat: this.businessjson.virtualServices,
        dept: deptId,
        user: this.current_provider.id
      }
    };
    this.routerobj.navigate(['consumer', 'checkin'], navigationExtras);
  }

  showAppointment() {
    let deptId;
    if (this.current_provider.wtlstservices[0] && this.current_provider.wtlstservices[0].department) {
      deptId = this.current_provider.wtlstservices[0].department;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        loc_id: this.locationjson[0].id,
        cur: this.changedate_req,
        unique_id: this.provider_id,
        account_id: this.businessjson.id,
        tel_serv_stat: this.businessjson.virtualServices,
        dept: deptId,
        user: this.current_provider.id,
        futureAppt: this.futureAllowed
      }
    };
    this.routerobj.navigate(['consumer', 'appointment'], navigationExtras);
  }
  checkProvider(type) {
    return (type === 'consumer') ? 'false' : 'true';
  }

  getServiceByLocationid(locid, passedIndx) {
    this.shared_service.getServicesByLocationId(locid)
      .subscribe(data => {
        this.locationjson[passedIndx]['services'] = data;
      },
        error => {
          this.shared_functions.apiErrorAutoHide(this, error);
        });
  }

  stringToInt(stringVal) {
    return parseInt(stringVal, 0);
  }

  communicateHandler(search_result) {
    const providforCommunicate = search_result.bProfile.id;
    // check whether logged in as consumer
    if (this.shared_functions.checkLogin()) {
      this.showCommunicate(providforCommunicate);
    } else { // show consumer login

    }
  }
  showCommunicate(provid) {
    this.commdialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        caption: 'Enquiry',
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

  openCoupons(type) {
    this.coupondialogRef = this.dialog.open(CouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
      disableClose: true,
      data: {
        couponsList: this.s3CouponList,
        type: type
      }
    });
    this.coupondialogRef.afterClosed().subscribe(() => {
    });
  }

  claimBusiness(obj) {
    const myidarr = obj.id.split('-');
    if (myidarr[0]) {
      this.searchdetailserviceobj.getClaimmable(myidarr[0])
        .subscribe(data => {
          const claimdata = data;
          const pass_data = {
            accountId: myidarr[0],
            sector: claimdata['sector'],
            subSector: claimdata['subSector']
          };
          this.SignupforClaimmable(pass_data);
        }, error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
    } else {
    }
  }

  SignupforClaimmable(passData) {
    this.claimdialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: 'true',
        claimData: passData
      }
    });
    this.claimdialogRef.afterClosed().subscribe(result => {
    });
  }

  checkserviceClicked(name, obj) {
    this.btn_clicked = true;
    this.serviceClicked(name, obj);
  }

  serviceClicked(service, obj) {
    const s3id = obj.bProfile.unique_id;
    const busname = obj.bProfile.businessName;
    if (!service) {
      this.btn_clicked = false;
    } else {
      this.showServiceDetail(service, busname);
    }
  }

  openJdn() {
    this.jdndialogRef = this.dialog.open(JdnComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
      disableClose: true,
      data: {
        jdnList: this.jaldeediscountJson
      }
    });
    this.jdndialogRef.afterClosed().subscribe(() => {
    });
  }
  firstChckinCuponCunt(CouponList) {
    for (let index = 0; index < CouponList.length; index++) {
      if (CouponList[index].firstCheckinOnly === true) {
        this.frstChckinCupnCunt = this.frstChckinCupnCunt + 1;
      }
    }
  }
  getUserApptTime(provids_locid, user) {
    if (provids_locid.length > 0) {
      const post_provids_locid: any = [];
      for (let i = 0; i < provids_locid.length; i++) {
        post_provids_locid.push(provids_locid[i].locid);
      }
      if (post_provids_locid.length === 0) {
        return;
      }
      this.searchdetailserviceobj.getUserApptTime(post_provids_locid)
        .subscribe(data => {
          this.appttime_arr = data;
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
            user['apptAllowed'] = this.appttime_arr[i]['isCheckinAllowed'];
            if (this.appttime_arr[i]['availableSchedule']) {
              user['futureAppt'] = this.appttime_arr[i]['availableSchedule']['futureAppt'];
              user['todayAppt'] = this.appttime_arr[i]['availableSchedule']['todayAppt'];
              user['apptopennow'] = this.appttime_arr[i]['availableSchedule']['openNow'];
              if (dtoday === this.appttime_arr[i]['availableSchedule']['availableDate']) {
                user['apptAvailableToday'] = true;
              } else {
                user['apptAvailableToday'] = false;
              }
            }
          }
        });
    }
  }
  getUserbusinessprofiledetails_json(section, user, modDateReq: boolean) {
    let UTCstring = null;
    if (modDateReq) {
      UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    }
    this.shared_service.getUserbusinessprofiledetails_json(this.businessjson.uniqueId, user.id, this.s3url, section, UTCstring)
      .subscribe((res: any) => {
        switch (section) {
          case 'providerBusinessProfile': {
            user['bProfile'] = res;
            user['ratingenabledCnt'] = this.businessjson.avgRating || 0;
            if (user['ratingenabledCnt'] > 0) {
              user['ratingenabledCnt'] = this.shared_functions.ratingRounding(user['ratingenabledCnt']);
            }
            const ratingenabledInt = parseInt(user['ratingenabledCnt'].toString(), 10);
            if (ratingenabledInt < user['ratingenabledCnt']) {
              user['ratingenabledHalf'] = true;
              user['ratingenabledCnt'] = ratingenabledInt;
              user['ratingdisabledCnt'] = 5 - (ratingenabledInt + 1);
            } else {
              user['ratingdisabledCnt'] = 5 - ratingenabledInt;
            }
            user['ratingenabledArr'] = [];
            user['ratingdisabledArr'] = [];
            for (let i = 0; i < user['ratingenabledCnt']; i++) {
              user['ratingenabledArr'].push(i);
            }
            for (let i = 0; i < user['ratingdisabledCnt']; i++) {
              user['ratingdisabledArr'].push(i);
            }
            const subDom = this.subDomainList.filter(subdomain => subdomain.id === res.userSubdomain);
            user['bProfile']['userSubSector'] = subDom[0];
            this.api_loading = false;
            break;
          }
          case 'providerApptServices': {
            user['apptServices'] = [];
            if (this.settingsjson.filterByDept) {
              for (const dept of res) {
                if (dept.services && dept.services.length > 0) {
                  for (const serv of dept.services) {
                    if (user['apptServices'].indexOf(serv) === -1) {
                      user['apptServices'].push(serv);
                    }
                  }
                }
              }
            } else {
              user['apptServices'] = res;
            }
            break;
          }
          case 'providerservices': {
            user['wtlstservices'] = [];
            if (this.settingsjson.filterByDept) {
              for (const dept of res) {
                if (dept.services && dept.services.length > 0) {
                  for (const serv of dept.services) {
                    if (user['wtlstservices'].indexOf(serv) === -1) {
                      user['wtlstservices'].push(serv);
                    }
                  }
                }
              }
            } else {
              user['wtlstservices'] = res;
            }
            if (user['apptServices'] && user['apptServices'].length > 0) {
              setTimeout(() => {
                const ids = new Set(user['wtlstservices'].map(d => d.id));
                const merged = [...user['wtlstservices'], ...user['apptServices'].filter(d => !ids.has(d.id))];
                user['wtlstservices'] = merged;
              });
            }
            break;
          }
        }
      },
        () => {
          if (section === 'providerBusinessProfile') {
            this.api_loading = false;
          }
        });
  }

  doLogin(origin?, passParam?) {
    const is_test_account = true;
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        test_account: is_test_account,
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.shared_functions.sendMessage(pdata);
        this.shared_functions.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'communicate') {
          this.showCommunicate(passParam['providerId']);
        } else if (passParam['callback'] === 'appointment') {
          this.showAppointment();
        } else {
          this.showCheckin();
        }
      } else if (result === 'showsignup') {
        this.doSignup(passParam);
      }
    });
  }
  doSignup(passParam?) {
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: 'false',
        moreParams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.shared_functions.sendMessage(pdata);
        this.shared_functions.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'communicate') {
          this.showCommunicate(passParam['providerId']);
        } else if (passParam['callback'] === 'appointment') {
          this.showAppointment();
        } else {
          this.showCheckin();
        }
      }
    });
  }
  showServiceDetail(serv, busname) {
    this.servicedialogRef = this.dialog.open(ServiceDetailComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
      disableClose: true,
      data: {
        bname: busname,
        serdet: serv
      }
    });
    this.servicedialogRef.afterClosed().subscribe(result => {
      this.btn_clicked = false;
    });
  }
}
