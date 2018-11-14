import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { SignUpComponent } from '../../components/signup/signup.component';
import {projectConstants} from '../../../shared/constants/project-constants';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-privacy-static',
  templateUrl: './privacy-static.component.html'
})
export class PrivacyStaticComponent implements OnInit {

  kwdet: any = [];
  api_error = null;
  domain;
  showheaderandfooter = false;

  constructor(
    private activaterouterobj: ActivatedRoute,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions
    ) {
     }

  ngOnInit() {
    this.activaterouterobj.paramMap
    .subscribe(params => {
      const passid = params.get('id');
     // console.log('passedid', passid);
      if (passid) {
        if (passid === 'mobile') {
          this.showheaderandfooter = false;
        }  else {
          this.showheaderandfooter = true;
        }
      } else {
        this.showheaderandfooter = true;
      }
    });
  }
}
