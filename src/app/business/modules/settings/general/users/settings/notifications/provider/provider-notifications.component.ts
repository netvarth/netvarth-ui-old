import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import { AddproviderAddonComponent } from '../../../../../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { UpdateProviderNotificationsComponent } from '../update-provider-notifications/update-provider-notifications.component';
import { GroupStorageService } from '../../../../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-provider-notifications',
  templateUrl: './provider-notifications.component.html'
})
export class ProviderNotificationUserComponent implements OnInit {

  breadcrumb_moreoptions: any = [];
  isCheckin;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: Messages.GENERALSETTINGS,
      url: '/provider/settings/general'
    },
    {
      url: '/provider/settings/general/users',
      title: 'Users'

    },
  ];
  mode_of_notify = '';
  breadcrumbs = this.breadcrumbs_init;
  SelchkinNotify = false;
  SelchkincnclNotify = false;
  sms = false;
  email = false;
  pushcheckin = false;
  cheknpush = false;
  cancelsms = false;
  pushcancelph = false;
  cancelemail = false;
  cancelpush = false;
  smsAppt = false;
  pushApptPh = false;
  emailAppt = false;
  apptPush = false;
  cancelsmsAppt = false;
  pushcancelAppt = false;
  cancelemailAppt = false;
  cancelpushAppt = false;
  notifyphonenumber = '';
  notifypushcheckinphonenumber = '';
  notifyemail = '';
  notifycanclphonenumber = '';
  notifypushcanclcheckinphonenumber = '';
  notifycanclemail = '';
  notifyApptphonenumber = '';
  notifypushApptphonenumber = '';
  notifyApptemail = '';
  notifyApptcanclphonenumber = '';
  notifypushApptcanclphonenumber = '';
  notifyApptcanclemail = '';
  api_error = null;
  api_success = null;
  ph_arr: any = [];
  pushcheckinph_arr: any = [];
  em_arr: any = [];
  ph1_arr: any = [];
  pushcanclcheckin_arr: any = [];
  em1_arr: any = [];
  apptph_arr: any = [];
  apptpushph_arr: any = [];
  apptem_arr: any = [];
  apptph1_arr: any = [];
  pushapptcancelph_arr: any = [];
  apptem1_arr: any = [];
  domain;
  provdr_domain_name = '';
  provider_label = '';
  savechekinNotification_json: any = {};
  savecancelNotification_json: any = {};
  notificationList: any = [];
  okCheckinStatus = false;
  okCancelStatus = false;
  okApptCancelStatus = false;
  okApptStatus = false;
  selApptNotify = false;
  selApptCancelNotify = false;
  userId: any;
  appointment_status: any;
  waitlistStatus: any;
  donations_status: any;
  settings: any = [];
  showToken = false;
  api_loading = true;
  smsCredits;
  is_smsLow = false;
  smsWarnMsg: string;
  corpSettings: any;
  addondialogRef: any;
  is_noSMS = false;
  isInternationalUser = false;
  constructor(
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    private activatedRoot: ActivatedRoute,
    private provider_servicesobj: ProviderServices,
    private dialog: MatDialog,
    public provider_services: ProviderServices,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService) {
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
  }

  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
    this.provdr_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
    // this.mode_of_notify = Messages.FRM_LVL_CUSTMR_NOTIFY_MODE.replace('[customer]', this.customer_label);
    this.activatedRoot.params.subscribe(params => {
      this.userId = + params.id;
      this.getUser();
    });
    this.getNotificationList();
    this.getGlobalSettingsStatus();
    this.getProviderSettings();
    this.getSMSCredits();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
      }, () => {
      });
  }
  getUser() {
    this.provider_services.getUser(this.userId)
      .subscribe((data: any) => {
        if (data.countryCode !== '+91') {
          this.isInternationalUser = true;
        }
        const breadcrumbs = [];
        this.breadcrumbs_init.map((e) => {
          breadcrumbs.push(e);
        });
        breadcrumbs.push({
          title: data.firstName,
          url: '/provider/settings/general/users/add?type=edit&val=' + this.userId
        });
        breadcrumbs.push({
          title: 'Settings',
          url: '/provider/settings/general/users/' + this.userId + '/settings'
        });
        breadcrumbs.push({
          title: 'Notifications',
          url: '/provider/settings/general/users/' + this.userId + '/settings/notifications'
        });
        breadcrumbs.push({
          title: this.provider_label.charAt(0).toUpperCase() + this.provider_label.substring(1)
        });
        this.breadcrumbs = breadcrumbs;
      });
  }
  getGlobalSettingsStatus() {
    this.provider_services.getGlobalSettings().subscribe(
      (data: any) => {
        this.appointment_status = data.appointment;
        this.waitlistStatus = data.waitlist;
        this.donations_status = data.donationFundRaising;
        this.api_loading = false;
      });
  }
  getNotificationList() {
    this.provider_services.getUserNotificationList(this.userId)
      .subscribe(
        data => {
          this.notificationList = data;
          this.setNotificationList(this.notificationList);
        },
        error => {
          this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        }
      );
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/comm->notifications']);
    }
  }
  setNotificationList(notificationList) {
    if (notificationList && notificationList.length !== 0) {
      for (const notifyList of notificationList) {
        if (notifyList.eventType && notifyList.eventType === 'WAITLISTADD') {
          if (notifyList.email && notifyList.email.length === 0 && notifyList.sms && notifyList.sms.length === 0 && notifyList.pushMsg && notifyList.pushMsg.length === 0) {
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
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.pushcheckinph_arr = notifyList.pushMsg;
            this.SelchkinNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }
        } else if (notifyList.eventType && notifyList.eventType === 'WAITLISTCANCEL') {
          if (notifyList.email && notifyList.email.length === 0 && notifyList.sms && notifyList.sms.length === 0 && notifyList.pushMsg && notifyList.pushMsg.length === 0) {
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
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.pushcanclcheckin_arr = notifyList.pushMsg;
            this.SelchkincnclNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }
        } else if (notifyList.eventType && notifyList.eventType === 'APPOINTMENTADD') {
          if (notifyList.email && notifyList.email.length === 0 && notifyList.sms && notifyList.sms.length === 0 && notifyList.pushMsg && notifyList.pushMsg.length === 0) {
            this.selApptNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.apptem_arr = notifyList.email;
            this.selApptNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.apptph_arr = notifyList.sms;
            this.selApptNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }

          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.apptpushph_arr = notifyList.pushMsg;
            this.selApptNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }
        } else if (notifyList.eventType && notifyList.eventType === 'APPOINTMENTCANCEL') {
          if (notifyList.email && notifyList.email.length === 0 && notifyList.sms && notifyList.sms.length === 0 && notifyList.pushMsg && notifyList.pushMsg.length === 0) {
            this.selApptCancelNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.apptem1_arr = notifyList.email;
            this.selApptCancelNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.apptph1_arr = notifyList.sms;
            this.selApptCancelNotify = true;
          }
          // else {
          //   this.SelchkinNotify = false;
          // }

          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.pushapptcancelph_arr = notifyList.pushMsg;
            this.selApptCancelNotify = true;
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
  selectApptNotify(event) {
    this.selApptNotify = event.checked;
    if (!this.selApptNotify) {
      this.apptNotifications('newappointment');
    }
  }
  selectApptCanclNotify(event) {
    this.selApptCancelNotify = event.checked;
    if (!this.selApptCancelNotify) {
      this.apptCancelNotifications('cancelappointment');
    }
  }

  addChkinPh() {
    this.resetApiErrors();
    if (this.notifyphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyphonenumber !== '') {
      const curphone = this.notifyphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.ph_arr.indexOf(curphone) === -1) {
        this.ph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okCheckinStatus = true;
      this.notifyphonenumber = '';
    }
  }
  addChkinemil() {
    this.resetApiErrors();
    if (this.notifyemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifyemail !== '') {
      const curemail = this.notifyemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      if (this.em_arr.indexOf(curemail) === -1) {
        this.em_arr.push(curemail);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.okCheckinStatus = true;
      this.notifyemail = '';
    }
  }
  addpushChkinPh() {
    this.resetApiErrors();
    if (this.notifypushcheckinphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifypushcheckinphonenumber !== '') {
      const curphone = this.notifypushcheckinphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.pushcheckinph_arr.indexOf(curphone) === -1) {
        this.pushcheckinph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okCheckinStatus = true;
      this.notifypushcheckinphonenumber = '';
    }
  }
  addCheknCanclph() {
    this.resetApiErrors();
    if (this.notifycanclphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycanclphonenumber !== '') {
      const curphone1 = this.notifycanclphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.ph1_arr.indexOf(curphone1) === -1) {
        this.ph1_arr.push(curphone1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }

      this.okCancelStatus = true;
      this.notifycanclphonenumber = '';
    }
  }
  addCheknCanclemil() {
    this.resetApiErrors();
    if (this.notifycanclemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
      return;
    }
    if (this.notifycanclemail !== '') {
      const curemail1 = this.notifycanclemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
        return;
      }
      if (this.em1_arr.indexOf(curemail1) === -1) {
        this.em1_arr.push(curemail1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.notifycanclemail = '';
      this.okCancelStatus = true;
    }
  }
  addCheknCanclpushph() {
    this.resetApiErrors();
    if (this.notifypushcanclcheckinphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifypushcanclcheckinphonenumber !== '') {
      const curphone1 = this.notifypushcanclcheckinphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.pushcanclcheckin_arr.indexOf(curphone1) === -1) {
        this.pushcanclcheckin_arr.push(curphone1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okCancelStatus = true;
      this.notifypushcanclcheckinphonenumber = '';
    }
  }
  addApptPh() {
    this.resetApiErrors();
    if (this.notifyApptphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyApptphonenumber !== '') {
      const curphone = this.notifyApptphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.apptph_arr.indexOf(curphone) === -1) {
        this.apptph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okApptStatus = true;
      this.notifyApptphonenumber = '';
    }
  }
  addApptemail() {
    this.resetApiErrors();
    if (this.notifyApptemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifyApptemail !== '') {
      const curemail = this.notifyApptemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      if (this.apptem_arr.indexOf(curemail) === -1) {
        this.apptem_arr.push(curemail);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.okApptStatus = true;
      this.notifyApptemail = '';
    }
  }
  addpushApptPh() {
    this.resetApiErrors();
    if (this.notifypushApptphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifypushApptphonenumber !== '') {
      const curphone = this.notifypushApptphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.apptpushph_arr.indexOf(curphone) === -1) {
        this.apptpushph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okApptStatus = true;
      this.notifypushApptphonenumber = '';
    }
  }
  addApptCanclph() {
    this.resetApiErrors();
    if (this.notifyApptcanclphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyApptcanclphonenumber !== '') {
      const curphone1 = this.notifyApptcanclphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.apptph1_arr.indexOf(curphone1) === -1) {
        this.apptph1_arr.push(curphone1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okApptCancelStatus = true;
      this.notifyApptcanclphonenumber = '';
    }
  }
  addApptCancelemail() {
    this.resetApiErrors();
    if (this.notifyApptcanclemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
      return;
    }
    if (this.notifyApptcanclemail !== '') {
      const curemail1 = this.notifyApptcanclemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
        return;
      }
      if (this.apptem1_arr.indexOf(curemail1) === -1) {
        this.apptem1_arr.push(curemail1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.notifyApptcanclemail = '';
      this.okApptCancelStatus = true;
    }
  }
  addpushApptCanclph() {
    this.resetApiErrors();
    if (this.notifypushApptcanclphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifypushApptcanclphonenumber !== '') {
      const curphone1 = this.notifypushApptcanclphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.pushapptcancelph_arr.indexOf(curphone1) === -1) {
        this.pushapptcancelph_arr.push(curphone1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okApptCancelStatus = true;
      this.notifypushApptcanclphonenumber = '';
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
      this.pushcheckinph_arr = [];
    }
    this.savechekinNotification_json.resourceType = 'CHECKIN';
    this.savechekinNotification_json.eventType = 'WAITLISTADD';
    this.savechekinNotification_json.sms = this.ph_arr;
    this.savechekinNotification_json.email = this.em_arr;
    this.savechekinNotification_json.pushMsg = this.pushcheckinph_arr;
    this.savechekinNotification_json.providerId = this.userId;
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
      this.pushcanclcheckin_arr = [];
      // this.cancelpush = false;
    }
    this.savecancelNotification_json.resourceType = 'CHECKIN';
    this.savecancelNotification_json.eventType = 'WAITLISTCANCEL';
    this.savecancelNotification_json.sms = this.ph1_arr;
    this.savecancelNotification_json.email = this.em1_arr;
    this.savecancelNotification_json.pushMsg = this.pushcanclcheckin_arr;
    this.savecancelNotification_json.providerId = this.userId;
    this.saveNotifctnJson(this.savecancelNotification_json, chekincancelMode, source);
  }
  apptNotifications(source) {
    this.savechekinNotification_json = {};
    let chekinMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekinMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'APPOINTMENTADD') {
        chekinMode = 'UPDATE';
      }
    }
    if (!this.selApptNotify) {
      this.apptem_arr = [];
      this.apptph_arr = [];
      this.apptpushph_arr = [];
      // this.apptPush = false;
    }
    this.savechekinNotification_json.resourceType = 'APPOINTMENT';
    this.savechekinNotification_json.eventType = 'APPOINTMENTADD';
    this.savechekinNotification_json.sms = this.apptph_arr;
    this.savechekinNotification_json.email = this.apptem_arr;
    this.savechekinNotification_json.pushMsg = this.apptpushph_arr;
    this.savechekinNotification_json.providerId = this.userId;
    this.saveNotifctnJson(this.savechekinNotification_json, chekinMode, source);
  }

  apptCancelNotifications(source) {
    this.savecancelNotification_json = {};
    let chekincancelMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekincancelMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'APPOINTMENTCANCEL') {
        chekincancelMode = 'UPDATE';
      }
    }
    if (!this.selApptCancelNotify) {
      this.apptem1_arr = [];
      this.apptph1_arr = [];
      this.pushapptcancelph_arr = [];
      // this.cancelpushAppt = false;
    }
    this.savecancelNotification_json.resourceType = 'APPOINTMENT';
    this.savecancelNotification_json.eventType = 'APPOINTMENTCANCEL';
    this.savecancelNotification_json.sms = this.apptph1_arr;
    this.savecancelNotification_json.email = this.apptem1_arr;
    this.savecancelNotification_json.pushMsg = this.pushapptcancelph_arr;
    this.savecancelNotification_json.providerId = this.userId;
    this.saveNotifctnJson(this.savecancelNotification_json, chekincancelMode, source);
  }
  saveNotifctnJson(saveNotification_json, mode, source) {
    this.sms = false;
    this.pushcheckin = false;
    this.email = false;
    this.cancelemail = false;
    this.cancelsms = false;
    this.pushcancelph = false;
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
            if (source === 'newappointment') {
              this.okApptStatus = false;
            }
            if (source === 'cancelappointment') {
              this.okApptCancelStatus = false;
            }
            this.okCancelStatus = false;
            this.api_success = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('ADD NOTIFICATIONS'));
          },
          error => {
            this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
            if (source === 'newappointment') {
              this.okApptStatus = false;
            }
            if (source === 'cancelappointment') {
              this.okApptCancelStatus = false;
            }
            this.api_success = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('UPDATED NOTIFICATIONS'));
          },
          error => {
            this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
    if (source === 'newappointment') {
      this.okApptStatus = true;
    }
    if (source === 'cancelappointment') {
      this.okApptCancelStatus = true;
    }
  }
  smsAddClicked() {
    if (this.sms) {
      this.sms = false;
    } else {
      this.sms = true;
    }
  }
  pushcheckinAddClicked() {
    if (this.pushcheckin) {
      this.pushcheckin = false;
    } else {
      this.pushcheckin = true;
    }
  }
  cancelledCheckinsmsAddClicked() {
    if (this.cancelsms) {
      this.cancelsms = false;
    } else {
      this.cancelsms = true;
    }
  }
  pushcancelledCheckinsmsAddClicked() {
    if (this.pushcancelph) {
      this.pushcancelph = false;
    } else {
      this.pushcancelph = true;
    }
  }
  smsApptAddClicked() {
    if (this.smsAppt) {
      this.smsAppt = false;
    } else {
      this.smsAppt = true;
    }
  }
  pushApptAddClicked() {
    if (this.pushApptPh) {
      this.pushApptPh = false;
    } else {
      this.pushApptPh = true;
    }
  }
  cancelledApptsmsAddClicked() {
    if (this.cancelsmsAppt) {
      this.cancelsmsAppt = false;
    } else {
      this.cancelsmsAppt = true;
    }
  }
  pushcancelledApptAddClicked() {
    if (this.pushcancelAppt) {
      this.pushcancelAppt = false;
    } else {
      this.pushcancelAppt = true;
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
  emailApptAddClicked() {
    if (this.emailAppt) {
      this.emailAppt = false;
    } else {
      this.emailAppt = true;
    }
  }
  cancelledApptemailAddClicked() {
    if (this.cancelemailAppt) {
      this.cancelemailAppt = false;
    } else {
      this.cancelemailAppt = true;
    }
  }
  changePushMsgStatus(source) {
    if (source === 'newcheckin') {
      this.okCheckinStatus = true;
    }
    if (source === 'cancelcheckin') {
      this.okCancelStatus = true;
    }
    if (source === 'cancelappointment') {
      this.okApptCancelStatus = true;
    }
    if (source === 'newappointment') {
      this.okApptStatus = true;
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/comm->' + mod]);
  }
  redirecToUserNotifications() {
    this.routerobj.navigate(['provider', 'settings', 'general', 'users', this.userId, 'settings', 'notifications']);
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
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
    this.provider_servicesobj.getLicenseCorpSettings().subscribe(
      (data: any) => {
        this.corpSettings = data;
      }
    );
  }
  gotoSmsAddon() {
    if (this.corpSettings && this.corpSettings.isCentralised) {
      this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
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
  showNotificationPopup(type) {
    if ((type === 'Token' || type === 'Check-in') && !this.waitlistStatus) {
      this.snackbarService.openSnackBar('Jaldee QManager is disabled in your settings', { 'panelClass': 'snackbarerror' });
    } else if (type === 'Appointment' && !this.appointment_status) {
      this.snackbarService.openSnackBar('Jaldee Appointment Manager is disabled in your settings', { 'panelClass': 'snackbarerror' });
    } else {
      const dialogref = this.dialog.open(UpdateProviderNotificationsComponent, {
        width: '40%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          inernationalUser : this.isInternationalUser,
          type: type,
          userId: this.userId
        }
      });
      dialogref.afterClosed().subscribe(
        result => {

        });
    }
  }
}
