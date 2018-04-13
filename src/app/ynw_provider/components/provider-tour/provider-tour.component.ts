import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {HeaderComponent} from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';



@Component({
    selector: 'app-provider-tour',
    templateUrl: './provider-tour.component.html'
})

export class ProviderTourComponent implements OnInit {
  constructor(
    private routerobj: Router
  ) {}

  ngOnInit() {
    // localStorage.removeItem('new_provider');
  }
}

