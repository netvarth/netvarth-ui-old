import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import {Messages} from '../../constants/project-messages';
import {projectConstants} from '../../constants/project-constants';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html'
})
export class ChangeEmailComponent implements OnInit {

  spForm: FormGroup;
  api_error = null;
  api_success = null;
  is_verified = false;
  user_details;
  step = 1;
  submit_data= {'email' : null};

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router) {}

    ngOnInit() {

      this.spForm = this.fb.group({
        email: ['', Validators.compose([Validators.email]) ]
      });
      const ob = this;
      this.shared_functions.getProfile()
      .then(
        success =>  {
          this.user_details = success;
          this.spForm.setValue({
            'email': success['userProfile']['email'] || null
          });
          this.is_verified = success['userProfile']['emailVerified'];
        },
        error => { ob.api_error = error.error; }
      );

    }

    onSubmit(submit_data) {

      this.resetApiErrors();

      if (!submit_data.email) { return false; }

      this.shared_services.verifyNewPhone(submit_data.email, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        data => {
          this.step = 2;
          this.submit_data = submit_data;
          this.api_success = Messages.OTP_SENT_EMAIL;
        },
        error => {
          this.api_error = error.error;
        }
      );
    }

    isVerified(data) {
      if (this.user_details.userProfile.email === data) {
        this.is_verified = true;
      } else {
        this.is_verified = false;
      }
    }

    resetApiErrors() {
      this.api_error = null;
      this.api_success = null;
    }

    resendOtp(submit_data) {
      this.onSubmit(submit_data);
    }

    onOtpSubmit(submit_data) {

      const post_data = {'loginId': this.submit_data.email};
      this.shared_services.verifyNewPhoneOTP(submit_data.phone_otp, post_data, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        data => {
          this.api_success = Messages.EMAIL_VERIFIED;
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
