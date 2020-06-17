
import {interval as observableInterval,  Observable , Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { KioskServices } from '../../services/kiosk-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-kiosk-home',
  templateUrl: './kiosk-home.component.html'
})
export class KioskHomeComponent implements OnInit, OnDestroy {
  @ViewChild('srchname', {static: false}) private srchname: ElementRef;
  @ViewChild('regmobile', {static: false}) private regmobile: ElementRef;
  @ViewChild('regfname', {static: false}) private regfname: ElementRef;
  @ViewChild('reglname', {static: false}) private reglname: ElementRef;

  welcome_cap = Messages.WELCOME_CAP;
  checkin_youself_cap = Messages.CHECKIN_YOURSELF_CAP;
  checkin_online_cap = Messages.CHECKIN_ONLINE_CAP;
  check_your_status_cap = Messages.CHECK_YOUR_STATUS_CAP;
  report_as_arrived_cap = Messages.REP_AS_ARRIVED_CAP;
  do_you_want_to_signup_cap = Messages.DO_YOU_WANT_TO_SIGNUP_CAP;
  marketing_text = Messages.MARKETING_TEXT;
  enter_your = Messages.ENTER_YOUR_CAP;
  mobile_no_cap = Messages.MOBILE_NUMBER_CAP;
  enter_first_letters_name = Messages.ENTER_FIR_LETTERS_CAP;
  first_last_name_cap = Messages.FIR_LAS_NAME_CAP;
  search_cap = Messages.SEARCH_CAP;
  oops_cap = Messages.OOPS_CAP;
  you_not_reg_cust_cap = Messages.LOOKS_NOT_REG_CUS_CAP;
  fill_det_to_reg_cap = Messages.FILL_YOUR_DET_CAP;
  first_name_cap = Messages.FIRST_NAME_CAP;
  last_name_cap = Messages.LAST_NAME_CAP;
  register_cap = Messages.REGISTER_CAP;
  back_to_search_cap = Messages.BACK_TO_SEARCH_CAP;
  home_cap = Messages.HOME_CAP;
  checkin_youeself_cap = Messages.CHECKIN_YOURSELF_CAP;
  exit_cap = Messages.EXIT_CAP;
  not_auth_to_view_page = Messages.SORRY_NOT_AUTH_TO_VIEW_PAGE;

  provider_loggedin = false;
  reg_mobile = '';
  srch_fname = '';
  reg_fname = '';
  reg_lname = '';
  userdet;
  ctype;
  customer_found = false;
  customerDet: any = [];
  customerDispDet = {
    id: '',
    name: ''
  };
  blankPattern;
  namePattern;
  phonePattern;
  numberpattern;
  cMod;
  loadingNow;
  terminologies: any = [];
  loclist: any = [];
  todaylist: any = [];
  showsearch_now = false;
  show_customernotfoundmsg = false;
  show_customerRegister = false;
  loccationId;
  locationName;
  query_executed = false;
  data;
  bprofile: any = [];
  provider_id;
  provider_bussiness_id;
  provider_name;
  next_avail_queue: any = [];
  waitlisttime_arr: any = [];
  waitlistmngr;
  kiosk_loading = true;
  showregmobile = false;
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
  apprxwaitingCaption = Messages.APPX_WAIT_TIME_CAPTION;
  subscription: Subscription;
  server_date;

  constructor(private kiosk_services: KioskServices,
    public shared_functions: SharedFunctions,
    public provider_datastorage: CommonDataStorageService,
    private router: Router,
    @Inject(DOCUMENT) public document
  ) { }

