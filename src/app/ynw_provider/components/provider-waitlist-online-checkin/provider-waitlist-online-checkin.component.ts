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
  reset_waitlist_manager: any  = null;
  formChange = 0;

  api_success = null;
  customer_label = '';
  checkin_label = '';

  constructor(private provider_services: ProviderServices,
  private provider_datastorage: ProviderDataStorageService,
  private shared_functions: SharedFunctions) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
  }

  ngOnInit() {

    this.waitlist_manager = this.reset_waitlist_manager = this.provider_datastorage.get('waitlistManage') || [];
    this.setValue(this.waitlist_manager);
  }

  setValue(value) {

    this.form.calculationMode = value['calculationMode'] || '';
    this.form.trnArndTime = value['trnArndTime'] || null;
    this.form.futureDateWaitlist = value['futureDateWaitlist'] || false;
    this.form.showTokenId = value['showTokenId'] || false;

  }


  OnSubmit() {

    if (  this.form.calculationMode === 'Fixed' && this.form.trnArndTime == null) {
      return false;
    }

    this.provider_services.setWaitlistMgr(this.form)
    .subscribe(
      data => {
        this.getWaitlistMgr();
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
        this.reset_waitlist_manager = data;
        this.setValue(this.waitlist_manager);
        this.provider_datastorage.set('waitlistManage', data);
        this.formChange = 0;
      },
      error => {

      }
    );
  }

  onFormChange() {
    this.formChange = 1;
  }

  cancelChange() {
    this.formChange = 0;
    this.setValue(this.reset_waitlist_manager);
  }



}
