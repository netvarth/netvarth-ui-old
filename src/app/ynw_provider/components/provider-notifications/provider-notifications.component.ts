import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';

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
      title: 'Notifications',
      url: '/provider/settings/holidays'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  SelchkinNotify = true;
  SelchkincnclNotify = true;
  // pushNotification = false;
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
  savechekinNotification_json: any = [];
  savecancelNotification_json: any = [];
  saveNotification: any = [];

  constructor(private sharedfunctionObj: SharedFunctions) { }

  ngOnInit() {
    this.breadcrumb_moreoptions = { 'show_learnmore': true, 'scrollKey': 'miscellaneous', 'subKey': 'services' };
    this.isCheckin = this.sharedfunctionObj.getitemfromLocalStorage('isCheckin');
  }

  selectChekinNotify() {
    this.SelchkinNotify = false;

  }
  selectChekinCanclNotify() {
    this.SelchkincnclNotify = false;

  }

  unselectChekinNotify() {
    this.SelchkinNotify = true;
  }
  unselectChekinCanclNotify() {
    this.SelchkincnclNotify = true;
  }
  addChkinPh() {
    this.resetApiErrors();
    if (this.notifyphonenumber !== '') {
      const curphone = this.notifyphonenumber;
      const pattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = Messages.BPROFILE_PRIVACY_PHONE_10DIGITS; // 'Mobile number should have 10 digits';
        return;
      }
      this.ph_arr.push(curphone);
      this.notifyphonenumber = '';
    }


  }

  addChkinemil() {
    this.resetApiErrors();
    if (this.notifyemail !== '') {
      const curemail = this.notifyemail;
      const pattern2 = new RegExp(projectConstants.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = Messages.BPROFILE_PRIVACY_EMAIL_INVALID; // 'Please enter a valid email id';
        return;
      }
      this.em_arr.push(curemail);
      this.notifyemail = '';
    }

  }
  addCheknCanclph() {
    this.resetApiErrors();
    if (this.notifycanclphonenumber !== '') {
      const curphone1 = this.notifycanclphonenumber;
      const pattern = new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = Messages.BPROFILE_PRIVACY_PHONE_INVALID; // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = Messages.BPROFILE_PRIVACY_PHONE_10DIGITS; // 'Mobile number should have 10 digits';
        return;
      }
      this.ph1_arr.push(curphone1);
      this.notifycanclphonenumber = '';
    }


  }

  addCheknCanclemil() {
    this.resetApiErrors();
    if (this.notifycanclemail !== '') {
      const curemail1 = this.notifycanclemail;
      const pattern2 = new RegExp(projectConstants.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.api_error = Messages.BPROFILE_PRIVACY_EMAIL_INVALID; // 'Please enter a valid email id';
        return;
      }
      this.em1_arr.push(curemail1);
      this.notifycanclemail = '';
    }
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  removeChkinPh() { }

  saveNotifications() {
    this.savechekinNotification_json.push({
      'type': 'create checkin',
      'sms': this.ph_arr,
      'email': this.em_arr,
      'pushnotifications': this.cheknpush
    });

    this.savecancelNotification_json.push({
      'type': 'cancel checkin',
      'sms': this.ph1_arr,
      'email': this.em1_arr,
      'pushnotifications': this.cancelpush
    });
// alert(JSON.stringify(this.savechekinNotification_json))
// alert(JSON.stringify(this.savecancelNotification_json))
    this.saveNotification.push(this.savechekinNotification_json);
    this.saveNotification.push(this.savecancelNotification_json);
    this.saveNotification = [];
  }


}
