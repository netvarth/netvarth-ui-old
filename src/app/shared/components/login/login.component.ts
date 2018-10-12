import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { SignUpComponent } from '../../components/signup/signup.component';
import {projectConstants} from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./home.component.scss']
})
export class LoginComponent implements OnInit {


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
    public dialog: MatDialog
    ) {
        if (this.shared_functions.checkLogin()) {
          this.shared_functions.logout();
        }
        this.test_provider = data.test_account;
        this.is_provider = data.is_provider || 'true';
       // console.log('login data', data);
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
        [ Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])  ],
      password: ['', Validators.compose([Validators.required])]

    });
  }

  showError () {
    this.show_error = true;
  }

  onSubmit(data) {

    this.resetApiErrors();

    const ob = this;
    const post_data = {
      'countryCode': '+91',
      'loginId': data.phonenumber,
      'password': data.password
    };
    this.api_loading = true;
    if (this.data.type === 'provider') {
      this.shared_functions.providerLogin(post_data)
      .then(
        success =>  {
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
      if (post_data.loginId.startsWith('55') &&  this.test_provider === false) {
        setTimeout(() => {
          ob.api_error = this.shared_functions.getProjectMesssages('TESTACC_LOGIN_NA');
          this.api_loading = false;
          }, projectConstants.TIMEOUT_DELAY_SMALL);
      } else {
      this.shared_functions.consumerLogin(post_data, this.moreParams)
      .then(
        success =>  { this.dialogRef.close('success'); },
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
  doSignup() {
    const cClass = 'consumerpopupmainclass';
    console.log('prov', this.is_provider);
    if (this.is_provider === 'true') {
      // cClass = 'commonpopupmainclass';
    }
    if (this.moreParams && (this.moreParams['source'] === 'searchlist_checkin')) {
      this.dialogRef.close('showsignup');
    } else {
      this.api_loading = false;
      this.dialogRef.close(); // closing the signin window
      const dialogRef = this.dialog.open(SignUpComponent, {
        width: '50%',
        panelClass: ['signupmainclass', cClass],
        disableClose: true,
        data: { is_provider : this.is_provider}
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
        // this.animal = result;
      });
    }
  }

  resetApiErrors() {
    this.api_error = null;
  }

  onChangePassword(data) {
    this.step = 1;
  }
}
