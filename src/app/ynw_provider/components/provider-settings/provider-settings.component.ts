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
  search_status = 2;
  search_statusstr = 'Off';
  payment_status = false;
  payment_statusstr = 'Off';
  discount_list ;
  discount_count = 0;
  coupon_list;
  coupon_count = 0;
  breadcrumbs = [
    {
      title: 'Settings'
    }
  ];
  location_count: any = 0;
  service_count: any = 0;
  queues_count: any = 0;

  constructor(private provider_services: ProviderServices,
  private routerobj: Router) {}

  ngOnInit() {
    this.getLocationCount();
    this.getQueuesCount();
    this.getServiceCount();
    this.getSearchstatus();
    this.getWaitlistMgr();
    this.getpaymentDetails();
    this.getDiscounts();
    this.getCoupons();
  }

  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr()
    .subscribe(
      data => {

        this.waitlist_status = data['enabledWaitlist'] || false;
        this.waitlist_statusstr = (this.waitlist_status) ? 'On' : 'Off';
      },
      error => {}
    );

  }
  handle_waitliststatus(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setWaitlistMgrStatus(is_check)
    .subscribe(
      data => {
        this.getWaitlistMgr();
      },
      error => {
        this.getWaitlistMgr();
      }
    );
  }
  getpaymentDetails() {
    this.provider_services.getPaymentSettings()
    .subscribe(
      data => {

        this.payment_status = data['onlinePayment'] || false;
        this.payment_statusstr = (this.payment_status) ? 'On' : 'Off';
      },
      error => {}
    );

  }
  handle_paymentstatus(event) {
    const is_check = (event.checked) ? true : false;
    const payment_data = {
      'onlinePayment' : is_check
    };
    this.provider_services.setPaymentSettings(payment_data)
    .subscribe(
      data => {
        this.getpaymentDetails();
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
          this.search_status = 1;
          this.search_statusstr = 'On';
        } else {
          this.search_status = 2;
          this.search_statusstr = 'Off';
        }
      });

  }
  handle_searchstatus() {
    const changeTostatus = (this.search_status === 1) ? 'DISABLE' : 'ENABLE';
    this.provider_services.updatePublicSearch(changeTostatus)
      .subscribe (data => {
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
      case 'waitlistmanager':
        this.routerobj.navigate(['provider', 'settings', 'waitlist-manager']);
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
}
