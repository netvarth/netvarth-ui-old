
import { interval as observableInterval, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../app.component';
import * as moment from 'moment';
import { Messages } from '../../../shared/constants/project-messages';
import { Title } from '@angular/platform-browser';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { ProviderDataStorageService } from '../../../ynw_provider/services/provider-datastorage.service';
import { JoyrideService } from 'ngx-joyride';
import { MatDialog } from '@angular/material/dialog';
import { ProviderStartTourComponent } from '../../../ynw_provider/components/provider-start-tour/provider-start-tour.component';
import { HelpPopUpComponent } from './help-pop-up/help-pop-up.component';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../../../../assets/css/style.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']
})
export class BusinessHeaderComponent implements OnInit, OnDestroy {
  accountType;
  inboxUnreadCnt;
  inboxCntFetched;
  alertCnt;
  ctype;
  license_message = '';
  active_license;
  waitlistmgr: any = [];
  alerts: any = [];
  checkinStatus = 1;
  cronHandle: Subscription;
  subscription: Subscription;
  bname;
  bsector = '';
  bsubsector = '';
  blogo = '';
  refreshTime;
  enable_disable;
  iswiz = false; // is true when active page is wizard
  qAvailability;
  waitlist_label: any;
  sessionStorage = false;
  myData: any;
  scheduleAvailability;
  licenseDetails;
  showUserSection = false;
  showMenuSection = false;
  action = '';
  phoneNumber = '';
  userData;
  userDetails: any = [];
  branchName = '';
  location;
  locName;
  active_user;
  account_type;
  constructor(public shared_functions: SharedFunctions,
    public router: Router,
    private sessionStorageService: SessionStorageService,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private renderer: Renderer2,
    public shared_service: SharedServices,
    private provider_services: ProviderServices,
    private routerobj: Router,
    private titleService: Title,
    public dialog: MatDialog,
    private provider_dataStorage: ProviderDataStorageService,
    private readonly joyrideService: JoyrideService) {
    this.refreshTime = projectConstants.INBOX_REFRESH_TIME;
    this.waitlist_label = this.wordProcessor.getTerminologyTerm('waitlist');
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      this.userData = this.groupService.getitemFromGroupStorage('ynw-user');
      switch (message.ttype) {
        case 'checkin-settings-changed':
          this.showCheckinED();
          break;
        case 'upgradelicence':
          // this.setLicense();
          this.getLicenseDetails();
          break;
        case 'hidemenus':
          this.renderer.removeClass(document.body, 'sidebar-open');
          this.renderer.addClass(document.body, 'sidebar-collapse');
          this.iswiz = message.value;
          break;
        case 'instant_q':
          this.qAvailability = message.qAvailability;
          break;
        case 'scheduleAvailbility':
          this.scheduleAvailability = message.scheduleAvailbility;
          break;
        case 'alertCount':
          this.alertCnt = message.alertCnt;
          // this.getAlertCount();
          break;
        case 'messageCount':
          this.inboxUnreadCnt = message.unreadCount;
          this.inboxCntFetched = message.messageFetched;
          break;
        case 'showmenu':
          this.showMenuSection = message.value;
          break;
          case 'updateuserdetails':
            this.getBusinessdetFromLocalstorage();
            break;
      }
      this.getBusinessdetFromLocalstorage();
      // this.connect();
    });
    this.userData = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log(this.userData);
    this.account_type = this.userData.accountType;
    if (this.userData.accountType === 'BRANCH' && !this.userData.adminPrivilege) {
      this.getUserDetails();
    }
    if (this.userData.accountType === 'BRANCH') {
      const location = this.groupService.getitemFromGroupStorage('loc_id');
      if (location) {
        this.locName = location.place;
      } else {
        this.getProviderLocation();
      }
    }
  }
  getProviderLocation() {
    this.provider_services.getProviderLocations()
      .subscribe(
        (data: any) => {
          this.location = data;
          if (this.location.length > 0) {
            this.locName = this.location[0].place;
          }
        });
  }
  closeMenu() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.renderer.removeClass(document.body, 'sidebar-open');
    }
  }
  isAvailableNow() {
    this.shared_service.isAvailableNow()
      .subscribe(data => {
        this.qAvailability = data;
      },
        () => {
        });
  }
  getScheduleAvailablity() {
    this.provider_services.getScheduleAvailablity()
      .subscribe(data => {
        this.scheduleAvailability = data;
      },
        () => {
        });
  }
  tourIconClicked() {
    const dialogRef = this.dialog.open(ProviderStartTourComponent, {
      width: '25%',
      panelClass: ['popup-class', 'commonpopupmainclass']

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'startTour') {

        this.joyrideService.startTour(

          {
            steps: ['step1@provider/settings', 'step2@provider/settings', 'step3@provider/settings', 'step4'],
            showPrevButton: false,
            stepDefaultPosition: 'top',
            themeColor: '#212f23'
          }
          // Your steps order
        ).subscribe(

          step => {
            /*Do something*/
            // console.log('Location', window.location.href, 'Path', window.location.pathname);
            // console.log('Next:', step);
          },
          error => {
            /*handle error*/
          },
          () => {
            this.router.navigate(['provider', 'settings']);
          }
        );
      }

    });
    // this.router.navigate(['provider', 'settings']);

  }
  gotoActiveHome() {
    this.shared_functions.gotoActiveHome();
  }
  gotoProfile() {
    const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    const userid = loggedUser.id
    if(this.account_type == 'BRANCH' && this.userData.userType == 1){
      this.routerobj.navigate(['provider', 'settings', 'general', 'users', userid, 'settings']);
    }else{
      this.router.navigate(['provider', 'settings', 'bprofile']);
    }
  

  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.bsector = bdetails.bs || '';
      this.bsubsector = bdetails.bss || '';
      if (this.userData.accountType === 'BRANCH' && this.userData.userType !== 2) {
        this.branchName = bdetails.bn || 'User';
        this.bname = this.userData.userName || 'User';
        this.blogo = (this.userDetails.profilePicture) ? this.userDetails.profilePicture.url : './assets/images/img-null.svg';
      } else {
        this.bname = bdetails.bn || 'User';
        this.blogo = bdetails.logo || './assets/images/img-null.svg';
      }
    }
  }
  getUserDetails() {
    this.provider_services.getUser(this.userData.id)
      .subscribe(
        res => {
          this.userDetails = res;
        });
  }
  ngOnInit() {
   
    if (this.sessionStorageService.getitemfromSessionStorage('tabId')) {
      this.sessionStorage = true;
    }
    this.isAvailableNow();
    this.getScheduleAvailablity();
    this.showCheckinED();
    this.getLicenseDetails();
    this.setLicense();
    this.reloadHandler();
    this.getBusinessdetFromLocalstorage();
    this.enable_disable = Messages.ENBLE_DISABLE_TOOLTIP.replace('[waitlist]', this.waitlist_label);
    this.cronHandle = observableInterval(this.refreshTime * 1000).subscribe(() => {
      this.reloadHandler();
    });
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  doLogout() {
    this.shared_functions.doLogout()
      .then(
        () => {
          this.provider_dataStorage.setWeightageArray([]);
          this.titleService.setTitle('Jaldee');
          this.router.navigate(['/home']);
        },
        () => {
        }
      );
  }

  redirectto(mod) {
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
      case 'check-ins':
        this.router.navigate([usertype]);
        break;
      case 'bprofile':
        this.router.navigate(['provider', 'settings', 'bprofile']);
        break;
    }
  }
  reloadHandler() { // this is the function which will be called periodically to refresh the contents in various sections
    this.getInboxUnreadCnt();
    this.getAlertCount();
  }
  getInboxUnreadCnt() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    if (!usertype) {
      if (this.cronHandle) {
        this.cronHandle.unsubscribe();
      }
    }
    let type;
    // if (usertype === 'provider') {
    //   type = 'account';
    // } else {
    type = usertype;
    // }
    this.shared_service.getInboxUnreadCount(type)
      .subscribe(data => {
        this.inboxCntFetched = true;
        this.inboxUnreadCnt = data;
        this.shared_functions.sendMessage({ ttype: 'messageCount', messageFetched: this.inboxCntFetched, unreadCount: this.inboxUnreadCnt });
      },
        () => {
        });
  }
  getLicenseDetails(call_type = 'init') {
    this.license_message = '';
    this.shared_service.getLicenseDetails()
      .subscribe(data => {
        this.licenseDetails = data;
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
    const cuser = this.groupService.getitemFromGroupStorage('ynw-user');
    this.phoneNumber = cuser.primaryPhoneNumber;
    this.accountType = cuser.accountType;
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    if (cuser && usertype === 'provider') {
      if (cuser.new_lic) {
        this.active_license = cuser.new_lic;
      } else if (cuser.accountLicenseDetails) {
        this.active_license = cuser.accountLicenseDetails.accountLicense.displayName;
      }
    }
  }

  gotoLicense() {
    if (this.licenseDetails && this.licenseDetails.accountLicense && this.licenseDetails.accountLicense.licPkgOrAddonId === 6) {
      this.router.navigate(['provider', 'license']);
      this.shared_functions.sendMessage({ 'ttype': 'menuChanged', 'value': 'license' });
    }
  }
  gotoInbox() {
    this.router.navigate(['provider', 'inbox']);
    this.shared_functions.sendMessage({ 'ttype': 'menuChanged', 'value': 'inbox' });
  }
  upgradeMembership() {
    this.lStorageService.setitemonLocalStorage('lic_ret', this.router.url);
    this.router.navigate(['provider', 'license', 'upgrade']);
  }
  showCheckinED() {
    this.waitlistmgr = [];
    this.shared_service.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistmgr = data;
        this.checkinStatus = 3;
        return false;
      },
        () => {

        });
  }
  getAlertCount() {
    this.shared_service.getAlertsTotalCnt('false', '', '')
      .subscribe((data: any) => {
        this.alertCnt = data;
        this.shared_functions.sendMessage({ ttype: 'alertCount', alertCnt: this.alertCnt });
        if (this.alertCnt > 0) {
          this.getAlerts(data);
        }
      },
        () => {

        });
  }
  gotoAlerts() {
    if (this.alertCnt === 0) {
      this.router.navigate(['provider', 'alerts']);
    }
    this.shared_functions.sendMessage({ 'ttype': 'menuChanged', 'value': 'alerts' });
  }
  getAlerts(count?) {
    // this.alerts = [];
    let maxCnt = projectConstants.ALERT_CNT;
    if (count < maxCnt) {
      maxCnt = count;
    }
    this.shared_service.getAlerts('false', '', '', 0, maxCnt)
      .subscribe(data => {
        this.alerts = data;
      },
        () => {
        });
  }
  changeOnlinestatus(curstat) {
    const changestatus = (curstat) ? 'Disable' : 'Enable';
    this.shared_service.setAcceptOnlineCheckin(changestatus)
      .subscribe(() => {
        if (changestatus === 'Enable') {
          this.waitlistmgr.onlineCheckIns = true;
        } else {
          this.waitlistmgr.onlineCheckIns = false;
        }
        this.shared_functions.sendMessage({ ttype: 'online_checkin_status', action: this.waitlistmgr.onlineCheckIns });
      },
        () => {

        });
  }
  changefutureOnlinestatus(curstat) {
    const changestatus = (curstat) ? 'Disable' : 'Enable';
    this.shared_service.setFutureCheckinStatus(changestatus)
      .subscribe(() => {
        if (changestatus === 'Enable') {
          this.waitlistmgr.futureDateWaitlist = true;
        } else {
          this.waitlistmgr.futureDateWaitlist = false;
        }

        this.shared_functions.sendMessage({ ttype: 'future_checkin_status', action: this.waitlistmgr.futureDateWaitlist });
      },
        () => {

        });
  }
  gotoCheckinSettings() {
    this.router.navigate(['provider', 'settings', 'q-manager']);
  }
  alertAcknowlege(alert) {
    this.shared_service.acknowledgeAlert(alert.id)
      .subscribe(() => {
        this.snackbarService.openSnackBar(Messages.PROVIDER_ALERT_ACK_SUCC);
        this.getAlertCount();
        this.getAlerts();
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  // getAlertById(date) {
  //   this.shared_service.getAlertsTotalCnt('false', date)
  //     .subscribe(() => {
  //       this.getAlertCount();
  //       this.getAlerts();
  //     },
  //       error => {
  //       });
  // }

  gotoBranch() {
    const accountid = this.sessionStorageService.getitemfromSessionStorage('accountid');
    this.lStorageService.removeitemfromLocalStorage(accountid);
    this.sessionStorageService.removeitemfromSessionStorage('accountid');
    this.sessionStorageService.removeitemfromSessionStorage('tabId');
    window.location.reload();
  }
  helpClicked() {
    const dialogRef = this.dialog.open(HelpPopUpComponent, {
      width: '25%',
      panelClass: ['commonpopupmainclass', 'popup-class']
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
  userPopup() {
    this.showUserSection = !this.showUserSection;
  }
  getUserFirstLetter() {
    if (this.bname) {
      const name = this.bname.split(' ');
      return name[0].charAt(0);
    }
  }
  showMenu() {
    this.showMenuSection = !this.showMenuSection;
    this.shared_functions.sendMessage({ ttype: 'showmenu', value: this.showMenuSection });
  }
  actionPerformed(action) {
    if (this.action === action) {
      this.action = '';
    } else {
      this.action = action;
    }
  }
  gotoSettings() {
    this.router.navigate(['provider', 'settings']);
  }
}
