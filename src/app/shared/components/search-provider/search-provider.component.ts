import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../constants/project-constants';
import { SharedServices } from '../../services/shared-services';
import { SearchDetailServices } from '../search-detail/search-detail-services.service';
import { Messages } from '../../constants/project-messages';
import { CheckInComponent } from '../../modules/check-in/check-in.component';
import { MatDialog } from '@angular/material';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';
import { CouponsComponent } from '../coupons/coupons.component';
import { SignUpComponent } from '../signup/signup.component';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';

@Component({
  selector: 'app-search-provider',
  templateUrl: './search-provider.component.html'
})
export class SearchProviderComponent implements OnInit, OnChanges {

  constructor(private routerobj: Router, private shared_functions: SharedFunctions,
    private searchdetailserviceobj: SearchDetailServices,
    private shared_service: SharedServices,
    private dialog: MatDialog) { }
  @Input() dept_id;
  @Input() searchResult;
  @Output() actionPerformed = new EventEmitter<any>();
  @Output() search_result_countevent = new EventEmitter<any>();
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
  ngOnInit() {
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    this.loc_details = this.shared_functions.getitemfromLocalStorage('ynw-locdet');
  }
  ngOnChanges() {
    this.getSearchData();
  }

  getSearchData() {
    this.searchResults = this.searchResult;
    for (let i = 0; i < this.searchResults.length; i++) {
      this.result_providdet = [];
      if (this.searchResults[i]['logo']) {
        this.searchResults[i]['logo'] = this.searchResults[i]['logo'] + '?' + new Date();
      }
      this.searchResults[i].rating = this.shared_functions.ratingRounding(this.searchResults[i].rating);
      this.searchResults[i]['checkInsallowed'] = (this.searchResults[i].hasOwnProperty('online_checkins')) ? true : false;
      const provid = this.searchResults[i].id;
      if (this.searchResults[i].claimable !== '1') {
        this.result_providdet.push({ 'provid': provid, 'searchindx': i });
      } else {
      }
      if (this.searchResults[i].business_hours1) {
        let schedule_arr = [];
        const business_hours = JSON.parse(this.searchResults[i].business_hours1[0]);
        for (let j = 0; j < business_hours.length; j++) {
          const obt_sch = business_hours[j];
          for (let k = 0; k < obt_sch.repeatIntervals.length; k++) {
            schedule_arr.push({
              day: obt_sch.repeatIntervals[k],
              sTime: obt_sch.timeSlots[0].sTime,
              eTime: obt_sch.timeSlots[0].eTime,
              recurrtype: obt_sch.recurringType
            });
          }
          this.searchResults[i]['display_schedule'] = this.shared_functions.arrageScheduleforDisplay(schedule_arr);
        }
      }
    }
    this.getWaitingTime(this.result_providdet);
  }

