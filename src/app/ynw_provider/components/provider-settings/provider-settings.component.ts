import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Subscription, SubscriptionLike as ISubscription } from 'rxjs';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-settings',
  templateUrl: './provider-settings.component.html'
})

export class ProviderSettingsComponent implements OnInit, OnDestroy {
  profile_cap = Messages.PROFILE_CAP;
  search_cap = Messages.SEARCH_CAP;
  public_search_cap = Messages.BPROFILE_PUBLIC_SEARCH_CAP;
  services_cap = Messages.SERVICES_CAP;
  service_window_cap = Messages.SERVICE_TIME_CAP;
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
  non_work_cap = Messages.NON_WORKING_CAP;
  
  frm_profile_search_cap = Messages.FRM_LEVEL_PROFILE_SEARCH_MSG;
  // frm_profile_cap = Messages.FRM_LEVEL_PROFILE_MSG;
  frm_waitlist_cap = Messages.FRM_LEVEL_WAITLIST_MSG;
  frm_license_cap = Messages.FRM_LEVEL_LIC_MSG;
  frm_pay_cap = Messages.FRM_LEVEL_PAY_MSG;
  frm_bill_cap = Messages.FRM_LEVEL_BILLING_MSG;
  frm_coupon_cap = Messages.FRM_LEVEL_COUPON_MSG;
  frm_mis_cap = Messages.FRM_LEVEL_MISC_MSG;

  waitlist_status = false;
  waitlist_statusstr = 'Off';
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
  checkin_label = '';
  tooltipcls = projectConstants.TOOLTIP_CLS;
  subscription: Subscription;
  customer_label = '';

  constructor(private provider_services: ProviderServices,
    private shared_functions: SharedFunctions,
    private routerobj: Router,
    private shared_services: SharedServices) {
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }
  bprofileTooltip = '';
  waitlistTooltip = '';
  licenseTooltip = '';
  paymentTooltip = '';
  accountActiveMsg = '';
  billposTooltip = '';
  frm_profile_cap = '';
  

  ngOnInit() {
    this.bprofileTooltip = this.shared_functions.getProjectMesssages('BRPFOLE_SEARCH_TOOLTIP');
    this.waitlistTooltip = this.shared_functions.getProjectMesssages('WAITLIST_TOOLTIP');
    this.licenseTooltip = this.shared_functions.getProjectMesssages('LINCENSE_TOOLTIP');
    this.paymentTooltip = this.shared_functions.getProjectMesssages('PAYMENT_TOOLTIP');
   // this.accountActiveMsg = this.shared_functions.getProjectMesssages('JALDEEBANK_TOOLTIP');
    this.billposTooltip = this.shared_functions.getProjectMesssages('BILLPOS_TOOLTIP');
    this.frm_profile_cap = Messages.FRM_LEVEL_PROFILE_MSG.replace('[customer]',this.customer_label);
    this.getLocationCount();
    this.getQueuesCount();
    this.getServiceCount();
    this.getSearchstatus();
    this.getWaitlistMgr();
    this.getpaymentDetails();
    this.getDiscounts();
    this.getCoupons();
    this.getitems();
    this.getBusinessConfiguration();


    // Update from footer
    this.subscription = this.shared_functions.getMessage()
      .subscribe(
        data => {
          if (data.ttype === 'online_checkin_status') {
            this.getWaitlistMgr();
          }
        },
        error => {

        }
      );

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr()
      .subscribe(
        data => {

          // this.waitlist_status = data['enabledWaitlist'] || false;
          this.waitlist_status = data['onlineCheckIns'] || false;
          this.waitlist_statusstr = (this.waitlist_status) ? 'On' : 'Off';
        },
        error => { }
      );

  }

