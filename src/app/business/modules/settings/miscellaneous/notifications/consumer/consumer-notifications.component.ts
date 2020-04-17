import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderDataStorageService } from '../../../../../../ynw_provider/services/provider-datastorage.service';

@Component({
  selector: 'app-consumer-notifications',
  templateUrl: './consumer-notifications.component.html'
})
export class ConsumerNotificationsComponent implements OnInit {

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
      title: 'Notifications',
      url: '/provider/settings/miscellaneous/notifications',
    },
    {
      title: 'Consumer'
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
  domain;
  cust_domain_name = '';
  mode_of_notify = '';
  notification: any = [];
  savechekinNotification_json: any = {};
  savecancelNotification_json: any = {};
  notificationList: any = [];
  okCheckinStatus = false;
  okCancelStatus = false;
  earlyNotificatonSettings = { eventType: 'EARLY', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false, personsAhead: '' };
  prefinalNotificationSettings = { eventType: 'PREFINAL', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false };
  finalNotificationSettings = { eventType: 'FINAL', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false };
  showButton: any = {};
  customer_label = '';
  cSettings: any = { 'EARLY': false, 'PREFINAL': false, 'FINAL': false };
  consumerNotification;
  notification_statusstr: string;
  constructor(private sharedfunctionObj: SharedFunctions,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    public provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.sharedfunctionObj.getitemFromGroupStorage('isCheckin');
    this.getNotificationSettings();
    this.getNotificationList();
    this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
    this.mode_of_notify = Messages.FRM_LVL_CUSTMR_NOTIFY_MODE.replace('[customer]', this.customer_label);
  }
  // isNumeric(evt) {
  //   return this.sharedfunctionObj.isNumeric(evt);
  // }
  isvalid(evt) {
    return this.sharedfunctionObj.isValid(evt);
  }
  numberOnly(event):
    boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) { return false; } return true;
  }

  getNotificationList() {
    this.provider_services.getConsumerNotificationSettings()
      .subscribe(
        data => {
          this.notificationList = data;
          if (this.notificationList) {
            this.setNotifications(this.notificationList);
          }
        },
        error => {
          this.api_error = this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        }
      );
  }
  handleNotificationSettings(event) {
    const value = (event.checked) ? true : false;
    const status = (value) ? 'enabled' : 'disabled';
    // const state = (value) ? 'Enable' : 'Disable';
    const notificationSettings = {
      'sendNotification': value
    };
    this.provider_services.setWaitlistMgr(notificationSettings).subscribe(data => {
      this.shared_functions.openSnackBar('Notifications ' + status + ' successfully');
      this.getNotificationSettings();
    }, (error) => {
      this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getNotificationSettings();
    });
  }
  getNotificationSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(
        (data: any) => {
          const waitlist_manager = data;
          this.consumerNotification = waitlist_manager.sendNotification;
          this.notification_statusstr = (this.consumerNotification) ? 'On' : 'Off';
          this.provider_datastorage.set('waitlistManage', data);
        },
        () => {

        }
      );
  }
  setNotifications(notificationList: any) {
    notificationList.forEach(notificationObj => {
      if (notificationObj['eventType'] === 'EARLY') {
        this.cSettings['EARLY'] = true;
        this.earlyNotificatonSettings = notificationObj;
      } else if (notificationObj['eventType'] === 'PREFINAL') {
        this.prefinalNotificationSettings = notificationObj;
        this.cSettings['PREFINAL'] = true;
      } else if (notificationObj['eventType'] === 'FINAL') {
        this.cSettings['FINAL'] = true;
        this.finalNotificationSettings = notificationObj;
      }
    });
  }

  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->notifications']);
    }
  }
  showSubmit(type) {
    this.showButton[type] = true;
  }
  changeNotificationSettings(type) {
    let activeInput;
    if (type === 'EARLY') {
      activeInput = this.earlyNotificatonSettings;
    } else if (type === 'PREFINAL') {
      activeInput = this.prefinalNotificationSettings;
    } else if (type === 'FINAL') {
      activeInput = this.finalNotificationSettings;
    }
    if (this.cSettings[type]) {
      this.provider_services.updateConsumerNotificationSettings(activeInput).subscribe(
        () => {
          this.sharedfunctionObj.openSnackBar(Messages.CONSUMERSETTINGSSUCCESS);
          this.showButton[type] = false;
        },
        (error) => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getNotificationList();
        }
      );
    } else {
      this.provider_services.saveConsumerNotificationSettings(activeInput).subscribe(
        () => {
          this.sharedfunctionObj.openSnackBar(Messages.CONSUMERSETTINGSSUCCESS);
          this.showButton[type] = false;
        },
        (error) => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getNotificationList();
        }
      );
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->' + mod]);
  }
}
