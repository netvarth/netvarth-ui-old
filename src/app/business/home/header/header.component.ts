import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { SharedServices } from '../../../shared/services/shared-services';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { projectConstants } from '../../../shared/constants/project-constants';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class BusinessHeaderComponent implements OnInit, OnDestroy {
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
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  constructor(public shared_functions: SharedFunctions,
    public router: Router,
    private _scrollToService: ScrollToService,
    public shared_service: SharedServices) {
    this.subscription = this.shared_functions.getMessage().subscribe(message => {
      switch (message.ttype) {
        case 'checkin-settings-changed':
          this.showCheckinED();
          break;
      }
      this.getBusinessdetFromLocalstorage();
    });
  }
  gotoActiveHome () {
    this.router.navigate(['provider', 'dashboard', 'check-ins']);
  }
  gotoProfile () {
    this.router.navigate(['provider', 'settings', 'bprofile']);
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.shared_functions.getitemfromLocalStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
      this.bsector = bdetails.bs || '';
      this.bsubsector = bdetails.bss || '';
      this.blogo = bdetails.logo || 'img-null.svg';
    }
  }
  ngOnInit() {
    this.showCheckinED();
    this.getLicenseDetails();
    this.setLicense();
    this.reloadHandler();
    this.getBusinessdetFromLocalstorage();
    this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(() => {
      this.reloadHandler();
    });
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
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
      case 'dashboard':
        this.router.navigate([usertype]);
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
    this.shared_service.getInboxUnreadCount(usertype)
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

  gotoLicense() {
    if (this.active_license === 'Diamond') {
      this.router.navigate(['provider', 'license']);
      this.shared_functions.sendMessage({'ttype' : 'menuChanged', 'value' : 'license'});
    }
  }
  gotoInbox() {
    this.router.navigate(['provider', 'inbox']);
    this.shared_functions.sendMessage({'ttype' : 'menuChanged', 'value' : 'inbox'});
  }
  upgradeMembership() {
    this.shared_functions.setitemonLocalStorage('lic_ret', this.router.url);
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
    this.shared_service.getAlertsTotalCnt('false', '')
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
    this.shared_functions.sendMessage({'ttype' : 'menuChanged', 'value' : 'alerts'});
  }
  getAlerts(count) {
    // this.alerts = [];
    let maxCnt = projectConstants.ALERT_CNT;
    if (count < maxCnt) {
      maxCnt = count;
    }
    this.shared_service.getAlerts('false', '', 0, maxCnt)
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
}

