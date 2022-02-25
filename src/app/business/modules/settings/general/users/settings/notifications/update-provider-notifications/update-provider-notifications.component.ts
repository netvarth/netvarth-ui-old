import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupStorageService } from '../../../../../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../../../../shared/services/word-processor.service';
import { projectConstantsLocal } from '../../../../../../../../shared/constants/project-constants';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../../services/provider-services.service';
import { TelegramInfoComponent } from '../../../../../comm/telegram-info/telegram-info.component';
import { AddproviderAddonComponent } from '../../../../../../../../business/modules/add-provider-addons/add-provider-addons.component';

@Component({
  selector: 'app-update-provider-notifications',
  templateUrl: './update-provider-notifications.component.html',
  styleUrls: ['./update-provider-notifications.component.css']
})
export class UpdateProviderUserNotificationsComponent implements OnInit {
  @Input() type;
  @Input() userid;
  @Input() internationalUser;
  telegram = false;
  sms = false;
  email = false;
  cheknPushph = false;
  cancelTelegram = false;
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
  notificationJson: any = {};
  cancelNotificationJson: any = {};
  notifyTele = '';
  teleCountrycode = '+91';
  tele1Countrycode = '+91';
  smsCountrycode = '+91';
  sms1Countrycode = '+91';
  pushCountrycode = '+91';
  push1Countrycode = '+91';
  notifycancltelegram = '';
  tele_arr: any = [];
  isInternationalUser;
  chatId;
  val: any = [];
  tele1_arr: any = [];
  constructor(private sharedfunctionObj: SharedFunctions,
    public dialogRef: MatDialogRef<UpdateProviderUserNotificationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public provider_services: ProviderServices,
    private groupService: GroupStorageService,
    private shared_functions: SharedFunctions,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor) {
  }

  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    this.getNotificationList();
    this.getSMSCredits();
    this.isInternationalUser = this.internationalUser;
    console.log(this.isInternationalUser)
  }
  getNotificationList() {
    this.api_loading = true;
    this.provider_services.getUserNotificationList(this.userid)
      .subscribe(
        data => {
          this.notificationList = data;
          this.setNotificationList(this.notificationList);
        },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        }
      );
  }
  setNotificationList(notificationList) {
    if (notificationList.length !== 0) {
      let addList = [];
      let cancelList = [];
      if (this.type === 'Token' || this.type === 'Check-in') {
        addList = notificationList.filter(notification => notification.eventType === 'WAITLISTADD');
        cancelList = notificationList.filter(notification => notification.eventType === 'WAITLISTCANCEL');
      } else if (this.type === 'Appointment') {
        addList = notificationList.filter(notification => notification.eventType === 'APPOINTMENTADD');
        cancelList = notificationList.filter(notification => notification.eventType === 'APPOINTMENTCANCEL');
      }
      if (addList && addList[0]) {
        // if (addList[0].email.length === 0 && addList[0].sms.length === 0 && addList[0].pushMsg.length === 0) {
        //   this.SelchkinNotify = false;
        // }
        if (addList[0].email && addList[0].email.length !== 0) {
          this.em_arr = addList[0].email;
          // this.SelchkinNotify = true;
        }
        if (addList[0].sms && addList[0].sms.length !== 0) {
          this.ph_arr = addList[0].sms;
          // this.SelchkinNotify = true;
        }
        if (addList[0].pushMsg && addList[0].pushMsg.length !== 0) {
          this.cheknPushph_arr = addList[0].pushMsg;
          // this.SelchkinNotify = true;
        }
        if (addList[0].telegramPhone && addList[0].telegramPhone.length !== 0) {
          this.tele_arr = addList[0].telegramPhone;

          // this.SelchkinNotify = true;
        }
        if (addList[0].status === 'Enable') {
          this.SelchkinNotify = true;
        } else {
          this.SelchkinNotify = false;
        }
      }
      if (cancelList && cancelList[0]) {
        // if (cancelList[0].email.length === 0 && cancelList[0].sms.length === 0 && cancelList[0].pushMsg.length === 0) {
        //   this.SelchkincnclNotify = false;
        // }
        if (cancelList[0].email && cancelList[0].email.length !== 0) {
          this.em1_arr = cancelList[0].email;
          // this.SelchkincnclNotify = true;
        }
        if (cancelList[0].sms && cancelList[0].sms.length !== 0) {
          this.ph1_arr = cancelList[0].sms;
          // this.SelchkincnclNotify = true;
        }
        if (cancelList[0].telegramPhone && cancelList[0].telegramPhone.length !== 0) {
          this.tele1_arr = cancelList[0].telegramPhone;
          // this.SelchkincnclNotify = true;
        }
        if (cancelList[0].pushMsg && cancelList[0].pushMsg.length !== 0) {
          this.cheknCancelPushph_arr = cancelList[0].pushMsg;
          // this.SelchkincnclNotify = true;
        }
        
        if (cancelList[0].status === 'Enable') {
          this.SelchkincnclNotify = true;
        } else {
          this.SelchkincnclNotify = false;
        }
      }
      this.api_loading = false;
    }
  }
  selectChekinNotify(event) {
    this.SelchkinNotify = event.checked;
    // if (!this.SelchkinNotify) {
    //   this.chekinNotifications('newcheckin');
    // }
    this.notificationJson = {};
    if (this.type === 'Token' || this.type === 'Check-in') {
      this.notificationJson.resourceType = 'CHECKIN';
      this.notificationJson.eventType = 'WAITLISTADD';
    } else if (this.type === 'Appointment') {
      this.notificationJson.resourceType = 'APPOINTMENT';
      this.notificationJson.eventType = 'APPOINTMENTADD';
    } else if (this.type === 'Donation') {
      this.notificationJson.resourceType = 'DONATION';
      this.notificationJson.eventType = 'DONATIONSERVICE';
    } else if (this.type === 'Account') {
      this.notificationJson.resourceType = 'ACCOUNT';
      this.notificationJson.eventType = 'LICENSE';
    } else if (this.type === 'Order') {
      this.notificationJson.resourceType = 'ORDER';
      this.notificationJson.eventType = 'ORDERCONFIRM';
    }
    this.notificationJson.providerId = this.userid;
    this.setProviderNotificationStatus(event, this.notificationJson);
  }
  selectChekinCanclNotify(event) {
    this.SelchkincnclNotify = event.checked;
    this.cancelNotificationJson = {};
    if (this.type === 'Token' || this.type === 'Check-in') {
      this.cancelNotificationJson.resourceType = 'CHECKIN';
      this.cancelNotificationJson.eventType = 'WAITLISTCANCEL';
    } else if (this.type === 'Appointment') {
      this.cancelNotificationJson.resourceType = 'APPOINTMENT';
      this.cancelNotificationJson.eventType = 'APPOINTMENTCANCEL';
    } else if (this.type === 'Order') {
      this.cancelNotificationJson.resourceType = 'ORDER';
      this.cancelNotificationJson.eventType = 'ORDERCANCEL';
    }
    this.cancelNotificationJson.providerId = this.userid;
    this.setProviderNotificationStatus(event, this.cancelNotificationJson);
    // if (!this.SelchkincnclNotify) {
    //   this.checkinCancelNotifications('cancelcheckin');
    // }
  }
  setProviderNotificationStatus(event, post_data) {
    const status = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.updateProviderNotificationStatus(status, post_data)
      .subscribe(
        () => {
          this.snackbarService.openSnackBar('Notification ' + status + 'd successfully', { 'panelclass': 'snackbarerror' });
          this.dialogRef.close();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  addChkinPh() {
    if (this.notifyphonenumber === '') {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyphonenumber !== '') {
      const curphone = this.notifyphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.ph_arr.length === 0) {
        if (this.smsCountrycode) {
          const val = {
            'number': curphone,
            'countryCode': this.smsCountrycode
          }
          this.ph_arr.push(val);
        }
        else {
          const val = {
            'number': curphone,
            'countryCode': '+91'
          }
          this.ph_arr.push(val);
        }
      }
      else {
        this.isSmsNumExists(curphone)
      }
      // if (this.ph_arr.indexOf(curphone) === -1) {
      //   this.ph_arr.push(curphone);

      // } else {
      //   this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
      //   // 'Phone number already exists'
      // }
      this.okCheckinStatus = true;
      this.notifyphonenumber = '';
    }
  }
  isSmsNumExists(curphone) {
    if (this.smsCountrycode) {
      this.val = {
        'number': curphone,
        'countryCode': this.smsCountrycode
      }
    }
    else {
      this.val = {
        'number': curphone,
        'countryCode': '+91'
      }
    }
    const indx = this.ph_arr.filter(vale => (vale.number === this.val.number));
    if (indx.length > 0) {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
    } else {
      this.ph_arr.push(this.val);
      // this.tele_arr.splice(indx, 1);

    }
  }
  addcheknPushPh() {
    if (this.notifycheknPushphonenumber === '') {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycheknPushphonenumber !== '') {
      const curphone = this.notifycheknPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.cheknPushph_arr.length === 0) {
        if (this.pushCountrycode) {
          const val = {
            'number': curphone,
            'countryCode': this.pushCountrycode
          }
          this.cheknPushph_arr.push(val);
        }
        else {
          const val = {
            'number': curphone,
            'countryCode': '+91'
          }
          this.cheknPushph_arr.push(val);
        }
      }
      else {
        this.isPushNumExists(curphone)
      }
      // if (this.cheknPushph_arr.indexOf(curphone) === -1) {
      //   this.cheknPushph_arr.push(curphone);
      // } else {
      //   this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
      //   // 'Phone number already exists'
      // }
      this.okCheckinStatus = true;
      this.notifycheknPushphonenumber = '';
      this.cheknPushph = false;
    }
  }
  isPushNumExists(curphone) {
    if (this.pushCountrycode) {
      this.val = {
        'number': curphone,
        'countryCode': this.pushCountrycode
      }
    }
    else {
      this.val = {
        'number': curphone,
        'countryCode': '+91'
      }
    }
    const indx = this.cheknPushph_arr.filter(vale => (vale.number === this.val.number));
    if (indx.length > 0) {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
    } else {
      this.cheknPushph_arr.push(this.val);
      // this.tele_arr.splice(indx, 1);
    }
  }
  addChkinemil() {
    if (this.notifyemail === '') {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifyemail !== '') {
      const curemail = this.notifyemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      if (this.em_arr.indexOf(curemail) === -1) {
        this.em_arr.push(curemail);
      } else {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.okCheckinStatus = true;
      this.notifyemail = '';
    }
  }
  addTele() {
    if (this.notifyTele === '') {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.teleCountrycode !== '') {
      const curTelecode = this.teleCountrycode;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_COUNTRYCODE);
      const result = pattern.test(curTelecode);
      if (!result) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_COUNTRYCODE'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
    }
    if (this.notifyTele !== '') {
      const curTele = this.notifyTele;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curTele);
      if (!result) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curTele);
      if (!result1) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      // this.provider_services.telegramChat(this.removePlus(this.teleCountrycode), curTele).subscribe(data => {
      //   this.chatId = data;
      //   if (this.chatId === null) {
      //     this.telegramInfo();
      //   }
      // },
      // );
      if (this.tele_arr.length === 0) {
        this.provider_services.telegramChat(this.removePlus(this.teleCountrycode), curTele).subscribe(data => {
          this.chatId = data;
          if (this.chatId === null) {
            this.telegramInfo();
          }
          else {
            if (this.teleCountrycode) {
              const val = {
                'number': curTele,
                'countryCode': this.teleCountrycode
              }
              this.tele_arr.push(val);
            }
            else {
              const val = {
                'number': curTele,
                'countryCode': '+91'
              }
              this.tele_arr.push(val);
            }
            this.notifyTele = '';
          }
        },
        );

      }
      else {
        this.isTeleNumExists(curTele)

      }
      this.okCheckinStatus = true;
      // this.notifyTele = '';
    }
  }
  isTeleNumExists(curTele) {
    this.provider_services.telegramChat(this.removePlus(this.teleCountrycode), curTele).subscribe(data => {
      this.chatId = data;
      if (this.chatId === null) {
        this.telegramInfo();
      }
      else {
        if (this.teleCountrycode) {
          this.val = {
            'number': curTele,
            'countryCode': this.teleCountrycode
          }
        }
        else {
          this.val = {
            'number': curTele,
            'countryCode': '+91'
          }
        }
        const indx = this.tele_arr.filter(vale => (vale.number === this.val.number));
        if (indx.length > 0) {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
          this.notifyTele = ''
        } else {
          this.tele_arr.push(this.val);
          this.provider_services.telegramChat(this.removePlus(this.teleCountrycode), curTele).subscribe(data => {
            this.chatId = data;
            if (this.chatId === null) {
              this.telegramInfo();
            }
          },
          );
        }
        this.notifyTele = '';
      }
    },
    );
    // this.removePlus(this.teleCountrycode)

  }
  addCheknCanclph() {
    if (this.notifycanclphonenumber === '') {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycanclphonenumber !== '') {
      const curphone1 = this.notifycanclphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.ph1_arr.length === 0) {
        if (this.tele1Countrycode) {
          const val = {
            'number': curphone1,
            'countryCode': this.tele1Countrycode
          }
          this.ph1_arr.push(val);
        }
        else {
          const val = {
            'number': curphone1,
            'countryCode': '+91'
          }
          this.ph1_arr.push(val);
        }
      }
      else {
        this.isSmsCancelNumExists(curphone1)
      }

      // this.ph1_arr.push(curphone1);
      this.okCancelStatus = true;
      this.notifycanclphonenumber = '';
    }
  }
  addCheknCancltelegram() {
    if (this.notifycancltelegram === '') {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycancltelegram !== '') {
      const curtele1 = this.notifycancltelegram;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curtele1);
      if (!result) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curtele1);
      if (!result1) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.tele1_arr.length === 0) {
        this.provider_services.telegramChat(this.removePlus(this.tele1Countrycode), curtele1).subscribe(data => {
          this.chatId = data;
          if (this.chatId === null) {
            this.telegramInfo();
          }
          else {
            if (this.tele1Countrycode) {
              const val = {
                'number': curtele1,
                'countryCode': this.tele1Countrycode
              }
              this.tele1_arr.push(val);
            }
            else {
              const val = {
                'number': curtele1,
                'countryCode': '+91'
              }
              this.tele1_arr.push(val);
            }
            this.notifycancltelegram = '';
          }
        },
        );

      }
      else {
        this.isteleCancelNumExists(curtele1)
      }

      this.okCancelStatus = true;
      // this.notifycancltelegram = '';
    }
  }
  isSmsCancelNumExists(curphone1) {
    if (this.sms1Countrycode) {
      this.val = {
        'number': curphone1,
        'countryCode': this.sms1Countrycode
      }
    }
    else {
      this.val = {
        'number': curphone1,
        'countryCode': '+91'
      }
    }
    const indx = this.ph1_arr.filter(vale => (vale.number === this.val.number));
    if (indx.length > 0) {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
    } else {
      this.ph1_arr.push(this.val);
      // this.tele_arr.splice(indx, 1);
    }
  }
  isteleCancelNumExists(curtele1) {
    this.provider_services.telegramChat(this.removePlus(this.tele1Countrycode), curtele1).subscribe(data => {
      this.chatId = data;
      if (this.chatId === null) {
        this.telegramInfo();
      }
      else {
        if (this.tele1Countrycode) {
          this.val = {
            'number': curtele1,
            'countryCode': this.tele1Countrycode
          }
        }
        else {
          this.val = {
            'number': curtele1,
            'countryCode': '+91'
          }
        }
        const indx = this.tele1_arr.filter(vale => (vale.number === this.val.number));
        if (indx.length > 0) {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
          this.notifycancltelegram = ''
        } else {
          this.tele1_arr.push(this.val);
          this.provider_services.telegramChat(this.removePlus(this.tele1Countrycode), curtele1).subscribe(data => {
            this.chatId = data;
            if (this.chatId === null) {
              this.telegramInfo();
            }
          },
          );
        }
        this.notifycancltelegram = '';
      }
    },
    );
    // this.removePlus(this.teleCountrycode)

  }
  ispushCancelNumExists(curphone) {
    if (this.push1Countrycode) {
      this.val = {
        'number': curphone,
        'countryCode': this.push1Countrycode
      }
    }
    else {
      this.val = {
        'number': curphone,
        'countryCode': '+91'
      }
    }
    const indx = this.cheknCancelPushph_arr.filter(vale => (vale.number === this.val.number));
    if (indx.length > 0) {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
    } else {
      this.cheknCancelPushph_arr.push(this.val);
      // this.tele_arr.splice(indx, 1);
    }
  }
  isNumericSign(evt) {
    return this.shared_functions.isNumericSign(evt);
}
  addcheknCancelPushPh() {
    if (this.notifycheknCancelPushphonenumber === '') {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    
    if (this.notifycheknCancelPushphonenumber !== '') {
      const curphone = this.notifycheknCancelPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.cheknCancelPushph_arr.length === 0) {
        if (this.push1Countrycode) {
          const val = {
            'number': curphone,
            'countryCode': this.push1Countrycode
          }
          this.cheknCancelPushph_arr.push(val);
        }
        else {
          const val = {
            'number': curphone,
            'countryCode': '+91'
          }
          this.cheknCancelPushph_arr.push(val);
        }
      }
      else {
        this.ispushCancelNumExists(curphone)
      }

      this.okCancelStatus = true;
      this.notifycheknCancelPushphonenumber = '';
      this.cheknCancelPushph = false;
    }
  }
  addCheknCanclemil() {
    if (this.notifycanclemail === '') {
      this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
      return;
    }
    if (this.notifycanclemail !== '') {
      const curemail1 = this.notifycanclemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
        return;
      }
      if (this.em1_arr.indexOf(curemail1) === -1) {
        this.em1_arr.push(curemail1);
      } else {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
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
      if (((this.type === 'Token' || this.type === 'Check-in') && notifyList.eventType && notifyList.eventType === 'WAITLISTADD') ||
        (this.type === 'Appointment' && notifyList.eventType && notifyList.eventType === 'APPOINTMENTADD') ||
        (this.type === 'Donation' && notifyList.eventType && notifyList.eventType === 'DONATIONSERVICE') ||
        (this.type === 'Account' && notifyList.eventType && notifyList.eventType === 'LICENSE') ||
        (this.type === 'Order' && notifyList.eventType && notifyList.eventType === 'ORDERCONFIRM')) {
        chekinMode = 'UPDATE';
      }
    }
    if (!this.SelchkinNotify) {
      this.em_arr = [];
      this.ph_arr = [];
      this.tele_arr = [];
      this.cheknPushph_arr = [];
    }
    if (this.type === 'Token' || this.type === 'Check-in') {
      this.savechekinNotification_json.resourceType = 'CHECKIN';
      this.savechekinNotification_json.eventType = 'WAITLISTADD';
    } else if (this.type === 'Appointment') {
      this.savechekinNotification_json.resourceType = 'APPOINTMENT';
      this.savechekinNotification_json.eventType = 'APPOINTMENTADD';
    } else if (this.type === 'Donation') {
      this.savechekinNotification_json.resourceType = 'DONATION';
      this.savechekinNotification_json.eventType = 'DONATIONSERVICE';
    } else if (this.type === 'Account') {
      this.savechekinNotification_json.resourceType = 'ACCOUNT';
      this.savechekinNotification_json.eventType = 'LICENSE';
    } else if (this.type === 'Order') {
      this.savechekinNotification_json.resourceType = 'ORDER';
      this.savechekinNotification_json.eventType = 'ORDERCONFIRM';
    }
    this.savechekinNotification_json.sms = this.ph_arr;
    this.savechekinNotification_json.email = this.em_arr;
    this.savechekinNotification_json.pushMsg = this.cheknPushph_arr;
    this.savechekinNotification_json.telegramPhone = this.tele_arr;
    this.savechekinNotification_json.providerId = this.userid;
    this.saveNotifctnJson(this.savechekinNotification_json, chekinMode, source);
  }

  checkinCancelNotifications(source) {
    this.savecancelNotification_json = {};
    let chekincancelMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekincancelMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (((this.type === 'Token' || this.type === 'Check-in') && notifyList.eventType && notifyList.eventType === 'WAITLISTCANCEL') ||
        (this.type === 'Appointment' && notifyList.eventType && notifyList.eventType === 'APPOINTMENTCANCEL') ||
        (this.type === 'Order' && notifyList.eventType && notifyList.eventType === 'ORDERCANCEL')) {
        chekincancelMode = 'UPDATE';
      }
    }
    if (!this.SelchkincnclNotify) {
      this.em1_arr = [];
      this.ph1_arr = [];
      this.tele1_arr = [];
      this.cheknCancelPushph_arr = [];
    }
    if (this.type === 'Token' || this.type === 'Check-in') {
      this.savecancelNotification_json.resourceType = 'CHECKIN';
      this.savecancelNotification_json.eventType = 'WAITLISTCANCEL';
    } else if (this.type === 'Appointment') {
      this.savecancelNotification_json.resourceType = 'APPOINTMENT';
      this.savecancelNotification_json.eventType = 'APPOINTMENTCANCEL';
    } else if (this.type === 'Order') {
      this.savecancelNotification_json.resourceType = 'ORDER';
      this.savecancelNotification_json.eventType = 'ORDERCANCEL';
    }
    this.savecancelNotification_json.sms = this.ph1_arr;
    this.savecancelNotification_json.email = this.em1_arr;
    this.savecancelNotification_json.telegramPhone = this.tele1_arr;
    this.savecancelNotification_json.pushMsg = this.cheknCancelPushph_arr;
    this.savecancelNotification_json.providerId = this.userid;
    this.saveNotifctnJson(this.savecancelNotification_json, chekincancelMode, source);
  }

  saveNotifctnJson(saveNotification_json, mode, source) {
    this.sms = false;
    this.email = false;
    this.cancelemail = false;
    this.cancelsms = false;
    this.cancelTelegram = false;
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
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('ADD NOTIFICATIONS'));
            this.dialogRef.close();
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('UPDATED NOTIFICATIONS'));
            this.dialogRef.close();
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
  telegramAddClicked() {
    if (this.telegram) {
      this.telegram = false;
    } else {
      this.telegram = true;
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
  cancelledCheckintelegramAddClicked() {
    if (this.cancelTelegram) {
      this.cancelTelegram = false;
    } else {
      this.cancelTelegram = true;
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
  removePlus(countryCode) {
    if (countryCode.startsWith('+')) {
      countryCode = countryCode.substring(1);
    }
    return countryCode;
  }
  telegramInfo() {
    const dialogref = this.dialog.open(TelegramInfoComponent, {
      width: '70%',
      height: '60%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'full-screen-modal', 'telegramPopupClass'],
      disableClose: true,
    });
    dialogref.afterClosed().subscribe(
      result => {
        //  this.closeDialog();
        // if (result) {
        // }
      }
    );
  }
}
