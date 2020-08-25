import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../app.component';
import { Subscription } from 'rxjs';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { QuestionService } from '../dynamicforms/dynamic-form-question.service';

@Component({
  selector: 'app-provider-settings',
  templateUrl: './provider-settings.component.html'
})

export class ProviderSettingsComponent implements OnInit, OnDestroy, AfterViewChecked {

  blogo: ArrayBuffer;
  weightageClass: string;
  progress_bar_four: number;
  progress_bar_three: number;
  progress_bar_two: number;
  progress_bar_one: number;
  subdomain: any;
  bprofile_btn_text: string;
  weightageValue: any;
  accountType;
  homeservice_cap = Messages.HOME_SERVICE_HEADING;
  profile_cap = Messages.PROFILE_CAP;
  search_cap = Messages.SEARCH_CAP;
  public_search_cap = Messages.BPROFILE_PUBLIC_SEARCH_CAP;
  services_cap = Messages.SERVICES_CAP;
  service_window_cap = Messages.SERVICE_TIME_CAP;
  qs_cap = Messages.QUEUE_CAP;
  invoice_cap = Messages.INVOICE_CAP;
  waitlist_manage_cap = Messages.WAITLIST_MANAGE_CAP;
  accept_online_cap = Messages.ACCEPT_ONLINE_CAP;
  settings_cap = Messages.SETTINGS_CAP;
  locations_cap = Messages.LOCATIONS_CAP;
  license_cap = Messages.LICENSE_CAP;
  add_on_cap = Messages.ADDON_CAP;
  payment_cap = Messages.PAYMENTS_CAP;
  accept_payments_cap = Messages.ACCEPT_PAYMENT_CAP;
  payment_setting_cap = Messages.PAYMENT_SETTING_CAP;
  tax_setting_cap = Messages.TAX_SETTING_CAP;
  billing_cap = Messages.BILLING_CAP;
  items_cap = Messages.ITEMS_CAP;
  discount_cap = Messages.DISCOUNTS_CAP;
  coupons_cap = Messages.COUPONS_CAP;
  miscellaneous_cap = Messages.MISCELLANEOUS_CAP;
  appointmentmanager_cap = Messages.APPOINTMENTMANAGER_CAP;
  non_work_cap = Messages.NON_WORKING_CAP;
  non_wrk_day_hr_cap = Messages.NON_WORK_DAY_OR_HR_CAP;
  schedules_cap = Messages.SCHEDULES_CAP;
  notification_cap = Messages.NOTIFICATION_CAP;
  saleschannel_cap = Messages.SALESCHANNEL_CAP;
  frm_profile_search_cap = Messages.FRM_LEVEL_PROFILE_SEARCH_MSG;
  frm_virtual_msg = '';
  frm_waitlist_cap = '';
  frm_license_cap = Messages.FRM_LEVEL_LIC_MSG;
  frm_pay_cap = Messages.FRM_LEVEL_PAY_MSG;
  frm_bill_cap = Messages.FRM_LEVEL_BILLING_MSG;
  frm_coupon_cap = Messages.FRM_LEVEL_COUPON_MSG;
  frm_mis_cap = '';
  frm_appointment_cap = Messages.FRM_LEVEL_APPOINTMENT_MSG;
  frm_donation_cap = Messages.FRM_LEVEL_DONATION_MSG;
  frm_jdn_short_cap = Messages.JDN_CAP;
  displayboard_heading = Messages.DISPLAYBOARD_HEADING;
  frm_displayboard_inhelp = Messages.DISPLAYBOARD__INHELP;
  customfields_cap = Messages.CUSTOMFIELDS_CAPTION;
  displayboards_cap = Messages.DISPLAYBOARD_HEADING;
  displayboards_layout_cap = Messages.DISPLAYBOARDLAYOUT_CAP;
  appointmentmanager;
  general;
  payments;
  integration;
  customers;
  comm;
  waitlist_status = false;
  futureDateWaitlist = false;
  waitlist_statusstr = 'Off';
  futurewaitlist_statusstr = 'Off';
  apptlist_status = false;
  futureDateApptlist = false;
  apptlist_statusstr = 'Off';
  futureapptlist_statusstr = 'Off';
  search_status = false;
  search_statusstr = 'Off';
  payment_settings: any = [];
  payment_settingsdet: any = [];
  payment_status = false;
  payment_statusstr = 'Off';
  discount_list;
  discount_count = 0;
  coupon_list;
  jaldeecoupon_list = 0;
  coupon_count = 0;
  item_list;
  item_count = 0;
  board_count = 0;
  board_count_waitlist = 0;
  bProfile = null;
  multipeLocationAllowed = false;
  locName;
  businessConfig: any = [];
  loc_list: any = [];
  breadcrumbs = [
    {
      title: 'Settings'
    }
  ];
  location_count: any = 0;
  service_count: any = 0;
  queues_count: any = 0;
  cause_count: any = 0;
  checkin_label = '';
  tooltipcls = projectConstants.TOOLTIP_CLS;
  subscription: Subscription;
  customer_label = '';
  isCheckin;
  reqFields: any = {};
  pos_status: any;
  pos_statusstr: string;
  addonMetadata: any = [];
  statusboardStatus = false;
  isCorp = false;
  isMultilevel = false;
  jaldee_pay_cap: string;
  provider_label = '';
  cust_domain_name = '';
  custs_name = '';
  provider_domain_name = '';
  assistantCount;
  onlinepresence_status: any;
  onlinepresence_statusstr: string;
  livetrack_status: any;
  livetrack_statusstr: string;
  walkinConsumer_status: any;
  walkinConsumer_statusstr: string;
  jaldeeintegration_status: any;
  jaldeeintegration_statusstr: string;
  createappointment_status: any;
  createappointment_statusstr: string;
  donations_status: any;
  donations_statusstr: string;
  virtualCallingMode_status: any;
  virtualCallingMode_statusstr: string;
  schedules_count: any = 0;
  waitlistStatus;
  waitlistStatusStr;
  jaldee_online_enabled_msg: string;
  jaldee_online_disabled_msg: string;
  profile_enabled_msg: string;
  profile_disabled_msg: string;
  businessProfile_weightageArray: any[];
  showTakeaTour = false;
  constructor(private provider_services: ProviderServices,
    private shared_functions: SharedFunctions,
    private cdf: ChangeDetectorRef,
    private routerobj: Router,
    private shared_services: SharedServices,
    private provider_datastorage: ProviderDataStorageService,
    private qservice: QuestionService,
    private provider_shared_functions: ProviderSharedFuctions,
    private activated_route: ActivatedRoute
  ) {
    this.activated_route.queryParams.subscribe(
      qparams => {
       this.showTakeaTour = qparams.firstTimeSignup;
      //  if (this.showTakeaTour) {
      //      this.letsGetStarted();
      //  }
      });
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.shared_functions.getMessage().subscribe(data => {
      switch (data.ttype) {
        case 'upgradelicence':
          // this.getStatusboardLicenseStatus();
          break;
      }
    });
    this.provider_label = this.shared_functions.getTerminologyTerm('provider');
  }
  bprofileTooltip = '';
  waitlistTooltip = '';
  licenseTooltip = '';
  paymentTooltip = '';
  accountActiveMsg = '';
  billposTooltip = '';
  frm_profile_cap = '';
  frm_msg_jaldeepay = '';
  frm_msg_commn = '';
  nodiscountError = false;
  noitemError = false;
  miscellaneous = '';
  frm_public_self_cap = '';
  frm_addinfo_cap = '';
  frm_search_cap = '';
  itemError = '';
  discountError = '';
  waitlist_details;
  apptlist_details;
  paytmVerified = false;
  payuVerified = false;
  isJaldeeAccount = false;
  departmentCount: any = 0;
  filterbydepartment = false;
  locationExists = false;
  mandatoryfieldArray: any = [];
  additionalInfoDomainFields: any = [];
  additionalInfoSubDomainFields: any = [];
  domain_fields;
  domain_questions = [];
  subdomain_fields = [];
  image_list: any = [];
  subdomain_questions = [];
  que_type = 'domain_questions';
  normal_domainfield_show = 1;
  normal_subdomainfield_show = 1;
  field;
  bprofileLoaded = false;
  showIncompleteButton = true;
  ngOnInit() {
    // this.provider_datastorage.setWeightageArray([]);
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.accountType = user.accountType;
    this.bprofileTooltip = this.shared_functions.getProjectMesssages('BRPFOLE_SEARCH_TOOLTIP');
    this.waitlistTooltip = this.shared_functions.getProjectMesssages('WAITLIST_TOOLTIP');
    this.licenseTooltip = this.shared_functions.getProjectMesssages('LINCENSE_TOOLTIP');
    this.paymentTooltip = this.shared_functions.getProjectMesssages('PAYMENT_TOOLTIP');
    this.billposTooltip = this.shared_functions.getProjectMesssages('BILLPOS_TOOLTIP');
    this.frm_profile_cap = Messages.FRM_LEVEL_PROFILE_MSG.replace('[customer]', this.customer_label);
    this.miscellaneous = this.shared_functions.getProjectMesssages('FRM_LEVEL_MISC_MSG');
    this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
    // this.frm_addinfo_cap = Messages.FRM_ADDINFO_MSG.replace('[customer]', this.customer_label);
    this.frm_addinfo_cap = Messages.FRM_ADDINFO_MSG;
    this.frm_search_cap = Messages.FRM_SEARCH_MSG.replace('[customer]', this.customer_label);
    this.frm_virtual_msg = Messages.FRM_LEVEL_VIRTUAL_MSG.replace('[customer]', this.customer_label);
    this.frm_mis_cap = Messages.FRM_LEVEL_MISC_MSG.replace('[customer]', this.customer_label);
    this.frm_msg_jaldeepay = Messages.FRM_LEVEL_JALDEEPAY_MSG.replace('[customer]', this.customer_label);
    this.frm_msg_commn = Messages.FRM_LEVEL_COMMN_MSG.replace('[customer]', this.customer_label);
    this.frm_waitlist_cap = Messages.FRM_LEVEL_WAITLIST_MSG.replace('[customer]', this.customer_label);
    this.jaldee_pay_cap = Messages.JALDEE_PAY_MSG.replace('[customer]', this.customer_label);
    this.cust_domain_name = Messages.CUSTOMER_NAME.replace('[customer]', this.customer_label);
    this.custs_name = Messages.CUSTOMERS_NAME.replace('[customer]', this.customer_label);
    this.provider_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
    this.jaldee_online_enabled_msg = Messages.JALDEEONLINE_ENABLED_MSG.replace('[customer]', this.customer_label);
    this.jaldee_online_disabled_msg = Messages.JALDEE_ONLINE_DISABLED_MSG.replace('[customer]', this.customer_label);
    this.profile_enabled_msg = Messages.PROFILE_ENABLED_MSG.replace('[customer]', this.customer_label);
    this.profile_disabled_msg = Messages.PROFILE_DISABLED_MSG.replace('[customer]', this.customer_label);
    this.getProviderLogo();
    this.getGalleryImages();
    this.getDomainSubdomainSettings();
    this.getBusinessConfiguration();
    this.getLocationCount();
    this.getQueuesCount();
    this.getServiceCount();
    this.getDepartmentsCount();
    this.getCauseCount();
    this.getSearchstatus();
    this.getWaitlistMgr();
    this.getApptlistMgr();
    this.getpaymentDetails();
    this.getDiscounts();
    this.getCoupons();
    this.getItems();
    this.getPOSSettings();
    this.getGlobalSettingsStatus();
    this.getJaldeeIntegrationSettings();
    this.getDisplayboardCountAppointment();
    this.getDisplayboardCountWaitlist();

    this.getSchedulesCount();
    // this.getStatusboardLicenseStatus();
    this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
    // Update from footer
    this.subscription = this.shared_functions.getMessage()
      .subscribe(
        data => {
          if (data.ttype === 'online_checkin_status' || data.ttype === 'filterbyDepartment' || data.ttype === 'future_checkin_status') {
            this.getWaitlistMgr();
          }
        });
    this.subscription = this.provider_datastorage.getWeightageArray().subscribe(result => {
      this.businessProfile_weightageArray = result;
      this.weightageValue = this.calculateWeightage(result);

    });
  }

