import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../../../shared/constants/project-messages';
import { ProviderDataStorageService } from '../../../../../../../../ynw_provider/services/provider-datastorage.service';

@Component({
  selector: 'app-userconsumer-notifications',
  templateUrl: './consumer-notifications.component.html'
})
export class ConsumerNotificationUserComponent implements OnInit {

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
  prefinalWLNotificationSettings = { eventType: 'PREFINAL', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false };
  prefinalAPPTNotificationSettings = { eventType: 'PREFINAL', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false };
  finalWLNotificationSettings = { eventType: 'FINAL', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false };
  finalAPPTNotificationSettings = { eventType: 'FINAL', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false };
  wlAddNotificationSettings = { eventType: 'WAITLISTADD', resourceType: 'CHECKIN', sms: false, email: false, pushNotification: false };
  apptAddNotificationSettings = { eventType: 'APPOINTMENTADD', resourceType: 'APPOINTMENT', sms: false, email: false, pushNotification: false };
  showButton: any = {};
  customer_label = '';
  cSettings: any = { 'EARLY_WL': false, 'EARLY_APPT': false, 'PREFINAL_WL': false, 'PREFINAL_APPT': false, 'FINAL_WL': false, 'FINAL_APPT': false, 'WAITLISTADD': false, 'APPOINTMENTADD': false };
  consumerNotification;
  notification_statusstr: string;
  wltstPersonsahead;
  apptPersonsahead;
  userId: any;
  appointment_status: any;
  waitlistStatus: any;
  donations_status: any;
  settings: any = [];
  showToken = false;
  api_loading = true;
  constructor(private sharedfunctionObj: SharedFunctions,
    private routerobj: Router,
    private shared_functions: SharedFunctions,
    public provider_services: ProviderServices,
    private activatedRoot: ActivatedRoute,
    private provider_datastorage: ProviderDataStorageService) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.activatedRoot.params.subscribe(params => {
      this.userId = + params.id;
      this.getUser();
    });
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.sharedfunctionObj.getitemFromGroupStorage('isCheckin');
    this.getNotificationSettings();
    this.getNotificationList();
    this.getGlobalSettingsStatus();
    this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
    this.mode_of_notify = Messages.FRM_LVL_CUSTMR_NOTIFY_MODE.replace('[customer]', this.customer_label);
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
  getUser() {
    this.provider_services.getUser(this.userId)
      .subscribe((data: any) => {
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
          title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1)
        });
        this.breadcrumbs = breadcrumbs;
      });
  }
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
    // const filter = {};
    //     filter['provider-eq'] = this.userId;
    this.provider_services.getUserConsumerNotificationSettings(this.userId)
      .subscribe(
        data => {
          this.notificationList = data;
          console.log(this.notificationList);
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
    }
    if (this.cSettings[type]) {
      //activeInput.providerId = this.userId;
      this.provider_services.updateUserConsumerNotificationSettings(activeInput).subscribe(
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
      //activeInput.providerId = this.userId;
      if (!activeInput.provider) {
        activeInput.provider = this.userId;
      }
      this.provider_services.saveUserConsumerNotificationSettings(activeInput).subscribe(
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
    this.routerobj.navigate(['/provider/' + this.domain + '/comm->' + mod]);
  }
}
