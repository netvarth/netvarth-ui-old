
import { interval as observableInterval, Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Input, Output, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { SharedServices } from '../../services/shared-services';
import { MatDialog } from '@angular/material';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { SignUpComponent } from '../../components/signup/signup.component';
import { LoginComponent } from '../../components/login/login.component';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Input() headerTitle: string;
  @Input() includedfrom;
  @Output() scrollhideclass = new EventEmitter<any>();
  // @Input() source;
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
  pageSource;
  small_device_display = false;
  show_small_device_queue_display = false;
  returnedFromCheckDetails = false;
  apis_loaded = false;
  noFilter = true;
  arr: any = [];
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
  urls_class = [
    { url: '\/provider\/bwizard', class: 'itl-steps' },
    { url: '\/provider\/settings\/.+', class: 'dashb' },
    { url: null, class: 'dashb' },
  ];
  isprovider = false;
  ctype;
  active_license;
  avoidClear = 1;
  upgradablepackages: any = [];
  main_loading = false;
  inboxiconTooltip = '';
  custsignTooltip = '';
  provsignTooltip = '';
  api_error = null;
  showLearnMore = false;
  screenHeight;
  hideMenu = false;
  qAvailability;
  origin = 'header';
  account_type;
  licenseMetrics: any = [];
  selectedpkgMetrics: any = [];
  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public router: Router,
    private _scrollToService: ScrollToService,
    public shared_service: SharedServices,
  ) {
    this.onResize();
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
          this.router.navigate(['/provider/learnmore/' + message.target.scrollKey]);
          break;
        case 'faq':
          this.router.navigate(['/provider/faq/' + message.target.scrollKey]);
          break;
      }
      this.getBusinessdetFromLocalstorage();
    });
  }
  /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
  myFunction() {
    const x = document.getElementById('myTopnav');
    if (x.className === 'topnav') {
      x.className += 'responsive';
    } else {
      x.className = 'topnav';
    }
  }
  hideLearnmore() {
    this.showLearnMore = false;
    this.scrollhideclass.emit(false);
  }
  ngOnInit() {
    this.pageSource = this.includedfrom;
    this.inboxiconTooltip = this.shared_functions.getProjectMesssages('INBOXICON_TOOPTIP');
    this.custsignTooltip = this.shared_functions.getProjectMesssages('CUSTSIGN_TOOPTIP');
    this.provsignTooltip = this.shared_functions.getProjectMesssages('PROVSIGN_TOOPTIP');
    this.getUserdetails();
    this.getBusinessdetFromLocalstorage();
    this.isprovider = this.shared_functions.isBusinessOwner();
    this.ctype = this.shared_functions.isBusinessOwner('returntyp');
    this.inboxCntFetched = false;
    // Section which handles the periodic reload
    if (this.ctype === 'consumer' || this.ctype === 'provider') {
      this.cronHandle = observableInterval(this.refreshTime * 1000).subscribe(() => {
        this.reloadHandler();
      });
    } else {
      // if (this.cronHandle) {
      //   this.cronHandle.unsubscribe();
      // }
    }
    if (this.ctype === 'consumer') {
    this.getInboxUnreadCnt();
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
    const cuser = this.shared_functions.getitemFromGroupStorage('ynw-user');
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
    if (this.evnt) {
      this.evnt.unsubscribe();
    }
    // unsubscribe to ensure no memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
    this.router.navigate(['/consumer/learn_more']);
  }
  faq() {
    this.router.navigate(['/consumer/faq']);
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.shared_functions.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
      this.bsector = bdetails.bs || '';
      this.bsubsector = bdetails.bss || '';
      this.blogo = bdetails.logo || '';
    }
  }
  getUserdetails() {
    this.userdet = this.shared_functions.getitemFromGroupStorage('ynw-user');
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
          this.getBusinessprofile();
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

  getBusinessprofile() {
    this.shared_service.getBussinessProfile()
      .subscribe(data => {
        this.account_type = data['accountType'];
      });
  }
  handleHeaderclassbasedonURL() {
    this.headercls = '';
    const currenturl = this.router.url.split(';');
    const checkUrl = currenturl[0]; // this.curPgurl;
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
    if (origin === 'provider') {
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
      if (result === 'showsignupfromlogin') {
        this.doSignup(origin);
      }
    });
  }
  checkProvider(type) {
    return (type === 'consumer') ? 'false' : 'true';
  }
  doLogout() {
    this.shared_functions.doLogout()
      .then(
        () => {
          this.router.navigate(['/home']);
        },
        () => {
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
  getInboxUnreadCnt() {
    let usertype;
    usertype = this.ctype;
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
    setTimeout(() => {
      this.triggerScrollTo(target);
    }, 200);
  }
  providerLinkClicked() {
    this.router.navigate(['/business']);
  }
  btnAvailableClicked() {
    this.router.navigate(['provider/settings/q-manager/queues']);
  }
  holidaybtnClicked() {
    this.router.navigate(['provider/settings/holidays']);
  }
  isAvailableNow() {
    this.shared_service.isAvailableNow()
      .subscribe(data => {
        this.qAvailability = data;
      },
        () => {
        });
  }
  gotoPricing() {
    this.router.navigate(['business', 'jaldeepricing']);

  }
  gotocontactus() {

    this.router.navigate(['business', 'contactus']);
  }
  gotoproducts() {
    const navigationExtras: NavigationExtras = {
      queryParams: { type: 'products' }
    };
    this.router.navigate(['business'], navigationExtras);
  }
  gotosales() {
    const navigationExtras: NavigationExtras = {
      queryParams: { type: 'sales' }
    };
    this.router.navigate(['business'], navigationExtras);
  }
  gotoActiveHome() {
    this.router.navigate(['/']);
  }
}