  getTerminologyTerm(term, fields) {
    let terminologies = null;
    if (fields.terminologies !== undefined) {
      terminologies = JSON.parse(fields.terminologies[0]);
    }
    if (terminologies !== null) {
      const term_only = term.replace(/[\[\]']/g, ''); // term may me with or without '[' ']'
      if (terminologies) {
        return this.shared_functions.firstToUpper((terminologies[term_only]) ? terminologies[term_only] : ((term === term_only) ? term_only : term));
      } else {
        return this.shared_functions.firstToUpper((term === term_only) ? term_only : term);
      }
    } else {
      return this.shared_functions.firstToUpper(term);
    }
  }

  providerDetClicked(obj) {
    const provid = obj.unique_id;
    this.routerobj.navigate(['searchdetail', provid]);
  }

  private getWaitingTime(provids) {
    if (provids.length > 0) {
      const post_provids: any = [];
      for (let i = 0; i < provids.length; i++) {
        post_provids.push(provids[i].provid);
      }
      if (post_provids.length === 0) {
        return;
      }
      this.searchdetailserviceobj.getEstimatedWaitingTime(post_provids)
        .subscribe(data => {
          this.waitlisttime_arr = data;
          if (this.waitlisttime_arr === '"Account doesn\'t exist"') {
            this.waitlisttime_arr = [];
          }
          const today = new Date(this.server_date.split(' ')[0]);
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
          let srchindx;
          const check_dtoday = new Date(dtoday);
          let cdate;
          for (let i = 0; i < this.waitlisttime_arr.length; i++) {
            srchindx = provids[i].searchindx;
            this.searchResults[srchindx]['waitingtime_res'] = this.waitlisttime_arr[i];
            this.searchResults[srchindx]['estimatedtime_det'] = [];
            this.searchResults[srchindx]['waitingtime_res'] = this.waitlisttime_arr[i];
            if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              this.searchResults[srchindx]['estimatedtime_det']['calculationMode'] = this.waitlisttime_arr[i]['nextAvailableQueue']['calculationMode'];
              this.searchResults[srchindx]['estimatedtime_det']['showToken'] = this.waitlisttime_arr[i]['nextAvailableQueue']['showToken'];
              this.searchResults[srchindx]['estimatedtime_det']['onlineCheckIn'] = this.waitlisttime_arr[i]['nextAvailableQueue']['onlineCheckIn'];
              this.searchResults[srchindx]['estimatedtime_det']['isAvailableToday'] = this.waitlisttime_arr[i]['nextAvailableQueue']['isAvailableToday'];
              this.searchResults[srchindx]['estimatedtime_det']['isCheckinAllowed'] = this.waitlisttime_arr[i]['isCheckinAllowed'];
              this.searchResults[srchindx]['estimatedtime_det']['personAhead'] = this.waitlisttime_arr[i]['nextAvailableQueue']['personAhead'];
              this.searchResults[srchindx]['estimatedtime_det']['cdate'] = this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
              this.searchResults[srchindx]['estimatedtime_det']['queue_available'] = 1;
              this.searchResults[srchindx]['opennow'] = this.waitlisttime_arr[i]['nextAvailableQueue']['openNow'] || false;
              cdate = new Date(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
              if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                this.searchResults[srchindx]['estimatedtime_det']['availableToday'] = true;
              } else {
                this.searchResults[srchindx]['estimatedtime_det']['availableToday'] = false;
              }
              if (!this.searchResults[srchindx]['opennow']) {
                this.searchResults[srchindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' ';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('serviceTime')) {
                  if (dtoday === this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']) {
                    this.searchResults[srchindx]['estimatedtime_det']['date'] = 'Today';
                  } else {
                    this.searchResults[srchindx]['estimatedtime_det']['date'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                  }
                  this.searchResults[srchindx]['estimatedtime_det']['time'] = this.searchResults[srchindx]['estimatedtime_det']['date']
                    + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                } else {
                  this.searchResults[srchindx]['estimatedtime_det']['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                }
                this.searchResults[srchindx]['estimatedtime_det']['nextAvailDate'] = this.searchResults[srchindx]['estimatedtime_det']['date'] + ',' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              } else {
                this.searchResults[srchindx]['estimatedtime_det']['caption'] = this.estimateCaption; // 'Estimated Waiting Time';
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  this.searchResults[srchindx]['estimatedtime_det']['time'] = this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                } else {
                  this.searchResults[srchindx]['estimatedtime_det']['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                  this.searchResults[srchindx]['estimatedtime_det']['time'] = 'Today, ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                }
              }
            } else {
              this.searchResults[srchindx]['estimatedtime_det']['queue_available'] = 0;
            }
            if (this.waitlisttime_arr[i]['message']) {
              this.searchResults[srchindx]['estimatedtime_det']['message'] = this.waitlisttime_arr[i]['message'];
            }
          }
        });
    }
  }

  checkinClicked(obj, chdatereq) {
    this.current_provider = obj;
    this.changedate_req = chdatereq;
    this.showCheckin('consumer');
  }

  checkProvider(type) {
    return (type === 'consumer') ? 'false' : 'true';
  }
  showCheckin(origin?) {
    this.checkindialogRef = this.dialog.open(CheckInComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass', 'checkin-consumer'],
      disableClose: true,
      data: {
        dept: true,
        type: origin,
        is_provider: this.checkProvider(origin),
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 },
        srchprovider: this.current_provider,
        datechangereq: this.changedate_req
      }
    });
    this.checkindialogRef.afterClosed().subscribe(result => {
    });
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
    const name = search_result.title || null; // providername
    const obj = search_result.id || null;
    if (obj) {
      const arr = obj.split('-');
      const providforCommunicate = arr[0];
      const ctype = this.shared_functions.isBusinessOwner('returntyp');
      if (ctype === 'consumer') {
        this.showCommunicate(providforCommunicate, name);
      }
    }
  }
  showCommunicate(provid, provider_name) {
    this.commdialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        user_id: provid,
        source: 'consumer-common',
        type: 'send',
        name: provider_name
      }
    });
    this.commdialogRef.afterClosed().subscribe(result => {
    });
  }

  openCoupons(obj, type) {
    this.btn_clicked = true;
    const s3id = obj.unique_id;
    const busname = obj.title;
    const UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    this.shared_functions.getS3Url('provider')
      .then(
        res => {
          const s3url = res;
          this.shared_service.getbusinessprofiledetails_json(s3id, s3url, 'coupon', UTCstring)
            .subscribe(couponsList => {
              this.coupondialogRef = this.dialog.open(CouponsComponent, {
                width: '60%',
                panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
                disableClose: true,
                data: {
                  couponsList: couponsList,
                  type: type
                }
              });
              this.coupondialogRef.afterClosed().subscribe(result => {
                this.btn_clicked = false;
              });
            });
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

  serviceClicked(name, obj) {
    const s3id = obj.unique_id;
    const busname = obj.title;
    // get services details from s3
    let selected_service = null;
    const UTCstring = this.shared_functions.getCurrentUTCdatetimestring();
    this.shared_functions.getS3Url('provider')
      .then(
        res => {
          const s3url = res;
          this.shared_service.getbusinessprofiledetails_json(s3id, s3url, 'services', UTCstring)
            .subscribe(services => {
              let servicesList: any = [];
              servicesList = services;
              for (let i = 0; i < servicesList.length; i++) {
                if (servicesList[i].name === name) {
                  selected_service = servicesList[i];
                  break;
                }
              }
              if (selected_service !== null) {
                this.showServiceDetail(selected_service, busname);
              } else {
                this.btn_clicked = false;
              }
            });
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
