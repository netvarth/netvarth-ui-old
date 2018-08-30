import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { SignUpComponent } from '../../components/signup/signup.component';
import {projectConstants} from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-privacy-static',
  templateUrl: './privacy-static.component.html'
})
export class PrivacyStaticComponent implements OnInit {

  kwdet: any = [];
  api_error = null;
  domain;

  constructor(
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions
    ) {
     }

  ngOnInit() {
  }
}
