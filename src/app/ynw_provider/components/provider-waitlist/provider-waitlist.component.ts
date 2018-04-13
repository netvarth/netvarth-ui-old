import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import {HeaderComponent} from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';



@Component({
    selector: 'app-provider-waitlist',
    templateUrl: './provider-waitlist-component.html'
})

export class ProviderWaitlistComponent implements OnInit {

  bProfile = null;
  online_checkin = false ;
  waitlist_manager: any  = null;
  location_count: any = 0;
  service_count: any = 0;
  queues_count: any = 0;


  breadcrumbs = [
    {
      title: 'Settings'
    },
    {
    title: 'Waitlist Manager'
    }
  ];

  constructor(private provider_services: ProviderServices,
  private provider_datastorage: ProviderDataStorageService,
  private router: Router) {}

  ngOnInit() {

    this.getBusinessProfile();
    this.getWaitlistMgr();
    this.getLocationCount();
    this.getQueuesCount();
    this.getServiceCount();

  }

  getWaitlistMgr() {

    this.provider_services.getWaitlistMgr()
    .subscribe(
      data => {
        this.waitlist_manager = data;
        this.online_checkin = data['enabledWaitlist'];
        console.log(this.online_checkin);
        this.provider_datastorage.set('waitlistManage', data);
      },
      error => {

      }
    );

  }

  getBusinessProfile() {

    this.provider_services.getBussinessProfile()
    .subscribe(
      data => {
        this.bProfile = data;
        this.provider_datastorage.set('bProfile', data);
      },
      error => {

      }
    );

  }

  changAcceptOnlineCheckin(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.online_checkin = event.checked;
    this.setAcceptOnlineCheckin(is_check);
  }

  setAcceptOnlineCheckin(is_check) {

    this.provider_services.setAcceptOnlineCheckin(is_check)
    .subscribe(
      data => {
      },
      error => {

      }
    );
  }


  goLocation() {
    this.router.navigate(['provider', 'settings', 'waitlist-manager', 'locations']);
  }

  goService() {
    this.router.navigate(['provider', 'settings', 'waitlist-manager', 'services']);
  }

  goQueue() {
    this.router.navigate(['provider', 'settings', 'waitlist-manager', 'queues']);
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

}


