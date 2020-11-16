import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { ProviderDataStorageService } from '../../../../../../ynw_provider/services/provider-datastorage.service';
import { AddproviderAddonComponent } from '../../../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { MatDialog } from '@angular/material/dialog';

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
      title: 'Communications And Notifications',
      url: '/provider/settings/comm',
    },
    {
      title: 'Notifications',
      url: '/provider/settings/comm/notifications',
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
  earlyWLNotificatonSettings = { eventType: 'EARLY', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false, personsAhead: '' };
  earlyAPPTNotificatonSettings = { eventType: 'EARLY', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false, personsAhead: '' };
  earlyDONATNotificatonSettings = { eventType: 'EARLY', resourceType: 'DONATION', sms: false, email: false, pushNotification: false, personsAhead: '' };
  prefinalWLNotificationSettings = { eventType: 'PREFINAL', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false };
  prefinalAPPTNotificationSettings = { eventType: 'PREFINAL', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false };
  firstAPPTNotificationSettings = { eventType: 'FIRSTNOTIFICATION', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false, time: '1440' };
  secondAPPTNotificationSettings = { eventType: 'SECONDNOTIFICATION', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false, time: '480' };
  thirdAPPTNotificationSettings = { eventType: 'THIRDNOTIFICATION', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false, time: '240' };
  fourthAPPTNotificationSettings = { eventType: 'FORTHNOTIFICATION', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false, time: '60' };
  prefinalDONATNotificationSettings = { eventType: 'PREFINAL', resourceType: 'DONATION', sms: false, email: false, pushNotification: false };
  finalWLNotificationSettings = { eventType: 'FINAL', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false };
  finalAPPTNotificationSettings = { eventType: 'FINAL', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false };
  finalDONATNotificationSettings = { eventType: 'FINAL', resourceType: 'DONATION', sms: false, email: false, pushNotification: false };
  wlAddNotificationSettings = { eventType: 'WAITLISTADD', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false };
  apptAddNotificationSettings = { eventType: 'APPOINTMENTADD', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false };
  donatAddNotificationSettings = { eventType: 'DONATIONSERVICE', resourceType: 'DONATION', sms: false, email: false, pushNotification: false };
  showButton: any = {};
  customer_label = '';
  cSettings: any = { 'EARLY_WL': false, 'EARLY_APPT': false, 'FIRST_APPT': false, 'SECOND_APPT': false, 'THIRD_APPT': false, 'FOURTH_APPT': false, 'EARLY_DONAT': false, 'PREFINAL_WL': false, 'PREFINAL_APPT': false, 'PREFINAL_DONAT': false, 'FINAL_WL': false, 'FINAL_APPT': false, 'FINAL_DONAT': false, 'WAITLISTADD': false, 'APPOINTMENTADD': false, 'DONATIONSERVICE': false };
  consumerNotification;
  notification_statusstr: string;
  wltstPersonsahead;
  apptPersonsahead;
  firstApptTime;
  secondApptTime;
  thirdApptTime;
  fourthApptTime;
  donatPersonsahead;
  appointment_status: any;
  waitlistStatus: any;
  donations_status: any;
  settings: any = [];
  showToken = false;
  api_loading = true;
  firstapptNotificationTime;
  secondapptNotificationTime;
  thirdapptNotificationTime;
  fourthapptNotificationTime;
  appt_remind_hr = [];
  appt_remind_min = [];
  f_selected_hr = 0;
  f_selected_min = 0;
  s_selected_hr = 0;
  s_selected_min = 0;
  t_selected_hr = 0;
  t_selected_min = 0;
  ft_selected_hr = 0;
  ft_selected_min = 0;
  totaltime;
  firstapp_time: number[];
  secndapp_time: number[];
  thirdapp_time: number[];
  fourthapp_time: number[];
  smsCredits;
  is_smsLow: boolean;
  smsWarnMsg: string;
  corpSettings: any;
  dialogRef: any;
  addondialogRef: any;
  constructor(private sharedfunctionObj: SharedFunctions,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    public provider_services: ProviderServices,
    private provider_servicesobj: ProviderServices,
    private dialog: MatDialog,
    private provider_datastorage: ProviderDataStorageService) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }

  ngOnInit() {
    console.log('consumer notify big');
    for (let j = 0; j <= 60; j++) {
      this.appt_remind_min[j] = j ;
    }
    for (let i = 0; i <= 24; i++) {
      this.appt_remind_hr[i] = i ;
    }
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.sharedfunctionObj.getitemFromGroupStorage('isCheckin');
    this.getNotificationSettings();
    this.getNotificationList();
    this.getGlobalSettingsStatus();
    this.getSMSCredits();
    this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
    this.mode_of_notify = Messages.FRM_LVL_CUSTMR_NOTIFY_MODE.replace('[customer]', this.customer_label);
    const breadcrumbs = [];
    this.breadcrumbs_init.map((e) => {
      breadcrumbs.push(e);
    });
    breadcrumbs.push({
      title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1)
    });
    this.breadcrumbs = breadcrumbs;
    this.getProviderSettings();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
      }, () => {
      });
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
    const status = (value) ? 'Enable' : 'Disable';
    this.provider_services.setNotificationSettings(status).subscribe(data => {
      this.shared_functions.openSnackBar('Notifications ' + status + 'ed successfully');
      this.getNotificationSettings();
    }, (error) => {
      this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getNotificationSettings();
    });
  }
  getNotificationSettings() {
    this.provider_services.getGlobalSettings().subscribe(
      (data: any) => {
        const global_data = data;
        this.consumerNotification = global_data.sendNotification;
        this.notification_statusstr = (this.consumerNotification) ? 'On' : 'Off';
        this.provider_datastorage.set('waitlistManage', data);
      });
  }
  setNotifications(notificationList: any) {
    notificationList.forEach(notificationObj => {
      if (notificationObj['eventType'] === 'EARLY' && notificationObj['resourceType'] === 'CHECKIN') {
        this.cSettings['EARLY_WL'] = true;
        this.earlyWLNotificatonSettings = notificationObj;
        this.wltstPersonsahead = (notificationObj['personsAhead']) ? true : false;
      } else if (notificationObj['eventType'] === 'PREFINAL' && notificationObj['resourceType'] === 'CHECKIN') {
        this.prefinalWLNotificationSettings = notificationObj;
        this.cSettings['PREFINAL_WL'] = true;
      } else if (notificationObj['eventType'] === 'FINAL' && notificationObj['resourceType'] === 'CHECKIN') {
        this.cSettings['FINAL_WL'] = true;
        this.finalWLNotificationSettings = notificationObj;
      } else if (notificationObj['eventType'] === 'WAITLISTADD' && notificationObj['resourceType'] === 'CHECKIN') {
        this.cSettings['WAITLISTADD'] = true;
        this.wlAddNotificationSettings = notificationObj;
      } else if (notificationObj['eventType'] === 'APPOINTMENTADD' && notificationObj['resourceType'] === 'APPOINTMENT') {
        this.cSettings['APPOINTMENTADD'] = true;
        this.apptAddNotificationSettings = notificationObj;
      } else if (notificationObj['eventType'] === 'EARLY' && notificationObj['resourceType'] === 'APPOINTMENT') {
        this.cSettings['EARLY_APPT'] = true;
        this.earlyAPPTNotificatonSettings = notificationObj;
        this.apptPersonsahead = (notificationObj['personsAhead']) ? true : false;
      } else if (notificationObj['eventType'] === 'PREFINAL' && notificationObj['resourceType'] === 'APPOINTMENT') {
        this.cSettings['PREFINAL_APPT'] = true;
        this.prefinalAPPTNotificationSettings = notificationObj;
      } else if (notificationObj['eventType'] === 'FINAL' && notificationObj['resourceType'] === 'APPOINTMENT') {
        this.cSettings['FINAL_APPT'] = true;
        this.finalAPPTNotificationSettings = notificationObj;
      } else if (notificationObj['eventType'] === 'FIRSTNOTIFICATION' && notificationObj['resourceType'] === 'APPOINTMENT') {
        this.cSettings['FIRST_APPT'] = true;
        this.firstapp_time = this.timeinHrMin(notificationObj.time);
        this.f_selected_hr = this.firstapp_time[0];
        this.f_selected_min = this.firstapp_time[1];
        this.firstAPPTNotificationSettings = notificationObj;
        this.firstApptTime = (notificationObj['time']) ? true : false;
      } else if (notificationObj['eventType'] === 'SECONDNOTIFICATION' && notificationObj['resourceType'] === 'APPOINTMENT') {
        this.cSettings['SECOND_APPT'] = true;
        this.secndapp_time = this.timeinHrMin(notificationObj.time);
        this.s_selected_hr = this.secndapp_time[0];
        this.s_selected_min = this.secndapp_time[1];
        this.secondAPPTNotificationSettings = notificationObj;
        this.secondApptTime = (notificationObj['time']) ? true : false;
      } else if (notificationObj['eventType'] === 'THIRDNOTIFICATION' && notificationObj['resourceType'] === 'APPOINTMENT') {
        this.cSettings['THIRD_APPT'] = true;
        this.thirdapp_time = this.timeinHrMin(notificationObj.time);
        this.t_selected_hr = this.thirdapp_time[0];
        this.t_selected_min = this.thirdapp_time[1];
        this.thirdAPPTNotificationSettings = notificationObj;
        this.thirdApptTime = (notificationObj['time']) ? true : false;
      } else if (notificationObj['eventType'] === 'FORTHNOTIFICATION' && notificationObj['resourceType'] === 'APPOINTMENT') {
        this.cSettings['FOURTH_APPT'] = true;
        this.fourthapp_time = this.timeinHrMin(notificationObj.time);
        this.ft_selected_hr = this.fourthapp_time[0];
        this.ft_selected_min = this.fourthapp_time[1];
        this.fourthAPPTNotificationSettings = notificationObj;
        this.fourthApptTime = (notificationObj['time']) ? true : false;
      } else if (notificationObj['eventType'] === 'DONATIONSERVICE' && notificationObj['resourceType'] === 'DONATION') {
        this.cSettings['DONATIONSERVICE'] = true;
        this.donatAddNotificationSettings = notificationObj;
      } else if (notificationObj['eventType'] === 'EARLY' && notificationObj['resourceType'] === 'DONATION') {
        this.cSettings['EARLY_DONAT'] = true;
        this.earlyDONATNotificatonSettings = notificationObj;
        this.donatPersonsahead = (notificationObj['personsAhead']) ? true : false;
      } else if (notificationObj['eventType'] === 'PREFINAL' && notificationObj['resourceType'] === 'DONATION') {
        this.cSettings['PREFINAL_DONAT'] = true;
        this.prefinalDONATNotificationSettings = notificationObj;
      } else if (notificationObj['eventType'] === 'FINAL' && notificationObj['resourceType'] === 'DONATION') {
        this.cSettings['FINAL_DONAT'] = true;
        this.finalDONATNotificationSettings = notificationObj;
      }
    });
  }

  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/comm->notifications']);
    }
  }
  showSubmit(type) {
    this.showButton[type] = true;
  }
  changeNotificationSettings(type) {
    let activeInput;
    if (type === 'EARLY_WL') {
      activeInput = this.earlyWLNotificatonSettings;
    } else if (type === 'PREFINAL_WL') {
      activeInput = this.prefinalWLNotificationSettings;
    } else if (type === 'FINAL_WL') {
      activeInput = this.finalWLNotificationSettings;
    } else if (type === 'WAITLISTADD') {
      activeInput = this.wlAddNotificationSettings;
    } else if (type === 'APPOINTMENTADD') {
      activeInput = this.apptAddNotificationSettings;
    } else if (type === 'EARLY_APPT') {
      activeInput = this.earlyAPPTNotificatonSettings;
    } else if (type === 'PREFINAL_APPT') {
      activeInput = this.prefinalAPPTNotificationSettings;
    } else if (type === 'FINAL_APPT') {
      activeInput = this.finalAPPTNotificationSettings;
    } else if (type === 'FIRST_APPT') {
      this.firstAPPTNotificationSettings.time = '';
      this.totaltime = this.hourtoMin(this.f_selected_hr) + this.f_selected_min;
      this.firstAPPTNotificationSettings.time = this.totaltime.toString();
      activeInput = this.firstAPPTNotificationSettings;
    } else if (type === 'SECOND_APPT') {
      this.secondAPPTNotificationSettings.time = '';
      this.totaltime = this.hourtoMin(this.s_selected_hr) + this.s_selected_min;
      this.secondAPPTNotificationSettings.time = this.totaltime.toString();
      activeInput = this.secondAPPTNotificationSettings;
    } else if (type === 'THIRD_APPT') {
      this.thirdAPPTNotificationSettings.time = '';
      this.totaltime = this.hourtoMin(this.t_selected_hr) + this.t_selected_min;
      this.thirdAPPTNotificationSettings.time = this.totaltime.toString();
      activeInput = this.thirdAPPTNotificationSettings;
    } else if (type === 'FOURTH_APPT') {
      this.fourthAPPTNotificationSettings.time = '';
      this.totaltime = this.hourtoMin(this.ft_selected_hr) + this.ft_selected_min;
      this.fourthAPPTNotificationSettings.time = this.totaltime.toString();
      activeInput = this.fourthAPPTNotificationSettings;
    } else if (type === 'DONATIONSERVICE') {
      activeInput = this.donatAddNotificationSettings;
    } else if (type === 'EARLY_DONAT') {
      activeInput = this.earlyDONATNotificatonSettings;
    } else if (type === 'PREFINAL_DONAT') {
      activeInput = this.prefinalDONATNotificationSettings;
    } else if (type === 'FINAL_DONAT') {
      activeInput = this.finalDONATNotificationSettings;
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
  timeinHrMin(val) {
    const hours = Math.floor(val / 60);
    const minutes = val % 60;
    return [hours, minutes];
    // return hours + ' Hr ' + minutes + ' min';
  }
  hourtoMin(val) {
    const minutes = val * 60;
    return minutes;
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/comm->' + mod]);
  }
  goBack() {
    this.routerobj.navigate(['provider', 'settings', 'comm', 'notifications']);
  }
  handleHrSelction(obj, atempt) {
     switch (atempt) {
      case 'first' : this.f_selected_hr = obj; break;
      case 'second' : this.s_selected_hr = obj; break;
      case 'third' : this.t_selected_hr = obj; break;
      case 'fourth' : this.ft_selected_hr = obj; break;
     }
  }
  handleMinSelction(obj, atempt) {
     switch (atempt) {
      case 'first' : this.f_selected_min = obj; break;
      case 'second' : this.s_selected_min = obj; break;
      case 'third' : this.t_selected_min = obj; break;
      case 'fourth' : this.ft_selected_min = obj; break;
     }
  }

  getSMSCredits() {
    this.provider_services.getSMSCredits().subscribe(data => {
        this.smsCredits = data;
        if (this.smsCredits < 5) {
          this.is_smsLow = true;
          this.smsWarnMsg = 'Your SMS credits are low, Please upgrade';
          this.getLicenseCorpSettings();
        } else {
          this.is_smsLow = false;
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
