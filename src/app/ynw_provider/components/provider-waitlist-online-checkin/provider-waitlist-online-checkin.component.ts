import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { Messages } from '../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';


@Component({
  selector: 'app-provider-waitlist-online-checkin',
  templateUrl: './provider-waitlist-online-checkin.component.html'
})

export class ProviderWaitlistOnlineCheckinComponent implements OnInit {

  fixed_cap = Messages.MANUAL_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  wait_time_calc_cap = Messages.CHECKIN_CALCULATE_CAP;
  ml_cap = Messages.CHECKIN_ML_CAP;
  mins_cap = Messages.CHECKIN_MINS_CAP;
  do_not_show_cap = Messages.CHECKIN_NO_WAIT_TIME_CAP;
  toke_enable_cap = Messages.CHECKIN_TOKEN_ENABLE_CAP;
  toke_disable_cap = Messages.CHECKIN_TOKEN_DISABLE_CAP;
  accept_future_cap = Messages.CHECKIN_FUTURE_CAP;
  waitlist_manager: any = null;
  reset_waitlist_manager: any = null;
  formChange = 0;
  api_success = null;
  customer_label = '';
  checkin_label = '';
  frm_wait_cal_cap = '';
  removeitemdialogRef;
  message;
  account_type;
  is_data_chnge: any;
  deptstatusstr = 'Off';
  showToken = true;
  showToken_str = 'Off';
  showPersonsahead_str = 'Off';
  showCheckinWaitTime = true;
  showCheckinWaitTime_str = 'Off';
  personsAhead = true;
  manualMode_str = 'Off';
  trnArndTime;
  manualMode = false;
  showTokenWaitTime: boolean;
  checkinManager = false;
  tokenManager = false;
  showTokenWaitTime_str: string;
  showCheckinmgr_str = 'Off';
  isManualMode = false;
  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private sharedfunctionObj: SharedFunctions,
    private router: Router, private dialog: MatDialog,
    private shared_functions: SharedFunctions,
    private routerobj: Router) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
  }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.account_type = user.accountType;
    this.waitlist_manager = this.reset_waitlist_manager = this.provider_datastorage.get('waitlistManage') || [];
    this.setValue(this.waitlist_manager);
    this.frm_wait_cal_cap = Messages.FRM_LEVEL_WAIT_TIME_CALC_MSG.replace('[customer]', this.customer_label);
  }

  /**
   * To prevent typing number greater than 4 digit
   * @param number typed number
   */
  isValid(number) {
    if (number <= 0) {
      this.trnArndTime = '';
    } else if (number > 999) {
      let numString = number.toString();
      if (numString.length > 3) {
        numString = numString.substr(0, numString.length - 1);
        this.trnArndTime = numString;
      }
    }
  }
  handleTokenManager(event) {
    const postData = {};
    if (event.checked) {
      postData['showTokenId'] = true;
    } else {
      postData['showTokenId'] = false;
    }
    this.provider_services.setWaitlistMgr(postData)
      .subscribe(
        () => {
          this.getWaitlistMgr();
          this.shared_functions.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  handleCheckinManager(event) {
    const postData = {};
    if (event.checked) {
      postData['showTokenId'] = false;
    } else {
      postData['showTokenId'] = true;
    }
    this.provider_services.setWaitlistMgr(postData)
      .subscribe(
        () => {
          this.getWaitlistMgr();
          this.shared_functions.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  setValue(value) {
    const calcMode = value['calculationMode'] || '';
    if (value['showTokenId']) {
      this.tokenManager = true;
      this.checkinManager = false;
      this.showToken_str = 'On';
      this.showCheckinmgr_str = 'Off';
      this.showPersonsahead_str = 'On';
      if (calcMode === 'NoCalc') {
        this.showTokenWaitTime = false;
      } else {
        this.showTokenWaitTime = true;
      }
      this.showTokenWaitTime_str = this.showTokenWaitTime ? 'On' : 'Off';
    } else {
      this.checkinManager = true;
      this.tokenManager = false;
      this.showCheckinmgr_str = 'On';
      this.showToken_str = 'Off';
      if (calcMode === 'Fixed') {
        this.showCheckinWaitTime = false;
        this.manualMode_str = 'On';
        this.trnArndTime = value['trnArndTime'];
        this.isManualMode = true;
        this.manualMode = true;
      } else {
        this.isManualMode = false;
        this.manualMode = false;
        this.manualMode_str = 'Off';
        this.showCheckinWaitTime = true;
      }
      this.showCheckinWaitTime_str = this.showCheckinWaitTime ? 'On' : 'Off';
    }
  }
  updateTokenWaitTime(event) {
    const postData = {
      showTokenId: true
    };
    if (event.checked) {
      postData['calculationMode'] = 'Conventional';
    } else {
      postData['calculationMode'] = 'NoCalc';
    }
    this.provider_services.setWaitlistMgr(postData)
      .subscribe(
        () => {
          this.getWaitlistMgr();
          this.shared_functions.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }

  updateManualMode(trnArndTime) {
      if (trnArndTime <= 0) {
        this.shared_functions.openSnackBar(Messages.WAITLIST_TURNTIME_INVALID, { 'panelClass': 'snackbarerror' });
        return;
      }
      const postData = {
        calculationMode: 'Fixed',
        trnArndTime: trnArndTime,
        showTokenId: false
      };
      this.provider_services.setWaitlistMgr(postData)
        .subscribe(
          () => {
            this.getWaitlistMgr();
            this.is_data_chnge = 0;
            this.shared_functions.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
          },
          error => {
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          });
  }
  fixedModeChanged(event) {
    if (!event.checked) {
      const postData = {
        calculationMode: 'Conventional',
        showTokenId: false
      };
      this.provider_services.setWaitlistMgr(postData)
        .subscribe(
          () => {
            this.getWaitlistMgr();
          });
    } else {
      this.isManualMode = true;
      this.trnArndTime = '';
    }
  }
  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr()
      .subscribe(
        data => {
          this.waitlist_manager = data;
          this.reset_waitlist_manager = data;
          this.setValue(this.waitlist_manager);
          this.provider_datastorage.set('waitlistManage', data);
        },
        () => {

        }
      );
  }

  // onFormChange() {
  //   this.formChange = 1;
  // }
inputChanged () {
  this.is_data_chnge = 1;
}
  cancelChange() {
     // this.setValue(this.waitlist_manager);
    // this.is_data_chnge = 0;
  //  this.trnArndTime = this.waitlist_manager['trnArndTime'];
      this.getWaitlistMgr();
  }

  // redirecTo(mod) {
  //   switch (mod) {
  //     case 'notifications':
  //       this.routerobj.navigate(['provider', 'settings', 'notifications']);
  //       break;
  //   }
  // }
  // doRemoveservice() {
  //   if (this.form['filterByDept']) {
  //     this.message = 'All services created will be moved to the department named \'Default\'. You can either rename the \'Default\' department for customer visibility or add new departments and assign respective services';
  //   } else {
  //     this.message = 'Assigned services are removed from the departments';
  //   }
  //   this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
  //     width: '50%',
  //     panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
  //     disableClose: true,
  //     data: {
  //       'message': this.message
  //     }
  //   });
  //   this.removeitemdialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       const status = (this.form.filterByDept === true) ? 'Enable' : 'Disable';
  //       this.provider_services.setDeptWaitlistMgr(status)
  //         .subscribe(
  //           () => {
  //             this.getWaitlistMgr();
  //           },
  //           error => {
  //             this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //           });
  //     } else {
  //       this.form['filterByDept'] = (this.form.filterByDept === true) ? false : true;
  //     }
  //   });
  // }
}
