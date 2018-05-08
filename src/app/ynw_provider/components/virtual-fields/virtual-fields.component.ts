import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {HeaderComponent} from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';

import { QuestionService } from '../dynamicforms/dynamic-form-question.service';

@Component({
    selector: 'app-provider-virtual-fields',
    templateUrl: './virtual-fields.component.html'
})

export class VirtualFieldsComponent implements OnInit {


  bProfile = null;
  questions = [];

  constructor(private provider_services: ProviderServices,
  private provider_datastorage: ProviderDataStorageService,
  private service: QuestionService,
  private router: Router) {}

  ngOnInit() {
    this.bProfile = this.provider_datastorage.get('bProfile');
    if ( this.bProfile && this.bProfile['serviceSector']['domain']) {
      this.getVirtualFields(this.bProfile['serviceSector']['domain']);
    } else {
      this.router.navigate(['/provider/profile-search-menu']);
    }
  }

  getVirtualFields(domain) { console.log(domain);
    this.provider_services.getVirtualFields('autoMobile')
    .subscribe(
      data => {
        console.log(data);
        this.questions = this.service.getQuestions(data);
      },
      error => {

      }
    );
  }


}
