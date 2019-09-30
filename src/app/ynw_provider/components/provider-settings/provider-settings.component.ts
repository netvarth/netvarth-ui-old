import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { Router } from '@angular/router';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Subscription } from 'rxjs/Subscription';
import { Messages } from '../../../shared/constants/project-messages';
import { HttpResponse } from '@angular/common/http';

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
  notification_cap = Messages.NOTIFICATION_CAP;
  frm_profile_search_cap = Messages.FRM_LEVEL_PROFILE_SEARCH_MSG;
  frm_waitlist_cap = Messages.FRM_LEVEL_WAITLIST_MSG;
  frm_license_cap = Messages.FRM_LEVEL_LIC_MSG;
  frm_pay_cap = Messages.FRM_LEVEL_PAY_MSG;
  frm_bill_cap = Messages.FRM_LEVEL_BILLING_MSG;
  frm_coupon_cap = Messages.FRM_LEVEL_COUPON_MSG;
  frm_mis_cap = Messages.FRM_LEVEL_MISC_MSG;
  waitlist_status = false;
  futureDateWaitlist = false;
  waitlist_statusstr = 'Off';
  futurewaitlist_statusstr = 'off';
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
  isCheckin;
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
  nodiscountError = false;
  noitemError = false;
  miscellaneous = '';
  frm_public_self_cap = '';
  itemError = '';
  discountError = '';
  waitlist_details;
  paytmVerified = false;
  payuVerified = false;
  isJaldeeAccount = false;
  departmentCount: any = 0;
  filterbydepartment = false;
  locationExists = false;
  ngOnInit() {
    this.bprofileTooltip = this.shared_functions.getProjectMesssages('BRPFOLE_SEARCH_TOOLTIP');
    this.waitlistTooltip = this.shared_functions.getProjectMesssages('WAITLIST_TOOLTIP');
    this.licenseTooltip = this.shared_functions.getProjectMesssages('LINCENSE_TOOLTIP');
    this.paymentTooltip = this.shared_functions.getProjectMesssages('PAYMENT_TOOLTIP');
    this.billposTooltip = this.shared_functions.getProjectMesssages('BILLPOS_TOOLTIP');
    this.frm_profile_cap = Messages.FRM_LEVEL_PROFILE_MSG.replace('[customer]', this.customer_label);
    this.miscellaneous = this.shared_functions.getProjectMesssages('FRM_LEVEL_MISC_MSG');
    this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
    this.getLocationCount();
    this.getQueuesCount();
    this.getServiceCount();
    this.getDepartmentsCount();
    this.getSearchstatus();
    this.getWaitlistMgr();
    this.getpaymentDetails();
    this.getDiscounts();
    this.getCoupons();
    this.getitems();
    this.getBusinessConfiguration();
    this.isCheckin = this.shared_functions.getitemfromLocalStorage('isCheckin');
    // Update from footer
    this.subscription = this.shared_functions.getMessage()
      .subscribe(
        data => {
          if (data.ttype === 'online_checkin_status' || data.ttype === 'filterbyDepartment' || data.ttype === 'future_checkin_status') {
            this.getWaitlistMgr();
          }
        });
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
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
  handle_waitliststatus(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setAcceptOnlineCheckin(is_check)
      .subscribe(
        () => {
          this.shared_functions.openSnackBar('Same day online check-in ' + is_check + 'd successfully', { ' panelclass': 'snackbarerror' });
          this.getWaitlistMgr();
          this.shared_functions.sendMessage({ttype: 'checkin-settings-changed'});
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
          this.shared_functions.sendMessage({ttype: 'checkin-settings-changed'});
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
    let dataHolder = '';
    const is_check = (event.checked) ? true : false;
    dataHolder = '"onlinePayment": ' + is_check;
    if (this.payment_settings.hasOwnProperty('payTm')) {
      dataHolder += ', "payTm": ' + this.payment_settings['payTm'];
    }
    if (this.payment_settings.hasOwnProperty('payTmLinkedPhoneNumber')) {
      dataHolder += ', "payTmLinkedPhoneNumber": ' + '"' + this.payment_settings['payTmLinkedPhoneNumber'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('dcOrCcOrNb')) {
      dataHolder += ', "dcOrCcOrNb": ' + this.payment_settings['dcOrCcOrNb'];
    }
    if (this.payment_settings.hasOwnProperty('panCardNumber')) {
      dataHolder += ', "panCardNumber": ' + '"' + this.payment_settings['panCardNumber'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('bankAccountNumber')) {
      dataHolder += ', "bankAccountNumber": ' + '"' + this.payment_settings['bankAccountNumber'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('bankName')) {
      dataHolder += ', "bankName": ' + '"' + this.payment_settings['bankName'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('ifscCode')) {
      dataHolder += ', "ifscCode": ' + '"' + this.payment_settings['ifscCode'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('nameOnPanCard')) {
      dataHolder += ', "nameOnPanCard": ' + '"' + this.payment_settings['nameOnPanCard'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('accountHolderName')) {
      dataHolder += ', "accountHolderName": ' + '"' + this.payment_settings['accountHolderName'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('branchCity')) {
      dataHolder += ', "branchCity": ' + '"' + this.payment_settings['branchCity'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('businessFilingStatus')) {
      dataHolder += ', "businessFilingStatus": ' + '"' + this.payment_settings['businessFilingStatus'] + '"';
    }
    if (this.payment_settings.hasOwnProperty('accountType')) {
      dataHolder += ', "accountType": ' + '"' + this.payment_settings['accountType'] + '"';
    }
    const post_Data = '{' + dataHolder + '}';
    this.provider_services.setPaymentSettings(JSON.parse(post_Data))
      .subscribe(
        () => {
          this.getpaymentDetails();
          if (!is_check) {
            // this.shared_functions.openSnackBar('online payment is disabled', {'panelclass' : 'snackbarerror'});
            this.shared_functions.openSnackBar('online payment is disabled', { 'panelClass': 'snackbarerror' });
          }
        },
        error => {
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
  redirecTo(mod) {
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
      case 'locations':
        this.routerobj.navigate(['provider', 'settings', 'waitlist-manager', 'locations']);
        break;
      case 'services':
        this.routerobj.navigate(['provider', 'settings', 'waitlist-manager', 'services']);
        break;
      case 'queues':
        if (this.locationExists) {
          this.routerobj.navigate(['provider', 'settings', 'waitlist-manager', 'queues']);
        } else {
          this.shared_functions.openSnackBar('Please set location', { 'panelClass': 'snackbarerror' });
        }
        break;
      case 'discounts':
        if (this.nodiscountError) {
          this.routerobj.navigate(['provider', 'settings', 'pos', 'discounts']);
        } else {
          this.shared_functions.openSnackBar(this.discountError, { 'panelClass': 'snackbarerror' });
        }
        break;
      case 'coupons':
        this.routerobj.navigate(['provider', 'settings', 'pos', 'coupons']);
        break;
      case 'nonworking':
        this.routerobj.navigate(['provider', 'settings', 'holidays']);
        break;
      case 'notifications':
        this.routerobj.navigate(['provider', 'settings', 'notifications']);
        break;
      case 'items':
        if (this.noitemError) {
          this.routerobj.navigate(['provider', 'settings', 'pos', 'items']);
        } else {
          this.shared_functions.openSnackBar(this.itemError, { 'panelClass': 'snackbarerror' });
        }
        break;
      case 'waitlistmanager':
        this.routerobj.navigate(['provider', 'settings', 'waitlist-manager']);
        break;
      // case 'license':
      //   this.routerobj.navigate(['provider', 'license']);
      //   break;
      case 'paymentsettings':
        this.routerobj.navigate(['provider', 'settings', 'pos', 'paymentsettings']);
        break;
      case 'taxsettings':
        this.routerobj.navigate(['provider', 'settings', 'pos', 'taxsettings']);
        break;
      case 'departments':
        this.routerobj.navigate(['provider', 'settings', 'waitlist-manager', 'departments']);
    }
  }
  getLocationCount() {
    this.provider_services.getLocationCount()
      .subscribe(
        data => {
          this.location_count = data;
        });
  }
  getServiceCount() {
    this.provider_services.getServiceCount()
      .subscribe(
        data => {
          this.service_count = data;
        });
  }
  getQueuesCount() {
    this.provider_services.getQueuesCount()
      .subscribe(
        data => {
          this.queues_count = data;
        });
  }
  getDiscounts() {
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
  getitems() {
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
    this.provider_services.getBussinessProfile()
      .subscribe(data => {
        this.bProfile = data;
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
}

