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
  curtype;
  submit_data = {'email' : null};
  breadcrumbs_init = [
    {
      title: 'Dashboard',
      url: '/' + this.shared_functions.isBusinessOwner('returntyp')
    },
    {
      title: 'Change Email id',
      url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/change-email'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router
  ) {}

    ngOnInit() {
      this.curtype = this.shared_functions.isBusinessOwner('returntyp');
      this.spForm = this.fb.group({
        email: ['', Validators.compose([Validators.email]) ]
      });
      this.getProviderProfile();
    }
    getProviderProfile() {
      const ob = this;
      this.shared_functions.getProfile()
      .then(
        success =>  {
          this.step = 1;
          this.user_details = success;
          if (this.shared_functions.isBusinessOwner('returntyp') === 'provider') {
            this.spForm.setValue({
              'email': success['basicInfo']['email'] || null
            });
            this.is_verified = success['basicInfo']['emailVerified'];
          } else {
            this.spForm.setValue({
                'email': success['userProfile']['email'] || null
              });
            this.is_verified = success['userProfile']['emailVerified'];
          }
        },
        error => {
          // ob.api_error = error.error;
          this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
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
          const email = (submit_data.email) ? submit_data.email : 'your email';
          this.api_success  = Messages.OTP_SENT_EMAIL.replace('[your_email]', email);
          /* setTimeout(() => {
            this.api_success = '';
            }, projectConstants.TIMEOUT_DELAY);*/
          // this.api_success = Messages.OTP_SENT_EMAIL;
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
    }

    isVerified(data) {
      if (this.shared_functions.isBusinessOwner('returntyp') === 'provider') {
        if (this.user_details.basicInfo.email === data) {
          this.is_verified = true;
        } else {
          this.is_verified = false;
        }
      } else {
        if (this.user_details.userProfile.email === data) {
          this.is_verified = true;
        } else {
          this.is_verified = false;
        }
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

      this.resetApiErrors();

      const post_data = {'loginId': this.submit_data.email};
      this.shared_services.verifyNewPhoneOTP(submit_data.phone_otp, post_data, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        data => {
          // this.api_success = Messages.EMAIL_VERIFIED;
          this.shared_functions.openSnackBar(Messages.EMAIL_VERIFIED);
          this.api_success = null;
          setTimeout(() => {
            // this.router.navigate(['/']);
            this.getProviderProfile();
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          // this.api_error = error.error;
          this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
        }
      );

    }

  }
