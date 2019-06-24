import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Messages } from '../../constants/project-messages';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { MatDialog } from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SignUpComponent } from '../signup/signup.component';

@Component({
  selector: 'app-home-app',
  templateUrl: './home-app.component.html'
})
export class HomeAppComponent implements OnInit, OnDestroy {
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
  signup_here = '';
  constructor(
    // public dialogRef: MatDialogRef<LoginComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public dialog: MatDialog,
    @Inject(DOCUMENT) public document
  ) {
    if (this.shared_functions.checkLogin()) {
      this.shared_functions.logout();
    }
    // this.test_provider = data.test_account;
    // this.is_provider = data.is_provider || 'true';
  }
  ngOnInit() {
    // this.moreParams = this.data.moreparams;
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('parent-cont');
    this.createForm();
    this.api_loading = false;
    // if (this.data.is_provider === 'true') {
    //   this.signup_here = 'Want to become a Service Provider? ';
    // } else if (this.data.is_provider === 'false') {
    //   this.signup_here = 'Want to become a Jaldee Customer? ';
    // }
    // if (this.data.type === 'provider') {
    //   this.heading = 'Service Provider Login';
    // } else if (this.data.type === 'consumer') {
    //   this.heading = 'Jaldee Customer Login';
    // }
  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('parent-cont');
  }
  createForm() {
    this.loginForm = this.fb.group({
      phonenumber: ['', Validators.compose(
        [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])],
      password: ['', Validators.compose([Validators.required])]

    });
  }
  showError() {
    this.show_error = true;
    const pN = this.document.getElementById('phonenumber').value.trim();
    const pW = this.document.getElementById('password').value.trim();
    if (pN === '') {
      if (this.document.getElementById('phonenumber')) {
        this.document.getElementById('phonenumber').focus();
        return;
      }
    }
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
        return;
      }
    }
  }
  onSubmit(data) {
    this.resetApiErrors();
    const pN = data.phonenumber.trim();
    const pW = data.password.trim();
    if (pN === '') {
      if (this.document.getElementById('phonenumber')) {
        this.document.getElementById('phonenumber').focus();
        return;
      }
    }
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
        return;
      }
    }
    const ob = this;
    const post_data = {
      'countryCode': '+91',
      'loginId': data.phonenumber,
      'password': data.password,
      'mUniqueId': null
    };
    this.api_loading = true;
    // if (this.data.type === 'provider') {
    this.shared_functions.providerLogin(post_data)
      .then(
        () => {
          // this.dialogRef.close();
          setTimeout(() => {
            // this.dialogRef.close();
          }, projectConstants.TIMEOUT_DELAY_SMALL);
        },
        error => {
          ob.api_error = this.shared_functions.getProjectErrorMesssages(error);
          this.api_loading = false;
        }
      );
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
    //   if (this.moreParams && (this.moreParams['source'] === 'searchlist_checkin' || this.moreParams['source'] === 'business_page')) {
    //     this.dialogRef.close('showsignup');
    //   } else {
    //     this.dialogRef.close('showsignupfromlogin'); // closing the signin window
    //   }
  }
  doSignup() {
    const dialogReflog = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: { is_provider: 'true' }
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
  }
  onChangePassword() {
    this.step = 1;
  }
}
