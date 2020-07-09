import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-consumer-join',
  templateUrl: './join.component.html'
})
export class ConsumerJoinComponent implements OnInit {
  mobile_no_cap = Messages.MOBILE_NUMBER_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  password_cap = Messages.PASSWORD_CAP;
  login_cap = Messages.LOGIN_CAP;
  forgot_password_cap = Messages.FORGOT_PASS_CAP;
  new_user_cap = Messages.NEW_USER_CAP;
  sign_up_here_cap = Messages.SIGNUP_HERE_CAP;
  loginForm: FormGroup;
  api_error = null;
  is_provider = 'true';
  step = 1;
  moreParams = [];
  api_loading = true;
  show_error = false;
  test_provider = null;
  heading = '';
  phOrem_error = '';
  signup_here = '';
  mobile_num: any;
  terms_cond_cap = Messages.TERMS_CONDITIONS_CAP;
  actionstarted: boolean;
  consumerjoin = 'consumerjoin';
  user_details;
  cancel_btn_cap = Messages.CANCEL_BTN;
  ok_btn_cap = Messages.OK_BTN;
  resendemailotpsuccess = true;
  api_success = null;
  otp: any;
  close_message: any;
  fname: any;
  lname: any;
  phoneExists = false;
  isPhoneValid = false;
  resendViaEmail: boolean;
  constructor(
    public dialogRef: MatDialogRef<ConsumerJoinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public dialog: MatDialog,
    private router: Router,
    @Inject(DOCUMENT) public document
  ) {
    if (this.shared_functions.checkLogin()) {
      this.shared_functions.logout();
    }
    this.test_provider = data.test_account;
  }
  ngOnInit() {
    this.moreParams = this.data.moreparams;
    this.createForm();
    this.api_loading = false;
    if (this.data.type === 'consumer') {
      this.heading = 'Welcome to Jaldee';
      this.phOrem_error = 'Invalid mobile number';
    }
  }
  createForm() {
    this.loginForm = this.fb.group({
      emailId: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_PHONENUMBERONLY)])],
      password: ['', Validators.compose([Validators.required])],
      first_name: [this.fname, Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      last_name: [this.lname, Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
    });
  }
  showError() {
    this.show_error = true;
    const pN = this.mobile_num.trim();
    const pW = this.document.getElementById('password').value.trim();
    if (pN === '') {
      if (this.mobile_num) {
        this.mobile_num.focus();
        return;
      }
    }
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
        return;
      }
    }
    this.onSubmit(this.loginForm.value);
  }
  clearPhoneExists() {
    this.phoneExists = false;
  }
  onSubmit(data) {
    const pN = this.mobile_num.trim();
    const pW = data.password.trim();
    if (pN === '') {
      if (this.mobile_num) {
        this.mobile_num.focus();
        return;
      }
    }
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
        return;
      }
    }
    const loginId = pN;
    const ob = this;
    const post_data = {
      'countryCode': '+91',
      'loginId': loginId,
      'password': data.password,
      'mUniqueId': null
    };
    this.shared_functions.removeitemfromSessionStorage('tabId');
    this.api_loading = true;
    if (this.data.type === 'provider') {
      post_data.mUniqueId = localStorage.getItem('mUniqueId');
      this.shared_functions.clearSessionStorage();
      this.shared_functions.providerLogin(post_data)
        .then(
          () => {
            const encrypted = this.shared_services.set(data.password, projectConstants.KEY);
            this.shared_functions.setitemonLocalStorage('jld', encrypted.toString());
            // this.dialogRef.close();
            setTimeout(() => {
              this.dialogRef.close();
            }, projectConstants.TIMEOUT_DELAY_SMALL);
          },
          error => {
            ob.api_error = this.shared_functions.getProjectErrorMesssages(error);
            this.api_loading = false;
          }
        );
    } else if (this.data.type === 'consumer') {
      if (post_data.loginId.startsWith('55') && this.test_provider === false) {
        setTimeout(() => {
          ob.api_error = this.shared_functions.getProjectMesssages('TESTACC_LOGIN_NA');
          this.api_loading = false;
        }, projectConstants.TIMEOUT_DELAY_SMALL);
      } else {
        post_data.mUniqueId = localStorage.getItem('mUniqueId');
        this.shared_functions.consumerLogin(post_data, this.moreParams)
          .then(
            () => {
              const encrypted = this.shared_services.set(data.password, projectConstants.KEY);
              this.shared_functions.setitemonLocalStorage('jld', encrypted.toString());
              this.dialogRef.close('success');
            },
            error => {
              ob.api_error = this.shared_functions.getProjectErrorMesssages(error);
              this.api_loading = false;
            }
          );
      }
    }
  }

  otpSend() {
    this.actionstarted = true;
    this.resetApiErrors();
    this.user_details = {};
    let userProfile = {
      countryCode: '+91',
      primaryMobileNo: null, // this.signupForm.get('phonenumber').value || null,
      firstName: null,
      lastName: null
    };
    userProfile = {
      countryCode: '+91',
      primaryMobileNo: this.loginForm.get('emailId').value || null,
      firstName: this.loginForm.get('first_name').value || null,
      lastName: this.loginForm.get('last_name').value || null,
    };
    if (userProfile.firstName === null) {
      userProfile.firstName = 'undefined';
    }
    if (userProfile.lastName === null) {
      userProfile.lastName = 'undefined';
    }
    this.user_details = {
      userProfile: userProfile
    };
    this.signUpApiConsumer(this.user_details);
  }
  resendOTPEmail(status) {
    this.resendViaEmail = status;
  }
  signUpApiConsumer(user_details) {
    this.resendemailotpsuccess = false;
    this.shared_services.signUpConsumer(user_details)
      .subscribe(
        () => {
          this.actionstarted = false;
          // this.createForm(2);
          this.resendemailotpsuccess = true;
          if (user_details.userProfile &&
            user_details.userProfile.email) {
            this.setMessage('email', user_details.userProfile.email);
          } else {
            this.setMessage('mobile', user_details.userProfile.primaryMobileNo);
          }
          this.step = 3;
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
  }
  setMessage(type, data) {
    this.api_error = '';
    if (type === 'email') {
      const email = (data) ? data : 'your email';
      this.api_success = Messages.OTP_SENT_EMAIL.replace('[your_email]', email);
    } else if (type === 'mobile') {
      const phonenumber = (data) ? data : 'your mobile number';
      this.api_success = Messages.OTP_SENT_MOBILE.replace('[your_mobile]', phonenumber);
    }
    setTimeout(() => {
      this.api_success = '';
    }, projectConstants.TIMEOUT_DELAY_LARGE6);
  }
  onOtpSubmit(submit_data) {
    this.actionstarted = true;
    this.resetApiErrors();

    const firstName = this.loginForm.get('first_name').value;
    const lastName = this.loginForm.get('last_name').value;

    if (firstName && firstName.trim().length > 3) {
    } else {
      this.api_error = 'First Name is too short';
      this.actionstarted = false;
      return false;
    }
    if (lastName && lastName.trim() !== '') {
    } else {
      this.api_error = 'Last Name is required';
      this.actionstarted = false;
      return false;
    }
    this.shared_services.OtpSignUpConsumerValidate(submit_data.phone_otp)
      .subscribe(
        () => {
          this.actionstarted = false;
          this.otp = submit_data.phone_otp;
          // this.createForm(4);

          this.step = 6;
        },
        error => {
          this.actionstarted = false;
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
  }
  resendOtp(user_details) {
    this.signUpApiConsumer(user_details);
  }
  onPasswordSubmit(submit_data) {
    this.actionstarted = true;
    this.resetApiErrors();
    const ob = this;
    const post_data = { password: submit_data.new_password };
    this.shared_services.ConsumerSetPassword(this.otp, post_data)
      .subscribe(
        () => {
          this.actionstarted = false;
          const login_data = {
            'countryCode': '+91',
            'loginId': this.user_details.userProfile.primaryMobileNo,
            'password': post_data.password
          };
          // this.dialogRef.close();
          this.shared_functions.consumerLogin(login_data, this.moreParams)
            .then(
              (login_info: any) => {
                this.user_details.userProfile['firstName'] = this.loginForm.get('first_name').value;
                this.user_details.userProfile['lastName'] = this.loginForm.get('last_name').value;
                this.user_details.userProfile['id'] = login_info.id;
                this.shared_services.updateProfile(this.user_details.userProfile, 'consumer').subscribe(
                  () => {
                    login_info['firstName'] = this.user_details.userProfile['firstName'];
                    login_info['lastName'] = this.user_details.userProfile['lastName'];
                    login_info['userName'] = login_info['firstName'] + ' ' + login_info['lastName'];
                    this.shared_functions.setLoginData(login_info, login_data, 'consumer');
                    const pdata = { 'ttype': 'updateuserdetails' };
                    this.shared_functions.sendMessage(pdata);
                    const encrypted = this.shared_services.set(post_data.password, projectConstants.KEY);
                    this.shared_functions.setitemonLocalStorage('jld', encrypted.toString());
                    this.dialogRef.close('success');
                  },
                  error => {
                    this.api_error = this.shared_functions.getProjectErrorMesssages(error);
                    return false;
                  });
              },
              error => {
                ob.api_error = this.shared_functions.getProjectErrorMesssages(error);
                // this.api_loading = false;
              }
            );
        },
        error => {
          this.actionstarted = false;
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
  }
  continuetoPwd() {
    this.step = 6;
  }
  closePwdScreen() {
    this.dialogRef.close();
  }
  onCancelPass() {
    if (this.step === 6) {
      this.step = 7;
      this.close_message = this.shared_functions.getProjectMesssages('PASSWORD_ERR_MSG');
    }
  }
  onFieldBlur(key) {
    this.loginForm.get(key).setValue(this.toCamelCase(this.loginForm.get(key).value));
  }
  toCamelCase(word) {
    if (word) {
      return this.shared_functions.toCamelCase(word);
    } else {
      return word;
    }
  }
  doForgotPassword() {
    this.resetApiErrors();
    this.api_loading = false;
    this.step = 2;
  }
  cancelForgotPassword() {
    this.step = 3;
  }
  handleSignup() {
    if (this.moreParams && (this.moreParams['source'] === 'searchlist_checkin' || this.moreParams['source'] === 'business_page')) {
      this.dialogRef.close('showsignup');
    } else {
      this.dialogRef.close('showsignupfromlogin'); // closing the signin window
    }
    if (this.data.moreparams && (this.data.moreparams.source === 'businesshome_page')) {
      this.doSignup();
    }
  }
  doSignup() {
    // const dialogReflog = this.dialog.open(SignUpComponent, {
    //   width: '50%',
    //   panelClass: ['signupmainclass', 'popup-class'],
    //   disableClose: true,
    //   data: { is_provider: this.is_provider }
    // });
    // dialogReflog.afterClosed().subscribe(() => {
    // });
  }
  handlekeyup(ev) {
    if (ev.keyCode !== 13) {
      this.resetApiErrors();
    }
  }
  resetApiErrors() {
    this.api_error = null;
  }
  onChangePassword() {
    this.step = 1;
  }
  goBusinessClicked() {
    this.dialogRef.close();
    this.router.navigate(['/business']);
  }

  checkAccountExists() {
    this.mobile_num = this.document.getElementById('emailId').value;
    if (this.mobile_num) {
      this.shared_services.consumerMobilenumCheck(this.mobile_num).subscribe((accountExists) => {
        if (accountExists) {
          this.phoneExists = true;
          this.isPhoneValid = true;
        } else {
          this.phoneExists = false;
          this.isPhoneValid = true;
          this.otpSend();
        }
      }
      );
    }
  }
}
