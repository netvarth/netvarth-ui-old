
import {interval as observableInterval,  Subscription, SubscriptionLike as ISubscription ,  Observable } from 'rxjs';
import { Component, OnInit, Inject, EventEmitter, Input, Output, OnDestroy, HostListener, OnChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

import { SignUpComponent } from '../../components/signup/signup.component';
import { LoginComponent } from '../../components/login/login.component';
import { SearchFields } from '../../modules/search/searchfields';

import { projectConstants } from '../../constants/project-constants';

// import { ViewChild } from '@angular/core';
// import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    // styleUrls: ['./home.component.scss']
})



export class HeaderComponent implements OnInit, OnDestroy {

  @Input() headerTitle: string;
  @Input() includedfrom: string;
  @Input() passedDomain: string;
  @Input() passedkwdet: any =  [];
  @Input() passedRefine: any =  [];
  @Output() searchclick = new EventEmitter<any>();
  @Output() scrollhideclass = new EventEmitter<any>();
  userdet: any = [];
  headercls = '';
  provider_loggedin = false;
  consumer_loggedin = false;
  curPgurl = '';
  evnt;
  subscription: Subscription;
  bname;
  bsector = '';
  bsubsector = '';
  blogo = '';
  inboxUnreadCnt;
  inboxCntFetched;
  cronHandle: Subscription;
  cronStarted;
  showmobileSubmenu = false;
  urls_class = [
    {url: '\/provider\/bwizard' , class: 'itl-steps'},
    {url: '\/provider\/settings\/.+' , class: 'dashb'},
    {url: null , class: 'dashb'},
  ];
  isprovider = false;
  ctype;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  public searchfields: SearchFields = new SearchFields();
  locationholder = { 'autoname': '', 'name': '', 'lat': '', 'lon': '', 'typ': '' };
  keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': ''};
  selected_domain = '';
  avoidClear = 1;
  upgradablepackages: any = [];
  main_loading = false;
  inboxiconTooltip = '';
  custsignTooltip = '';
  provsignTooltip = '';
  showLearnMore = false;
  passedDet = {};
  screenHeight;
  screenWidth;
  small_device_display = false;

  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public router: Router,
    private _scrollToService: ScrollToService,
    public shared_service: SharedServices
  ) {
    this.onResize();
     /*router.events.subscribe((val) => {
        console.log('routerval', val['url']);
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
      // console.log('message', message);
      switch (message.ttype) {
        case 'updateuserdetails':
          this.getUserdetails();
          this.handleHeaderclassbasedonURL();
        break;
        case 'upgradelicence':
          this.getUpgradablePackages();
        break;
        case 'main_loading':
          this.main_loading = message.action || false;
        break;
        case 'load_unread_count' :
          if (!message.action) {
            this.getInboxUnreadCnt();
          } else if (message.action === 'setzero') {
            this.inboxUnreadCnt = 0;
            this.inboxCntFetched = true;
          }
        break;
        case 'learn_more':
          this.showLearnMore = true;
          this.scrollhideclass.emit(true);
          this.passedDet = { 'mainKey': message.target.scrollKey, 'subKey': message.target.subKey};
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
   // console.log('reached here');
    this.showLearnMore = false;
    this.scrollhideclass.emit(false);
  }

  ngOnInit() {
   // console.log('passeddomain', this.passedDomain);
   // console.log('passedkw', this.passedkwdet);
   // console.log('passedRefine', this.passedRefine);
   this.inboxiconTooltip = this.shared_functions.getProjectMesssages('INBOXICON_TOOPTIP');
   this.custsignTooltip = this.shared_functions.getProjectMesssages('CUSTSIGN_TOOPTIP');
   this.provsignTooltip = this.shared_functions.getProjectMesssages('PROVSIGN_TOOPTIP');
    this.getUserdetails();
    this.getBusinessdetFromLocalstorage();
    // this.handleHeaderclassbasedonURL();
    this.isprovider = this.shared_functions.isBusinessOwner();
    this.ctype = this.shared_functions.isBusinessOwner('returntyp');
    this.inboxCntFetched = false;
    // this.getInboxUnreadCnt();

    // Section which handles the periodic reload
    if (this.ctype === 'consumer' || this.ctype === 'provider') {
      this.cronHandle = observableInterval(this.refreshTime * 1000).subscribe(x => {
        this.reloadHandler();
      });
    } else {
        if (this.cronHandle) {
          this.cronHandle.unsubscribe();
        }
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
    // doSomething();
    const dd = new Date();
    this.getInboxUnreadCnt();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= projectConstants.SMALL_DEVICE_BOUNDARY) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  // console.log('resized', this.screenWidth, this.screenHeight, this.small_device_display);
}

 getBusinessdetFromLocalstorage() {
    const bdetails = this.shared_functions.getitemfromLocalStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
      this.bsector = bdetails.bs || '';
      this.bsubsector = bdetails.bss || '';
      this.blogo = bdetails.logo || '';
     // console.log('logo', this.blogo);
    }
  }
  getUserdetails() {
    this.userdet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    if (this.userdet)  {
     //  console.log(this.userdet);
      if (this.shared_functions.checkLogin()) {
        this.ctype = this.shared_functions.isBusinessOwner('returntyp');
        if (this.userdet.isProvider === true) {
          this.provider_loggedin = true;
          this.consumer_loggedin = false;
        } else {
          this.consumer_loggedin = true;
          this.provider_loggedin = false;
        }

        if (this.ctype === 'provider') {

          this.getUpgradablePackages();
        }

      }
    }
  }

  getUpgradablePackages() {
    this.shared_service.getUpgradableLicensePackages()
      .subscribe( data => {
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
        const match = checkUrl.match(url.url) ;
        if (match instanceof Array && match.length === 1) {
          this.headercls = url.class;
          // console.log('reached here', url.class);
        }

     }

   }
   if (this.headercls === '') {
        this.headercls = 'dashb';
   }
   // console.log('header class', this.headercls);

  }
  doSignup(origin?, moreOptions = {}) {
    // const ctype = this.checkProvider(origin);
    //   let cClass = 'consumerpopupmainclass';
    //   if (ctype === 'true') {
    //     cClass = 'commonpopupmainclass';
    //   }
    const cClass = 'consumerpopupmainclass';
    if (origin === 'provider') {
      // cClass = 'commonpopupmainclass';
    }
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', cClass],
      disableClose: true,
      data: {
        is_provider : this.checkProvider(origin),
        moreOptions: moreOptions
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }

  doLogin(origin?) {
    const cClass = 'consumerpopupmainclass';
    if (origin === 'provider') {
      // cClass = 'commonpopupmainclass';
    }
    const dialogRef = this.dialog.open(LoginComponent, {
       width: '50%',
       panelClass: ['loginmainclass', cClass],
       disableClose: true,
      data: {
        type : origin,
        is_provider : this.checkProvider(origin)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
     // console.log('returned', result);
      if (result === 'showsignupfromlogin') {
        this.doSignup(origin);
      }
    });

  }

  checkProvider(type) {
    return  (type === 'consumer') ? 'false' : 'true';
  }

  doLogout() {
    // console.log('here');
    // this.router.navigate(['logout']);
    this.shared_functions.doLogout()
    .then (
      success =>  {
        // console.log('logout succ');
        this.router.navigate(['/home']);
      },
        error => {
          // console.log('logout fail');
         // this.router.navigate(['/']);
        }
    );
  }
  upgradeMembership() {
   // console.log(this.router.url);
    this.shared_functions.setitemonLocalStorage('lic_ret', this.router.url);
    this.router.navigate(['provider', 'settings', 'license', 'upgrade']);
  }
  inboxiconClick() {
    this.redirectto('inbox');
  }

  redirectto (mod) {
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
    this.showmobileSubmenu = false;
    const ynw = this.shared_functions.getitemfromLocalStorage('ynw-credentials');
    // console.log('credentials', ynw.loginId, ynw.password);
    this.shared_service.ProviderLogout()
         .subscribe(data => {
            this.shared_functions.clearLocalstorage();
            const post_data = {
              'countryCode': '+91',
              'loginId': ynw.loginId,
              'password': ynw.password
            };
            this.shared_functions.consumerLogin(post_data);
         },
         error => {
            // console.log(error);
         }
         );
  }
  switchtoProvider() {
    const ynw = this.shared_functions.getitemfromLocalStorage('ynw-credentials');
    // console.log('credentials', ynw.loginId, ynw.password);
    this.shared_service.ConsumerLogout()
      .subscribe(data => {
        this.shared_functions.clearLocalstorage();
        const post_data = {
          'countryCode': '+91',
          'loginId': ynw.loginId,
          'password': ynw.password
        };
        this.shared_functions.providerLogin(post_data);
      },
      error => {
        // console.log(error);
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
      .subscribe(data => {
        this.shared_functions.clearLocalstorage();
        const moreOptions = {
          isCreateProv: true,
          dataCreateProv: storage_Data
        };
        this.doSignup('provider', moreOptions);
        this.router.navigate(['/']);
      },
      error => {
        // console.log(error);
      }
    );
  }

  handlesearchClick(ob) {
     this.searchclick.emit(ob);
  }
  getInboxUnreadCnt() {
    const usertype = this.ctype;
    this.shared_service.getInboxUnreadCount(usertype)
      .subscribe (data => {
        this.inboxCntFetched = true;
        // console.log('inboxcnt', data);
        this.inboxUnreadCnt = data;
      },
    error => {
    });
  }

  gototop() {
    // console.log('here');
    window.scrollTo(0, 0);
  }
  public triggerScrollTo(destination) {
    const config: ScrollToConfigOptions = {
      target: destination
    };
    // console.log('destination', destination, 'config', config);
    this._scrollToService.scrollTo(config);
  }

  handleScroll(target) {
   // if (this.data.moreOptions.scrollKey !== undefined) {
      setTimeout(() => {
        this.triggerScrollTo(target);
        }, 200);
    // }
  }
  showHidemobileSubMenu() {
    if (this.showmobileSubmenu) {
      this.showmobileSubmenu = false;
    } else {
      this.showmobileSubmenu = true;
    }
  }
}
