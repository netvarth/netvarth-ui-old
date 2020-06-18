import { Component, Input, Output, Inject, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { FormMessageDisplayService } from '../../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../services/shared-services';
import { SharedFunctions } from '../../../functions/shared-functions';
import { Messages } from '../../../constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';
import * as moment from 'moment';
import { ConsumerPaymentmodeComponent } from '../../../../shared/components/consumer-paymentmode/consumer-paymentmode.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
@Component({
  selector: 'app-check-in-inner',
  templateUrl: './check-in-inner.component.html',
})
export class CheckInInnerComponent implements OnInit {
  select_service_cap = Messages.SELECT_SER_CAP;
  select_deptment_cap = Messages.SELECT_DEPT_CAP;
  no_services_avail_cap = Messages.NO_SER_AVAIL_CAP;
  add_change_member = Messages.ADD_CHANGE_MEMBER;
  date_cap = Messages.DATE_CAP;
  serv_time_window_cap = Messages.SERV_TIME_WINDOW_CAP;
  enter_party_size_cap = Messages.ENTER_PARTY_SIZE;
  have_note_click_here = '';
  not_accepted_for_this_date = Messages.NOT_ACCEPTED_THIS_DATE_CAP;
  service_needs_prepayment = Messages.NEEDS_PREPAYMENT_FOR_CAP;
  prepayment_amnt_cap = Messages.PREPAYMENT_AMOUNT_CAP;
  no_pay_modes_avail_cap = Messages.NO_PAY_MODES_AVAIL_CAP;
  apply_cap = Messages.APPLY_CAP;
  select_the_cap = Messages.SELECT_THE_CAP;
  member_cap = Messages.MEMBER_CAPTION;
  members_cap = Messages.MEMBERS_CAP;
  for_whom_the_cap = Messages.FOR_WHOM_CAP;
  is_beingmade_cap = Messages.IS_BEING_MADE_CAP;
  add_member_cap = Messages.ADD_MEMBER_CAP;
  for_cap = Messages.FOR_CAP;
  today_cap = Messages.TODAY_CAP;
  persons_ahead_cap = Messages.PERS_AHEAD;
  back_to_cap = Messages.BACK_TO_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_member_cap = Messages.SAVE_MEMBER_BTN;
  applied_inbilltime = Messages.APPLIED_INBILLTIME;
  optinal_fields = Messages.DISPLAYBOARD_OPTIONAL_FIELDS;
  token = Messages.TOKEN;
  get_token_cap;
  domain;
  note_placeholder;
  s3url;
  provider_id;
  trackTimeChange = false;
  trackMode = false;
  api_success = null;
  api_error = null;
  api_cp_error = null;
  partyapi_error = null;
  services: any = [];
  servicesjson: any = [];
  serviceslist: any = [];
  galleryjson: any = [];
  settingsjson: any = [];
  locationjson: any = [];
  terminologiesjson: any = [];
  queuejson: any = [];
  businessjson: any = [];
  familymembers: any = [];
  partysizejson: any = [];
  s3CouponsList: any = [];
  sel_loc;
  sel_ser;
  sel_ser_det: any = [];
  prepaymentAmount = 0;
  sel_que;
  search_obj;
  checkinenable = false;
  checkindisablemsg = '';
  pass_loc;
  sel_queue_id;
  sel_queue_waitingmins;
  sel_queue_servicetime = '';
  sel_queue_name;
  sel_queue_timecaption = '';
  sel_queue_indx;
  sel_queue_det;
  sel_queue_personaahead = 0;
  calc_mode;
  showfuturediv;
  multipleMembers_allowed = false;
  partySize = false;
  partySizeRequired = null;
  maxPartySize = 1;
  revealphonenumber;
  today;
  minDate;
  maxDate;
  consumerNote = '';
  enterd_partySize = 1;
  holdenterd_partySize = 0;
  showCreateMember = false;
  sel_checkindate;
  hold_sel_checkindate;
  sel_dayname;
  account_id;
  retval;
  futuredate_allowed = false;
  step;
  waitlist_for: any = [];
  holdwaitlist_for: any = [];
  paymentModes: any = [];
  payModesExists = false;
  payModesQueried = false;
  loggedinuser;
  maxsize;
  paytype = '';
  isFuturedate = false;
  addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '' };
  payment_popup = null;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  fromKiosk = false;
  customer_data: any = [];
  page_source = null;
  main_heading;
  dispCustomernote = false;
  dispCustomerEmail = false;
  CweekDays = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
  queueQryExecuted = false;
  todaydate;
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  checkinCaption = Messages.CHECKIN_TIME_CAPTION;
  checkinsCaption = Messages.CHECKINS_TIME_CAPTION;
  checkinLabel;
  CheckedinLabel;
  ddate;
  selected_coupons: any = [];
  selected_coupon;
  coupon_status = null;
  couponsList: any = [];
  @Input() data: any = [];
  @Output() returntoParent = new EventEmitter<any>();
  isfirstCheckinOffer;
  showCouponWB: boolean;
  couponvalid = true;
  server_date;
  api_loading1 = true;
  api_loading = true;
  track_loading = true;
  departmentlist: any = [];
  departments: any = [];
  selected_dept;
  deptLength;
  filterDepart = false;
  confrmshow = false;
  userData: any = [];
  userEmail;
  userPhone;
  emailExist = false;
  payEmail;
  payEmail1;
  emailerror = null;
  email1error = null;
  phoneerror = null;
  edit = true;
  selected_phone;
  consumerPhoneNo;
  trackUuid;
  liveTrack = false;
  source: any = [];
  travelMode = 'DRIVING';
  notifyTime = 'ONEHOUR';
  notifyAutomatic = true;
  shareLoc = false;
  lat_lng = {
    latitude: 0,
    longitude: 0
  };
  driving = true;
  walking: boolean;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  activeWt;
  bicycling: boolean;
  liveTrackMessage;
  firstTimeClick = true;
  apptTime: any;
  // board_count = 0;
  allSlots: any = [];
  availableSlots: any = [];
  showEditView = false;
  disable_btn = false;
  q_preselected = false;
  tracking = false;
  serviceDatalist;
  constructor(public fed_service: FormMessageDisplayService,
    private provider_services: ProviderServices,
    public shared_services: SharedServices,
    public sharedFunctionobj: SharedFunctions,
    public router: Router,
    public provider_datastorage: CommonDataStorageService,
    public dialogRef: MatDialogRef<CheckInInnerComponent>,
    public _sanitizer: DomSanitizer,
    private dialog: MatDialog,
    @Inject(DOCUMENT) public document,
  ) { }
  ngOnInit() {
    // this.apptTime = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
    this.api_loading = false;
    this.server_date = this.sharedFunctionobj.getitemfromLocalStorage('sysdate');
    const activeUser = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      this.isfirstCheckinOffer = activeUser.firstCheckIn;
    }
    this.customer_data = this.data.customer_data || [];
    if (this.data.apptTime) {
      this.apptTime = this.data.apptTime;
    }
    if (this.data.queue) {
      this.sel_queue_timecaption = this.data.queue.queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.data.queue.queueSchedule.timeSlots[0]['eTime'];
    }
    if (this.data.fromKiosk !== undefined) {
      if (this.data.fromKiosk) {
        this.fromKiosk = true;
      }
    }
    this.page_source = this.data.moreparams.source;
    this.main_heading = this.checkinLabel; // 'Check-in';
    this.get_token_cap = Messages.GET_TOKEN;
    this.maxsize = 1;
    this.step = 1;
    this.getProfile();
    this.loggedinuser = this.sharedFunctionobj.getitemFromGroupStorage('ynw-user');
    this.gets3curl();
    this.getFamilyMembers();
    // this.getCurrentLocation();
    this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    this.today = new Date(this.today);
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    this.minDate = new Date(this.minDate);
    const dd = this.today.getDate();
    const mm = this.today.getMonth() + 1; // January is 0!
    const yyyy = this.today.getFullYear();
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
    this.todaydate = dtoday;
    this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
    if (this.page_source === 'provider_checkin') {
      if (this.data.queue) {
        this.sel_queue_id = this.data.queue.id;
      }
      // this.getDisplayboardCount();
      if (this.fromKiosk) {
        this.waitlist_for.push({ id: this.customer_data.id, name: this.customer_data.name });
      } else {
        this.waitlist_for.push({ id: this.customer_data.id, name: this.customer_data.userProfile.firstName + ' ' + this.customer_data.userProfile.lastName });
      }
    } else {
      this.waitlist_for.push({ id: this.loggedinuser.id, name: this.loggedinuser.firstName + ' ' + this.loggedinuser.lastName });
    }
    if (this.page_source === 'searchlist_checkin') { // case check-in from search result pages
      this.search_obj = this.data.srchprovider;
      if (this.data.dept) {
        this.provider_id = this.search_obj.unique_id;
        this.sel_queue_id = this.search_obj.waitingtime_res.nextAvailableQueue.id;
        this.sel_loc = this.search_obj.location_id1;
        this.sel_checkindate = this.search_obj.waitingtime_res.nextAvailableQueue.availableDate;
      } else {
        this.provider_id = this.search_obj.fields.unique_id;
        this.sel_queue_id = this.search_obj.fields.waitingtime_res.nextAvailableQueue.id;
        this.sel_loc = this.search_obj.fields.location_id1;
        this.sel_checkindate = this.search_obj.fields.waitingtime_res.nextAvailableQueue.availableDate;
      }
      const providarr = this.search_obj.id.split('-');
      this.account_id = providarr[0];
      this.minDate = this.sel_checkindate;
    } else if (this.page_source === 'provdet_checkin'
      || this.page_source === 'provider_checkin') { // case check-in from provider details page or provider dashboard
      // this.search_obj = this.data.srchprovider;
      this.provider_id = this.data.moreparams.provider.unique_id;
      this.account_id = this.data.moreparams.provider.account_id;
      const srch_fields = {
        fields: {
          title: this.data.moreparams.provider.name,
          place1: this.data.moreparams.location.name,
        }
      };
      this.search_obj = srch_fields;
      // this.sel_queue_id = this.search_obj.fields.waitingtime_res.nextAvailableQueue.id;
      this.sel_loc = this.data.moreparams.location.id;
      // if (this.page_source === 'provider_checkin') {
      //   this.sel_checkindate = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).format(projectConstants.POST_DATE_FORMAT);
      // } else {
      this.sel_checkindate = this.data.moreparams.sel_date;
      // }
      if (this.sharedFunctionobj.getitemFromGroupStorage('pdtyp') && this.sharedFunctionobj.getitemFromGroupStorage('pdtyp') !== 2) {
        this.minDate = this.sel_checkindate; // done to set the min date in the calendar view
      }
    }
    if (this.page_source !== 'provider_checkin') { // not came from provider, but came by clicking "Do you want to check in for a different date"
      if (this.data.datechangereq) {
        const seldateChecker = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const seldate_checker = new Date(seldateChecker);
        const todaydateChecker = new Date(this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const todaydate_checker = new Date(todaydateChecker);
        if (seldate_checker.getTime() === todaydate_checker.getTime()) { // if the next available date is today itself, then add 1 day to the date and use it
          // const nextdate = new Date(seldate_checker.setDate(seldate_checker.getDate() + 1));
          const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const serverdate = moment(server).format();
          const servdate = new Date(serverdate);
          const nextdate = new Date(seldate_checker.setDate(servdate.getDate() + 1));
          this.sel_checkindate = nextdate.getFullYear() + '-' + (nextdate.getMonth() + 1) + '-' + nextdate.getDate();
          this.minDate = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION }); // done to set the min date in the calendar view
          this.minDate = new Date(this.minDate.replace(/-/g, '/'));
        }
      }
    }
    const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const ddd = new Date(day);
    this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));
    this.hold_sel_checkindate = this.sel_checkindate;
    this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
    if (this.data.moreparams.terminologies) {
      this.terminologiesjson = this.data.moreparams.terminologies;
      this.setTerminologyLabels();
    }
    // if ( this.page_source !== 'provider_checkin') {
    // this.getPaymentModesofProvider(this.account_id);
    // }
    const dt1 = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const date1 = new Date(dt1);
    const dt2 = new Date(this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const date2 = new Date(dt2);
    // if (this.sel_checkindate !== this.todaydate) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
    if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      this.isFuturedate = true;
    }
    // const retdatedet = this.getQueueDateTimeDetails(this.search_obj.fields.waitingtime_res.nextAvailableQueue);
    // this.sel_queue_det = retdatedet;
    this.showfuturediv = false;
    this.revealphonenumber = true;
  }
  setTerminologyLabels() {
    this.checkinLabel = this.sharedFunctionobj.firstToUpper(this.terminologiesjson['waitlist']);
    this.CheckedinLabel = this.sharedFunctionobj.firstToUpper(this.terminologiesjson['waitlisted']);
    if (this.calc_mode === 'NoCalc' && this.settingsjson.showTokenId) {
      this.main_heading = this.get_token_cap;
    } else {
      this.main_heading = this.checkinLabel;
    }
  }
  getPaymentModesofProvider(provid) {
    if (this.paymentModes.length === 0) {
      this.shared_services.getPaymentModesofProvider(provid)
        .subscribe(data => {
          this.paymentModes = data;
          this.payModesQueried = true;
          if (this.paymentModes.length <= 2) { // **** This is a condition added as per suggestion from Manikandan to avoid showing modes such as Cash, wallet etc in consumer area
            this.payModesExists = false;
          } else {
            this.payModesExists = true;
          }
        },
          error => {
            this.payModesQueried = true;
            this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
            this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          });
    }
  }
  getFamilyMembers() {
    this.api_loading1 = true;
    let fn;
    let self_obj;
    if (this.page_source === 'provider_checkin') {
      fn = this.shared_services.getProviderCustomerFamilyMembers(this.customer_data.id);
      if (this.fromKiosk) {
        self_obj = {
          'userProfile': {
            'id': this.customer_data.id,
            'firstName': this.customer_data.name,
            'lastName': ''
          }
        };
      } else {
        self_obj = {
          'userProfile': {
            'id': this.customer_data.id,
            'firstName': this.customer_data.userProfile.firstName,
            'lastName': this.customer_data.userProfile.lastName
          }
        };
      }
    } else {
      fn = this.shared_services.getConsumerFamilyMembers();
      self_obj = {
        'userProfile': {
          'id': this.loggedinuser.id,
          'firstName': this.loggedinuser.firstName,
          'lastName': this.loggedinuser.lastName
        }
      };
    }
    fn.subscribe(data => {
      this.familymembers = [];
      this.familymembers.push(self_obj);
      for (const mem of data) {
        if (mem.userProfile.id !== self_obj.userProfile.id) {
          this.familymembers.push(mem);
        }
      }
      this.api_loading1 = false;
    },
      () => {
        this.api_loading1 = false;
      });
  }
  gets3curl() {
    this.api_loading1 = true;
    this.retval = this.sharedFunctionobj.getS3Url()
      .then(
        res => {
          this.s3url = res;
          this.getbusinessprofiledetails_json('businessProfile', true);
          this.getbusinessprofiledetails_json('settings', true);
          this.getbusinessprofiledetails_json('coupon', true);
          if (!this.terminologiesjson) {
            this.getbusinessprofiledetails_json('terminologies', true);
          } else {
            if (this.terminologiesjson.length === 0) {
              this.getbusinessprofiledetails_json('terminologies', true);
            } else {
              this.provider_datastorage.set('terminologies', this.terminologiesjson);
              this.sharedFunctionobj.setTerminologies(this.terminologiesjson);
            }
          }
          this.api_loading1 = false;
        },
        () => {
          this.api_loading1 = false;
        }
      );
  }
  // gets the various json files based on the value of "section" parameter
  getbusinessprofiledetails_json(section, modDateReq: boolean) {
    let UTCstring = null;
    if (modDateReq) {
      UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    }
    this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
      .subscribe(res => {
        switch (section) {
          case 'settings':
            this.settingsjson = res;
            this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
            /*this.maxsize = this.settingsjson.maxPartySize;
            if (this.maxsize === undefined) {
            this.maxsize = 1;
            }*/
            break;
          case 'terminologies':
            this.terminologiesjson = res;
            this.provider_datastorage.set('terminologies', this.terminologiesjson);
            this.sharedFunctionobj.setTerminologies(this.terminologiesjson);
            this.setTerminologyLabels();
            break;
          case 'businessProfile':
            this.businessjson = res;
            setTimeout(() => {
              if (this.settingsjson.filterByDept) {
                this.getProviderDepart(this.businessjson.id);
              }
            }, 100);
            this.domain = this.businessjson.serviceSector.domain;
            if (this.domain === 'foodJoints') {
              this.have_note_click_here = Messages.PLACE_ORDER_CLICK_HERE;
              this.note_placeholder = 'Item No Item Name Item Quantity';
            } else {
              this.have_note_click_here = Messages.HAVE_NOTE_CLICK_HERE_CAP;
              this.note_placeholder = '';
            }
            this.getPartysizeDetails(this.businessjson.serviceSector.domain, this.businessjson.serviceSubSector.subDomain);
            break;
          case 'coupon':
            this.s3CouponsList = res;
            if (this.s3CouponsList.length > 0) {
              this.showCouponWB = true;
            }
            break;
        }
      },
        () => {
        }
      );
  }
  getProfile() {
    this.sharedFunctionobj.getProfile()
      .then(
        data => {
          this.userData = data;
          if (this.userData.userProfile !== undefined && this.page_source !== 'provider_checkin') {
            this.userEmail = this.userData.userProfile.email || '';
            this.userPhone = this.userData.userProfile.primaryMobileNo || '';
            this.consumerPhoneNo = this.userPhone;
          } else if (this.data.customer_data && this.data.customer_data.userProfile && this.page_source === 'provider_checkin') {
            this.userEmail = this.data.customer_data.userProfile.email || '';
            this.userPhone = this.data.customer_data.userProfile.primaryMobileNo || '';
            this.consumerPhoneNo = this.userPhone;
          }
          if (this.userEmail) {
            this.emailExist = true;
          } else {
            this.emailExist = false;
          }
        });
  }
  addEmail() {
    this.resetApiErrors();
    this.resetApi();
    let post_data;
    let passtyp;
    if (this.payEmail) {
      const stat = this.validateEmail(this.payEmail);
      if (!stat) {
        this.emailerror = 'Please enter a valid email.';
      }
    }
    if (this.payEmail1) {
      const stat1 = this.validateEmail(this.payEmail1);
      if (!stat1) {
        this.email1error = 'Please enter a valid email.';
      }
    }
    // return new Promise((resolve) => {
    if (this.payEmail === this.payEmail1) {
      post_data = {
        'id': this.userData.userProfile.id || null,
        'firstName': this.userData.userProfile.firstName || null,
        'lastName': this.userData.userProfile.lastName || null,
        'dob': this.userData.userProfile.dob || null,
        'gender': this.userData.userProfile.gender || null,
        'email': this.payEmail || ''
      };
      passtyp = 'consumer';
      if (this.payEmail) {
        this.shared_services.updateProfile(post_data, passtyp)
          .subscribe(
            () => {
              this.getProfile();
              // this.api_success = Messages.PROFILE_UPDATE;
              // this.sharedFunctionobj.openSnackBar(Messages.PROFILE_UPDATE);
              // resolve();
            },
            error => {
              this.api_error = error.error;
              this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
      }
    } else {
      this.email1error = 'Email and Re-entered Email do not match';
    }
  }
  addPhone() {
    this.resetApiErrors();
    this.resetApi();
    const curphone = this.selected_phone;
    const pattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
    const result = pattern.test(curphone);
    const pattern1 = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
    const result1 = pattern1.test(curphone);
    if (this.selected_phone === '') {
      this.phoneerror = Messages.BPROFILE_PHONENO;
      return;
    } else if (!result) {
      this.phoneerror = Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
      return;
    } else if (!result1) {
      this.phoneerror = Messages.BPROFILE_PRIVACY_PHONE_10DIGITS; // 'Mobile number should have 10 digits';
      return;
    } else {
      this.consumerPhoneNo = this.selected_phone;
      this.userPhone = this.selected_phone;
      this.edit = true;
    }
  }
  editPhone() {
    this.edit = false;
    this.selected_phone = this.userPhone;
  }
  validateEmail(mail) {
    const emailField = mail;
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField) === false) {
      return false;
    }
    return true;
  }
  resetApiErrors() {
    this.emailerror = null;
    this.email1error = null;
    this.phoneerror = null;
  }
  setServiceDetails(curservid) {
    let serv;
    for (let i = 0; i < this.servicesjson.length; i++) {
      if (this.servicesjson[i].id === curservid) {
        serv = this.servicesjson[i];
      }
    }
    this.sel_ser_det = [];
    // if (serv.serviceDuration) {
    this.sel_ser_det = {
      name: serv.name,
      duration: serv.serviceDuration,
      description: serv.description,
      price: serv.totalAmount,
      isPrePayment: serv.isPrePayment,
      minPrePaymentAmount: serv.minPrePaymentAmount,
      status: serv.status,
      taxable: serv.taxable
    };
    if (this.page_source !== 'provider_checkin') {
      if (serv.isPrePayment) {
        this.prepaymentAmount = this.waitlist_for.length * this.sel_ser_det.minPrePaymentAmount;
        this.getPaymentModesofProvider(this.account_id);
      }
    }
    // }
  }
  getQueuesbyLocationandServiceId(locid, servid, pdate?, accountid?) {
    this.disable_btn = false;
    this.queueQryExecuted = false;
    if (locid && servid) {
      this.shared_services.getQueuesbyLocationandServiceId(locid, servid, pdate, accountid)
        .subscribe(data => {
          this.queuejson = data;
          this.queueQryExecuted = true;
          if (this.queuejson.length > 0) {
            let selindx = -1;
            let count = 0;
            if (this.q_preselected || this.data.queue) {
              for (let i = 0; i < this.queuejson.length; i++) {
                if (this.queuejson[i].id === this.sel_queue_id) {
                  selindx = i;
                  count++;
                  break;
                }
              }
              if (count === 0) {
                this.sel_queue_id = this.queuejson[0].id;
                selindx = 0;
              }
            } else {
              selindx = 0;
              for (let i = 0; i < this.queuejson.length; i++) {
                if (this.queuejson[i]['queueWaitingTime'] !== undefined) {
                  selindx = i;
                  break;
                }
              }
            }
            if (selindx !== -1) {
              this.sel_queue_indx = selindx;
              // this.sel_queue_waitingmins = this.queuejson[0].queueWaitingTime + ' Mins';
              this.sel_queue_waitingmins = this.sharedFunctionobj.convertMinutesToHourMinute(this.queuejson[selindx].queueWaitingTime);
              this.sel_queue_servicetime = this.queuejson[selindx].serviceTime || '';
              this.sel_queue_name = this.queuejson[selindx].name;
              // this.sel_queue_timecaption = '[ ' + this.queuejson[selindx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[selindx].queueSchedule.timeSlots[0]['eTime'] + ' ]';
              this.sel_queue_timecaption = this.queuejson[selindx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[selindx].queueSchedule.timeSlots[0]['eTime'];
              this.sel_queue_id = this.queuejson[selindx].id;
              this.sel_queue_personaahead = this.queuejson[this.sel_queue_indx].queueSize;
              this.calc_mode = this.queuejson[this.sel_queue_indx].calculationMode;
              this.setTerminologyLabels();
              // if (this.page_source === 'provider_checkin' && !this.data.apptTime && this.calc_mode === 'Fixed') {
              //   if (this.data.queue && this.data.queue.timeInterval && this.data.queue.timeInterval !== 0) {
              //     this.getAvailableTimeSlots(this.data.queue.queueSchedule.timeSlots[0]['sTime'], this.data.queue.queueSchedule.timeSlots[0]['eTime'], this.data.queue.timeInterval);
              //   } else if (this.queuejson[this.sel_queue_indx].timeInterval && this.queuejson[this.sel_queue_indx].timeInterval !== 0) {
              //     this.getAvailableTimeSlots(this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'], this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'], this.queuejson[this.sel_queue_indx].timeInterval);
              //   }
              // }
              // if (this.page_source === 'provider_checkin' && !this.data.apptTime && this.calc_mode === 'Fixed' && this.queuejson[this.sel_queue_indx].appointment === 'Enable') {
              if (this.page_source === 'provider_checkin' && this.calc_mode === 'Fixed' && this.queuejson[this.sel_queue_indx].appointment === 'Enable') {
                this.getAvailableTimeSlots(this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'], this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'], this.queuejson[this.sel_queue_indx].timeInterval);
              } else {
                this.apptTime = '';
                this.showEditView = false;
              }
            } else {
              this.api_error = ' The business hours for the day have ended.Please try again during working hours.';
              this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
              this.disable_btn = true;
            }
          } else {
            if (this.q_preselected || this.sel_queue_id !== 0) {
            } else {
              this.sel_queue_indx = -1;
              this.sel_queue_id = 0;
              this.sel_queue_timecaption = '';
              this.sel_queue_name = '';
              this.sel_queue_waitingmins = 0;
              this.sel_queue_servicetime = '';
              this.sel_queue_personaahead = 0;
            }
          }
        });
    }
  }
  handleServiceSel(obj) {
    // this.sel_ser = obj.id;
    this.sel_ser = obj;
    this.setServiceDetails(obj);
    this.queuejson = [];
    this.sel_queue_id = 0;
    this.sel_queue_waitingmins = 0;
    this.sel_queue_servicetime = '';
    this.sel_queue_personaahead = 0;
    this.sel_queue_name = '';
    this.sel_queue_timecaption = '';
    // this.q_preselected = false;
    this.resetApi();
    this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
  }
  showConfrmEmail(event) {
    if (event.key !== 'Enter') {
      this.confrmshow = true;
    }
  }
  isSelectedService(id) {
    let clr = false;
    if (id === this.sel_ser) {
      clr = true;
    } else {
      clr = false;
    }
    return clr;
  }
  isSelectedQueue(id) {
    let clr = false;
    if (id === this.sel_queue_id) {
      clr = true;
    } else {
      clr = false;
    }
    return clr;
  }
  // handleQueueSel(obj) {
  // this.resetApi();
  // // this.queueReloaded = false;
  // this.sel_queue_id = obj.id;
  // this.sel_queue_waitingmins = this.sharedFunctionobj.convertMinutesToHourMinute(obj.queueWaitingTime);
  // this.sel_queue_servicetime = obj.serviceTime || '';
  // this.sel_queue_name = obj.name;
  // // this.queueReloaded = true;
  // }
  handleQueueSel(mod) {
    this.resetApi();
    if (this.q_preselected) {
      return false;
    }
    if (mod === 'next') {
      if ((this.queuejson.length - 1) > this.sel_queue_indx) {
        this.sel_queue_indx = this.sel_queue_indx + 1;
      }
    } else if (mod === 'prev') {
      if ((this.queuejson.length > 0) && (this.sel_queue_indx > 0)) {
        this.sel_queue_indx = this.sel_queue_indx - 1;
      }
    }
    if (this.sel_queue_indx !== -1) {
      this.sel_queue_id = this.queuejson[this.sel_queue_indx].id;
      this.sel_queue_waitingmins = this.sharedFunctionobj.convertMinutesToHourMinute(this.queuejson[this.sel_queue_indx].queueWaitingTime);
      this.sel_queue_servicetime = this.queuejson[this.sel_queue_indx].serviceTime || '';
      this.sel_queue_name = this.queuejson[this.sel_queue_indx].name;
      // this.sel_queue_timecaption = '[ ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'] + ' ]';
      this.sel_queue_timecaption = this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'];
      this.sel_queue_personaahead = this.queuejson[this.sel_queue_indx].queueSize;
      // this.queueReloaded = true;
      this.availableSlots = [];
      this.apptTime = '';
      // this.api_loading = true;
      // if (this.page_source === 'provider_checkin' && !this.data.apptTime && this.calc_mode === 'Fixed' && this.queuejson[this.sel_queue_indx].timeInterval && this.queuejson[this.sel_queue_indx].timeInterval !== 0) {
      //   this.getAvailableTimeSlots(this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'], this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'], this.queuejson[this.sel_queue_indx].timeInterval);
      // }
      if (this.page_source === 'provider_checkin' && this.calc_mode === 'Fixed') {
        // if (this.data.queue && this.data.queue.timeInterval && this.data.queue.timeInterval !== 0) {
        //   this.getAvailableTimeSlots(this.data.queue.queueSchedule.timeSlots[0]['sTime'], this.data.queue.queueSchedule.timeSlots[0]['eTime'], this.data.queue.timeInterval);
        // } else
        if (this.queuejson[this.sel_queue_indx].appointment === 'Enable' && this.queuejson[this.sel_queue_indx].timeInterval && this.queuejson[this.sel_queue_indx].timeInterval !== 0) {
          this.getAvailableTimeSlots(this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'], this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'], this.queuejson[this.sel_queue_indx].timeInterval);
        }
      }
    }
  }
  handleFuturetoggle() {
    this.showfuturediv = !this.showfuturediv;
  }
  isCheckinenable() {
    if (this.sel_loc && this.sel_ser && this.sel_queue_id && this.sel_checkindate) {
      return true;
    } else {
      return false;
    }
  }
  revealChk() {
    this.revealphonenumber = !this.revealphonenumber;
  }
  handleConsumerNote(vale) {
    this.consumerNote = vale;
  }
  handleFutureDateChange(e) {
    const tdate = e.targetElement.value;
    const newdate = tdate.split('/').reverse().join('-');
    const futrDte = new Date(newdate);
    // const obtmonth = (e.value._i.month + 1);
    const obtmonth = (futrDte.getMonth() + 1);
    let cmonth = '' + obtmonth;
    if (obtmonth < 10) {
      cmonth = '0' + obtmonth;
    }
    const seldate = futrDte.getFullYear() + '-' + cmonth + '-' + futrDte.getDate();
    this.sel_checkindate = seldate;
    const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    const date2 = new Date(dt2);
    const dte0 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
    const datee2 = new Date(dte2);
    if (datee2.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      this.isFuturedate = true;
    } else {
      this.isFuturedate = false;
    }
    this.handleFuturetoggle();
    this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
  }
  handleServiceForWhom() {
    this.resetApi();
    this.holdwaitlist_for = this.waitlist_for;
    this.step = 3;
    this.main_heading = 'Family Members';
  }
  handleCheckinClicked() {
    this.resetApi();
    let error = '';
    // if (this.step === 1) {
    // this.step = 2;
    // } else
    if (this.step === 1) {
      if (this.sel_ser_det.isPrePayment && this.page_source !== 'provider_checkin') {
        /*if (this.paytype === '') {
        error = 'Please select the payment mode';
        }*/
        this.paytype = 'DC'; // deleberately giving this value as per request from Manikandan.
      }
      if (this.partySizeRequired) {
        this.clearerrorParty();
        error = this.validatorPartysize(this.enterd_partySize);
      }
      if (error === '') {
        this.saveCheckin();
      } else {
        this.api_error = error;
        this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    }
  }
  getCurrentLocation() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
          _this.lat_lng.longitude = +pos.coords.longitude;
          _this.lat_lng.latitude = +pos.coords.latitude;
          resolve(_this.lat_lng);
        },
          error => {
            reject();
          });
      }
    });
  }
  saveCheckin() {
    const waitlistarr = [];
    for (let i = 0; i < this.waitlist_for.length; i++) {
      waitlistarr.push({ id: this.waitlist_for[i].id });
    }
    // const apptTimeFormat = moment(this.apptTime).format('hh:mm A') || null;
    let post_Data;
    // if (this.editAppntTime) {
    post_Data = {
      'queue': {
        'id': this.sel_queue_id
      },
      'date': this.sel_checkindate,
      'service': {
        'id': this.sel_ser
      },
      'consumerNote': this.consumerNote,
      'waitlistingFor': JSON.parse(JSON.stringify(waitlistarr)),
      'coupons': this.selected_coupons
    };
    if (this.apptTime) {
      post_Data['appointmentTime'] = this.apptTime;
    }
    // }

    // 'appointmentTime': apptTimeFormat
    // else {
    //   post_Data = {
    //     'queue': {
    //       'id': this.sel_queue_id
    //     },
    //     'date': this.sel_checkindate,
    //     'service': {
    //       'id': this.sel_ser
    //     },
    //     'consumerNote': this.consumerNote,
    //     'waitlistingFor': JSON.parse(JSON.stringify(waitlistarr)),
    //     'coupons': this.selected_coupons
    //   };
    // }
    if (this.selectedMessage.files.length > 0 && this.consumerNote === '') {
      this.api_error = this.sharedFunctionobj.getProjectMesssages('ADDNOTE_ERROR');
      this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
    }
    if (this.partySizeRequired) {
      this.holdenterd_partySize = this.enterd_partySize;
      post_Data['partySize'] = Number(this.holdenterd_partySize);
    }
    if (this.api_error === null) {
      if (this.page_source === 'provider_checkin') {
        post_Data['consumer'] = { id: this.customer_data.id };
        post_Data['ignorePrePayment'] = true;
        this.addCheckInProvider(post_Data);
      } else {
        this.addCheckInConsumer(post_Data);
      }
    }
  }
  addCheckInConsumer(post_Data) {
    post_Data['waitlistPhoneNumber'] = this.consumerPhoneNo;
    this.api_loading = true;
    this.shared_services.addCheckin(this.account_id, post_Data)
      .subscribe(data => {
        const retData = data;
        let retUUID;
        Object.keys(retData).forEach(key => {
          retUUID = retData[key];
          this.trackUuid = retData[key];
        });
        if (this.selectedMessage.files.length > 0) {
          this.consumerNoteAndFileSave(retUUID);
        }
        this.shared_services.getCheckinByConsumerUUID(this.trackUuid, this.account_id).subscribe(
          (wailist: any) => {
            this.activeWt = wailist;
            for ( let serv in this.serviceDatalist) {
              if ( this.activeWt.service.id === this.serviceDatalist[serv].id) {
                if ( this.serviceDatalist[serv].livetrack === true) {
                  this.tracking = true;
                  break;
                }
              }
            }
           this.liveTrack = true;
            this.resetApi();
          },
          () => {
          }
        );
        // if (this.settingsjson.calculationMode !== 'NoCalc' || (this.settingsjson.calculationMode === 'NoCalc' && !this.settingsjson.showTokenId)) {
        // this.api_success = this.sharedFunctionobj.getProjectMesssages('CHECKIN_SUCC');
        // } else if (this.settingsjson.calculationMode === 'NoCalc' && this.settingsjson.showTokenId) {
        // this.api_success = this.sharedFunctionobj.getProjectMesssages('TOKEN_GENERATION');
        // }
        // if (this.sel_ser_det.isPrePayment) { // case if prepayment is to be done
        //   if (this.paytype !== '' && retUUID && this.sel_ser_det.isPrePayment && this.sel_ser_det.minPrePaymentAmount > 0) {
        //     this.dialogRef.close();
        //     // this.sel_ser_det.minPrePaymentAmount
        //     const payData = {
        //       'amount': this.prepaymentAmount,
        //       // 'paymentMode': this.paytype,
        //       'uuid': retUUID,
        //       'accountId': this.account_id,
        //       'purpose': 'prePayment'
        //     };
        //     const dialogrefd = this.dialog.open(ConsumerPaymentmodeComponent, {
        //       width: '50%',
        //       panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
        //       disableClose: true,
        //       data: {
        //         'details': payData,
        //         'origin': 'consumer'
        //       }
        //     });

        //   } else {
        //     this.api_error = this.sharedFunctionobj.getProjectMesssages('CHECKIN_ERROR');
        //     this.api_loading = false;
        //   }
        // }
      },
        error => {
          this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
          this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
        });
  }
  addCheckInProvider(post_Data) {
    post_Data['waitlistPhoneNumber'] = this.consumerPhoneNo;
    this.api_loading = true;
    this.shared_services.addProviderCheckin(post_Data)
      .subscribe((data) => {
        const retData = data;
        let retUuid;
        Object.keys(retData).forEach(key => {
          retUuid = retData[key];
          this.trackUuid = retData[key];
        });
        if (this.selectedMessage.files.length > 0) {
          this.consumerNoteAndFileSave(retUuid);
        }
        if (this.settingsjson.calculationMode !== 'NoCalc' || (this.settingsjson.calculationMode === 'NoCalc' && !this.settingsjson.showTokenId)) {
          this.api_success = this.sharedFunctionobj.getProjectMesssages('CHECKIN_SUCC');
        } else if (this.settingsjson.calculationMode === 'NoCalc' && this.settingsjson.showTokenId) {
          this.api_success = this.sharedFunctionobj.getProjectMesssages('TOKEN_GENERATION');
        }
        setTimeout(() => {
          // this.source['list'] = 'reloadlist';
          // this.source['mode'] = this.page_source;
          // this.dialogRef.close('reloadlist');
          this.returntoParent.emit('reloadlist');
        }, projectConstants.TIMEOUT_DELAY);
      },
        error => {
          this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
          this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
        });
  }

  prePaymentcheckin(retUUID) {
    if (this.paytype !== '' && retUUID && this.sel_ser_det.isPrePayment && this.sel_ser_det.minPrePaymentAmount > 0) {
      this.dialogRef.close();
      // this.sel_ser_det.minPrePaymentAmount
      const payData = {
        'amount': this.prepaymentAmount,
        // 'paymentMode': this.paytype,
        'uuid': retUUID,
        'accountId': this.account_id,
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
      this.api_error = this.sharedFunctionobj.getProjectMesssages('CHECKIN_ERROR');
      this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
      this.api_loading = false;
    }
    if (this.shareLoc) {
      this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('TRACKINGCANCELENABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
    } else {
      this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('TRACKINGCANCELDISABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
    }
  }
  handleGoBack(cstep) {
    if (this.page_source !== 'provider_checkin') {
      if (this.sel_ser_det.isPrePayment) {
        let len = this.waitlist_for.length;
        if (this.waitlist_for.length === 0) {
          len = 1;
        }
        this.prepaymentAmount = len * this.sel_ser_det.minPrePaymentAmount;
      }
    }
    this.resetApi();
    switch (cstep) {
      case 1:
        break;
      case 2:
        if (this.calc_mode === 'NoCalc' && this.settingsjson.showTokenId) {
          this.main_heading = this.get_token_cap;
        } else {
          this.main_heading = this.checkinLabel;
        }
        this.handleServiceSel(this.sel_ser);
        break;
      case 3:
        this.main_heading = 'Family Members';
        this.showCreateMember = false;
        this.addmemberobj.fname = '';
        this.addmemberobj.lname = '';
        this.addmemberobj.mobile = '';
        this.addmemberobj.gender = '';
        this.addmemberobj.dob = '';
        break;
    }
    this.step = cstep;
    if (this.waitlist_for.length === 0) { // if there is no members selected, then default to self
      // this.waitlist_for.push ({id: this.loggedinuser.id, name: 'Self'});
      if (this.page_source === 'provider_checkin') {
        // this.waitlist_for.push ({id: this.customer_data.id, name: 'Self'});
        if (this.fromKiosk) {
          this.waitlist_for.push({ id: this.customer_data.id, name: this.customer_data.name });
        } else {
          this.waitlist_for.push({ id: this.customer_data.id, name: this.customer_data.userProfile.firstName + ' ' + this.customer_data.userProfile.lastName });
        }
      } else {
        // this.waitlist_for.push ({id: this.loggedinuser.id, name: 'Self'});
        this.waitlist_for.push({ id: this.loggedinuser.id, name: this.loggedinuser.firstName + ' ' + this.loggedinuser.lastName });
      }
    }
  }
  showCheckinButtonCaption() {
    let caption = '';
    caption = 'Confirm';
    return caption;
  }
  handleOneMemberSelect(id, name) {
    this.resetApi();
    this.waitlist_for = [];
    this.waitlist_for.push({ id: id, name: name });
  }
  handleMemberSelect(id, name, obj) {
    this.resetApi();
    if (this.waitlist_for.length === 0) {
      this.waitlist_for.push({ id: id, name: name });
    } else {
      let exists = false;
      let existindx = -1;
      for (let i = 0; i < this.waitlist_for.length; i++) {
        if (this.waitlist_for[i].id === id) {
          exists = true;
          existindx = i;
        }
      }
      if (exists) {
        this.waitlist_for.splice(existindx, 1);
      } else {
        if (this.ismoreMembersAllowedtopush()) {
          this.waitlist_for.push({ id: id, name: name });
        } else {
          obj.source.checked = false; // preventing the current checkbox from being checked
          if (this.maxsize > 1) {
            this.api_error = 'Only ' + this.maxsize + ' member(s) can be selected';
            this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
          } else if (this.maxsize === 1) {
            this.api_error = 'Only ' + this.maxsize + ' member can be selected';
            this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
          }
        }
      }
    }
  }
  ismoreMembersAllowedtopush() {
    if (this.maxsize > this.waitlist_for.length) {
      return true;
    } else {
      return false;
    }
  }
  isChecked(id) {
    let retval = false;
    if (this.waitlist_for.length > 0) {
      for (let i = 0; i < this.waitlist_for.length; i++) {
        if (this.waitlist_for[i].id === id) {
          retval = true;
        }
      }
    }
    return retval;
  }
  addMember() {
    this.resetApi();
    this.showCreateMember = true;
    // this.step = 4; // show add member section
    // this.main_heading = 'Add Family Member';
  }
  resetApi() {
    this.api_error = null;
    this.api_success = null;
  }
  handleReturnDetails(obj) {
    this.resetApi();
    this.addmemberobj.fname = obj.fname || '';
    this.addmemberobj.lname = obj.lname || '';
    this.addmemberobj.mobile = obj.mobile || '';
    this.addmemberobj.gender = obj.gender || '';
    this.addmemberobj.dob = obj.dob || '';
  }
  handleSaveMember() {
    this.resetApi();
    let derror = '';
    const namepattern = new RegExp(projectConstants.VALIDATOR_CHARONLY);
    const phonepattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
    const phonecntpattern = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
    const blankpattern = new RegExp(projectConstants.VALIDATOR_BLANK);
    if (!namepattern.test(this.addmemberobj.fname) || blankpattern.test(this.addmemberobj.fname)) {
      derror = 'Please enter a valid first name';
    }
    if (derror === '' && (!namepattern.test(this.addmemberobj.lname) || blankpattern.test(this.addmemberobj.lname))) {
      derror = 'Please enter a valid last name';
    }
    if (derror === '') {
      if (this.addmemberobj.mobile !== '') {
        if (!phonepattern.test(this.addmemberobj.mobile)) {
          derror = 'Phone number should have only numbers';
        } else if (!phonecntpattern.test(this.addmemberobj.mobile)) {
          derror = 'Enter a 10 digit mobile number';
        }
      }
    }
    if (derror === '') {
      const post_data = {
        'userProfile': {
          'firstName': this.addmemberobj.fname,
          'lastName': this.addmemberobj.lname
        }
      };
      if (this.addmemberobj.mobile !== '') {
        post_data.userProfile['primaryMobileNo'] = this.addmemberobj.mobile;
        post_data.userProfile['countryCode'] = '+91';
      }
      if (this.addmemberobj.gender !== '') {
        post_data.userProfile['gender'] = this.addmemberobj.gender;
      }
      if (this.addmemberobj.dob !== '') {
        post_data.userProfile['dob'] = this.addmemberobj.dob;
      }
      let fn;
      if (this.page_source === 'provider_checkin') {
        post_data['parent'] = this.customer_data.id;
        fn = this.shared_services.addProviderCustomerFamilyMember(post_data);
      } else {
        fn = this.shared_services.addMembers(post_data);
      }
      fn.subscribe(() => {
        this.api_success = this.sharedFunctionobj.getProjectMesssages('MEMBER_CREATED');
        this.getFamilyMembers();
        setTimeout(() => {
          this.handleGoBack(3);
        }, projectConstants.TIMEOUT_DELAY);
      },
        error => {
          this.api_error = error.error;
          this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
        });
    } else {
      this.api_error = derror;
      this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
    }
  }
  handleNote() {
    if (this.dispCustomernote) {
      this.dispCustomernote = false;
      this.selectedMessage = {
        files: [],
        base64: [],
        caption: []
      };
    } else {
      this.dispCustomernote = true;
    }
  }
  handleEmail() {
    if (this.dispCustomerEmail) {
      this.dispCustomerEmail = false;
    } else {
      this.dispCustomerEmail = true;
    }
  }
  calculateDate(days) {
    this.resetApi();
    const dte = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
    const newdate = new Date(date);
    newdate.setDate(newdate.getDate() + days);
    const dd = newdate.getDate();
    const mm = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const ndate1 = y + '-' + mm + '-' + dd;
    const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
    const strtDt1 = this.hold_sel_checkindate + ' 00:00:00';
    const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();
    const nDt = new Date(ndate);
    if (nDt.getTime() >= strtDt.getTime()) {
      this.sel_checkindate = ndate;
      this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    }
    const dt = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const dt1 = moment(dt, 'YYYY-MM-DD HH:mm').format();
    const date1 = new Date(dt1);
    const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
    const date2 = new Date(dt2);
    // if (this.sel_checkindate !== this.todaydate) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
    if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      this.isFuturedate = true;
    } else {
      this.isFuturedate = false;
    }
    const day1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const day = moment(day1, 'YYYY-MM-DD HH:mm').format();
    const ddd = new Date(day);
    this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));
  }
  disableMinus() {
    const seldate1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
    const seldate = new Date(seldate2);
    const selecttdate = new Date(seldate.getFullYear() + '-' + this.sharedFunctionobj.addZero(seldate.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(seldate.getDate()));
    const strtDt1 = this.hold_sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
    const strtDt = new Date(strtDt2);
    const startdate = new Date(strtDt.getFullYear() + '-' + this.sharedFunctionobj.addZero(strtDt.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(strtDt.getDate()));
    if (startdate >= selecttdate) {
      return true;
    } else {
      return false;
    }
  }
  getPartysizeDetails(domain, subdomain) {
    this.shared_services.getPartysizeDetails(domain, subdomain)
      .subscribe(data => {
        this.partysizejson = data;
        this.partySize = false;
        this.maxsize = 1;
        if (this.partysizejson.partySize) {
          this.partySize = true;
          this.maxsize = (this.partysizejson.maxPartySize) ? this.partysizejson.maxPartySize : 1;
        }
        if (this.partySize && !this.partysizejson.partySizeForCalculation) { // check whether partysize box is to be displayed to the user
          this.partySizeRequired = true;
        }
        if (this.partysizejson.partySizeForCalculation) { // check whether multiple members are allowed to be selected
          this.multipleMembers_allowed = true;
        }
      },
        () => {
        });
  }
  checkPartySize(pVal) {
    this.clearerrorParty();
    const error = this.validatorPartysize(pVal);
    if (error !== '') {
      this.partyapi_error = error;
    }
  }
  validatorPartysize(pVal) {
    this.resetApi();
    let errmsg = '';
    const numbervalidator = projectConstants.VALIDATOR_NUMBERONLY;
    this.enterd_partySize = pVal;
    if (!numbervalidator.test(pVal)) {
      errmsg = 'Please enter a valid party size';
    } else {
      if (pVal > this.maxsize) {
        errmsg = 'Sorry ... the maximum party size allowed is ' + this.maxsize;
      }
    }
    return errmsg;
  }
  clearerrorParty() {
    this.partyapi_error = '';
  }
  checkCouponExists(couponCode) {
    let found = false;
    for (let index = 0; index < this.selected_coupons.length; index++) {
      if (couponCode === this.selected_coupons[index]) {
        found = true;
        break;
      }
    }
    return found;
  }
  toggleterms(i) {
    if (this.couponsList[i].showme) {
      this.couponsList[i].showme = false;
    } else {
      this.couponsList[i].showme = true;
    }
  }
  removeJCoupon(i) {
    this.selected_coupons.splice(i, 1);
    this.couponsList.splice(i, 1);
  }
  removeCoupons() {
    this.selected_coupons = [];
    this.couponsList = [];
    this.coupon_status = null;
  }
  clearCouponErrors() {
    this.couponvalid = true;
    this.api_cp_error = null;
  }
  applyCoupons(jCoupon) {
    this.api_cp_error = null;
    this.couponvalid = true;
    const couponInfo = {
      'couponCode': '',
      'instructions': ''
    };
    if (jCoupon) {
      const jaldeeCoupn = jCoupon.trim();
      if (this.checkCouponExists(jaldeeCoupn)) {
        this.api_cp_error = 'Coupon already applied';
        this.couponvalid = false;
        return false;
      }
      this.couponvalid = false;
      let found = false;
      for (let couponIndex = 0; couponIndex < this.s3CouponsList.length; couponIndex++) {
        if (this.s3CouponsList[couponIndex].jaldeeCouponCode.trim() === jaldeeCoupn) {
          this.selected_coupons.push(this.s3CouponsList[couponIndex].jaldeeCouponCode);
          couponInfo.couponCode = this.s3CouponsList[couponIndex].jaldeeCouponCode;
          couponInfo.instructions = this.s3CouponsList[couponIndex].consumerTermsAndconditions;
          this.couponsList.push(couponInfo);
          found = true;
          this.selected_coupon = '';
          break;
        }
      }
      if (found) {
        this.couponvalid = true;
      } else {
        this.api_cp_error = 'Coupon invalid';
      }
    } else {
      this.api_cp_error = 'Enter a Coupon';
    }
  }
  getProviderDepart(id) {
    this.shared_services.getProviderDept(id).
      subscribe(data => {
        this.departmentlist = data;
        this.filterDepart = this.departmentlist.filterByDept;
        for (let i = 0; i < this.departmentlist['departments'].length; i++) {
          if (this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
            if (this.departmentlist['departments'][i].serviceIds.length !== 0) {
              this.departments.push(this.departmentlist['departments'][i]);
            }
          }
        }
        this.deptLength = this.departments.length;
        // this.selected_dept = 'None';
        if (this.deptLength !== 0) {
          this.selected_dept = this.departments[0].departmentId;
          this.handleDeptSelction(this.selected_dept);
        }
      });
  }
  handleDeptSelction(obj) {
    // this.sel_queue_id = 0;
    this.api_error = '';
    this.selected_dept = obj;
    if (obj === 'None') {
      this.servicesjson = this.serviceslist;
    } else {
      for (let i = 0; i < this.departmentlist['departments'].length; i++) {
        if (obj === this.departmentlist['departments'][i].departmentId) {
          this.services = this.departmentlist['departments'][i].serviceIds;
        }
      }
      const newserviceArray = [];
      if (this.services) {
        for (let i = 0; i < this.serviceslist.length; i++) {
          for (let j = 0; j < this.services.length; j++) {
            if (this.services[j] === this.serviceslist[i].id) {
              newserviceArray.push(this.serviceslist[i]);
            }
          }
        }
        this.servicesjson = newserviceArray;
      }
    }
    if (this.servicesjson.length > 0) {
      this.sel_ser = this.servicesjson[0].id;
      this.setServiceDetails(this.sel_ser);
      this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    } else {
      this.api_error = this.sharedFunctionobj.getProjectMesssages('NO_SERVICE_IN_DEPARTMENT');
      this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
    }
  }
  getServicebyLocationId(locid, pdate) {
    this.api_loading1 = true;
    this.resetApi();
    this.shared_services.getServicesByLocationId(locid)
      .subscribe(data => {
        this.serviceDatalist = data;
        this.servicesjson = data;
        this.serviceslist = data;
        this.sel_ser_det = [];
        if (this.servicesjson.length > 0) {
          this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
          // this.setServiceDetails(this.servicesjson[0]); // setting the details of the first service to the holding variable
          this.setServiceDetails(this.sel_ser); // setting the details of the first service to the holding variable
          this.getQueuesbyLocationandServiceId(locid, this.sel_ser, pdate, this.account_id);
        }
        this.api_loading1 = false;
      },
        () => {
          this.api_loading1 = false;
          this.sel_ser = '';
        });
  }
  getTravelMod(event) {
    this.trackMode = false;
    this.travelMode = event;
    if (event === 'DRIVING') {
      this.driving = true;
      this.walking = false;
      this.bicycling = false;
    } else if (event === 'WALKING') {
      this.walking = true;
      this.driving = false;
      this.bicycling = false;
    } else {
      this.walking = false;
      this.driving = false;
      this.bicycling = true;
    }
    this.saveLiveTrackTravelModeInfo().then(
      data => {
        this.api_loading = true;
        this.liveTrackMessage = this.sharedFunctionobj.getLiveTrackStatusMessage(data, this.activeWt.providerAccount.businessName, this.travelMode);
      },
      error => {
        this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
        this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.api_loading = false;
      });
  }
  getNotifyTime(time) {
    this.notifyTime = time;
  }
  filesSelected(event) {
    const input = event.target.files;
    if (input) {
      for (const file of input) {
        if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
          this.sharedFunctionobj.apiErrorAutoHide(this, 'Selected image type not supported');
        } else if (file.size > projectConstants.FILE_MAX_SIZE) {
          this.sharedFunctionobj.apiErrorAutoHide(this, 'Please upload images with size < 10mb');
        } else {
          this.selectedMessage.files.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedMessage.base64.push(e.target['result']);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
  deleteTempImage(index) {
    this.selectedMessage.files.splice(index, 1);
  }
  consumerNoteAndFileSave(uuid) {
    const dataToSend: FormData = new FormData();
    dataToSend.append('message', this.consumerNote);
    const captions = {};
    let i = 0;
    if (this.selectedMessage) {
      for (const pic of this.selectedMessage.files) {
        dataToSend.append('attachments', pic, pic['name']);
        captions[i] = 'caption';
        i++;
      }
    }
    const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
    dataToSend.append('captions', blobPropdata);
    this.shared_services.addConsumerWaitlistNote(this.account_id, uuid,
      dataToSend)
      .subscribe(
        () => {
        },
        error => {
          this.sharedFunctionobj.apiErrorAutoHide(this, error);
        }
      );
  }
  locationEnableDisable(event) {
    if (event.checked) {
      this.getCurrentLocation().then(
        (lat_long: any) => {
          this.lat_lng = lat_long;
          if (!this.firstTimeClick) {
            this.updateLiveTrackInfo().then(
              (liveTInfo) => {
                this.track_loading = false;
                this.liveTrackMessage = this.sharedFunctionobj.getLiveTrackStatusMessage(liveTInfo, this.activeWt.providerAccount.businessName, this.travelMode);
              }
            );
          } else {
            this.saveLiveTrackInfo().then(
              (liveTInfo) => {
                this.track_loading = false;
                this.firstTimeClick = false;
                this.liveTrackMessage = this.sharedFunctionobj.getLiveTrackStatusMessage(liveTInfo, this.activeWt.providerAccount.businessName, this.travelMode);
              }
            );
          }
        }, (error) => {
          this.api_error = 'You have blocked Jaldee from tracking your location. To use this, change your location settings in browser.';
          this.sharedFunctionobj.openSnackBar(this.api_error, { 'panelClass': 'snackbarerror' });
          this.shareLoc = false;
          this.track_loading = false;
        }
      );
    } else {
      this.shareLoc = false;
      this.updateLiveTrackInfo();
    }
  }

  notifyEvent(event) {
    if (event.checked) {
      this.notifyTime = 'ONEHOUR';
    } else {
      this.notifyTime = 'AFTERSTART';
    }
  }
  saveLiveTrackTravelModeInfo() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      const passdata = {
        'travelMode': _this.travelMode
      };
      _this.shared_services.updateTravelMode(_this.trackUuid, _this.account_id, passdata)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }
  saveLiveTrackInfo() {
    this.track_loading = true;
    const _this = this;
    return new Promise(function (resolve, reject) {
      const post_Data = {
        'jaldeeGeoLocation': {
          'latitude': _this.lat_lng.latitude,
          'longitude': _this.lat_lng.longitude
        },
        'travelMode': _this.travelMode,
        'waitlistPhoneNumber': _this.consumerPhoneNo,
        'jaldeeStartTimeMod': _this.notifyTime,
        'shareLocStatus': _this.shareLoc
      };
      _this.shared_services.addLiveTrackDetails(_this.trackUuid, _this.account_id, post_Data)
        .subscribe(
          data => {
            resolve(data);

          },
          () => {
            reject();
          }
        );
    });
  }
  trackClose(status) {
   if (this.tracking) {
    if (status === 'livetrack') {
      if (this.shareLoc) {
        this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('TRACKINGCANCELENABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
      } else {
        this.sharedFunctionobj.openSnackBar(this.sharedFunctionobj.getProjectMesssages('TRACKINGCANCELDISABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
      }
       }
       }
      this.dialogRef.close();
      this.router.navigate(['/']);
    
   
  }
  saveLiveTrackDetails() {
    this.track_loading = true;
    this.resetApi();
    this.updateLiveTrackInfo().then(
      data => {
        this.trackClose('livetrack');
        this.track_loading = false;
      },
      error => {
        this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
        this.sharedFunctionobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.api_loading = false;
      });
  }
  updateLiveTrackInfo() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      const post_Data = {
        'jaldeeGeoLocation': {
          'latitude': _this.lat_lng.latitude,
          'longitude': _this.lat_lng.longitude
        },
        'travelMode': _this.travelMode,
        'waitlistPhoneNumber': _this.consumerPhoneNo,
        'jaldeeStartTimeMod': _this.notifyTime,
        'shareLocStatus': _this.shareLoc
      };
      _this.shared_services.updateLiveTrackDetails(_this.trackUuid, _this.account_id, post_Data)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }
  // getDisplayboardCount() {
  //   let layout_list: any = [];
  //   this.provider_services.getDisplayboards()
  //     .subscribe(
  //       data => {
  //         layout_list = data;
  //         this.board_count = layout_list.length;
  //       });
  // }
  getAvailableTimeSlots(QStartTime, QEndTime, interval, edit?) {
    // const curTimeSub = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).subtract(interval, 'm');
    // const curTimeSubDt = moment(curTimeSub, 'YYYY-MM-DD HH:mm A').format(projectConstants.POST_DATE_FORMAT_WITHTIME_A);
    const nextTimeDt = this.sharedFunctionobj.getDateFromTimeString(moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION }), ['YYYY-MM-DD HH:mm A']).format('HH:mm A').toString());
    const _this = this;
    const filter = {};
    this.availableSlots = [];
    filter['queue-eq'] = _this.sel_queue_id;
    filter['location-eq'] = _this.sel_loc;
    filter['waitlistStatus-eq'] = 'arrived,checkedIn,done,started';
    let future = false;
    const waitlist_date = new Date(this.sel_checkindate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    waitlist_date.setHours(0, 0, 0, 0);
    if (today.valueOf() < waitlist_date.valueOf()) {
      future = true;
    }
    if (!edit) {
      this.apptTime = '';
    }
    const activeSlots = [];
    const allSlots = this.sharedFunctionobj.getTimeSlotsFromQTimings(interval, QStartTime, QEndTime);
    if (!future) {
      _this.provider_services.getTodayWaitlist(filter).subscribe(
        (waitlist: any) => {
          for (let i = 0; i < waitlist.length; i++) {
            if (waitlist[i]['appointmentTime']) {
              activeSlots.push(waitlist[i]['appointmentTime']);
            }
          }
          const slots = allSlots.filter(x => !activeSlots.includes(x));
          // for (let i = 0; i < slots.length; i++) {
          //   const slotTime = moment(this.sharedFunctionobj.getDateFromTimeString(slots[i])).format(projectConstants.POST_DATE_FORMAT_WITHTIME_A);
          //   if (curTimeSubDt <= slotTime) {
          //     this.availableSlots.push(slots[i]);
          //   }
          // }
          for (let i = 0; i < slots.length; i++) {
            const endTimeStr = moment(slots[i], ['HH:mm A']).format('HH:mm A').toString();
            const endDTime = this.sharedFunctionobj.getDateFromTimeString(endTimeStr);
            if (nextTimeDt <= endDTime) {
              this.availableSlots.push(slots[i]);
            }
          }
          if (!edit) {
            if (this.data.apptTime && this.data.queue.id === this.sel_queue_id) {
              this.apptTime = this.data.apptTime;
            } else {
              this.apptTime = this.availableSlots[0];
            }
          }
        }
      );
    } else {
      filter['date-eq'] = _this.sel_checkindate;
      _this.provider_services.getFutureWaitlist(filter).subscribe(
        (waitlist: any) => {
          for (let i = 0; i < waitlist.length; i++) {
            if (waitlist[i]['appointmentTime']) {
              activeSlots.push(waitlist[i]['appointmentTime']);
            }
          }
          const slots = allSlots.filter(x => !activeSlots.includes(x));
          this.availableSlots = slots;
          if (this.data.apptTime && this.data.queue.id === this.sel_queue_id) {
            this.apptTime = this.data.apptTime;
          } else {
            this.apptTime = this.availableSlots[0];
          }
        }
      );
    }
  }
  timeSelected(slot) {
    this.apptTime = slot;
    this.showEditView = false;
  }
  editClicked() {
    const selectedQ = this.queuejson.filter(x => (x.id === this.sel_queue_id));
    this.getAvailableTimeSlots(selectedQ[0].queueSchedule.timeSlots[0]['sTime'], selectedQ[0].queueSchedule.timeSlots[0]['eTime'], selectedQ[0].timeInterval, 'edit');
    this.showEditView = true;
  }
}
