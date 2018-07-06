import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import {HeaderComponent} from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-provider-settings',
    templateUrl: './provider-settings.component.html'
})

export class ProviderSettingsComponent implements OnInit {

  waitlist_status = false;
  waitlist_statusstr = 'Off';
  search_status = false;
  search_statusstr = 'Off';
  payment_settings: any = [];
  payment_settingsdet: any = [];
  payment_status = false;
  payment_statusstr = 'Off';
  discount_list ;
  discount_count = 0;
  coupon_list;
  coupon_count = 0;
  item_list;
  item_count = 0;
  breadcrumbs = [
    {
      title: 'Settings'
    }
  ];
  location_count: any = 0;
  service_count: any = 0;
  queues_count: any = 0;
  checkin_label = '';

  constructor(private provider_services: ProviderServices,
    private shared_functions: SharedFunctions,
  private routerobj: Router) {
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
  }

  ngOnInit() {
    this.getLocationCount();
    this.getQueuesCount();
    this.getServiceCount();
    this.getSearchstatus();
    this.getWaitlistMgr();
    this.getpaymentDetails();
    this.getDiscounts();
    this.getCoupons();
    this.getitems();
  }

  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr()
    .subscribe(
      data => {

        // this.waitlist_status = data['enabledWaitlist'] || false;
        this.waitlist_status = data['onlineCheckIns'] || false;
        this.waitlist_statusstr = (this.waitlist_status) ? 'On' : 'Off';
      },
      error => {}
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
        const snackBarRef =  this.shared_functions.openSnackBar (error, {'panelClass': 'snackbarerror'});
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
      },
      error => {
        const snackBarRef =  this.shared_functions.openSnackBar (error, {'panelClass': 'snackbarerror'});
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
        const snackBarRef =  this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
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
      .subscribe (data => {
          this.getSearchstatus();
      },
    error => {
      const snackBarRef =  this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
      this.getSearchstatus();
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
        this.routerobj.navigate(['provider', 'settings', 'paymentsettings', {id: 1}]);
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
}
