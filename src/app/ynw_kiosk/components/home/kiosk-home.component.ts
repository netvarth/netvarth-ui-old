
import {interval as observableInterval,  Subscription, SubscriptionLike as ISubscription ,  Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


import { KioskServices } from '../../services/kiosk-services.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-kiosk-home',
  templateUrl: './kiosk-home.component.html'
})
export class KioskHomeComponent implements OnInit, OnDestroy {
 @ViewChild ('srchmobile') private srchmob: ElementRef;
 @ViewChild ('srchname') private srchname: ElementRef;

 @ViewChild ('regmobile') private regmobile: ElementRef;
 @ViewChild ('regfname') private regfname: ElementRef;
 @ViewChild ('reglname') private reglname: ElementRef;
  provider_loggedin = false;
  srch_mobile = '';
  srch_fname = '';
  reg_mobile = '';
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

  constructor(private kiosk_services: KioskServices,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public provider_datastorage: CommonDataStorageService,
    private dialog: MatDialog, private router: Router,
    @Inject(DOCUMENT) public document
    ) {}

  ngOnInit() {
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
      this.subscription = observableInterval(5 * 1000).subscribe(x => {
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
    console.log('checkedIn check');
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
  getTerminologies() {
    this.kiosk_services.getTerminoligies(this.userdet.sector, this.userdet.subSector)
    . subscribe (data => {
      this.terminologies = data;
      this.provider_datastorage.set('terminologies', this.terminologies);
      // console.log(this.terminologies);
    },
    error => {

    });
  }
  getUserdetails() {
    this.userdet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    if (this.userdet)  {
       // console.log(this.userdet);
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
    if (this.shared_functions.getItemOnCookie('provider_selected_location1')) { // check whether the location is there in cookie
      this.loccationId = this.shared_functions.getItemOnCookie('provider_selected_location');
      this.getLocationDetails(this.loccationId);
    } else { // this is to take care of the situation where location id is not there in the cookie
      this.kiosk_services.getProviderLocations()
        .subscribe (data => {
          this.loclist = data;
          if (this.loclist.length > 0) {
            this.loccationId = this.loclist[0].id;
            this.locationName = this.loclist[0].place;
            this.getBprofile();
          }
        },
          error => {
            this.shared_functions.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
          });
    }
  }
  getLocationDetails(id) {
    this.kiosk_services.getLocationDetail(id)
      .subscribe (data => {
        this.locationName = data['place'];
        this.getBprofile();
      },
      error => {

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
        error => {

        }
      );
  }

  getWaitingTime(provid_locid) {
    if (provid_locid !== '') {
      this.kiosk_loading = true;
    this.kiosk_services.getEstimatedWaitingTime(provid_locid)
      .subscribe (data => {
        // console.log('waitingtime api', data);
        this.waitlisttime_arr = data;
        this.kiosk_loading = false;
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
        const check_dtoday = new Date(dtoday);
        let cdate = new Date();
        for (let i = 0; i < this.waitlisttime_arr.length; i++) {
          if (this.waitlisttime_arr[i].hasOwnProperty('nextAvailableQueue')) {
            this.next_avail_queue['cdate'] = this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'];
            this.next_avail_queue['queue_available'] = 1;
            cdate = new Date(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate']);
            // if (this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'] !== dtoday) {
            if (cdate.getTime() !== check_dtoday.getTime()) {
              this.next_avail_queue['caption'] = this.nextavailableCaption + ' '; // 'Next Available Time ';
              this.next_avail_queue['isFuture'] = 1;
              if (this.waitlisttime_arr[i]['nextAvailableQueue'].hasOwnProperty('queueWaitingTime')) {
                this.next_avail_queue['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                  + ', ' + this.shared_functions.convertMinutesToHourMinute(this.waitlisttime_arr[i]['nextAvailableQueue']['queueWaitingTime']);
              } else {
                this.next_avail_queue['time'] = this.shared_functions.formatDate(this.waitlisttime_arr[i]['nextAvailableQueue']['availableDate'], {'rettype': 'monthname'})
                + ', ' + this.waitlisttime_arr[i]['nextAvailableQueue']['serviceTime'];
              }
            } else {
              this.next_avail_queue['caption'] = this.apprxwaitingCaption; // 'Appox Waiting Time';
              this.next_avail_queue['isFuture'] = 2;
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
        // console.log('available queue', this.next_avail_queue);
      });
    }
  }

  getParametersforCheckin() {
    const curdate = this.next_avail_queue['cdate'];
    const checkIndata = {
                  type : 'provider',
                  is_provider : true,
                  moreparams: { source: 'provider_checkin',
                                bypassDefaultredirection: 1,
                                provider: {
                                            unique_id: this.provider_id,
                                            account_id: this.provider_bussiness_id,
                                            name: this.provider_name},
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
   // console.log('checindata get', checkIndata);
    return checkIndata;
  }
  handleCheckinReturn(retdata) {
    // console.log('kiosk return checkin', retdata);
    if (retdata === 'reloadlist') {
      this.showMode('main');
    }
  }

  searchCustomer() {
    if (!this.numberpattern.test(this.srch_mobile)) {
      this.shared_functions.openSnackBar('Phone number can have only numbers', {'panelClass': 'snackbarerror'});
      if (this.srchmob.nativeElement) {
        this.srchmob.nativeElement.focus();
      }
      return false;
    }
    if (!this.phonePattern.test(this.srch_mobile)) {
      this.shared_functions.openSnackBar('Phone number should have 10 digits', {'panelClass': 'snackbarerror'});
      if (this.srchmob.nativeElement) {
        this.srchmob.nativeElement.focus();
      }
      return false;
    }
    if (this.blankPattern.test(this.srch_fname) || this.srch_fname.length < 3) {
      this.shared_functions.openSnackBar('Please enter atleast the first 3 letters of your First/Last Name', {'panelClass': 'snackbarerror'});
      if (this.srchname.nativeElement) {
        this.srchname.nativeElement.focus();
      }
      return false;
    }
    if ( !this.namePattern.test(this.srch_fname)) {
      this.shared_functions.openSnackBar('Name should contain only characters', {'panelClass': 'snackbarerror'});
      if (this.srchname.nativeElement) {
        this.srchname.nativeElement.focus();
      }
      return false;
    }

    const data = {
      'firstName-eq': this.srch_fname,
      'lastName-eq': this.srch_fname,
      'primaryMobileNo-eq': this.srch_mobile

    };
    this.customer_found = false;
    this.show_customernotfoundmsg = false;
    this.loadingNow = true;
    this.kiosk_services.getCustomer(data)
      .subscribe (rdata => {
          // console.log('returned', rdata);
          this.customerDet = rdata;
          if (this.customerDet.length > 0) { // case if searched customer exists
            this.customer_found = true;
            this.customerDispDet.id = this.customerDet[0].id;
            this.customerDispDet.name = this.customerDet[0].userProfile.firstName + ' ' + this.customerDet[0].userProfile.lastName;
            if (this.cMod === '') {
              this.cMod = 'main';
            }
            this.srch_fname = '';
            this.srch_mobile = '';
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
        this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), {'panelClass': 'snackbarerror'});
        this.loadingNow = false;
      });
  }

  showMode(val) {
    this.showregmobile = false;
    this.cMod = val;
    this.srch_fname = '';
    this.srch_mobile = '';
    this.reg_fname = '';
    this.reg_lname = '';
    this.reg_mobile = '';
    this.show_customernotfoundmsg = false;
    this.show_customerRegister = false;
    this.showsearch_now = false;
    // console.log('cmod', this.cMod);
    if (this.cMod !== 'main') {
      if (!this.customer_found) {
        this.showsearch_now = true;
        setTimeout(() => {
          if (this.document.getElementById('srchmobilebox')) {
            this.document.getElementById('srchmobilebox').focus();
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
   // console.log('reached here');
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
      .subscribe (data => {
        this.todaylist = data;
        this.query_executed = true;
       // console.log('today list', this.todaylist);
      },
      error => {

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
      if (!this.phonePattern.test(this.reg_mobile)) {
        this.shared_functions.openSnackBar('Phone number should have 10 digits', {'panelClass': 'snackbarerror'});
        if (this.regmobile.nativeElement) {
          this.regmobile.nativeElement.focus();
        }
        return false;
      }
      curmobile = this.reg_mobile;
    } else {
      curmobile = this.srch_mobile;
    }
    if (this.blankPattern.test(this.reg_fname) || !this.namePattern.test(this.reg_fname)) {
      this.shared_functions.openSnackBar('Please enter a valid first name', {'panelClass': 'snackbarerror'});
      if (this.regfname.nativeElement) {
        this.regfname.nativeElement.focus();
      }
      return false;
    }
    if (this.blankPattern.test(this.reg_lname)  || !this.namePattern.test(this.reg_lname)) {
      this.shared_functions.openSnackBar('Please enter a valid last name', {'panelClass': 'snackbarerror'});
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
      .subscribe ((data: any) => {
        // console.log('returned', data);
        const retdata = data;
        // console.log('retdata', retdata);
        this.customer_found = true;
        this.show_customerRegister = false;
        this.customerDispDet.id = retdata;
        this.customerDispDet.name = this.reg_fname + ' ' + this.reg_lname;
        this.reg_fname = '';
        this.reg_lname = '';
        this.srch_fname = '';
        this.srch_mobile = '';
        this.loadingNow = false;
        if (this.showregmobile) { // case if reached here by clicking the signu link
          this.showMode('main');
        } else {
          this.do_operation();
        }
        // this.showMode(this.cMod);
      },
    error => {
      this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
      this.loadingNow = false;
    });
  }
  showSearchNow() {
    this.showregmobile = false;
    this.show_customerRegister = false;
    this.show_customernotfoundmsg = false;
    this.showsearch_now = true;
    setTimeout(function() {
      if (this.srchmob !== undefined) {
        if (this.srchmob.nativeElement) {
          this.srchmob.nativeElement.focus();
        }
      }
    }, 5000);
  }
  arrivedReturn(passedinData) {
   // console.log('arrived', passedinData);
    this.kiosk_services.changeWaitlistStatus(passedinData.uuid, passedinData.action)
      .subscribe (data => {
        // console.log('status change', data);
        this.do_operation();
        this.shared_functions.openSnackBar ('Arrival Confirmed');
      }, error => {
          this.shared_functions.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
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
      .subscribe ( data => {
        this.waitlistmngr = data;
        // console.log('waitlist', this.waitlistmngr);
      },
      error => {

      });
  }

}
