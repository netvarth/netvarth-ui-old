import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
import { projectConstants } from '../../../app.component';
import { SnackbarService } from '../../services/snackbar.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html'
})
export class ChangeEmailComponent implements OnInit {

  email_cap = Messages.EMAIL_CAP;
  verified_cap = Messages.EMAIL_VERIFIED;
  save_btn_cap = Messages.SAVE_BTN;
  related_links_cap = Messages.RELATED_LINKS;
  user_profile_cap = Messages.USER_PROF_CAP;
  change_password_cap = Messages.CHANGE_PASSWORD_CAP;
  change_mobile_cap = Messages.CHANGE_MOB_CAP;
  family_members_cap = Messages.FAMILY_MEMBERS;
  dashboard_cap = Messages.DASHBOARD_TITLE;
  spForm: FormGroup;
  api_error = null;
  api_success = null;
  is_verified = false;
  user_details;
  step = 1;
  curtype;
  submit_data = { 'email': null };
  breadcrumbs_init = [
    {
      title: Messages.ADD_CHANGE_EMAIL,
      url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/change-email'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.spForm = this.fb.group({
      email: ['', Validators.compose([Validators.email])]
    });
    this.getProviderProfile();
  }
  getProviderProfile() {
    this.shared_functions.getProfile()
      .then(
        success => {
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
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  onSubmit(submit_data) {

    this.resetApiErrors();
    if (!submit_data.email) { return false; }

    this.shared_services.verifyNewPhone(submit_data.email, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        () => {
          this.step = 2;
          this.submit_data = submit_data;
          const email = (submit_data.email) ? submit_data.email : 'your email';
          this.api_success = Messages.OTP_SENT_EMAIL.replace('[your_email]', email);

          setTimeout(() => {
            this.api_success = '';
          }, projectConstants.TIMEOUT_DELAY_LARGE6);
          // this.api_success = Messages.OTP_SENT_EMAIL;
        },
        error => {
          // this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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

    const post_data = { 'loginId': this.submit_data.email };
    this.shared_services.verifyNewPhoneOTP(submit_data.phone_otp, post_data, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        () => {
          // this.api_success = Messages.EMAIL_VERIFIED;
          this.snackbarService.openSnackBar(Messages.EMAIL_VERIFIED);
          this.api_success = null;
          setTimeout(() => {
            // this.router.navigate(['/']);
            const e_ret = this.lStorageService.getitemfromLocalStorage('e_ret');
            if (e_ret && e_ret === 'pset') {
              this.lStorageService.removeitemfromLocalStorage('e_ret');
              this.router.navigate(['provider', 'settings', 'paymentsettings']);
            } else {
              this.getProviderProfile();
            }
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          // this.api_error = error.error;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

  }

}
