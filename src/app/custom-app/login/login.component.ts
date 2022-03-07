import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Messages } from '../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../shared/modules/form-message-display/form-message-display.service';
import { AuthService } from '../../shared/services/auth-service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { SharedServices } from '../../shared/services/shared-services';
import { WordProcessor } from '../../shared/services/word-processor.service';
import { SubSink } from 'subsink';
import { projectConstantsLocal } from '../../shared/constants/project-constants';
import { CustomappService } from '../customapp.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() accountId;
  @Output() actionPerformed = new EventEmitter<any>();
  templateJson;

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
  countryCodes = projectConstantsLocal.CONSUMER_COUNTRY_CODES;
  selectedCountryCode;
  cancel_btn_cap = Messages.CANCEL_BTN;
  ok_btn_cap = Messages.OK_BTN;
  resendemailotpsuccess = true;
  api_success = null;
  otp: any;
  close_message: any;
  fname: any;
  lname: any;
  theme: any;
  phoneExists = false;
  isPhoneValid = false;
  resendViaEmail: boolean;
  phoneNumber;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  selectedCountry = CountryISO.India;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom, CountryISO.UnitedStates];
  phoneError: string;
  phoneDialCode;
  joinStep = true;
  private subs = new SubSink();
  businessProfile: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    private wordProcessor: WordProcessor,
    private sessionStorageService: SessionStorageService,
    private lStorageService: LocalStorageService,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private customappService: CustomappService,
    @Inject(DOCUMENT) public document
  ) {

    this.test_provider = data.test_account;
  }
  ngOnInit() {
    this.businessProfile = this.customappService.getBusinessProfile();
    this.templateJson = this.customappService.getTemplateJson();
    this.joinStep = true;
    this.selectedCountryCode = this.countryCodes[0].value;
    this.moreParams = this.data.moreparams;
    this.theme = this.data.theme;
    console.log(this.theme);
    this.createForm();
    this.api_loading = false;
    if (this.data.type === 'consumer') {
      this.heading = 'Please enter your phone number';
      this.phOrem_error = 'Invalid mobile number';
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  createForm() {
    this.loginForm = this.fb.group({
      emailId: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_PHONENUMBERONLY)])],
      password: ['', Validators.compose([Validators.required])],
      phone: new FormControl(undefined, [Validators.required]),
      first_name: [this.fname, Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
      last_name: [this.lname, Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
    });
  }
  showError() {
    this.phoneError = null;
    this.show_error = true;
    if (!this.loginForm.get('phone').value) {
      this.phoneError = 'Please enter your phone number';
      return false;
    } else if (this.loginForm.get('phone').errors && !this.loginForm.get('phone').value.e164Number.startsWith(this.loginForm.get('phone').value.dialCode + '55')) {
      this.phoneError = 'Phone number is invalid';
      return false;
    }
    const pN = this.loginForm.get('phone').value.e164Number;
    // const pN = this.mobile_num.trim();
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
    const self=this;
    const dialCode = data.phone.dialCode;
    const pN = data.phone.e164Number.trim();
    // const pN = this.mobile_num.trim();
    const pW = data.password.trim();
    if (pN === '') {
      if (self.mobile_num) {
        this.mobile_num.focus();
        return;
      }
    }
    if (pW === '') {
      if (self.document.getElementById('password')) {
        self.document.getElementById('password').focus();
        return;
      }
    }
    let loginId = pN;
    if (pN.startsWith(dialCode)) {
      loginId = pN.split(dialCode)[1];
    }
    const ob = this;
    const post_data = {
      'countryCode': dialCode,
      // 'countryCode': '+91',
      'loginId': loginId,
      'password': data.password,
      'mUniqueId': null
    };
    self.sessionStorageService.removeitemfromSessionStorage('tabId');
    self.api_loading = true;
    if (post_data.loginId.startsWith('55') && self.test_provider === false) {
      setTimeout(() => {
        ob.api_error = self.wordProcessor.getProjectMesssages('TESTACC_LOGIN_NA');
        self.api_loading = false;
      }, projectConstantsLocal.TIMEOUT_DELAY_SMALL);
    } else {
      post_data.mUniqueId = self.lStorageService.getitemfromLocalStorage('mUniqueId');
      console.log("Before Checking authToken");
      console.log("Token: " + self.lStorageService.getitemfromLocalStorage('authToken'));
      if (self.lStorageService.getitemfromLocalStorage('authToken')) {
        post_data['token'] = self.lStorageService.getitemfromLocalStorage('authToken');
      }
      self.authService.consumerAppLogin(post_data)
        .then(
          () => {
            self.lStorageService.setitemonLocalStorage('qrp', data.password);
            let pre_header = dialCode.split('+')[1] + "-" + loginId;
            if (self.lStorageService.getitemfromLocalStorage('authToken')) {
              self.lStorageService.setitemonLocalStorage("pre-header", pre_header);
            }
            self.actionPerformed.emit('success');
          },
          error => {
            if (error.status === 401 && error.error === 'Session already exists.') {
              const activeUser = self.lStorageService.getitemfromLocalStorage('ynw-user');
              if (!activeUser) {
                self.shared_services.ConsumerLogout().subscribe(
                  () => {
                    self.authService.consumerAppLogin(post_data).then(
                      () => {
                        self.lStorageService.setitemonLocalStorage('qrp', data.password);
                        self.actionPerformed.emit('success');
                      });
                  }
                )
              } else {
                self.lStorageService.setitemonLocalStorage('qrp', data.password);
              }
            } else {
              ob.api_error = self.wordProcessor.getProjectErrorMesssages(error);
              self.api_loading = false;
            }
          }
        );
    }
  }

  otpSend() {
    this.actionstarted = true;
    this.resetApiErrors();
    this.user_details = {};

    const dialCode = this.loginForm.get('phone').value.dialCode;
    const pN = this.loginForm.get('phone').value.e164Number;
    let loginId = pN.split(dialCode)[1];

    if (this.phoneDialCode !== '+91' && !this.loginForm.get('emailId').value) {
      this.api_error = 'Email Id required';
      if (document.getElementById('emailId')) {
        document.getElementById('emailId').focus();
      }
      return false;
    } else {

    }

    const userProfile = {
      // countryCode: '+91',
      countryCode: dialCode,
      primaryMobileNo: loginId || null,
      firstName: this.loginForm.get('first_name').value || null,
      lastName: this.loginForm.get('last_name').value || null,
    };
    if (this.loginForm.get('emailId').value) {
      userProfile['email'] = this.loginForm.get('emailId').value.trim();
    }
    // if (userProfile.firstName === null) {
    //   userProfile.firstName = 'undefined';
    // }
    // if (userProfile.lastName === null) {
    //   userProfile.lastName = 'undefined';
    // }
    this.user_details = {
      userProfile: userProfile
    };
    const firstName = this.loginForm.get('first_name').value;
    const lastName = this.loginForm.get('last_name').value;
    if (firstName && firstName.trim() === '' || firstName === null) {
      this.api_error = 'First Name is required';
    } else if (lastName && lastName.trim() === '' || lastName === null) {
      this.api_error = 'Last Name is required';
    } else if (firstName && firstName.trim().length < 3) {
      this.api_error = 'First Name is too short';
    }
    if (firstName && firstName.trim() !== '' && lastName && lastName.trim() !== '') {
      this.signUpApiConsumer(this.user_details);
    }
  }
  resendOTPEmail(status) {
    this.resendViaEmail = status;
  }
  signUpApiConsumer(user_details) {
    this.resendemailotpsuccess = false;
    if (this.lStorageService.getitemfromLocalStorage('customId') && this.lStorageService.getitemfromLocalStorage('accountId')) {
      user_details['accountId'] = this.lStorageService.getitemfromLocalStorage('accountId');
    }
    this.subs.sink = this.shared_services.signUpConsumer(user_details)
      .subscribe(
        () => {
          this.actionstarted = false;
          // this.createForm(2);
          this.resendemailotpsuccess = true;
          // if (user_details.userProfile &&
          //   user_details.userProfile.email) {
          //   this.setMessage('email', user_details.userProfile.email);
          // } else {
          //   this.setMessage('mobile', user_details.userProfile.primaryMobileNo);
          // }
          this.step = 4;
        },
        error => {
          this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
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
    }, projectConstantsLocal.TIMEOUT_DELAY_LARGE6);
  }
  onOtpSubmit(submit_data) {
    this.actionstarted = true;
    this.resetApiErrors();
    this.subs.sink = this.shared_services.OtpSignUpConsumerValidate(submit_data.phone_otp)
      .subscribe(
        () => {
          this.actionstarted = false;
          this.otp = submit_data.phone_otp;
          // this.createForm(4);

          this.step = 6;
        },
        error => {
          this.actionstarted = false;
          this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
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
    const dialCode = this.loginForm.get('phone').value.dialCode;
    const post_data = {
      countryCode: dialCode,
      password: submit_data.new_password
    };
    this.subs.sink = this.shared_services.ConsumerSetPassword(this.otp, post_data)
      .subscribe(
        () => {
          this.actionstarted = false;
          const login_data = {
            // 'countryCode': '+91',
            'countryCode': dialCode,
            'loginId': this.user_details.userProfile.primaryMobileNo,
            'password': post_data.password
          };
          if (this.lStorageService.getitemfromLocalStorage('authToken')) {
            login_data['token'] = this.lStorageService.getitemfromLocalStorage('authToken');
          }
          // this.dialogRef.close();
          this.authService.consumerLogin(login_data, this.moreParams)
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
                    let pre_header = dialCode.split('+')[1] + "-" + this.user_details.userProfile.primaryMobileNo;
                    if (this.lStorageService.getitemfromLocalStorage('authToken')) {
                      this.lStorageService.setitemonLocalStorage("pre-header", pre_header);
                    }
                    this.authService.setLoginData(login_info, login_data, 'consumer');
                    const pdata = { 'ttype': 'updateuserdetails' };
                    this.authService.sendMessage(pdata);
                    // const encrypted = this.shared_services.set(post_data.password, projectConstants.KEY);
                    // this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
                    this.lStorageService.setitemonLocalStorage('qrp', post_data.password);
                  },
                  error => {
                    this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
                    return false;
                  });
              },
              error => {
                ob.api_error = this.wordProcessor.getProjectErrorMesssages(error);
                // this.api_loading = false;
              }
            );
        },
        error => {
          this.actionstarted = false;
          this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
        }
      );
  }
  continuetoPwd() {
    this.step = 6;
  }
  closePwdScreen() {
  }
  onCancelPass() {
    if (this.step === 6) {
      this.step = 7;
      this.close_message = this.wordProcessor.getProjectMesssages('PASSWORD_ERR_MSG');
    }
  }
  onFieldBlur(key) {
    this.loginForm.get(key).setValue(this.toCamelCase(this.loginForm.get(key).value));
  }
  toCamelCase(word) {
    if (word) {
      return this.wordProcessor.toCamelCase(word);
    } else {
      return word;
    }
  }
  doForgotPassword() {
    this.resetApiErrors();
    this.api_loading = false;
    this.step = 2;
    console.log(this.step);
  }
  cancelForgotPassword() {
    this.step = 1;
  }
  handleSignup() {
    if (this.moreParams && (this.moreParams['source'] === 'searchlist_checkin' || this.moreParams['source'] === 'business_page')) {
    } else {
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
    this.actionstarted = false;
  }
  onChangePassword() {
    this.step = 1;
  }
  goBusinessClicked() {
    this.router.navigate(['/business']);
  }

  checkAccountExists() {
    this.mobile_num = this.document.getElementById('phone').value;
    this.phoneError = null;
    if (this.mobile_num) {
      this.phoneDialCode = this.loginForm.get('phone').value.dialCode;
      this.subs.sink = this.shared_services.consumerMobilenumCheck(this.mobile_num, this.phoneDialCode).subscribe((accountExists) => {
        if (accountExists) {
          this.phoneExists = true;
          this.isPhoneValid = true;
        } else {
          this.phoneExists = false;
          this.isPhoneValid = true;
          this.step = 3;
          // this.otpSend();
        }
      }
      );
    } else {
      this.phoneError = 'Mobile number required';
    }
  }

  toastNext(str) {
    console.log('toast');
    this.joinStep = !this.joinStep;
    if (str === 'sUp') {
      this.step = 3;
    } else {
      this.step = 1;
    }
  }

}
