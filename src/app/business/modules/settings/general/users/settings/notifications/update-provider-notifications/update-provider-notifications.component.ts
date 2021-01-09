import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../../../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { AddproviderAddonComponent } from '../../../../../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-update-provider-notifications',
  templateUrl: './update-provider-notifications.component.html',
  styleUrls: ['./update-provider-notifications.component.css']
})
export class UpdateProviderNotificationsComponent implements OnInit {

  sms = false;
  email = false;
  cheknPushph = false;
  cheknCancelPushph = false;
  cancelsms = false;
  cancelemail = false;
  cancelpush = false;
  notifyphonenumber = '';
  notifycheknPushphonenumber = '';
  notifycheknCancelPushphonenumber = '';
  notifyemail = '';
  notifycanclphonenumber = '';
  notifycanclemail = '';
  ph_arr: any = [];
  cheknPushph_arr: any = [];
  cheknCancelPushph_arr: any = [];
  em_arr: any = [];
  ph1_arr: any = [];
  em1_arr: any = [];
  savechekinNotification_json: any = {};
  savecancelNotification_json: any = {};
  notificationList: any = [];
  okCheckinStatus = false;
  okCancelStatus = false;
  SelchkinNotify = false;
  SelchkincnclNotify = false;
  settings: any = [];
  api_loading = false;
  smsCredits;
  is_smsLow = false;
  smsWarnMsg: string;
  is_noSMS = false;
  corpSettings: any;
  addondialogRef: any;
  accountType;
  constructor(private sharedfunctionObj: SharedFunctions,
    public dialogRef: MatDialogRef<UpdateProviderNotificationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public provider_services: ProviderServices) {
  }