  handle_waitliststatus(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    // this.provider_services.setWaitlistMgrStatus(is_check)
    this.provider_services.setAcceptOnlineCheckin(is_check)
      .subscribe(
        data => {
          this.getWaitlistMgr();
        },
        error => {
          const snackBarRef = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getWaitlistMgr();
        }
      );
  }
  getpaymentDetails() {
    this.provider_services.getPaymentSettings()
      .subscribe(
        data => {
          this.payment_settings = data;
          // console.log('paystatus', data);
          this.payment_status = (data['onlinePayment']) || false;
          this.payment_statusstr = (this.payment_status) ? 'On' : 'Off';
          if(this.payment_settings.isJaldeeAccount){
            this.accountActiveMsg = "You are using Jaldee bank account";
          }
          else{
            this.accountActiveMsg = "You are using your own bank account";
          }
          
        },
        error => {
          const snackBarRef = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

  }
  handle_paymentstatus(event) {

    let dataHolder = '';
    const is_check = (event.checked) ? true : false;

    dataHolder = '"onlinePayment": ' + is_check;
    if (this.payment_settings.hasOwnProperty('payTm')) {
      dataHolder += ', "payTm": ' + this.payment_settings['payTm'];
      // post_Data.payTm = this.payment_settings['payTm'];
    }
    if (this.payment_settings.hasOwnProperty('payTmLinkedPhoneNumber')) {
      dataHolder += ', "payTmLinkedPhoneNumber": ' + '"' + this.payment_settings['payTmLinkedPhoneNumber'] + '"';
      // post_Data.payTmLinkedPhoneNumber = this.payment_settings['payTmLinkedPhoneNumber'];
    }
    if (this.payment_settings.hasOwnProperty('dcOrCcOrNb')) {
      dataHolder += ', "dcOrCcOrNb": ' + this.payment_settings['dcOrCcOrNb'];
      // post_Data.dcOrCcOrNb = this.payment_settings['dcOrCcOrNb'];
    }
    if (this.payment_settings.hasOwnProperty('panCardNumber')) {
      dataHolder += ', "panCardNumber": ' + '"' + this.payment_settings['panCardNumber'] + '"';
      // post_Data.panCardNumber = this.payment_settings['panCardNumber'];
    }
    if (this.payment_settings.hasOwnProperty('bankAccountNumber')) {
      dataHolder += ', "bankAccountNumber": ' + '"' + this.payment_settings['bankAccountNumber'] + '"';
      // post_Data.bankAccountNumber = this.payment_settings['bankAccountNumber'];
    }
    if (this.payment_settings.hasOwnProperty('bankName')) {
      dataHolder += ', "bankName": ' + '"' + this.payment_settings['bankName'] + '"';
      // post_Data.bankName = this.payment_settings['bankName'];
    }
    if (this.payment_settings.hasOwnProperty('ifscCode')) {
      dataHolder += ', "ifscCode": ' + '"' + this.payment_settings['ifscCode'] + '"';
      // post_Data.ifscCode = this.payment_settings['ifscCode'];
    }
    if (this.payment_settings.hasOwnProperty('nameOnPanCard')) {
      dataHolder += ', "nameOnPanCard": ' + '"' + this.payment_settings['nameOnPanCard'] + '"';
      // post_Data.nameOnPanCard = this.payment_settings['nameOnPanCard'];
    }
    if (this.payment_settings.hasOwnProperty('accountHolderName')) {
      dataHolder += ', "accountHolderName": ' + '"' + this.payment_settings['accountHolderName'] + '"';
      // post_Data.accountHolderName = this.payment_settings['accountHolderName'];
    }
    if (this.payment_settings.hasOwnProperty('branchCity')) {
      dataHolder += ', "branchCity": ' + '"' + this.payment_settings['branchCity'] + '"';
      // post_Data.branchCity = this.payment_settings['branchCity'];
    }
    if (this.payment_settings.hasOwnProperty('businessFilingStatus')) {
      dataHolder += ', "businessFilingStatus": ' + '"' + this.payment_settings['businessFilingStatus'] + '"';
      // post_Data.businessFilingStatus = this.payment_settings['businessFilingStatus'];
    }
    if (this.payment_settings.hasOwnProperty('accountType')) {
      dataHolder += ', "accountType": ' + '"' + this.payment_settings['accountType'] + '"';
      // post_Data.accountType = this.payment_settings['accountType'];
    }
    const post_Data = '{' + dataHolder + '}';
    console.log('post', JSON.parse(post_Data));

    this.provider_services.setPaymentSettings(JSON.parse(post_Data))
      .subscribe(
        data => {
          this.getpaymentDetails();
        },
        error => {
          const snackBarRef = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          console.log('reached here');
          this.getpaymentDetails();
        }
      );
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
      .subscribe(data => {
        this.getSearchstatus();
        this.getWaitlistMgr();
      },
        error => {
          const snackBarRef = this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.getSearchstatus();
          this.getWaitlistMgr();
        });
  }
  redirecTo(mod) {
    switch (mod) {
      case 'bprofile':
        this.routerobj.navigate(['provider', 'settings', 'bprofile-search']);
        break;
      case 'locations':
        this.routerobj.navigate(['provider', 'settings', 'waitlist-manager', 'locations']);
        break;
      case 'services':
        this.routerobj.navigate(['provider', 'settings', 'waitlist-manager', 'services']);
        break;
      case 'queues':
        this.routerobj.navigate(['provider', 'settings', 'waitlist-manager', 'queues']);
        break;
      case 'discounts':
        this.routerobj.navigate(['provider', 'settings', 'discounts']);
        break;
      case 'coupons':
        this.routerobj.navigate(['provider', 'settings', 'coupons']);
        break;
      case 'nonworking':
        this.routerobj.navigate(['provider', 'settings', 'holidays']);
        break;
      case 'items':
        this.routerobj.navigate(['provider', 'settings', 'items']);
        break;
      case 'waitlistmanager':
        this.routerobj.navigate(['provider', 'settings', 'waitlist-manager']);
        break;
      case 'license':
        this.routerobj.navigate(['provider', 'settings', 'license']);
        break;
      case 'paymentsettings':
        this.routerobj.navigate(['provider', 'settings', 'paymentsettings']);
        break;
      case 'taxsettings':
        this.routerobj.navigate(['provider', 'settings', 'paymentsettings', { id: 1 }]);
        break;
    }
  }

  getLocationCount() {
    this.provider_services.getLocationCount()
      .subscribe(
        data => {
          this.location_count = data;
        },
        error => {

        }
      );
  }

  getServiceCount() {
    this.provider_services.getServiceCount()
      .subscribe(
        data => {
          this.service_count = data;

        },
        error => {

        }
      );
  }

  getQueuesCount() {

    this.provider_services.getQueuesCount()
      .subscribe(
        data => {
          this.queues_count = data;
        },
        error => {

        }
      );
  }

  getDiscounts() {
    this.provider_services.getProviderDiscounts()
      .subscribe(data => {
        this.discount_list = data;
        this.discount_count = this.discount_list.length;
      });
  }
  getCoupons() {
    this.provider_services.getProviderCoupons()
      .subscribe(data => {
        this.coupon_list = data;
        this.coupon_count = this.coupon_list.length;
      });
  }
  getitems() {
    this.provider_services.getProviderItems()
      .subscribe(data => {
        this.item_list = data;
        this.item_count = this.item_list.length;
      });
  }
  reloadHandler() {
  }
  getBusinessConfiguration() {
    this.shared_services.bussinessDomains()
      .subscribe(data => {
        this.businessConfig = data;
        // console.log('config', this.businessConfig);
        this.getBussinessProfile();
      },
        error => {

        });
  }
  getBussinessProfile() {
    this.provider_services.getBussinessProfile()
      .subscribe(data => {
        this.bProfile = data;
        console.log('sector Id', this.bProfile);
        for (let i = 0; i < this.businessConfig.length; i++) {
          if (this.businessConfig[i].id === this.bProfile.serviceSector.id) {
            if (this.businessConfig[i].multipleLocation) {
              this.multipeLocationAllowed = true;
            }
            console.log(this.multipeLocationAllowed);
            if (this.multipeLocationAllowed == true) {
              this.locName = this.shared_functions.getProjectMesssages('WAITLIST_LOCATIONS_CAP');
            }
            if (this.multipeLocationAllowed == false) {
              this.locName = this.shared_functions.getProjectMesssages('WIZ_LOCATION_CAP');
            }
          }
        }
      },
        error => {

        });
  }
}
