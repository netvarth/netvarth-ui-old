import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { SignUpComponent } from '../../components/signup/signup.component';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { Messages } from '../../constants/project-messages';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { SessionStorageService } from '../../services/session-storage.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { WordProcessor } from '../../services/word-processor.service';
import { AuthService } from '../../services/auth-service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
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
  phoneNumber;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  selectedCountry = CountryISO.India;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom, CountryISO.UnitedStates];
  phoneError: string;
  chatId: ArrayBuffer;
  tele_num: any;
  countryCode;
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private sessionStorageService: SessionStorageService,
    private lStorageService: LocalStorageService,
    private wordProcessor: WordProcessor,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    @Inject(DOCUMENT) public document
  ) {
    if (this.shared_functions.checkLogin()) {
      this.authService.logout();
    }
    this.test_provider = data.test_account;
    this.is_provider = data.is_provider || 'true';
  }
  ngOnInit() {
    this.moreParams = this.data.moreparams;
    this.createForm();
    this.api_loading = false;
    if (this.data.is_provider === 'true') {
      this.signup_here = 'Want to become a Service Provider? ';
    } else if (this.data.is_provider === 'false') {
      this.signup_here = 'Want to become a Jaldee Customer? ';
    }
    if (this.data.type === 'provider') {
      this.heading = 'Service Provider Login';
      this.phOrem_error = 'Invalid mobile number/email id';
    } else if (this.data.type === 'consumer') {
      this.heading = 'Jaldee Customer Login';
      this.phOrem_error = 'Invalid mobile number';
    }
  }
  createForm() {
    this.loginForm = this.fb.group({
      emailId: ['', Validators.pattern(new RegExp(projectConstantsLocal.VALIDATOR_MOBILE_AND_EMAIL))],
      password: ['', Validators.compose([Validators.required])],
      phone: new FormControl( [Validators.required])
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
    const pW = this.document.getElementById('password').value;
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
        return;
      }
    }
  }
  onSubmit(data) {
    this.resetApiErrors();
    const dialCode = data.phone.dialCode;
    const pN = data.phone.e164Number.trim();
    const pW = data.password;
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
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
      'loginId': loginId,
      'password': data.password,
      'mUniqueId': null
    };
    this.sessionStorageService.removeitemfromSessionStorage('tabId');
    this.api_loading = true;
    if (this.data.type === 'provider') {
      post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
      this.sessionStorageService.clearSessionStorage();
      this.authService.providerLogin(post_data)
        .then(
          () => {
            const encrypted = this.shared_services.set(data.password, projectConstants.KEY);
            this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
            setTimeout(() => {
              this.dialogRef.close();
            }, projectConstants.TIMEOUT_DELAY_SMALL);
          },
          error => {
            ob.api_error = this.wordProcessor.getProjectErrorMesssages(error);
            this.api_loading = false;
          }
        );
    } else if (this.data.type === 'consumer') {
      if (post_data.loginId.startsWith('55') && this.test_provider === false) {
        setTimeout(() => {
          ob.api_error = this.wordProcessor.getProjectMesssages('TESTACC_LOGIN_NA');
          this.api_loading = false;
        }, projectConstants.TIMEOUT_DELAY_SMALL);
      } else {
        post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
        this.lStorageService.removeitemfromLocalStorage('customId');
        this.authService.consumerLogin(post_data, this.moreParams)
          .then(
            () => {
              const encrypted = this.shared_services.set(data.password, projectConstants.KEY);
              this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
              this.lStorageService.setitemonLocalStorage('qrp', data.password);

              this.dialogRef.close('success');
              this.lStorageService.setitemonLocalStorage('showTelePop', 'true');
            },
            error => {
              if (error.status === 401 && error.error === 'Session already exists.') {
                this.authService.doLogout().then(() => {
                  this.onSubmit(data);
                });
              } else {
                ob.api_error = this.wordProcessor.getProjectErrorMesssages(error);
              }
              this.api_loading = false;
            }
          );
      }
    }
  }
  doForgotPassword() {
    this.resetApiErrors();
    this.api_loading = false;
    this.step = 2;
  }
  cancelForgotPassword() {
    this.step = 1;
  }
  handleSignup() {
    this.dialogRef.close();
    this.doSignup();
  }
  doSignup() {
    const dialogReflog = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: { is_provider: this.is_provider }
    });
    dialogReflog.afterClosed().subscribe(() => {
    });
  }
  handlekeyup(ev) {
    if (ev.keyCode !== 13) {
      this.resetApiErrors();
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.phoneError = null;
  }
  onChangePassword() {
    this.step = 1;
  }
  goBusinessClicked() {
    this.dialogRef.close();
    this.router.navigate(['/business']);
  }
}
