import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import {Messages} from '../../constants/project-messages';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  // styleUrls: ['./home.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  spForm: FormGroup;
  api_error = null;
  api_success = null;

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router) {}

    ngOnInit() {

      this.spForm = this.fb.group({
        old_password: ['', Validators.compose(
          [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')]) ],
        new_password: ['', Validators.compose(
          [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')]) ],
        confirm_password: ['', Validators.compose(
            [Validators.required]) ],

    });

    }

    onSubmit(sub_data) {

      if (sub_data.new_password === sub_data.confirm_password) {

        const post_data = {
                            'oldpassword': sub_data.old_password,
                            'password': sub_data.new_password
                          };
        this.api_error = this.api_success = '';
        this.shared_services.changePasswordProfile(post_data, this.shared_functions.isBusinessOwner('returntyp'))
        .subscribe(
          data => {
            this.api_success = Messages.PASSWORD_CHANGED;
            this.spForm.reset();
          },
          error => {
            this.api_error = error.error;
          }
        );

      } else {
        this.api_error = Messages.PASSWORD_MISMATCH;
      }

    }

    resetApiErrors() {
      this.api_error = null;
    }

  }
