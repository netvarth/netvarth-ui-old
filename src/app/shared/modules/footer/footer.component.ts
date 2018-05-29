import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    // styleUrls: ['./home.component.scss']
})


export class FooterComponent implements OnInit {
  curyear;
  ctype;
  auditlog: any = [];
  auditCnt = projectConstants.AUDITLOG_CNT;
  showbottompopup = false;
  selOpt;
  showCheckinDiv;
  showAlertDiv;
  showAuditDiv;
  bottomdivHeader;
  auditStatus = 1;
  checkinStatus = 1;
  waitlistmgr: any = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  ngOnInit() {
    this.curyear = new Date().getFullYear();
    this.ctype = this.shared_functions.isBusinessOwner('returntyp');
    this.selOpt = '';
    this.clearDivs();
  }

  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public shared_services: SharedServices,
    public router: Router) {}

    showAuditlog() {
      this.clearDivs();
      this.auditStatus = 1;
      this.showbottompopup = true;
      this.showAuditDiv = true;
      this.bottomdivHeader = 'Audit Logs';
      this.selOpt = 'Audit';
      this.auditlog = [];
      this.shared_services.getAuditLogs('', '', '', '')
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
      this.clearDivs();
      this.showbottompopup = true;
      this.showAlertDiv = true;
      this.bottomdivHeader = 'Alerts';
      this.selOpt = 'Alert';
      /*this.shared_services.getAuditLogs()
        .subscribe(data => {
          this.auditlog = data;
        },
      error => {

      });*/
    }
    showCheckinED() {
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
        },
      error => {

      });
    }
}
