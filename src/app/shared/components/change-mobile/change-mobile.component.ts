import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import {Messages} from '../../constants/project-messages';
import {projectConstants} from '../../constants/project-constants';

@Component({
  selector: 'app-change-mobile',
  templateUrl: './change-mobile.component.html'
})
export class ChangeMobileComponent implements OnInit {

  spForm: FormGroup;
  api_error = null;
  api_success = null;
  is_verified = false;
  user_details;
  step = 1;
  submit_data = {'phonenumber' : null};

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router) {}

    ngOnInit() {

      this.spForm = this.fb.group({
        phonenumber: ['', Validators.compose(
          [ Validators.required,
            Validators.maxLength(10),
            Validators.minLength(10),
            Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])  ]

      });
      const ob = this;
      this.shared_functions.getProfile()
      .then(
        success =>  {
          this.user_details = success;
          if (this.shared_functions.isBusinessOwner('returntyp') === 'provider') {
            this.spForm.setValue({
              'phonenumber': success['basicInfo']['mobile'] || null
            });
          } else {

            this.spForm.setValue({
              'phonenumber': success['userProfile']['primaryMobileNo'] || null
            });
          }
          this.is_verified = success['userProfile']['phoneVerified'];
        },
        error => { ob.api_error = error.error; }
      );

    }

    onSubmit(submit_data) {
      if (!submit_data.phonenumber) { return false; }

      this.shared_services.verifyNewPhone(submit_data.phonenumber, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        data => {
          this.step = 2;
          this.submit_data = submit_data;
        },
        error => {
          this.api_error = error.error;
        }
      );
    }

    isVerified(data) {
      if (this.user_details.userProfile.primaryMobileNo === data) {
        this.is_verified = true;
      } else {
        this.is_verified = false;
      }
    }

    resetApiErrors() {
      this.api_error = null;
    }

    resendOtp(phonenumber) {
      this.onSubmit(phonenumber);
    }

    onOtpSubmit(submit_data) {

      const post_data = {'loginId': this.submit_data.phonenumber};
      this.shared_services.verifyNewPhoneOTP(submit_data.phone_otp, post_data, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        data => {
          this.api_success = Messages.PHONE_VERIFIED;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.api_error = error.error;
        }
      );

    }

  }
