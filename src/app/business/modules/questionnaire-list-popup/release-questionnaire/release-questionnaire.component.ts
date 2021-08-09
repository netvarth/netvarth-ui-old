import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { AddproviderAddonComponent } from '../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../../app.component';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-release-questionnaire',
  templateUrl: './release-questionnaire.component.html',
  styleUrls: ['./release-questionnaire.component.css']
})
export class ReleaseQuestionnaireComponent implements OnInit {
  api_error = null;
  cancel_btn_cap = Messages.CANCEL_BTN;
  sms = false;
  email = false;
  pushnotify = false;
  telegram = false;
  disableButton = false;
  is_smsLow = false;
  smsWarnMsg = '';
  corpSettings;
  isPush = false;
  isEmail = false;
  isTelegram = false;
  is_noSMS = false;
  countryCode;
  amForm: FormGroup;
  loading = true;
  qnrLink;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  customer_label = '';
  constructor(public dialogRef: MatDialogRef<ReleaseQuestionnaireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor,
    public fed_service: FormMessageDisplayService) {
  }

  ngOnInit() {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.sms = this.data.isPhone;
    this.email = this.data.isEmail;
    if (this.data.source === 'appt') {
      this.countryCode = this.data.waitlist_data.providerConsumer.countryCode.split('+')[1];
      if ((this.data.isEmail || this.data.isPhone) && this.data.waitlist_data.consumer) {
        this.pushnotify = true;
        this.isPush = true;
      }
    } else {
      this.countryCode = this.data.waitlist_data.consumer.countryCode.split('+')[1];
      if ((this.data.isEmail || this.data.isPhone) && this.data.waitlist_data.jaldeeConsumer) {
        this.pushnotify = true;
        this.isPush = true;
      }
    }
    const uid = (this.data.source === 'appt') ? this.data.waitlist_data.uid : this.data.waitlist_data.ynwUuid;
    this.qnrLink = projectConstants.PATH + 'questionnaire/' + uid + '/' + this.data.qnrId + '/' + this.data.waitlist_data.providerAccount.id;
    this.qnrLink = 'http://localhost:4200/questionnaire/' + uid + '/' + this.data.qnrId + '/' + this.data.waitlist_data.providerAccount.id;
    this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
      message: ['Please fill out this form', Validators.compose([Validators.required])]
    });
    if (this.countryCode && this.data.isPhone) {
      this.getTelegramChatId();
      this.getSMSCredits();
    } else {
      this.loading = false;
    }
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  getTelegramChatId() {
    let phone = (this.data.source === 'appt') ? this.data.waitlist_data.providerConsumer.phoneNo : this.data.waitlist_data.consumer.phoneNo;
    this.provider_services.telegramChat(this.countryCode, phone)
      .subscribe(
        data => {
          if (data === null) {
            this.isTelegram = false;
          }
          else {
            this.isTelegram = true;
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
        this.is_noSMS = true;
        this.smsWarnMsg = Messages.NO_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else {
        this.is_smsLow = false;
        this.is_noSMS = false;
      }
      this.loading = false;
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
    if (this.amForm.get('message').value.trim() === '' || !this.amForm.valid || this.disableButton || (!this.sms && !this.email && !this.pushnotify && !this.telegram)) {
      return true;
    }
    return false;
  }
  shareQnr(form_data) {
    this.disableButton = true;
    const postData = {
      'medium': {
        'email': this.email,
        'sms': this.sms,
        'pushNotification': this.pushnotify,
        'telegram': this.telegram
      },
      'id': this.data.qnrId,
      'message': form_data.message
    };
    if (this.data.source === 'appt') {
      this.provider_services.sendApptQnrNotification(this.data.waitlist_data.uid, postData).subscribe(data => {
        this.changeQnrReleaseStatus('share');
      }, error => {
        this.api_error = error.error;
        this.disableButton = false;
      });
    } else {
      this.provider_services.sendWaitlistQnrNotification(this.data.waitlist_data.ynwUuid, postData).subscribe(data => {
        this.changeQnrReleaseStatus('share');
      }, error => {
        this.api_error = error.error;
        this.disableButton = false;
      });
    }
  }
  resetErrors() {
    this.api_error = null;
  }
  copyMessageInfo() {
    this.changeQnrReleaseStatus();
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.qnrLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackbarService.openSnackBar('Copied to clipboard');
  }
  closeDialog() {
    this.dialogRef.close('reload');
  }
  changeQnrReleaseStatus(type?) {
    const uid = (this.data.source === 'checkin') ? this.data.waitlist_data.ynwUuid : this.data.waitlist_data.uid;
    if (this.data.source === 'checkin') {
      this.provider_services.changeWaitlistQnrReleaseStatus('released', uid, this.data.qnrId).subscribe(data => {
        if (type) {
          this.snackbarService.openSnackBar('Link has been shared');
          setTimeout(() => {
            this.dialogRef.close('reload');
          }, 200);
        }
      }, error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    } else {
      this.provider_services.changeApptQnrReleaseStatus('released', uid, this.data.qnrId).subscribe(data => {
        if (type) {
          this.snackbarService.openSnackBar('Link has been shared');
          setTimeout(() => {
            this.dialogRef.close('reload');
          }, 200);
        }
      }, error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
    }
  }
}