  ngOnInit() {
    const user = this.sharedfunctionObj.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    this.getNotificationList();
    this.getSMSCredits();
  }
  getNotificationList() {
    this.api_loading = true;
    this.provider_services.getUserNotificationList(this.data.userId)
      .subscribe(
        data => {
          this.notificationList = data;
          this.setNotificationList(this.notificationList);
        },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        }
      );
  }
  setNotificationList(notificationList) {
    if (notificationList.length !== 0) {
      let addList = [];
      let cancelList = [];
      if (this.data.type === 'Token' || this.data.type === 'Check-in') {
        addList = notificationList.filter(notification => notification.eventType === 'WAITLISTADD');
        cancelList = notificationList.filter(notification => notification.eventType === 'WAITLISTCANCEL');
      } else if (this.data.type === 'Appointment') {
        addList = notificationList.filter(notification => notification.eventType === 'APPOINTMENTADD');
        cancelList = notificationList.filter(notification => notification.eventType === 'APPOINTMENTCANCEL');
      }
      if (addList && addList[0]) {
        if (addList[0].email.length === 0 && addList[0].sms.length === 0 && addList[0].pushMsg.length === 0) {
          this.SelchkinNotify = false;
        }
        if (addList[0].email && addList[0].email.length !== 0) {
          this.em_arr = addList[0].email;
          this.SelchkinNotify = true;
        }
        if (addList[0].sms && addList[0].sms.length !== 0) {
          this.ph_arr = addList[0].sms;
          this.SelchkinNotify = true;
        }
        if (addList[0].pushMsg && addList[0].pushMsg.length !== 0) {
          this.cheknPushph_arr = addList[0].pushMsg;
          this.SelchkinNotify = true;
        }
      }
      if (cancelList && cancelList[0]) {
        if (cancelList[0].email.length === 0 && cancelList[0].sms.length === 0 && cancelList[0].pushMsg.length === 0) {
          this.SelchkincnclNotify = false;
        }
        if (cancelList[0].email && cancelList[0].email.length !== 0) {
          this.em1_arr = cancelList[0].email;
          this.SelchkincnclNotify = true;
        }
        if (cancelList[0].sms && cancelList[0].sms.length !== 0) {
          this.ph1_arr = cancelList[0].sms;
          this.SelchkincnclNotify = true;
        }
        if (cancelList[0].pushMsg && cancelList[0].pushMsg.length !== 0) {
          this.cheknCancelPushph_arr = cancelList[0].pushMsg;
          this.SelchkincnclNotify = true;
        }
      }
      this.api_loading = false;
    }
  }
  selectChekinNotify(event) {
    this.SelchkinNotify = event.checked;
    if (!this.SelchkinNotify) {
      this.chekinNotifications('newcheckin');
    }
  }
  selectChekinCanclNotify(event) {
    this.SelchkincnclNotify = event.checked;
    if (!this.SelchkincnclNotify) {
      this.checkinCancelNotifications('cancelcheckin');
    }
  }

  addChkinPh() {
    if (this.notifyphonenumber === '') {
      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyphonenumber !== '') {
      const curphone = this.notifyphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.ph_arr.indexOf(curphone) === -1) {
        this.ph_arr.push(curphone);
      } else {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okCheckinStatus = true;
      this.notifyphonenumber = '';
    }
  }
  addcheknPushPh() {
    if (this.notifycheknPushphonenumber === '') {
      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycheknPushphonenumber !== '') {
      const curphone = this.notifycheknPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.cheknPushph_arr.indexOf(curphone) === -1) {
        this.cheknPushph_arr.push(curphone);
      } else {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okCheckinStatus = true;
      this.notifycheknPushphonenumber = '';
      this.cheknPushph = false;
    }
  }
  addChkinemil() {
    if (this.notifyemail === '') {
      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifyemail !== '') {
      const curemail = this.notifyemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      if (this.em_arr.indexOf(curemail) === -1) {
        this.em_arr.push(curemail);
      } else {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.okCheckinStatus = true;
      this.notifyemail = '';
    }
  }
  addCheknCanclph() {
    if (this.notifycanclphonenumber === '') {
      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycanclphonenumber !== '') {
      const curphone1 = this.notifycanclphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.ph1_arr.indexOf(curphone1) === -1) {
        this.ph1_arr.push(curphone1);
      } else {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      // this.ph1_arr.push(curphone1);
      this.okCancelStatus = true;
      this.notifycanclphonenumber = '';
    }
  }
  addcheknCancelPushPh() {
    if (this.notifycheknCancelPushphonenumber === '') {
      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycheknCancelPushphonenumber !== '') {
      const curphone = this.notifycheknCancelPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.cheknCancelPushph_arr.indexOf(curphone) === -1) {
        this.cheknCancelPushph_arr.push(curphone);
      } else {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okCancelStatus = true;
      this.notifycheknCancelPushphonenumber = '';
      this.cheknCancelPushph = false;
    }
  }
  addCheknCanclemil() {
    if (this.notifycanclemail === '') {
      this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
      return;
    }
    if (this.notifycanclemail !== '') {
      const curemail1 = this.notifycanclemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
        return;
      }
      if (this.em1_arr.indexOf(curemail1) === -1) {
        this.em1_arr.push(curemail1);
      } else {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.notifycanclemail = '';
      this.okCancelStatus = true;
    }
  }
  chekinNotifications(source) {
    this.savechekinNotification_json = {};
    let chekinMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekinMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (((this.data.type === 'Token' || this.data.type === 'Check-in') && notifyList.eventType && notifyList.eventType === 'WAITLISTADD') ||
        (this.data.type === 'Appointment' && notifyList.eventType && notifyList.eventType === 'APPOINTMENTADD') ||
        (this.data.type === 'Donation' && notifyList.eventType && notifyList.eventType === 'DONATIONSERVICE') ||
        (this.data.type === 'Account' && notifyList.eventType && notifyList.eventType === 'LICENSE') ||
        (this.data.type === 'Order' && notifyList.eventType && notifyList.eventType === 'ORDERCONFIRM')) {
        chekinMode = 'UPDATE';
      }
    }
    if (!this.SelchkinNotify) {
      this.em_arr = [];
      this.ph_arr = [];
      this.cheknPushph_arr = [];
    }
    if (this.data.type === 'Token' || this.data.type === 'Check-in') {
      this.savechekinNotification_json.resourceType = 'CHECKIN';
      this.savechekinNotification_json.eventType = 'WAITLISTADD';
    } else if (this.data.type === 'Appointment') {
      this.savechekinNotification_json.resourceType = 'APPOINTMENT';
      this.savechekinNotification_json.eventType = 'APPOINTMENTADD';
    } else if (this.data.type === 'Donation') {
      this.savechekinNotification_json.resourceType = 'DONATION';
      this.savechekinNotification_json.eventType = 'DONATIONSERVICE';
    } else if (this.data.type === 'Account') {
      this.savechekinNotification_json.resourceType = 'ACCOUNT';
      this.savechekinNotification_json.eventType = 'LICENSE';
    } else if (this.data.type === 'Order') {
      this.savechekinNotification_json.resourceType = 'ORDER';
      this.savechekinNotification_json.eventType = 'ORDERCONFIRM';
    }
    this.savechekinNotification_json.sms = this.ph_arr;
    this.savechekinNotification_json.email = this.em_arr;
    this.savechekinNotification_json.pushMsg = this.cheknPushph_arr;
    this.savechekinNotification_json.providerId = this.data.userId;
    this.saveNotifctnJson(this.savechekinNotification_json, chekinMode, source);
  }

  checkinCancelNotifications(source) {
    this.savecancelNotification_json = {};
    let chekincancelMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekincancelMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (((this.data.type === 'Token' || this.data.type === 'Check-in') && notifyList.eventType && notifyList.eventType === 'WAITLISTCANCEL') ||
        (this.data.type === 'Appointment' && notifyList.eventType && notifyList.eventType === 'APPOINTMENTCANCEL') ||
        (this.data.type === 'Order' && notifyList.eventType && notifyList.eventType === 'ORDERCANCEL')) {
        chekincancelMode = 'UPDATE';
      }
    }
    if (!this.SelchkincnclNotify) {
      this.em1_arr = [];
      this.ph1_arr = [];
      this.cheknCancelPushph_arr = [];
    }
    if (this.data.type === 'Token' || this.data.type === 'Check-in') {
      this.savecancelNotification_json.resourceType = 'CHECKIN';
      this.savecancelNotification_json.eventType = 'WAITLISTCANCEL';
    } else if (this.data.type === 'Appointment') {
      this.savecancelNotification_json.resourceType = 'APPOINTMENT';
      this.savecancelNotification_json.eventType = 'APPOINTMENTCANCEL';
    } else if (this.data.type === 'Order') {
      this.savecancelNotification_json.resourceType = 'ORDER';
      this.savecancelNotification_json.eventType = 'ORDERCANCEL';
    }
    this.savecancelNotification_json.sms = this.ph1_arr;
    this.savecancelNotification_json.email = this.em1_arr;
    this.savecancelNotification_json.pushMsg = this.cheknCancelPushph_arr;
    this.savecancelNotification_json.providerId = this.data.userId;
    this.saveNotifctnJson(this.savecancelNotification_json, chekincancelMode, source);
  }

  saveNotifctnJson(saveNotification_json, mode, source) {
    this.sms = false;
    this.email = false;
    this.cancelemail = false;
    this.cancelsms = false;
    if (mode === 'ADD') {
      this.provider_services.addNotificationList(saveNotification_json)
        .subscribe(
          () => {
            this.getNotificationList();
            if (source === 'newcheckin') {
              this.okCheckinStatus = false;
            }
            if (source === 'cancelcheckin') {
              this.okCancelStatus = false;
            }
            this.okCancelStatus = false;
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ADD NOTIFICATIONS'));
            this.dialogRef.close();
          },
          error => {
            this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    } else {
      this.provider_services.updateNotificationList(saveNotification_json)
        .subscribe(
          () => {
            this.getNotificationList();
            if (source === 'newcheckin') {
              this.okCheckinStatus = false;
            }
            if (source === 'cancelcheckin') {
              this.okCancelStatus = false;
            }
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('UPDATED NOTIFICATIONS'));
            this.dialogRef.close();
          },
          error => {
            this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    }
  }
  removePhEmail(phemail, array, source) {
    const index = array.indexOf(phemail);
    if (index > -1) {
      array.splice(index, 1);
    }
    if (source === 'newcheckin') {
      this.okCheckinStatus = true;
    }
    if (source === 'cancelcheckin') {
      this.okCancelStatus = true;
    }
  }
  smsAddClicked() {
    if (this.sms) {
      this.sms = false;
    } else {
      this.sms = true;
    }
  }
  cheknPushAddClicked() {
    if (this.cheknPushph) {
      this.cheknPushph = false;
    } else {
      this.cheknPushph = true;
    }
  }
  cancelledCheckinsmsAddClicked() {
    if (this.cancelsms) {
      this.cancelsms = false;
    } else {
      this.cancelsms = true;
    }
  }
  cheknCancelPushAddClicked() {
    if (this.cheknCancelPushph) {
      this.cheknCancelPushph = false;
    } else {
      this.cheknCancelPushph = true;
    }
  }

  emailAddClicked() {
    if (this.email) {
      this.email = false;
    } else {
      this.email = true;
    }
  }
  cancelledCheckinemailAddClicked() {
    if (this.cancelemail) {
      this.cancelemail = false;
    } else {
      this.cancelemail = true;
    }
  }
  isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
  }
  getSMSCredits() {
    this.provider_services.getSMSCredits().subscribe(data => {
      this.smsCredits = data;
      if (this.smsCredits < 5 && this.smsCredits > 0) {
        this.is_smsLow = true;
        this.smsWarnMsg = Messages.LOW_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else if (this.smsCredits === 0) {
        this.is_smsLow = true;
        this.is_noSMS = true;
        this.smsWarnMsg = Messages.NO_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else {
        this.is_smsLow = false;
        this.is_noSMS = false;
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
    if (this.corpSettings && this.corpSettings.isCentralised) {
      this.sharedfunctionObj.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
    } else {
      this.addondialogRef = this.dialog.open(AddproviderAddonComponent, {
        width: '50%',
        data: {
          type: 'addons'
        },
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true
      });
      this.addondialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getSMSCredits();
        }
      });
    }
  }
}
