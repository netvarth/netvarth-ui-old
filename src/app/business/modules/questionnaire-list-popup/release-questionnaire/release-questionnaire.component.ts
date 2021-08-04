import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { AddproviderAddonComponent } from '../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedServices } from '../../../../shared/services/shared-services';

@Component({
  selector: 'app-release-questionnaire',
  templateUrl: './release-questionnaire.component.html',
  styleUrls: ['./release-questionnaire.component.css']
})
export class ReleaseQuestionnaireComponent implements OnInit {
  api_error = null;
  api_success = null;
  cancel_btn_cap = Messages.CANCEL_BTN;
  send_btn_cap = Messages.SEND_BTN;
  message = '';
  sms = false;
  email = false;
  pushnotify = false;
  telegram = false;
  disableButton = false;
  is_smsLow = false;
  smsWarnMsg = '';
  corpSettings;
  isSms = false;
  phone;
  isPush = false;
  isEmail = false;
  isTelegram = false;
  countryCode;
  constructor(public dialogRef: MatDialogRef<ReleaseQuestionnaireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private shared_services: SharedServices) {
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data.source === 'appt') {
      if (this.data.waitlist_data.providerConsumer.email) {
        this.email = this.data.waitlist_data.providerConsumer.email;
        this.isEmail = true;
        this.email = true;
      }
      this.countryCode = this.data.waitlist_data.providerConsumer.countryCode;
      if (this.data.waitlist_data.providerConsumer.phoneNo) {
        this.phone = this.data.waitlist_data.providerConsumer.phoneNo;
        this.isSms = true;
        this.sms = true;
      }
      if ((this.email || this.phone) && this.data.waitlist_data.consumer) {
        this.pushnotify = true;
        this.isPush = true;
      }
    } else {
      if (this.data.waitlist_data.waitlistingFor[0].email) {
        this.email = this.data.waitlist_data.waitlistingFor[0].email;
        this.isEmail = true;
        this.email = true;
      }
      this.countryCode = this.data.waitlist_data.consumer.countryCode;
      if (this.data.waitlist_data.consumer.phoneNo) {
        this.phone = this.data.waitlist_data.consumer.phoneNo;
        this.isSms = true;
        this.sms = true;
      }
      if ((this.email || this.phone) && this.data.waitlist_data.jaldeeConsumer) {
        this.pushnotify = true;
        this.isPush = true;
      }
    }
    if (this.countryCode && this.phone) {
      this.getTelegramChatId();
      this.getSMSCredits();
    }
  }
  getTelegramChatId() {
    this.shared_services.telegramChat(this.countryCode, this.phone)
      .subscribe(
        data => {
          console.log(data);
          if (data === null) {
            this.isTelegram = true;
          }
          else {
            this.isTelegram = false;
          }
        },
        (error) => {
        }
      );
  }
  getSMSCredits() {
    this.provider_services.getSMSCredits().subscribe((data: any) => {
      if (data < 5 && data > 0) {
        this.is_smsLow = true;
        this.smsWarnMsg = Messages.LOW_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else if (data === 0) {
        this.is_smsLow = true;
        this.isSms = true;
        this.smsWarnMsg = Messages.NO_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else {
        this.is_smsLow = false;
        this.isSms = false;
      }
    });
  }
  getLicenseCorpSettings() {
    this.provider_services.getLicenseCorpSettings().subscribe(
      (data: any) => {
        this.corpSettings = data;
      }
    );
  }
  gotoSmsAddon() {
    this.dialogRef.close();
    if (this.corpSettings && this.corpSettings.isCentralised) {
      this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
    } else {
      const addondialogRef = this.dialog.open(AddproviderAddonComponent, {
        width: '50%',
        data: {
          type: 'addons'
        },
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true
      });
      addondialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getSMSCredits();
        }
      });
    }
  }
  sendBtnDisable() {
    if (this.message.trim() === '' || this.disableButton || (!this.sms && !this.email && !this.pushnotify && !this.telegram)) {
      return true;
    }
    return false;
  }
  shareQnr() {

  }
}
