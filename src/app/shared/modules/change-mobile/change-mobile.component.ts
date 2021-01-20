import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../constants/project-constants';
import { Location } from '@angular/common';
import { WordProcessor } from '../../services/word-processor.service';
import { SnackbarService } from '../../services/snackbar.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-change-mobile',
  templateUrl: './change-mobile.component.html'
})
export class ChangeMobileComponent implements OnInit {

  mobile_cap = Messages.MOBILE_CAP;
  your_curmob_msg = Messages.CURRENTMOBMSG;
  verified_cap = Messages.PHONE_VERIFIED;
  save_btn_cap = Messages.SAVE_BTN;
  related_links_cap = Messages.RELATED_LINKS;
  user_profile_cap = Messages.USER_PROF_CAP;
  change_pass_cap = Messages.CHANGE_PASSWORD_CAP;
  add_change_email_cap = Messages.ADD_CHANGE_EMAIL;
  family_members_cap = Messages.FAMILY_MEMBERS;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  changemob_cap = Messages.CHANGE_MOB_CAP;
  dashboard_cap = Messages.DASHBOARD_TITLE;
  spForm: FormGroup;
  api_error = null;
  api_success = null;
  is_verified = false;
  user_details;
  prev_phonenumber;
  countryCode = 91;
  currentcountryCode;
  step = 1;
  curtype;
  usertype;
  submit_data = { 'phonenumber': null };
  // breadcrumbs_init = [
  //   {
  //     title: this.changemob_cap,
  //     url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/change-mobile'
  //   }
  // ];
  // breadcrumbs = this.breadcrumbs_init;

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router,
    private location: Location,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private lStorageService: LocalStorageService
  ) { }
  goBack () {
    this.location.back();
  }
  ngOnInit() {
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.spForm = this.fb.group({
      phonenumber: ['', Validators.compose(
        [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])]
    });
    this.getProfile();
  }
  getProfile() {
    const ob = this;
    this.shared_functions.getProfile()
      .then(
        success => {
          this.user_details = success;
          this.step = 1;
          if (this.shared_functions.isBusinessOwner('returntyp') === 'provider') {
            this.prev_phonenumber = success['basicInfo']['mobile'];
            this.currentcountryCode = success['basicInfo']['countryCode'];

            // this.spForm.setValue({
            //   'phonenumber': success['basicInfo']['mobile'] || null
            // });
            this.is_verified = success['basicInfo']['phoneVerified'];
          } else {
            this.prev_phonenumber = success['userProfile']['primaryMobileNo'];
            this.currentcountryCode = success['userProfile']['countryCode'];
            // this.spForm.setValue({
            //   'phonenumber': success['userProfile']['primaryMobileNo'] || null
            // });
            this.is_verified = success['userProfile']['phoneVerified'];
          }
        },
        error => { ob.api_error = this.wordProcessor.getProjectErrorMesssages(error); }
      );
  }
  onSubmit(submit_data) {
    if (!submit_data.phonenumber) { return false; }

    this.resetApiErrors();

    this.shared_services.verifyNewPhone(submit_data.phonenumber, this.shared_functions.isBusinessOwner('returntyp'), this.countryCode)
      .subscribe(
        () => {
          this.step = 2;
          this.submit_data = submit_data;
          // this.api_success = Messages.OTP_SENT_MOBILE.replace('[your_mobile]', submit_data.phonenumber);
          // this.snackbarService.openSnackBar(Messages.PASSWORD_MISMATCH, {'panelClass': 'snackbarerror'});
          setTimeout(() => {
            this.api_success = '';
            this.spForm.reset();
          }, projectConstants.TIMEOUT_DELAY_LARGE6);
        },
        error => {
          this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
        }
      );
  }

  isVerified(data) {
    if (this.shared_functions.isBusinessOwner('returntyp') === 'provider') {
      if (this.user_details.basicInfo.mobile === data) {
        this.is_verified = true;
      } else {
        this.is_verified = false;
      }
    } else {
      if (this.user_details.userProfile.primaryMobileNo === data) {
        this.is_verified = true;
      } else {
        this.is_verified = false;
      }
    }
  }

  resetApiErrors() {
    this.api_error = null;
  }

  resendOtp(phonenumber) {
    this.onSubmit(phonenumber);
  }

  onOtpSubmit(submit_data) {

    this.resetApiErrors();

    const post_data = { 
      'countryCode': this.countryCode,
      'loginId': this.submit_data.phonenumber
     };
    this.shared_services.verifyNewPhoneOTP(submit_data.phone_otp, post_data, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        () => {
          // this.api_success = Messages.PHONE_VERIFIED;
          this.api_success = null;
          this.snackbarService.openSnackBar(Messages.PHONE_VERIFIED);
          const ynw = this.lStorageService.getitemfromLocalStorage('ynw-credentials'); // get the credentials from local storage variable
          ynw.loginId = this.submit_data.phonenumber; // change the phone number to the new one in the local storage variable
          this.lStorageService.setitemonLocalStorage('ynw-credentials', ynw); // saving the updation to the local storage variable
          setTimeout(() => {
            this.location.back();
            this.getProfile();
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          // this.api_error = error.error;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

  }

  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  redirecToSettings() {
    this.router.navigate(['provider', 'settings', 'bprofile']);
  }
}