  calculateWeightage(data) {
    let total = 0;
    if (data != null && data.length > 0) {
      data.forEach(x => total += x.value);
    }
    return total;

  }
  ngAfterViewChecked() {
    this.cdf.detectChanges();

  } ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr()
      .subscribe(
        data => {
          this.waitlist_details = data;
          this.waitlist_status = data['onlineCheckIns'] || false;
          this.futureDateWaitlist = data['futureDateWaitlist'] || false;
          this.waitlist_statusstr = (this.waitlist_status) ? 'On' : 'Off';
          this.futurewaitlist_statusstr = (this.futureDateWaitlist) ? 'On' : 'Off';
          this.filterbydepartment = data['filterByDept'];
        });
  }
  getBusinessProfileWeightageText() {
    let businessProfileWeightageText = '';
    const weightage = this.weightageValue;
    if (weightage <= 25) {
      businessProfileWeightageText = Messages.PROFILE_INCOMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'warning';
      this.progress_bar_one = weightage;
      this.progress_bar_two = 0;
      this.progress_bar_three = 0;
      this.progress_bar_four = 0;
      this.showIncompleteButton = true;
      return businessProfileWeightageText;

    }
    if (weightage > 25 && weightage < 50) {
      businessProfileWeightageText = Messages.PROFILE_INCOMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'warning';
      this.progress_bar_one = 25;
      this.progress_bar_two = weightage - 25;
      this.progress_bar_three = 0;
      this.progress_bar_four = 0;
      this.showIncompleteButton = true;
      return businessProfileWeightageText;
    } else if
    (weightage >= 50 && weightage < 75) {
      businessProfileWeightageText = Messages.PROFILE_MINIMALLY_COMPLETE_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_COMPLETE_YOUR_PROFILE;
      this.weightageClass = 'info';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = weightage - 50;
      this.progress_bar_four = 0;
      this.showIncompleteButton = false;
      return businessProfileWeightageText;

    } else if (weightage >= 75 && weightage < 100) {
      businessProfileWeightageText = Messages.GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_STRENGTHEN_YOUR_PROFILE;
      this.weightageClass = 'primary';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = 25;
      this.progress_bar_four = weightage - 75;
      this.showIncompleteButton = false;
      return businessProfileWeightageText;
    } else if (weightage === 100) {
      businessProfileWeightageText = Messages.VERY_GOOD_CAP;
      this.bprofile_btn_text = Messages.BTN_TEXT_MANAGE_YOUR_PROFILE;
      this.weightageClass = 'success';
      this.progress_bar_one = 25;
      this.progress_bar_two = 25;
      this.progress_bar_three = 25;
      this.progress_bar_four = 25;
      this.showIncompleteButton = false;
      return businessProfileWeightageText;

    }

  }
  getProviderLogo() {
    this.provider_services.getProviderLogo()
      .subscribe(
        data => {
          this.blogo = data;
          let logoExist;
          if (this.blogo[0]) {
            logoExist = true;
            // logo = this.blogo[0].url;
          } else {
            // logo = '';
            logoExist = false;
          }
          this.provider_datastorage.updateProfilePicWeightage(logoExist);
        }
      );
  }

  getApptlistMgr() {
    this.provider_services.getApptlistMgr()
      .subscribe(
        data => {
          this.apptlist_details = data;
          this.apptlist_status = data['enableToday'] || false;
          this.futureDateApptlist = data['futureAppt'] || false;
          this.apptlist_statusstr = (this.apptlist_status) ? 'On' : 'Off';
          this.futureapptlist_statusstr = (this.futureDateApptlist) ? 'On' : 'Off';
          // this.filterbydepartment = data['filterByDept'];
        });
  }
  handle_jaldeeWalkinConsumer(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    const data = {
      'walkinConsumerBecomesJdCons': event.checked
    };
    this.provider_services.setJaldeeIntegration(data)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Jaldee.com for Mob App ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getJaldeeIntegrationSettings();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getJaldeeIntegrationSettings();
        }
      );
  }
  handle_jaldeeOnlinePresence(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    const data = {
      'onlinePresence': event.checked
    };
    this.provider_services.setJaldeeIntegration(data)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Jaldee.com Online presence ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getJaldeeIntegrationSettings();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getJaldeeIntegrationSettings();
        }
      );
  }
  handle_liveTracking(event) {
    const is_livetrack = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setLivetrack(is_livetrack)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Live tracking ' + is_livetrack + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        }
      );
  }
  handle_waitliststatus(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setAcceptOnlineCheckin(is_check)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Same day online check-in ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getWaitlistMgr();
          this.shared_functions.sendMessage({ ttype: 'checkin-settings-changed' });
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getWaitlistMgr();
        }
      );
  }
  handle_futurewaitliststatus(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setFutureCheckinStatus(is_check)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Future check-in ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getWaitlistMgr();
          this.shared_functions.sendMessage({ ttype: 'checkin-settings-changed' });
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  handle_apptliststatus(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setAcceptOnlineAppointment(is_check)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Same day online appointment ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getApptlistMgr();
          this.shared_functions.sendMessage({ ttype: 'checkin-settings-changed' });
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getApptlistMgr();
        }
      );
  }
  handle_futureapptliststatus(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setFutureAppointmentStatus(is_check)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Future appointment ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getApptlistMgr();
          this.shared_functions.sendMessage({ ttype: 'checkin-settings-changed' });
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  getDomainSubdomainSettings() {
    const user_data = this.shared_functions.getitemFromGroupStorage('ynw-user');
    const domain = user_data.sector || null;
    const sub_domain = user_data.subSector || null;
    return new Promise((resolve, reject) => {
      this.provider_services.domainSubdomainSettings(domain, sub_domain)
        .subscribe(
          (data: any) => {
            this.isCorp = data.isCorp;
            this.isMultilevel = data.isMultilevel;
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getJaldeeIntegrationSettings() {
    this.provider_services.getJaldeeIntegrationSettings().subscribe(
      (data: any) => {
        this.onlinepresence_status = data.onlinePresence;
        this.walkinConsumer_status = data.walkinConsumerBecomesJdCons;
        this.jaldeeintegration_status = data.onlinePresence;
        this.walkinConsumer_statusstr = (this.walkinConsumer_status) ? 'On' : 'Off';
        this.onlinepresence_statusstr = (this.onlinepresence_status) ? 'On' : 'Off';
        this.jaldeeintegration_statusstr = (this.jaldeeintegration_status) ? 'On' : 'Off';
      }
    );
  }
  getpaymentDetails() {
    this.provider_services.getPaymentSettings()
      .subscribe(
        data => {
          this.payment_settings = data;
          this.payment_status = (data['onlinePayment']) || false;
          this.paytmVerified = (data['payTmVerified']) || false;
          this.payuVerified = (data['payUVerified']) || false;
          this.isJaldeeAccount = (data['isJaldeeAccount']) || false;
          this.payment_statusstr = (this.payment_status) ? 'On' : 'Off';
          if (this.payment_settings.isJaldeeAccount) {
            this.accountActiveMsg = 'You are using Jaldee bank account';
          } else {
            this.accountActiveMsg = 'You are using your own bank account';
          }
        });
  }
  handle_paymentstatus(event) {
    let status;
    (event.checked) ? status = 'enable' : status = 'disable';
    this.provider_services.changeJaldeePayStatus(status).subscribe(data => {
      this.getpaymentDetails();
      if (!event.checked) {
        this.shared_functions.openSnackBar('online payment is disabled', { 'panelClass': 'snackbarerror' });
      }
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.getpaymentDetails();
      });
  }
  getPOSSettings() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos_status = data['enablepos'];
      this.pos_statusstr = (this.pos_status) ? 'On' : 'Off';
    });
  }
  getGlobalSettingsStatus() {
    this.provider_services.getGlobalSettings().subscribe(
      (data: any) => {
        // this.onlinepresence_status = data.onlinePresence;
        // this.onlinepresence_statusstr = (this.onlinepresence_status) ? 'On' : 'Off';
        this.livetrack_status = data.livetrack;
        this.livetrack_statusstr = (this.livetrack_status) ? 'On' : 'Off';
        this.createappointment_status = data.appointment;
        this.createappointment_statusstr = (this.createappointment_status) ? 'On' : 'Off';
        this.waitlistStatus = data.waitlist;
        this.waitlistStatusStr = (this.waitlistStatus) ? 'On' : 'Off';
        this.donations_status = data.donationFundRaising;
        this.donations_statusstr = (this.donations_status) ? 'On' : 'Off';
        this.virtualCallingMode_status = data.virtualService;
        this.virtualCallingMode_statusstr = (this.virtualCallingMode_status) ? 'On' : 'Off';
        this.shared_functions.sendMessage({ 'ttype': 'apptStatus', apptStatus: this.createappointment_status });
        this.shared_functions.sendMessage({ 'ttype': 'donationStatus', donationStatus: this.donations_status });
      });
  }
  handle_posStatus(event) {
    const value = (event.checked) ? true : false;
    const status = (value) ? 'enabled' : 'disabled';
    this.provider_services.setProviderPOSStatus(value).subscribe(data => {
      this.shared_functions.openSnackBar('POS settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.getPOSSettings();
      this.getItems();
      this.getDiscounts();
    }, (error) => {
      this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getPOSSettings();
    });
  }
  getSearchstatus() {
    this.provider_services.getPublicSearch()
      .subscribe(data => {
        if (data && data.toString() === 'true') {
          this.search_status = true;
          this.search_statusstr = 'On';
        } else {
          this.search_status = false;
          this.search_statusstr = 'Off';
        }
      });
  }
  handle_searchstatus() {
    const changeTostatus = (this.search_status === false) ? 'DISABLE' : 'ENABLE';
    this.provider_services.updatePublicSearch(changeTostatus)
      .subscribe(() => {
        this.getSearchstatus();
        this.getWaitlistMgr();
      },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getSearchstatus();
          this.getWaitlistMgr();
        });
  }
  redirecTo(mod, usermode?) {
    switch (mod) {
      case 'bprofile':
        this.routerobj.navigate(['provider', 'settings', 'bprofile']);
        break;
      case 'specializations':
        this.routerobj.navigate(['provider', 'settings', 'bprofile', 'specializations']);
        break;
      case 'languages':
        this.routerobj.navigate(['provider', 'settings', 'bprofile', 'languages']);
        break;
      case 'additionalinfo':
        this.routerobj.navigate(['provider', 'settings', 'bprofile', 'additionalinfo']);
        break;
      case 'privacy':
        this.routerobj.navigate(['provider', 'settings', 'bprofile', 'privacy']);
        break;
      case 'media':
        this.routerobj.navigate(['provider', 'settings', 'bprofile', 'media']);
        break;
      case 'integration':
        this.routerobj.navigate(['provider', 'settings', 'bprofile', 'jaldee-integration']);
        break;
      case 'locations':
        this.routerobj.navigate(['provider', 'settings', 'general', 'locations']);
        break;
      case 'services':
        this.routerobj.navigate(['provider', 'settings', 'q-manager', 'services']);
        break;
      case 'causes':
        this.routerobj.navigate(['provider', 'settings', 'donationmanager', 'causes']);
        break;
      case 'queues':
        if (this.locationExists) {
          this.routerobj.navigate(['provider', 'settings', 'q-manager', 'queues']);
        } else if (this.bprofileLoaded) {
          this.shared_functions.openSnackBar('Please set location', { 'panelClass': 'snackbarerror' });
        }
        break;
      case 'discounts':
        if (this.nodiscountError) {
          this.routerobj.navigate(['provider', 'settings', 'pos', 'discount']);
        } else {
          this.shared_functions.openSnackBar(this.discountError, { 'panelClass': 'snackbarerror' });
        }
        break;
      case 'coupons':
        this.routerobj.navigate(['provider', 'settings', 'pos', 'coupon']);
        break;
      case 'nonworking':
        this.routerobj.navigate(['provider', 'settings', 'general', 'holidays']);
        break;
      case 'notifications':
        this.routerobj.navigate(['provider', 'settings', 'comm', 'notifications']);
        break;
      case 'saleschannel':
        this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'saleschannel']);
        break;
      case 'items':
        if (this.noitemError) {
          this.routerobj.navigate(['provider', 'settings', 'pos', 'items']);
        } else {
          this.shared_functions.openSnackBar(this.itemError, { 'panelClass': 'snackbarerror' });
        }
        break;
      case 'waitlistmanager':
        this.routerobj.navigate(['provider', 'settings', 'q-manager']);
        break;
      // case 'license':
      //   this.routerobj.navigate(['provider', 'license']);
      //   break;
      case 'paymentsettings':
        this.routerobj.navigate(['provider', 'settings', 'payments', 'paymentsettings']);
        break;
      case 'taxsettings':
        this.routerobj.navigate(['provider', 'settings', 'payments', 'taxsettings']);
        break;
      case 'departments':
        this.routerobj.navigate(['provider', 'settings', 'general', 'departments']);
        break;
      case 'homeservice':
        this.routerobj.navigate(['provider', 'settings', 'home-service']);
        break;
      case 'homeservice-services':
        this.routerobj.navigate(['provider', 'settings', 'home-service', 'services']);
        break;
      case 'homeservice-queues':
        this.routerobj.navigate(['provider', 'settings', 'home-service', 'queues']);
        break;
      case 'pos':
        this.routerobj.navigate(['provider', 'settings', 'pos']);
        break;
      case 'payments':
        this.routerobj.navigate(['provider', 'settings', 'payments']);
        break;
      case 'miscellaneous':
        this.routerobj.navigate(['provider', 'settings', 'miscellaneous']);
        break;
      case 'general':
        this.routerobj.navigate(['provider', 'settings', 'general']);
        break;
      case 'customers':
        this.routerobj.navigate(['provider', 'settings', 'customers']);
        break;
      case 'custid':
        this.routerobj.navigate(['provider', 'settings', 'customers', 'custid']);
        break;
      case 'comm':
        this.routerobj.navigate(['provider', 'settings', 'comm']);
        break;
      case 'video':
        this.routerobj.navigate(['provider', 'settings', 'comm', 'video']);
        break;
      case 'jdn':
        this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'jdn']);
        break;
      case 'labels':
        this.routerobj.navigate(['provider', 'settings', 'general', 'labels']);
        break;
      case 'displayboards':
        this.routerobj.navigate(['provider', 'settings', 'q-manager', 'displayboards']);
        break;
      case 'skins':
        this.routerobj.navigate(['provider', 'settings', 'general', 'skins']);
        break;
      case 'users':
        this.routerobj.navigate(['provider', 'settings', 'general', 'users']);
        break;
      case 'customview':
        this.routerobj.navigate(['provider', 'settings', 'general', 'customview']);
        break;
      case 'livetrack':
        this.routerobj.navigate(['provider', 'settings', 'general', 'livetrack']);
        break;
      case 'corporate':
        this.routerobj.navigate(['provider', 'settings', 'miscellaneous', 'corporate']);
        break;
      // case 'users':
      //   this.routerobj.navigate(['provider', 'settings', 'users']);
      //   break;
      case 'doctorslist':
        const navigationExtras: NavigationExtras = {
          queryParams: { type: 'doctors' }
        };
        this.routerobj.navigate(['provider', 'settings', 'users', 'doctors'], navigationExtras);
        break;
      case 'assistantslist':
        const navigationExtras1: NavigationExtras = {
          queryParams: { type: 'assistants' }
        };
        this.routerobj.navigate(['provider', 'settings', 'users', 'doctors'], navigationExtras1);
        break;
      case 'doctors':
        const navigationExtras2: NavigationExtras = {
          queryParams: {
            type: 'doctors',
            mode: usermode
          }
        };
        this.routerobj.navigate(['provider', 'settings', 'users', 'doctors', 'add'], navigationExtras2);
        // this.routerobj.navigate(['provider', 'settings', 'users', 'doctors']);
        break;
      case 'assistants':
        const navigationExtras3: NavigationExtras = {
          queryParams: {
            type: 'assistants',
            mode: usermode
          }
        };
        this.routerobj.navigate(['provider', 'settings', 'users', 'doctors', 'add'], navigationExtras3);
        // this.routerobj.navigate(['provider', 'settings', 'users', 'assistants']);
        break;
      case 'appointmentmanager':
        this.routerobj.navigate(['provider', 'settings', 'appointmentmanager']);
        break;
      case 'schedules':
        if (this.locationExists) {
          this.routerobj.navigate(['provider', 'settings', 'appointmentmanager', 'schedules']);
        } else if (this.bprofileLoaded) {
          this.shared_functions.openSnackBar('Please set location', { 'panelClass': 'snackbarerror' });
        }
        break;
      case 'appservices':
        this.routerobj.navigate(['provider', 'settings', 'appointmentmanager', 'services']);
        break;
      case 'appdisplayboards':
        this.routerobj.navigate(['provider', 'settings', 'appointmentmanager', 'displayboards']);
        break;
      case 'donationmanager':
        this.routerobj.navigate(['provider', 'settings', 'donationmanager']);
    }
  }
  getLocationCount() {
    this.provider_services.getLocationCount()
      .subscribe(
        data => {
          this.location_count = data;
        });
  }
  getDisplayboardCountAppointment() {
    this.provider_services.getDisplayboardsAppointment()
      .subscribe(
        (data: any) => {
          const allappontidisplayBoards = data;
          let appo_count = 0;
          allappontidisplayBoards.forEach(element => {
            if (element.container) {
            } else {
              appo_count++;
            }
          });
          this.board_count = appo_count;
        });
  }
  getDisplayboardCountWaitlist() {
    this.provider_services.getDisplayboardsWaitlist()
      .subscribe(
        (data: any) => {
          const allwaitlstdisplayBoards = data;
          let wtlist_count = 0;
          allwaitlstdisplayBoards.forEach(element => {
            if (element.container) {
            } else {
              wtlist_count++;
            }
          });
          this.board_count_waitlist = wtlist_count;
        });
  }
  getServiceCount() {
    const filter = { 'serviceType-neq': 'donationService' };
    this.provider_services.getServiceCount(filter)
      .subscribe(
        data => {
          this.service_count = data;
        });
  }
  getQueuesCount() {
    // const filter = { 'scope-eq': 'account' };
    this.provider_services.getQueuesCount()
      .subscribe(
        data => {
          this.queues_count = data;
        });
  }
  getDiscounts() {
    this.nodiscountError = true;
    this.provider_services.getProviderDiscounts()
      .subscribe(data => {
        this.discount_list = data;
        this.discount_count = this.discount_list.length;
        this.nodiscountError = true;
      },
        (error) => {
          this.discountError = error;
          this.nodiscountError = false;
        }
      );
  }
  getCoupons() {
    this.provider_services.getProviderCoupons()
      .subscribe(data => {
        this.coupon_list = data;
        this.coupon_count = this.coupon_list.length;
      },
        (error) => {
          if (typeof (error) === 'object') {
            // this.shared_functions.openSnackBar(error.error, { 'panelclass': 'snackbarerror' });
          } else {
            this.shared_functions.openSnackBar(error, { 'panelclass': 'snackbarerror' });
          }
        });
  }
  getCauseCount() {
    const filter = { 'scope-eq': 'account', 'serviceType-eq': 'donationService' };
    this.provider_services.getCauseCount(filter)
      .subscribe(
        data => {
          this.cause_count = data;
        });
  }
  getItems() {
    this.noitemError = true;
    this.provider_services.getProviderItems()
      .subscribe(data => {
        this.item_list = data;
        this.item_count = this.item_list.length;
        this.noitemError = true;
      },
        (error) => {
          this.itemError = error;
          this.noitemError = false;
        });
  }
  reloadHandler() {
  }
  getBusinessConfiguration() {
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        this.getBussinessProfile();
      });
  }
  getBussinessProfile() {
    this.additionalInfoDomainFields = [];
    this.additionalInfoSubDomainFields = [];
    this.mandatoryfieldArray = [];
    this.provider_services.getBussinessProfile()
      .subscribe(data => {
        this.bProfile = data;
        this.bprofileLoaded = true;
        this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain']).subscribe(
          domainfields => {
            this.provider_services.getVirtualFields(this.bProfile['serviceSector']['domain'], this.bProfile['serviceSubSector']['subDomain']).subscribe(
              subdomainfields => {
                this.reqFields = this.provider_shared_functions.getProfileRequiredFields(this.bProfile, domainfields, subdomainfields, this.bProfile['serviceSubSector']['subDomain']);
                console.log(this.reqFields);
                this.mandatoryfieldArray = this.provider_shared_functions.getAdditonalInfoMandatoryFields();
                this.additionalInfoDomainFields = this.provider_shared_functions.getAdditionalNonDomainMandatoryFields();
                this.additionalInfoSubDomainFields = this.provider_shared_functions.getAdditionalNonSubDomainMandatoryFields();
                this.subdomain = this.bProfile['serviceSubSector']['subDomain'];
                this.getDomainVirtualFields();
                if (this.bProfile['serviceSubSector']['subDomain']) {
                  this.getSubDomainVirtualFields();
                }
              });
          });
        if (this.bProfile.baseLocation) {
          this.locationExists = true;
        } else {
          this.locationExists = false;
        }
        for (let i = 0; i < this.businessConfig.length; i++) {
          if (this.businessConfig[i].id === this.bProfile.serviceSector.id) {
            if (this.businessConfig[i].multipleLocation) {
              this.multipeLocationAllowed = true;
            }
            if (this.multipeLocationAllowed === true) {
              this.locName = this.shared_functions.getProjectMesssages('WAITLIST_LOCATIONS_CAP');
            }
            if (this.multipeLocationAllowed === false) {
              this.locName = this.shared_functions.getProjectMesssages('WIZ_LOCATION_CAP');
            }
          }
        }
        this.provider_datastorage.setBusinessProfileWeightage(this.bProfile);
      });
  }
  getAssistantCount() {
    this.provider_services.assistantFilterCount()
      .subscribe(data => {
        this.assistantCount = data;

      });
  }
  // onFormChange(event) {
  //   const is_check = event.checked;
  //   const postData = {
  //     calculationMode: this.waitlist_details.calculationMode,
  //     trnArndTime: this.waitlist_details.trnArndTime || null,
  //     providerNotification: this.waitlist_details.providerNotification,
  //     futureDateWaitlist: is_check,
  //     showTokenId: this.waitlist_details.showTokenId
  //   };
  //   this.provider_services.setWaitlistMgr(postData)
  //     .subscribe(
  //       () => {
  //         this.getWaitlistMgr();
  //         this.shared_functions.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
  //       },
  //       error => {
  //         this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //       });
  // }

  getDepartmentsCount() {
    this.provider_services.getDepartmentCount()
      .subscribe(
        data => {
          this.departmentCount = data;
        });
  }
  getStatusboardLicenseStatus() {
    // let pkgId;
    // const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    // if (user && user.accountLicenseDetails && user.accountLicenseDetails.accountLicense && user.accountLicenseDetails.accountLicense.licPkgOrAddonId) {
    //   pkgId = user.accountLicenseDetails.accountLicense.licPkgOrAddonId;
    // }
    // this.provider_services.getLicenseMetadata().subscribe(data => {
    //   this.licenseMetadata = data;
    //   for (let i = 0; i < this.licenseMetadata.length; i++) {
    //     if (this.licenseMetadata[i].pkgId === pkgId) {
    //       for (let k = 0; k < this.licenseMetadata[i].metrics.length; k++) {
    //         if (this.licenseMetadata[i].metrics[k].id === 18) {
    //           if (this.licenseMetadata[i].metrics[k].anyTimeValue === 'true') {
    //             this.statusboardStatus = true;
    //             return;
    //           } else {
    //             this.statusboardStatus = false;
    //             return;
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
    this.provider_services.getLicenseAddonmetaData().subscribe(data => {
      this.addonMetadata = data;
      //   for (let i = 0; i < this.addonMetadata.length; i++) {
      //     if (this.addonMetadata[i].pkgId === pkgId) {
      //       for (let k = 0; k < this.addonMetadata[i].metrics.length; k++) {
      //         if (this.addonMetadata[i].metrics[k].id === 18) {
      //           if (this.addonMetadata[i].metrics[k].anyTimeValue === 'true') {
      //             this.statusboardStatus = true;
      //             return;
      //           } else {
      //             this.statusboardStatus = false;
      //             return;
      //           }
      //         }
      //       }
      //     }
      //   }
    });
  }
  handle_appointmentPresence(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setAppointmentPresence(is_check)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Appointment creation ' + is_check.charAt(0).toLowerCase() + is_check.slice(1) + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        }
      );
  }
  handleCheckinPresence(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setCheckinPresence(is_check)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Check-in creation ' + is_check.charAt(0).toLowerCase() + is_check.slice(1) + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        }
      );
  }
  handle_Donations(event) {
    const is_Donation = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setDonations(is_Donation)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Accept Donations ' + is_Donation + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        }
      );
  }
  handle_virtualCallingModeStatus(event) {
    const is_VirtualCallingMode = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setVirtualCallingMode(is_VirtualCallingMode)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Teleservice ' + is_VirtualCallingMode + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getGlobalSettingsStatus();
        }
      );
  }
  getSchedulesCount() {
    // const filter = { 'scope-eq': 'account' };
    this.provider_services.getSchedulesCount()
      .subscribe(
        data => {
          this.schedules_count = data;
        });
  }

  // mandatory fields
  getDomainVirtualFields() {
    const weightageObjectOfDomain: any = {};
    const checkArray = [];
    this.getVirtualFields(this.bProfile['serviceSector']['domain'])
      .then(
        data => {
          // this.mandatoryfieldArray = this.provider_shared_functions.getAdditonalInfoMandatoryFields();
          //  this.additionalInfoFields = this.provider_shared_functions.getAdditionalNonMandatoryFields();
          let mandatorydomain = false;
          let mandatorydomainFilled = false;
          let additionalInfoFilledStatus = false;
          this.domain_fields = data['fields'];
          this.domain_questions = data['questions'] || [];
          this.domain_fields.forEach(subdomain => {
            checkArray.push(subdomain);
          });
          this.normal_domainfield_show = (this.normal_domainfield_show === 2) ? 4 : 3;
          if (this.mandatoryfieldArray.length !== 0 && this.domain_fields.some(domain => domain.mandatory === true)) {
            mandatorydomain = true;
            this.mandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.domain_fields, mandatoryField)) {
                mandatorydomainFilled = true;
              } else {
                mandatorydomainFilled = false;
                return;
              }
            });


          } else {
            mandatorydomain = false;
          }

          if (this.checkAdditionalFieldsFullyFilled(this.additionalInfoDomainFields, this.domain_fields)) {
            additionalInfoFilledStatus = true;
          }
          weightageObjectOfDomain.mandatoryDomain = mandatorydomain;
          weightageObjectOfDomain.mandatoryDomainFilledStatus = mandatorydomainFilled;
          weightageObjectOfDomain.additionalDomainFullyFilled = additionalInfoFilledStatus;
          console.log(this.mandatoryfieldArray);
          console.log(weightageObjectOfDomain);


          this.provider_datastorage.setWeightageObjectOfDomain(weightageObjectOfDomain);



        }
      );
  }


  checkMandatoryFieldsInResultSet(domainFields, fieldname) {
    let fullyfilledStatus = true;
    domainFields.forEach(function (dom) {
      if (dom.name === fieldname) {
        if (!dom['value'] || (dom.value === undefined || dom.value == null)) {
          fullyfilledStatus = false;
          return;
        }
      }
    });
    return fullyfilledStatus;
  }
  checkAdditionalFieldsFullyFilled(additionalInfoFields, dom_subdom_list) {
    let fullyfilledStatus = true;
    additionalInfoFields.forEach(function (field) {
      if (fullyfilledStatus) {
        if (!dom_subdom_list.some(domobject => domobject.name === field)) {
          fullyfilledStatus = false;
          return;
        } else {
          dom_subdom_list.forEach(function (data_object) {
            if (data_object.name === field) {
              console.log(field + 'value' + data_object.value);
              if (!data_object['value'] || (data_object.value === undefined || data_object.value == null)) {
                fullyfilledStatus = false;
                return;
              }
            }
          });
        }
      }
    });

    return fullyfilledStatus;
  }


  getVirtualFields(domain, subdomin = null) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getVirtualFields(domain, subdomin)
        .subscribe(
          data => {
            const set_data = [];
            set_data['fields'] = _this.setFieldValue(data, subdomin);
            set_data['questions'] = _this.qservice.getQuestions(set_data['fields']);
            resolve(set_data);
          },
          () => {
            reject();
          }
        );
    });
  }
  setFieldValue(data, subdomin) {
    let fields = [];
    if (subdomin) {
      fields = (this.bProfile['subDomainVirtualFields'] &&
        this.bProfile['subDomainVirtualFields'][0]) ?
        this.bProfile['subDomainVirtualFields'][0][subdomin] : [];
    } else {
      fields = (this.bProfile['domainVirtualFields']) ?
        this.bProfile['domainVirtualFields'] : [];
    }
    if (fields) {
      for (const i in data) {
        if (data[i]) {
          const row = data[i];
          if (fields[row.name]) {
            data[i]['value'] = fields[row.name];
          } else {
            delete data[i]['value'];
          }
        }
      }
      return data;
    } else {
      return data;
    }
  }

  getSubDomainVirtualFields() {
    const checkArray = [];
    const weightageObjectOfSubDomain: any = {};
    this.getVirtualFields(this.bProfile['serviceSector']['domain'],
      this.bProfile['serviceSubSector']['subDomain']).then(
        data => {
          let mandatorysubdomain = false;
          let mandatorySubDomainFilled = false;
          let additionalInfoFilledStatus = false;
          this.subdomain_fields = data['fields'];
          this.subdomain_fields.forEach(subdomain => {
            checkArray.push(subdomain);
          });
          this.subdomain_questions = data['questions'] || [];
          if (this.mandatoryfieldArray.length !== 0 && this.subdomain_fields.some(subdomain => subdomain.mandatory === true)) {
            mandatorysubdomain = true;
            this.mandatoryfieldArray.forEach(mandatoryField => {
              if (this.checkMandatoryFieldsInResultSet(this.subdomain_fields, mandatoryField)) {
                mandatorySubDomainFilled = true;
              } else {
                mandatorySubDomainFilled = false;
                return;
              }
            });

          }
          if (this.checkAdditionalFieldsFullyFilled(this.additionalInfoSubDomainFields, this.subdomain_fields)) {
            additionalInfoFilledStatus = true;
          }

          weightageObjectOfSubDomain.mandatorySubDomain = mandatorysubdomain;
          weightageObjectOfSubDomain.mandatorySubDomainFilledStatus = mandatorySubDomainFilled;
          weightageObjectOfSubDomain.additionalSubDomainFullyFilled = additionalInfoFilledStatus;
          this.provider_datastorage.setWeightageObjectOfSubDomain(weightageObjectOfSubDomain);
          this.provider_datastorage.updateMandatoryAndAdditionalFieldWeightage();
        }
      );
  }

  getGalleryImages() {
    this.provider_services.getGalleryImages()
      .subscribe(
        data => {
          this.image_list = data;
          this.provider_datastorage.updateGalleryWeightageToBusinessProfile(this.image_list);

        },
        () => {

        }
      );
  }
}