  ngOnInit() {
    this.server_date = this.shared_functions.getitemfromLocalStorage('sysdate');
    this.getWaitlistManager();
    this.blankPattern = projectConstants.VALIDATOR_BLANK;
    this.phonePattern = projectConstants.VALIDATOR_PHONENUMBERCOUNT10;
    this.namePattern = projectConstants.VALIDATOR_CHARONLY;
    this.numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
    this.customer_found = false;
    this.customerDet = [];
    this.customerDispDet.id = '';
    this.customerDispDet.name = '';
    this.getUserdetails();
    this.loadingNow = false;
    this.cMod = 'main';
    this.ctype = this.shared_functions.isBusinessOwner('returntyp');
    // this.getInboxUnreadCnt();
    // Section which handles the periodic reload
    if (this.ctype === 'provider') {
      this.subscription = observableInterval(5 * 1000).subscribe(() => {
        this.checkloggedIn();
      });
    } else {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
    // this.shared_functions.checkLogin()
  }
  checkloggedIn() {
    if (!this.shared_functions.checkLogin()) {
      this.router.navigate(['/']);
    }
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler() {
    // event.returnValue = false;
  }
  getTerminologies() {
    this.kiosk_services.getTerminoligies(this.userdet.sector, this.userdet.subSector)
      .subscribe(data => {
        this.terminologies = data;
        this.provider_datastorage.set('terminologies', this.terminologies);
      },
        () => {

        });
  }
  getUserdetails() {
    this.userdet = this.shared_functions.getitemFromGroupStorage('ynw-user');
    if (this.userdet) {
      if (this.shared_functions.checkLogin()) {
        this.ctype = this.shared_functions.isBusinessOwner('returntyp');
        if (this.userdet.isProvider === true) {
          this.provider_loggedin = true;
          this.getTerminologies();
        } else {
          this.provider_loggedin = false;
        }
      }
      this.getLocationId();
    }
  }
  getLocationId() {
    if (this.shared_functions.getitemFromGroupStorage('provider_selected_location')) { // check whether the location is there in cookie
      this.loccationId = this.shared_functions.getitemFromGroupStorage('provider_selected_location');
      this.getLocationDetails(this.loccationId);
    } else { // this is to take care of the situation where location id is not there in the cookie
      this.kiosk_services.getProviderLocations()
        .subscribe(data => {
          this.loclist = data;
          if (this.loclist.length > 0) {
            this.loccationId = this.loclist[0].id;
            this.locationName = this.loclist[0].place;
            this.getBprofile();
          }
        },
          error => {
            this.shared_functions.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
          });
    }
  }
  getLocationDetails(id) {
    this.kiosk_services.getLocationDetail(id)
      .subscribe(data => {
        this.locationName = data['place'];
        this.getBprofile();
      },
        () => {

        });
  }
  getBprofile() {
    this.kiosk_services.getBussinessProfile()
      .subscribe(
        data => {
          this.bprofile = data;
          this.provider_id = this.bprofile.uniqueId;
          this.provider_bussiness_id = this.bprofile.id;
          this.provider_name = this.bprofile.businessName;
          const prov_loc = this.provider_bussiness_id + '-' + this.loccationId;
          this.getWaitingTime(prov_loc);
        },
        () => {

        }
      );
  }

  getWaitingTime(provid_locid) {
    if (provid_locid !== '') {
      this.kiosk_loading = true;
      if (provid_locid.length === 0) {
        return;
      }
      this.kiosk_services.getEstimatedWaitingTime(provid_locid)
        .subscribe(data => {
          this.waitlisttime_arr = data;
          this.kiosk_loading = false;
          if (this.waitlisttime_arr === '"Account doesn\'t exist"') {
            this.waitlisttime_arr = [];
          }
          const todaydt = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
          const today = new Date(todaydt);
          // const today = new Date(this.server_date.split(' ')[0]);
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
            if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
              this.next_avail_queue['cdate'] = this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
              this.next_avail_queue['queue_available'] = 1;
              cdate = new Date(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
              this.next_avail_queue['opennow'] = this.waitlisttime_arr[i]['nextAvailableQueue']['openNow'];
              // if (this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'] !== dtoday) {
              // if (cdate.getTime() !== check_dtoday.getTime()) {
                if (!this.next_avail_queue['opennow']) {
                this.next_avail_queue['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
                // this.next_avail_queue['isFuture'] = 1;
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  this.next_avail_queue['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                } else {
                  this.next_avail_queue['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], { 'rettype': 'monthname' })
                    + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                }
              } else {
                this.next_avail_queue['caption'] = this.apprxwaitingCaption; // 'Appox Waiting Time';
                // this.next_avail_queue['isFuture'] = 2;
                if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                  this.next_avail_queue['time'] = this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
                } else {
                  this.next_avail_queue['caption'] = this.nextavailableCaption + ' '; // 'Next Availale Time';
                  this.next_avail_queue['time'] = 'Today, ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
                }
              }
            } else {
              this.next_avail_queue['queue_available'] = 0;
            }
            if (this.waitlisttime_arr[i]['message']) {
              this.next_avail_queue['message'] = this.waitlisttime_arr[i]['message'];
            }
          }
        });
    }
  }

  getParametersforCheckin() {
    const curdate = this.next_avail_queue['cdate'];
    const checkIndata = {
      type: 'provider',
      is_provider: true,
      moreparams: {
        source: 'provider_checkin',
        bypassDefaultredirection: 1,
        provider: {
          unique_id: this.provider_id,
          account_id: this.provider_bussiness_id,
          name: this.provider_name
        },
        location: {
          id: this.loccationId,
          name: this.locationName
        },
        sel_date: curdate
      },
      datechangereq: true,
      fromKiosk: true,
      customer_data: {
        id: this.customerDispDet.id,
        name: this.customerDispDet.name
      }
    };
    return checkIndata;
  }
  handleCheckinReturn(retdata) {
    if (retdata === 'reloadlist') {
      this.showMode('main');
    }
  }

  searchCustomer() {
    if (!this.numberpattern.test(this.reg_mobile)) {
      if (!this.reg_mobile) {
        this.shared_functions.openSnackBar('Please enter your mobile number', { 'panelClass': 'snackbarerror' });
      } else {
        this.shared_functions.openSnackBar('Mobile number can have only numbers', { 'panelClass': 'snackbarerror' });
        if (this.regmobile.nativeElement) {
          this.regmobile.nativeElement.focus();
        }
      }
      return false;
    }
    if (!this.phonePattern.test(this.reg_mobile)) {
      this.shared_functions.openSnackBar('Enter a 10 digit mobile number', { 'panelClass': 'snackbarerror' });
      if (this.regmobile.nativeElement) {
        this.regmobile.nativeElement.focus();
      }
      return false;
    }
    if (this.blankPattern.test(this.srch_fname) || this.srch_fname.length < 3) {
      this.shared_functions.openSnackBar('Please enter atleast the first 3 letters of your First/Last Name', { 'panelClass': 'snackbarerror' });
      if (this.srchname.nativeElement) {
        this.srchname.nativeElement.focus();
      }
      return false;
    }
    if (!this.namePattern.test(this.srch_fname)) {
      this.shared_functions.openSnackBar('Name should contain only characters', { 'panelClass': 'snackbarerror' });
      if (this.srchname.nativeElement) {
        this.srchname.nativeElement.focus();
      }
      return false;
    }

    const data = {
      'firstName-eq': this.srch_fname,
      'lastName-eq': this.srch_fname,
      'primaryMobileNo-eq': this.reg_mobile

    };
    this.customer_found = false;
    this.show_customernotfoundmsg = false;
    this.loadingNow = true;
    this.kiosk_services.getCustomer(data)
      .subscribe(rdata => {
        this.customerDet = rdata;
        if (this.customerDet.length > 0) { // case if searched customer exists
          this.customer_found = true;
          this.customerDispDet.id = this.customerDet[0].id;
          this.customerDispDet.name = this.customerDet[0].userProfile.firstName + ' ' + this.customerDet[0].userProfile.lastName;
          if (this.cMod === '') {
            this.cMod = 'main';
          }
          this.srch_fname = '';
          this.reg_mobile = '';
          this.loadingNow = false;
          this.do_operation();
        } else { // case if searched customer does not exists, so show the "Not found" page
          this.reg_fname = this.srch_fname;
          this.show_customernotfoundmsg = true;
          this.showsearch_now = false;
          this.loadingNow = false;
          this.showRegister();
        }
      },
        error => {
          this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          this.loadingNow = false;
        });
  }

  showMode(val) {
    this.showregmobile = false;
    this.cMod = val;
    this.srch_fname = '';
    this.reg_mobile = '';
    this.reg_fname = '';
    this.reg_lname = '';
    this.reg_mobile = '';
    this.show_customernotfoundmsg = false;
    this.show_customerRegister = false;
    this.showsearch_now = false;
    if (this.cMod !== 'main') {
      if (!this.customer_found) {
        this.showsearch_now = true;
        setTimeout(() => {
          if (this.document.getElementById('regmobilebox')) {
            this.document.getElementById('regmobilebox').focus();
          }
        }, 500);
      } else {
        this.do_operation();
      }
    } else {
      this.showsearch_now = false;
    }
  }
  do_operation() {
    if (this.cMod === 'checkin') {
      this.shared_functions.sendMessage({ ttype: 'checkin', action: false });
    } else if (this.cMod === 'arrived') {
      this.shared_functions.sendMessage({ ttype: 'checkstat', action: false });
    } else {
      this.shared_functions.sendMessage({ ttype: '', action: false });
    }
    switch (this.cMod) {
      case 'status':
        this.getwaitlistForToday(); // get the waitlist entry for today for current consumer
        break;
      case 'arrived':
        // this.getwaitlistForToday('checkedIn'); // get the waitlist entry for today for current consumer
        this.getwaitlistForToday(); // get the waitlist entry for today for current consumer
        break;
    }
  }
  getwaitlistForToday(stat?) {
    const params = {
      consumerid: this.customerDispDet.id,
      locationid: this.loccationId,
      waitliststatus: stat
    };
    this.query_executed = false;
    this.kiosk_services.getTodayWaitlist(params)
      .subscribe(data => {
        this.todaylist = data;
        this.query_executed = true;
      },
        () => {

        });
  }
  getpassedinDetails() {
    const passedData = {
      userdet: this.customerDet,
      mod: this.cMod,
      waitlist: this.todaylist
    };
    return passedData;
  }
  logOff() {
    this.shared_functions.sendMessage({ ttype: '', action: false });
    this.showregmobile = false;
    this.customer_found = false;
    this.show_customernotfoundmsg = false;
    this.show_customerRegister = false;
    this.loadingNow = false;
    this.customerDet = [];
    this.showMode('main');
  }
  showRegister() {
    this.show_customernotfoundmsg = false;
    this.show_customerRegister = true;
    this.reg_fname = this.srch_fname;
    this.reg_lname = '';
  }
  registerCustomer() {
    let curmobile = '';
    if (this.showregmobile) {
      if (!this.numberpattern.test(this.reg_mobile)) {
        if (!this.reg_mobile) {
          this.shared_functions.openSnackBar('Please enter your mobile number', { 'panelClass': 'snackbarerror' });
        } else {
          this.shared_functions.openSnackBar('Mobile number can have only numbers', { 'panelClass': 'snackbarerror' });
          if (this.regmobile.nativeElement) {
            this.regmobile.nativeElement.focus();
          }
        }
        return false;
      }
      if (!this.phonePattern.test(this.reg_mobile)) {
        this.shared_functions.openSnackBar('Enter a 10 digit mobile number', { 'panelClass': 'snackbarerror' });
        if (this.regmobile.nativeElement) {
          this.regmobile.nativeElement.focus();
        }
        return false;
      }
      curmobile = this.reg_mobile;
    } else {
      curmobile = this.reg_mobile;
    }
    if (this.blankPattern.test(this.reg_fname) || !this.namePattern.test(this.reg_fname)) {
      this.shared_functions.openSnackBar('Please enter a valid first name', { 'panelClass': 'snackbarerror' });
      if (this.regfname.nativeElement) {
        this.regfname.nativeElement.focus();
      }
      return false;
    }
    if (this.blankPattern.test(this.reg_lname) || !this.namePattern.test(this.reg_lname)) {
      this.shared_functions.openSnackBar('Please enter a valid last name', { 'panelClass': 'snackbarerror' });
      if (this.reglname.nativeElement) {
        this.reglname.nativeElement.focus();
      }
      return false;
    }
    const postData = {
      'userProfile': {
        'firstName': this.reg_fname,
        'lastName': this.reg_lname,
        'primaryMobileNo': curmobile
      }
    };
    this.loadingNow = true;
    this.kiosk_services.createProviderCustomer(postData)
      .subscribe((data: any) => {
        const retdata = data;
        this.customer_found = true;
        this.show_customerRegister = false;
        this.customerDispDet.id = retdata;
        this.customerDispDet.name = this.reg_fname + ' ' + this.reg_lname;
        this.reg_fname = '';
        this.reg_lname = '';
        this.srch_fname = '';
        this.reg_mobile = '';
        this.loadingNow = false;
        if (this.showregmobile) { // case if reached here by clicking the signu link
          this.showMode('main');
        } else {
          this.do_operation();
        }
        // this.showMode(this.cMod);
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.loadingNow = false;
        });
  }
  showSearchNow() {
    this.showregmobile = false;
    this.show_customerRegister = false;
    this.show_customernotfoundmsg = false;
    this.showsearch_now = true;
    setTimeout(function () {
      if (this.regmobile !== undefined) {
        if (this.regmobile.nativeElement) {
          this.regmobile.nativeElement.focus();
        }
      }
    }, 5000);
  }
  arrivedReturn(passedinData) {
    this.kiosk_services.changeWaitlistStatus(passedinData.uuid, passedinData.action)
      .subscribe(() => {
        this.do_operation();
        this.shared_functions.openSnackBar('Arrival Confirmed');
      }, error => {
        this.shared_functions.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
      });
  }
  showSignup() {
    this.cMod = '';
    this.show_customernotfoundmsg = true;
    this.showsearch_now = false;
    this.loadingNow = false;
    this.showregmobile = true;
    this.showRegister();
  }

  getWaitlistManager() {
    this.kiosk_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistmngr = data;
      },
        () => {
        });
  }
}
