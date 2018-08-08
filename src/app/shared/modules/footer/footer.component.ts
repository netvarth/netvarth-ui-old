import { Component, OnInit, Inject, Input, OnDestroy, DoCheck } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription, ISubscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    // styleUrls: ['./home.component.scss']
})


export class FooterComponent implements OnInit, OnDestroy, DoCheck {

  @Input() includedfrom: string;
  curyear;
  ctype;
  auditlog: any = [];
  auditCnt = projectConstants.AUDITLOG_CNT;
  alerts: any = [];
  alertsCnt = projectConstants.ALERT_CNT;
  showbottompopup = false;
  selOpt;
  showCheckinDiv;
  showAlertDiv;
  showAuditDiv;
  bottomdivHeader;
  auditStatus = 1;
  alertStatus = 1;
  checkinStatus = 1;
  waitlistmgr: any = [];
  includedFrom;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  alert_count = 0;
  subscription: Subscription;

  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  cronHandle: Subscription;
  show_prov_bottomicons = false;
  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public shared_services: SharedServices,
    public router: Router) {}

  ngOnInit() {
    // console.log('includedfrom1', this.includedfrom);
    // console.log('url', this.router.url.substr(-8));
    if (this.router.url.substr(-8) !== '/bwizard') {
      this.show_prov_bottomicons = true;
    }
    if (this.includedfrom !== undefined) {
      this.includedFrom = this.includedfrom;
    } else {
      this.includedFrom = '';
    }
    // console.log('includedfrom2', this.includedFrom);
    this.curyear = new Date().getFullYear();
    this.ctype = this.shared_functions.isBusinessOwner('returntyp');
    this.selOpt = '';
    this.clearDivs();
    if (this.ctype === 'provider') {
      this.getAlertCount();
    }
    if (this.ctype === 'provider') {
      this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(x => {
        this.reloadHandler();
      });
    } else {
      if (this.cronHandle) {
        this.cronHandle.unsubscribe();
      }
    }

    // Update from alert page
    this.subscription = this.shared_functions.getMessage()
    .subscribe(
      data => {

        if (data.ttype === 'alert_count_update') {
          this.reloadHandler('Alert');
        }
      },
      error => {

      }
    );

  }


  ngOnDestroy() {
     // unsubscribe to ensure no memory leaks
     this.subscription.unsubscribe();
     if (this.cronHandle) {
      this.cronHandle.unsubscribe();
     }
  }

  ngDoCheck() {
    if (this.ctype === 'provider') {
      if (this.router.url.substr(-8) !== '/bwizard') {
        this.show_prov_bottomicons = true;
      }
    }
  }

  reloadHandler(type = '') {
    this.getAlertCount();
    if (this.selOpt === 'Alert') {
      this.getAlerts();
    }
  }

  showAuditlog() {
    if (this.showAuditDiv === true) {
      this.showbottompopup = false;
      this.clearDivs();
      return;
    }
    this.clearDivs();
    this.auditStatus = 1;
    this.showbottompopup = true;
    this.showAuditDiv = true;
    this.bottomdivHeader = 'Audit Logs';
    this.selOpt = 'Audit';
    this.auditlog = [];
    this.shared_services.getAuditLogs('', '', '', '', 0, this.auditCnt)
      .subscribe(data => {
        this.auditlog = data;
        if (this.auditlog.length > 0) {
          this.auditStatus = 3;
        } else {
          this.auditStatus = 2;
        }
      },
    error => {

    });
  }

  showAlert() {
    if (this.showAlertDiv === true) {
      this.showbottompopup = false;
      this.clearDivs();
      return;
    }
    this.clearDivs();
    this.showbottompopup = true;
    this.showAlertDiv = true;
    this.bottomdivHeader = 'Alerts';
    this.selOpt = 'Alert';
    this.getAlerts();
  }

  alertAcknowlege(alert) {
    this.shared_services.acknowledgeAlert(alert.id)
      .subscribe (data => {
        this.shared_functions.openSnackBar(Messages.PROVIDER_ALERT_ACK_SUCC);
          this.getAlertCount();
          this.getAlerts();
      },
    error => {
      this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
    });
  }

  getAlertCount() {
    this.shared_services.getAlertsTotalCnt('false' , '')
    .subscribe((data: any) => {
      this.alert_count = data;
    },
    error => {

    });
  }

  getAlerts() {
    // this.alerts = [];
    this.shared_services.getAlerts('false', '', 0, this.alertsCnt)
      .subscribe(data => {
        this.alerts = data;
        if (this.alerts.length > 0) {
          this.alertStatus = 3;
        } else {
          this.alertStatus = 2;
        }
        // console.log('alerts', this.alerts);
      },
    error => {

    });
  }

  showCheckinED() {
    if (this.showCheckinDiv === true) {
      this.showbottompopup = false;
      this.clearDivs();
      return;
    }
    this.clearDivs();
    this.showbottompopup = true;
    this.showCheckinDiv = true;
    this.bottomdivHeader = 'Check-in Enable / Disable';
    this.selOpt = 'Checkin';
    this.waitlistmgr = [];
    this.shared_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistmgr = data;
        this.checkinStatus = 3;
      },
    error => {

    });
  }

  showLicense() {
    this.selOpt = '';
    this.showbottompopup = false;
    this.clearDivs();
    this.router.navigate(['/provider/settings/license']);
  }

  handleMaximize() {
    this.showbottompopup = false;
    switch (this.selOpt) {
      case 'Audit':
        this.router.navigate(['/provider/auditlog']);
        this.selOpt = '';
      break;
      case 'Alert':
        this.router.navigate(['/provider/alerts']);
        this.selOpt = '';
      break;
      case 'Checkin':
        this.router.navigate(['/provider/settings/waitlist-manager']);
        this.selOpt = '';
      break;
    }
  }

  closebottompopup() {
    this.clearDivs();
    this.showbottompopup = false;
    this.selOpt = '';
    this.bottomdivHeader = '';
  }

  clearDivs() {
    this.showAlertDiv = false;
    this.showAuditDiv = false;
    this.showCheckinDiv = false;
    this.selOpt = '';
  }

  changeOnlinestatus(curstat) {
    const changestatus = (curstat) ? 'Disable' : 'Enable';
    this.shared_services.setAcceptOnlineCheckin(changestatus)
      .subscribe (data => {
        if (changestatus === 'Enable') {
          this.waitlistmgr.onlineCheckIns = true;
        } else {
          this.waitlistmgr.onlineCheckIns = false;
        }

        this.shared_functions.sendMessage({ttype: 'online_checkin_status', action: this.waitlistmgr.onlineCheckIns});
      },
    error => {

    });
  }

}
