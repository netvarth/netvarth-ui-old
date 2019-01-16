import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { SignUpComponent } from '../../components/signup/signup.component';
import { projectConstants } from '../../../shared/constants/project-constants';
import { post } from 'selenium-webdriver/http';
import { Messages } from '../../constants/project-messages';
import { DOCUMENT } from '@angular/common';
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
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    this.test_provider = data.test_account;
    this.is_provider = data.is_provider || 'true';
  }
  ngOnInit() {
    this.moreParams = this.data.moreparams;
    this.createForm();
    this.api_loading = false;
    if (this.data.type === 'provider') {
      this.heading = 'Service Provider Login';
    } else if (this.data.type === 'consumer') {
      this.heading = 'Consumer Login';
    }
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
    if (this.data.type === 'provider') {
      this.shared_functions.providerLogin(post_data)
        .then(
          success => {
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
        console.log(JSON.stringify(post_data));
        this.shared_functions.consumerLogin(post_data, this.moreParams)
          .then(
            success => { this.dialogRef.close('success'); },
            error => {
              ob.api_error = this.shared_functions.getProjectErrorMesssages(error);
              this.api_loading = false;
            }
          );
      }
    }
  }
  doForgotPassword() {
    this.resetApiErrors();
    this.api_loading = false;
    // this.dialogRef.close(); // closing the signin window
    // const dialogRef = this.dialog.open(ForgotPasswordComponent, {
    //   width: '60%',
    //   panelClass: 'forgotpasswordmainclass',
    //   data: {
    //     is_provider : this.is_provider
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed');
    //   // this.animal = result;
    // });
    this.step = 2;
  }
  cancelForgotPassword() {
    this.step = 1;
  }
  handleSignup() {
    if (this.moreParams && (this.moreParams['source'] === 'searchlist_checkin')) {
      this.dialogRef.close('showsignup');
    } else {
      this.dialogRef.close('showsignupfromlogin'); // closing the signin window
      // this.doSignup();
    }
  }
  doSignup() {
    const dialogReflog = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'consumerpopupmainclass'],
      disableClose: true,
      data: { is_provider: this.is_provider }
    });
    dialogReflog.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  /*doSignup() {
    const cClass = 'consumerpopupmainclass';
    // console.log('prov', this.is_provider);
    if (this.is_provider === 'true') {
      // cClass = 'commonpopupmainclass';
    }
    if (this.moreParams && (this.moreParams['source'] === 'searchlist_checkin')) {
      this.dialogRef.close('showsignup');
    } else {
      console.log('sign here');
      this.api_loading = false;
      this.dialogRef.close(); // closing the signin window
      const dialogReflog = this.dialog.open(SignUpComponent, {
        width: '50%',
        panelClass: ['signupmainclass', cClass],
        disableClose: true,
        data: { is_provider : this.is_provider}
      });

      dialogReflog.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
        // this.animal = result;
      });
    }
  }*/
    handlekeyup(ev) {
    // console.log(ev);
    if (ev.keyCode !== 13) {
      this.resetApiErrors();
    }
  }
  resetApiErrors() {
    this.api_error = null;
  }
  onChangePassword(data) {
    this.step = 1;
  }
}
