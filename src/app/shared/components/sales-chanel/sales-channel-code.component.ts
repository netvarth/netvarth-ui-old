
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import {Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnChanges, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedFunctions } from '../../functions/shared-functions';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { Messages } from '../../constants/project-messages';

@Component({
  selector: 'app-sales-channel-code',
  templateUrl: './sales-channel-code.component.html'
})
export class SalesChannelCodeComponent implements OnInit {
  salescode = false;
  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions) { }

  ngOnInit() {
  }
  handleSalescode() {
 this.salescode = true;
  }
}
