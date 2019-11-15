import { Component, OnInit } from '@angular/core';
import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-notifications',
  templateUrl: './provider-notifications.component.html',
  styleUrls: ['./provider-notifications.component.css']
})
export class ProviderNotificationsComponent implements OnInit {

  breadcrumb_moreoptions: any = [];
  isCheckin;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      url: '/provider/settings/miscellaneous',
      title: 'Miscellaneous'
    },
    {
      title: 'Notifications'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  SelchkinNotify = false;
  SelchkincnclNotify = false;
  sms = false;
  email = false;
  cheknpush = false;
  cancelsms = false;
  cancelemail = false;
  cancelpush = false;
  notifyphonenumber = '';
  notifyemail = '';
  notifycanclphonenumber = '';
  notifycanclemail = '';
  api_error = null;
  api_success = null;
  ph_arr: any = [];
  em_arr: any = [];
  ph1_arr: any = [];
  em1_arr: any = [];
  domain;
  savechekinNotification_json: any = {};
  savecancelNotification_json: any = {};
  notificationList: any = [];
  okCheckinStatus = false;
  okCancelStatus = false;
  constructor(private sharedfunctionObj: SharedFunctions,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    public provider_services: ProviderServices) { }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }]};
    this.isCheckin = this.sharedfunctionObj.getitemfromLocalStorage('isCheckin');
    this.getNotificationList();
  }
  getNotificationList() {
    this.provider_services.getNotificationList()
      .subscribe(
        data => {
          this.notificationList = data;
          this.setNotificationList(this.notificationList);
        },
        error => {
          this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        }
      );
  }
  performActions(action) {
    if (action === 'learnmore') {
        this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->notifications']);
    }
}
  setNotificationList(notificationList: any): any {
    if (notificationList.length !== 0) {
      for (const notifyList of notificationList) {
        if (notifyList.eventType && notifyList.eventType === 'WAITLISTADD') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && !notifyList.pushMessage) {
            this.SelchkinNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.em_arr = notifyList.email;
            this.SelchkinNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.ph_arr = notifyList.sms;
            this.SelchkinNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }

          if (notifyList.pushMessage) {
            this.cheknpush = notifyList.pushMessage;
            this.SelchkinNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }
        } else if (notifyList.eventType && notifyList.eventType === 'WAITLISTCANCEL') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && !notifyList.pushMessage) {
            this.SelchkincnclNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.em1_arr = notifyList.email;
            this.SelchkincnclNotify = true;
          }
          // else {
          //   this.SelchkincnclNotify = false;
          // }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.ph1_arr = notifyList.sms;
            this.SelchkincnclNotify = true;
          }
          // else {
          //   this.SelchkincnclNotify = false;
          // }
          if (notifyList.pushMessage) {
            this.cancelpush = notifyList.pushMessage;
            this.SelchkincnclNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }
        }
      }
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
    this.resetApiErrors();
    if (this.notifyphonenumber === '') {
      this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyphonenumber !== '') {
      const curphone = this.notifyphonenumber;
      const pattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      this.ph_arr.push(curphone);
      this.okCheckinStatus = true;
      this.notifyphonenumber = '';
    }
  }
  addChkinemil() {
    this.resetApiErrors();
    if (this.notifyemail === '') {
      this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifyemail !== '') {
      const curemail = this.notifyemail.trim();
      const pattern2 = new RegExp(projectConstants.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      this.em_arr.push(curemail);
      this.okCheckinStatus = true;
      this.notifyemail = '';
    }
  }
  addCheknCanclph() {
    this.resetApiErrors();
    if (this.notifycanclphonenumber === '') {
      this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycanclphonenumber !== '') {
      const curphone1 = this.notifycanclphonenumber;
      const pattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      this.ph1_arr.push(curphone1);
      this.okCancelStatus = true;
      this.notifycanclphonenumber = '';
    }
  }
  addCheknCanclemil() {
    this.resetApiErrors();
    if (this.notifycanclemail === '') {
      this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
      return;
    }
    if (this.notifycanclemail !== '') {
      const curemail1 = this.notifycanclemail.trim();
      const pattern2 = new RegExp(projectConstants.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
        return;
      }
      this.em1_arr.push(curemail1);
      this.notifycanclemail = '';
      this.okCancelStatus = true;
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  chekinNotifications(source) {
    this.savechekinNotification_json = {};
    let chekinMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekinMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'WAITLISTADD') {
        chekinMode = 'UPDATE';
      }
    }
    if (!this.SelchkinNotify) {
      this.em_arr = [];
      this.ph_arr = [];
      this.cheknpush = false;
    }
    this.savechekinNotification_json.resourceType = 'CHECKIN';
    this.savechekinNotification_json.eventType = 'WAITLISTADD';
    this.savechekinNotification_json.sms = this.ph_arr;
    this.savechekinNotification_json.email = this.em_arr;
    this.savechekinNotification_json.pushMessage = this.cheknpush;
    this.saveNotifctnJson(this.savechekinNotification_json, chekinMode, source);
  }

  checkinCancelNotifications(source) {
    this.savecancelNotification_json = {};
    let chekincancelMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekincancelMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'WAITLISTCANCEL') {
        chekincancelMode = 'UPDATE';
      }
    }
    if (!this.SelchkincnclNotify) {
      this.em1_arr = [];
      this.ph1_arr = [];
      this.cancelpush = false;
    }
    this.savecancelNotification_json.resourceType = 'CHECKIN';
    this.savecancelNotification_json.eventType = 'WAITLISTCANCEL';
    this.savecancelNotification_json.sms = this.ph1_arr;
    this.savecancelNotification_json.email = this.em1_arr;
    this.savecancelNotification_json.pushMessage = this.cancelpush;
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
            this.api_success = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ADD NOTIFICATIONS'));
          },
          error => {
            this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
            this.api_success = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('UPDATED NOTIFICATIONS'));
          },
          error => {
            this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
  cancelledCheckinsmsAddClicked() {
    if (this.cancelsms) {
      this.cancelsms = false;
    } else {
      this.cancelsms = true;
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
  changePushMsgStatus(source) {
    if (source === 'newcheckin') {
      this.okCheckinStatus = true;
    }
    if (source === 'cancelcheckin') {
      this.okCancelStatus = true;
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->' + mod]);
  }
}
