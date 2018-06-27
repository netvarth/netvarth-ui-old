import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-existing-checkin',
  templateUrl: './existing-checkin.component.html'
})

export class ExistingCheckinComponent implements OnInit {

  api_error = null;
  api_success = null;

  user_id = null;
  uuid = null;
  message = '';
  source = null;
  loc: any = [];
  locid;
  changeOccured = false;

  constructor(
    public dialogRef: MatDialogRef<ExistingCheckinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog
    ) {

     }

  ngOnInit() {
    // this.loc = this.data.locdet;
    this.getExistingCheckinsByLocation(this.data.locdet.id);
    this.dialogRef.backdropClick().subscribe(result => {
      this.dialogRef.close(this.changeOccured);
    });
  }
  getWaitlistingFor(obj) {
    let str = '';
    if (obj.length > 0) {
      for (let i = 0; i < obj.length ; i++) {
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
    .subscribe (data1 => {
      this.loc = data1;
      // console.log('obtained data', this.loc);
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
  resetApiErrors () {
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
      panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
      data: {
        'message' : 'Do you want to cancel this Check-In?',
        'heading' : 'Confirm'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doCangelCheckin(obj);
      }
    });
  }

  doCangelCheckin(obj) {
   // console.log('cancel checkin', obj);
    this.sharedfunctionObj.cancelWaitlist (obj.ynwUuid, obj.provider.id)
    .then (
      data => {
        if (data === 'reloadlist') {
          this.changeOccured = true;
          this.api_success = Messages.CHECKIN_CANCELLED;
          this.getExistingCheckinsByLocation(this.data.locdet.id);
        }
      },
      error => {
        this.api_error = error.error;
      }
    );
  }

}
