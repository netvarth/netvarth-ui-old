import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import {HeaderComponent} from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';

import { Messages } from '../../../shared/constants/project-messages';



@Component({
    selector: 'app-provider-waitlist-online-checkin',
    templateUrl: './provider-waitlist-online-checkin.component.html'
})

export class ProviderWaitlistOnlineCheckinComponent implements OnInit {

  form = {
    'calculationMode': '',
    'trnArndTime': '',
    'futureDateWaitlist': false,
    'showTokenId': false
  };
  waitlist_manager: any  = null;
  api_success = null;

  constructor(private provider_services: ProviderServices,
  private provider_datastorage: ProviderDataStorageService,
  private shared_functions: SharedFunctions) {}

  ngOnInit() {

    this.waitlist_manager = this.provider_datastorage.get('waitlistManage') || [];
    console.log(this.waitlist_manager);
    this.setValue();
  }

  setValue() {

    this.form.calculationMode = this.waitlist_manager['calculationMode'] || '';
    this.form.trnArndTime = this.waitlist_manager['trnArndTime'] || null;
    this.form.futureDateWaitlist = this.waitlist_manager['futureDateWaitlist'] || false;
    this.form.showTokenId = this.waitlist_manager['showTokenId'] || false;

  }


  OnSubmit() {

    if (  this.form.calculationMode === 'Fixed' && this.form.trnArndTime == null) {
      return false;
    }

    this.provider_services.setWaitlistMgr(this.form)
    .subscribe(
      data => {
        this.getWaitlistMgr();
        this.api_success = Messages.ONLINE_CHECKIN_SAVED;
        this.shared_functions.apiSuccessAutoHide(this, Messages.ONLINE_CHECKIN_SAVED);
      },
      error => {

      });
  }


  getWaitlistMgr() {

    this.provider_services.getWaitlistMgr()
    .subscribe(
      data => {
        this.waitlist_manager = data;
        this.provider_datastorage.set('waitlistManage', data);
      },
      error => {

      }
    );
  }




}
