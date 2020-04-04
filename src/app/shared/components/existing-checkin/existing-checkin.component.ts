import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
import { CommonDataStorageService } from '../../../shared/services/common-datastorage.service';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-existing-checkin',
  templateUrl: './existing-checkin.component.html'
})

export class ExistingCheckinComponent implements OnInit {

  api_error = null;
  api_success = null;
  your_cap = Messages.YOUR_CAP;
  at_cap = Messages.AT_CAP;
  service_cap = Messages.SRVIC_CAP;
  for_cap = Messages.FOR_CAP;
  scheduled_on_cap = Messages.SCHEDULED_ON_CAP;
  mins_cap = Messages.MIN_CAP;
  no_cap = Messages.NO_CAP;
  exists_at_cap = Messages.EXISTS_AT;
  close_btn_cap = Messages.CLOSE_BTN;
  token_no = Messages.TOKEN;

  user_id = null;
  uuid = null;
  message = '';
  source = null;
  loc: any = [];
  locid;
  terminologiesjson: any = null;
  changeOccured = false;
  checkinLabel;
  cancelledlabel;
  estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
  tokenenabled = false;

  constructor(
    public dialogRef: MatDialogRef<ExistingCheckinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog,
    public provider_datastorage: CommonDataStorageService
  ) {

  }

  ngOnInit() {
    this.getExistingCheckinsByLocation(this.data.locId);
    this.terminologiesjson = this.data.terminologies;
    this.provider_datastorage.set('terminologies', this.terminologiesjson);
    this.checkinLabel = this.sharedfunctionObj.firstToUpper(this.terminologiesjson['waitlist']);
    this.cancelledlabel = this.sharedfunctionObj.firstToUpper(this.terminologiesjson['cancelled']);
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close(this.changeOccured);
    });
  }
  getWaitlistingFor(obj) {
    let str = '';
    if (obj.length > 0) {
      for (let i = 0; i < obj.length; i++) {
        if (str !== '') {
          str += ', ';
        }
        str += obj[i].firstName;
      }
    }
    return str;
  }
  getExistingCheckinsByLocation(locid) {
    this.shared_services.getExistingCheckinsByLocation(locid)
      .subscribe(data1 => {
        this.loc = data1;
        for (const details of this.loc) {
          if (details.token) {
            this.tokenenabled = true;
          }
        }
      },
        error => {
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
        });
  }
  getDateDisplay(dt) {
    let str = '';
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

    if (dtoday === dt) {
      str = 'Today';
    } else {
      const dtr = dt.split('-');
      str = dtr[2] + '-' + dtr[1] + '-' + dtr[0];
    }
    return str;
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  closePopup() {
    this.dialogRef.close(this.changeOccured);
  }

  confirmCancelChecin(obj) {
    this.resetApiErrors();
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you want to cancel this ' + this.checkinLabel + '?',
        'heading': 'Confirm'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doCangelCheckin(obj);
      }
    });
  }

  doCangelCheckin(obj) {
    this.sharedfunctionObj.cancelWaitlist(obj.ynwUuid, obj.providerAccount.id)
      .then(
        data => {
          if (data === 'reloadlist') {
            this.changeOccured = true;
            // this.api_success = Messages.CHECKIN_CANCELLED;
            this.api_success = this.sharedfunctionObj.getProjectMesssages('CHECKIN_CANCELLED').replace('[waitlist]', this.checkinLabel);
            this.api_success =  this.api_success.replace('[cancelled]', this.cancelledlabel);
            setTimeout(() => {
              this.api_success = null;
              this.api_error = null;
            }, projectConstants.TIMEOUT_DELAY);
            // this.api_success = this.sharedfunctionObj.getProjectMesssages('CHECKIN_CANCELLED').replace('[waitlist]', obj.place);;
            this.getExistingCheckinsByLocation(this.data.locId);
          }
        },
        error => {
          this.api_error = this.sharedfunctionObj.getProjectErrorMesssages(error);
        }
      );
  }
}


