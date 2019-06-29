import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, EventEmitter, Input, Output, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { SharedServices } from '../../services/shared-services';
import { MatDialog } from '@angular/material';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { SignUpComponent } from '../../components/signup/signup.component';
import { LoginComponent } from '../../components/login/login.component';
import { SearchFields } from '../../modules/search/searchfields';
import { projectConstants } from '../../constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Input() headerTitle: string;
  @Input() includedfrom: string;
  @Input() passedDomain: string;
  @Input() passedkwdet: any = [];
  @Input() passedRefine: any = [];
  @Output() searchclick = new EventEmitter<any>();
  @Output() scrollhideclass = new EventEmitter<any>();
  sign_in_cap = Messages.SIGN_IN_CAP;
  join_cap = Messages.JOIN_CAP;
  are_you_ser_pro = Messages.ARE_YOU_SER_PRO_CAP;
  click_here_cap = Messages.CLICK_HERE_CAP;
  user_profile = Messages.USER_PROF_CAP;
  change_password = Messages.CHANGE_PASSWORD_CAP;
  change_mobile = Messages.CHANGE_MOB_CAP;
  add_change_email = Messages.ADD_CHANGE_EMAIL;
  switch_to_consumer = Messages.SWITCH_TO_CONSUMER;
  switch_to_provider = Messages.SWITCH_TO_PROVIDER;
  logout_cap = Messages.LOGOUT_CAP;
  help_cap = Messages.HELP_CAP;
  upgrade_cap = Messages.UPGRADE_CAP;
  membership_cap = Messages.MEMBERSHIP_CAP;
  close_btn = Messages.CLOSE_BTN;
  dashboard_cap = Messages.DASHBOARD_TITLE;
  create_pro_accnt = Messages.CREATE_PRO_ACCNT;
  family_members = Messages.FAMILY_MEMBERS;
  cronHandle: Subscription;
  cronStarted;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  settings;
  adjustdialogRef;
  notedialogRef;
  addnotedialogRef;
  billdialogRef;
  viewbilldialogRef;
  makPaydialogRef;
  sendmsgdialogRef;
  screenWidth;
  isCheckin;
  small_device_display = false;
  show_small_device_queue_display = false;
  returnedFromCheckDetails = false;
  breadcrumb_moreoptions: any = [];
  apis_loaded = false;
  breadcrumbs_init = [
    {
      title: Messages.DASHBOARD_TITLE,
      url: '/' + this.shared_functions.isBusinessOwner('returntyp')
    }
  ];
  noFilter = true;
  arr: any = [];
  breadcrumbs = this.breadcrumbs_init;
  server_date;
  isServiceBillable = true;
  subscription: Subscription;
  userdet: any = [];
  headercls = '';
  provider_loggedin = false;
  consumer_loggedin = false;
  curPgurl = '';
  evnt;
  bname;
  license_message = '';
  bsector = '';
  bsubsector = '';
  blogo = '';
  inboxUnreadCnt;
  inboxCntFetched;
  showmobileSubmenu = false;
  showlocation = false;
  @Input() moreOptions: any = [];
  urls_class = [
    { url: '\/provider\/bwizard', class: 'itl-steps' },
    { url: '\/provider\/settings\/.+', class: 'dashb' },
    { url: null, class: 'dashb' },
  ];
  isprovider = false;
  ctype;
  active_license;
  public searchfields: SearchFields = new SearchFields();
  locationholder = { 'autoname': '', 'name': '', 'lat': '', 'lon': '', 'typ': '' };
  keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': '' };
  selected_domain = '';
  avoidClear = 1;
  upgradablepackages: any = [];
  main_loading = false;
  inboxiconTooltip = '';
  custsignTooltip = '';
  provsignTooltip = '';
  api_error = null;
  showLearnMore = false;
  passedDet = {};
  screenHeight;
  hideMenu = false;
  qAvailability;
  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public router: Router,
    private _scrollToService: ScrollToService,
    public shared_service: SharedServices,
  ) {
    this.onResize();
    /*router.events.subscribe((val) => {
       if (val['url']) {
         this.curPgurl = val['url'];
         this.handleHeaderclassbasedonURL();
       }
    }
   });*/

    this.evnt = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleHeaderclassbasedonURL();
      }
    });
    // subscribe to home component messages
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'updateuserdetails':
          this.getUserdetails();
          this.handleHeaderclassbasedonURL();
          break;
        case 'upgradelicence':
          this.setLicense();
          this.getUpgradablePackages();
          break;
        case 'main_loading':
          this.main_loading = message.action || false;
          break;
        case 'load_unread_count':
          if (!message.action) {
            this.getInboxUnreadCnt();
          } else if (message.action === 'setzero') {
            this.inboxUnreadCnt = 0;
            this.inboxCntFetched = true;
          }
          break;
        case 'learn_more':
          this.showLearnMore = true;
          // this.scrollhideclass.emit(true);
          this.scrollhideclass.emit(false);
          this.passedDet = { 'mainKey': message.target.scrollKey, 'subKey': message.target.subKey };
          break;
        case 'instant_q':
          this.qAvailability = message.qAvailability;
          break;
      }
      /*if (message.ttype === 'updateuserdetails') {
        this.getUserdetails();
        this.handleHeaderclassbasedonURL();
      }*/
      this.getBusinessdetFromLocalstorage();
    });

  }
  hideLearnmore() {
    this.showLearnMore = false;
    this.scrollhideclass.emit(false);
  }

  ngOnInit() {
    this.inboxiconTooltip = this.shared_functions.getProjectMesssages('INBOXICON_TOOPTIP');
    this.custsignTooltip = this.shared_functions.getProjectMesssages('CUSTSIGN_TOOPTIP');
    this.provsignTooltip = this.shared_functions.getProjectMesssages('PROVSIGN_TOOPTIP');
    this.getUserdetails();
    this.setLicense();
    this.getBusinessdetFromLocalstorage();
    // this.handleHeaderclassbasedonURL();
    this.isprovider = this.shared_functions.isBusinessOwner();
    this.ctype = this.shared_functions.isBusinessOwner('returntyp');
    this.inboxCntFetched = false;
    // this.getInboxUnreadCnt();

    // Section which handles the periodic reload
    if (this.ctype === 'consumer' || this.ctype === 'provider') {
      this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(() => {
        this.reloadHandler();
      });
    } else {
      if (this.cronHandle) {
        this.cronHandle.unsubscribe();
      }
    }
    if (this.ctype === 'provider') {
    this.isAvailableNow();
    this.getLicenseDetails();
    }
  }
  getLicenseDetails(call_type = 'init') {
    this.license_message = '';
    this.shared_service.getLicenseDetails()
      .subscribe(data => {
        if (data['accountLicense'] && data['accountLicense']['type'] === 'Trial') {
          const start_date = (data['accountLicense']['dateApplied']) ? moment(data['accountLicense']['dateApplied']) : null;
          const end_date = (data['accountLicense']['expiryDate']) ? moment(data['accountLicense']['expiryDate']) : null;
          let valid_till = 0;
          if (start_date != null && end_date != null) {
            valid_till = end_date.diff(start_date, 'days');
            valid_till = (valid_till < 0) ? 0 : valid_till;
          }
          this.license_message = ' on ' + end_date.format('ll');
        }
      });
  }

  setLicense() {
    const cuser = this.shared_functions.getitemfromLocalStorage('ynw-user');
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    if (cuser && usertype === 'provider') {
      if (cuser.new_lic) {
        this.active_license = cuser.new_lic;
      } else {
        this.active_license = cuser.accountLicenseDetails.accountLicense.displayName;
      }
    }
  }
  showHidemobileSubMenu() {
    if (this.showmobileSubmenu) {
      this.showmobileSubmenu = false;
    } else {
      this.showmobileSubmenu = true;
    }
  }
  ngOnDestroy() {
    this.evnt.unsubscribe();
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
  }
  reloadHandler() { // this is the function which will be called periodically to refresh the contents in various sections
    this.getInboxUnreadCnt();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= projectConstants.SMALL_DEVICE_BOUNDARY) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  help() {

    // const pdata = { 'ttype': 'learn_more', 'target': this.moreOptions };
    this.router.navigate(['learn_more']);
    // this.shared_functions.sendMessage(pdata);
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.shared_functions.getitemfromLocalStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
      this.bsector = bdetails.bs || '';
      this.bsubsector = bdetails.bss || '';
      this.blogo = bdetails.logo || '';
    }
  }
  getUserdetails() {
    this.userdet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    if (this.userdet) {
      if (this.shared_functions.checkLogin()) {
        this.ctype = this.shared_functions.isBusinessOwner('returntyp');
        if (this.userdet.isProvider === true) {
          this.provider_loggedin = true;
          this.consumer_loggedin = false;
        } else {
          if (this.userdet.userType === 3) {
            this.provider_loggedin = true;
            this.consumer_loggedin = false;
            this.hideMenu = true;
          } else {
            this.consumer_loggedin = true;
            this.provider_loggedin = false;
          }
        }
        if (this.ctype === 'provider') {
          this.getUpgradablePackages();
        }

      }
    }
  }

  getUpgradablePackages() {
    this.shared_service.getUpgradableLicensePackages()
      .subscribe(data => {
        this.upgradablepackages = data;
      });
  }

  handleHeaderclassbasedonURL() {
    this.headercls = '';
    const currenturl = this.router.url.split(';');
    const checkUrl = currenturl[0]; // this.curPgurl;
    // return this.headercls;
    for (const url of this.urls_class) {
      if (url.url != null) {
        const match = checkUrl.match(url.url);
        if (match instanceof Array && match.length === 1) {
          this.headercls = url.class;
        }

      }

    }
    if (this.headercls === '') {
      this.headercls = 'dashb';
    }
  }
  doSignup(origin?, moreOptions = {}) {
    // const ctype = this.checkProvider(origin);
    //   let cClass = 'consumerpopupmainclass';
    //   if (ctype === 'true') {
    //     cClass = 'commonpopupmainclass';
    //   }
    if (origin === 'provider') {
      // cClass = 'commonpopupmainclass';
    }
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: this.checkProvider(origin),
        moreOptions: moreOptions
      }
    });

    dialogRef.afterClosed().subscribe(() => {
    });

  }

  doLogin(origin?) {
    if (origin === 'provider') {
      // cClass = 'commonpopupmainclass';
    }
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '50%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: this.checkProvider(origin)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
      if (result === 'showsignupfromlogin') {
        this.doSignup(origin);
      }
    });

  }

  checkProvider(type) {
    return (type === 'consumer') ? 'false' : 'true';
  }

  doLogout() {
    // this.router.navigate(['logout']);
    this.shared_functions.doLogout()
      .then(
        () => {
          this.router.navigate(['/home']);
        },
        () => {
          // this.router.navigate(['/']);
        }
      );
  }
  upgradeMembership() {
    this.shared_functions.setitemonLocalStorage('lic_ret', this.router.url);
    this.router.navigate(['provider', 'settings', 'license', 'upgrade']);
  }
  inboxiconClick() {
    this.redirectto('inbox');
  }

  redirectto(mod) {
    this.showmobileSubmenu = false;
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    switch (mod) {
      case 'profile':
        this.router.navigate([usertype, 'profile']);
        break;
      case 'change-password':
        this.router.navigate([usertype, 'change-password']);
        break;
      case 'change-mobile':
        this.router.navigate([usertype, 'change-mobile']);
        break;
      case 'change-email':
        this.router.navigate([usertype, 'change-email']);
        break;
      case 'inbox':
        this.router.navigate([usertype, 'inbox']);
        break;
      case 'members':
        this.router.navigate([usertype, 'members']);
        break;
      case 'dashboard':
        this.router.navigate([usertype]);
        break;
    }
  }
  switchtoConsumer() {
    const pdata = { 'ttype': 'fromprovider' };
    this.shared_functions.sendSwitchMessage(pdata);
    this.showmobileSubmenu = false;
    const ynw = this.shared_functions.getitemfromLocalStorage('ynw-credentials');
    const enc_pwd = this.shared_functions.getitemfromLocalStorage('jld');
    const password = this.shared_service.get(enc_pwd, projectConstants.KEY);
    this.shared_service.ProviderLogout()
      .subscribe(() => {
        this.shared_functions.clearLocalstorage();
        const post_data = {
          'countryCode': '+91',
          'loginId': ynw.loginId,
          'password': password
        };
        this.shared_functions.consumerLogin(post_data);
        this.shared_functions.setitemonLocalStorage('jld', enc_pwd);
      },
        () => {
        }
      );
  }
  switchtoProvider() {
    const pdata = { 'ttype': 'fromconsumer' };
    this.shared_functions.sendSwitchMessage(pdata);
    const ynw = this.shared_functions.getitemfromLocalStorage('ynw-credentials');
    const enc_pwd = this.shared_functions.getitemfromLocalStorage('jld');
    const password = this.shared_service.get(enc_pwd, projectConstants.KEY);
    this.shared_service.ConsumerLogout()
      .subscribe(() => {
        this.shared_functions.clearLocalstorage();
        const post_data = {
          'countryCode': '+91',
          'loginId': ynw.loginId,
          'password': password
        };
        this.shared_functions.providerLogin(post_data)
        .then(
          res => {
          },
          error =>{
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
        this.shared_functions.setitemonLocalStorage('jld', enc_pwd);
      }
      );
  }
  createProviderAccount() {
    const ynw = this.shared_functions.getitemfromLocalStorage('ynw-user');
    const firstname = ynw.firstName;
    const lastname = ynw.lastName;
    const mobile = ynw.primaryPhoneNumber;
    const storage_Data = {
      fname: firstname,
      lname: lastname,
      ph: mobile
    };
    this.shared_functions.setitemonLocalStorage('ynw-createprov', storage_Data);
    this.shared_service.ConsumerLogout()
      .subscribe(() => {
        this.shared_functions.clearLocalstorage();
        const moreOptions = {
          isCreateProv: true,
          dataCreateProv: storage_Data
        };
        this.doSignup('provider', moreOptions);
        this.router.navigate(['/']);
      },
        () => {
        }
      );
  }
  handlesearchClick(ob) {
    this.searchclick.emit(ob);
  }
  getInboxUnreadCnt() {
    const usertype = this.ctype;
    this.shared_service.getInboxUnreadCount(usertype)
      .subscribe(data => {
        this.inboxCntFetched = true;
        this.inboxUnreadCnt = data;
      },
        () => {
        });
  }

  gototop() {
    window.scrollTo(0, 0);
  }
  public triggerScrollTo(destination) {
    const config: ScrollToConfigOptions = {
      target: destination
    };
    
    this._scrollToService.scrollTo(config);
  }

  handleScroll(target) {
    // if (this.data.moreOptions.scrollKey !== undefined) {
    setTimeout(() => {
      this.triggerScrollTo(target);
    }, 200);
    // }
  }
  providerLinkClicked() {
    this.router.navigate(['/phome']);
  }

  btnAvailableClicked() {
    this.router.navigate(['provider/settings/waitlist-manager/queues']);
  }

  isAvailableNow() {
    this.shared_service.isAvailableNow()
      .subscribe(data => {
        this.qAvailability = data;
      },
        () => {
        });
  }
}

