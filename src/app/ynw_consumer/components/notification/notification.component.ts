import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServices } from '../../../shared/services/shared-services';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { TelegramPopupComponent } from './telegrampopup/telegrampopup.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  api_error = null;
  api_success = null;
  is_verified = false;
  user_details;
  prev_phonenumber;
  countryCode = 91;
  currentcountryCode;
  step = 1;
  curtype;
  usertype;
  submit_data = { 'phonenumber': null };
  telegramdialogRef: any;
  telegramstat = true;
  status = false;
  boturl: any;
  constructor(
    public shared_services: SharedServices,
    public router: Router,
    public dialog: MatDialog,
    private location: Location,
    public shared_functions: SharedFunctions
  ) { }
  goBack() {
    this.location.back();
  }
  ngOnInit() {
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.getTelegramstat();

  }
  enableTelegram(stat) {
    this.teleGramStat(stat).then(
      (data) => {
        this.getTelegramstat();
      },
      error => {
        this.telegramstat = false;
        if (!this.telegramstat) {
          this.telegramdialogRef = this.dialog.open(TelegramPopupComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass'],
            disableClose: true,
            data: this.boturl
          });
          this.telegramdialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.getTelegramstat();
            }
          });
        }
      });
  }
  teleGramStat(stat) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.enableTelegramNoti(stat)
        .subscribe(
          data => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getTelegramstat() {
    this.shared_services.getTelegramstat()
      .subscribe(
        (data: any) => {
          this.status = data.status;
          if (data.botUrl) {
            this.boturl = data.botUrl;
          }
        },
        error => {
        }
      );
  }
  redirecToSettings() {
    this.router.navigate(['provider', 'settings', 'bprofile']);
  }
}
