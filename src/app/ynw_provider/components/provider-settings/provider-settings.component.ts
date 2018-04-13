import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import {HeaderComponent} from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';



@Component({
    selector: 'app-provider-settings',
    templateUrl: './provider-settings.component.html'
})

export class ProviderSettingsComponent implements OnInit {

  waitlist_status = false;

  constructor(private provider_services: ProviderServices) {}

  ngOnInit() {
    this.getWaitlistMgr();
  }

  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr()
    .subscribe(
      data => {

        this.waitlist_status = data['enabledWaitlist'] || false;
      },
      error => {}
    );

  }
  changeWaitlist(event) {
    const is_check = (event.checked) ? 'Enable' : 'Disable';
    this.provider_services.setWaitlistMgrStatus(is_check)
    .subscribe(
      data => {},
      error => {
        this.getWaitlistMgr();
      }
    );
  }
}
