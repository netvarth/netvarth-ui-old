import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
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



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {
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
  // countryCodes = projectConstantsLocal.CONSUMER_COUNTRY_CODES;
  // selectedCountryCode;
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
    @Inject(DOCUMENT) public document
  ) {
    if (this.shared_functions.checkLogin()) {
      this.shared_functions.logout();
    }
    this.test_provider = data.test_account;
    this.is_provider = data.is_provider || 'true';
  }
  ngAfterViewInit() {
   
    // this.loginForm.controls.phone.setDialCode();
    // this.cd.detectChanges();
  }
  ngOnInit() {
    // if (this.countryCodes.length !== 0) {
    //   this.selectedCountryCode =this.countryCodes[0].value;
    // }
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
      // phonenumber: ['', Validators.compose(
      //   [
      //   Validators.maxLength(10),
      //   Validators.minLength(10),
      //   Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
      emailId: ['', Validators.pattern(new RegExp(projectConstantsLocal.VALIDATOR_MOBILE_AND_EMAIL))],
      password: ['', Validators.compose([Validators.required])],
      phone: new FormControl(undefined, [Validators.required])
    });
    // this.phoneNumber = '+19605551784';
    // e164Number: "+911234567890",
    // internationalNumber: "+91 1234 567 890",
    // nationalNumber: "01234 567 890",
    // countryCode: "IN",
    // this.phoneNumber = '+1 2015551234';
    // this.phoneNumber = '+19605551784';
    // this.phoneNumber =  {
// dialCode: "+1",
// e164Number: "+11234567890",
// internationalNumber: "+1 9605551784",
// nationalNumber: "09605551784",
// countryCode: "IN",
// number: "+19605551784"}
    // this.loginForm.controls.phone.setValue(phoneNumber);
    // this.phoneNumber = '(123)456-7890';
    // this.loginForm.controls.phone.setValue(this.phoneNumber);

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
    // const pN = this.document.getElementById('phonenumber').value.trim();
    // const pN = this.document.getElementById('emailId').value.trim();
    const pW = this.document.getElementById('password').value;
    // if (pN === '') {
    //   if (this.document.getElementById('phonenumber')) {
    //     this.document.getElementById('phonenumber').focus();
    //     return;
    //   }
    // }
    if (pN === '') {
      // if (this.document.getElementById('emailId')) {
      //   this.document.getElementById('emailId').focus();
      //   return;
      // }
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
    // const pN = data.phonenumber.trim();
    const dialCode = data.phone.dialCode;
    const pN = data.phone.e164Number.trim();
    const pW = data.password;
    //  const email = data.emailId.trim();
    // if (pN === '') {
    //   if (this.document.getElementById('emailId')) {
    //     this.document.getElementById('emailId').focus();
    //     return;
    //   }
    // }
    if (pW === '') {
      if (this.document.getElementById('password')) {
        this.document.getElementById('password').focus();
        return;
      }
    }
    let loginId = pN;
    if(pN.startsWith(dialCode)) {
      loginId = pN.split(dialCode)[1];
    }
    // if (email !== '') {
    //   loginId = email;
    // }
    const ob = this;
    const post_data = {
      'countryCode': dialCode,
      'loginId': loginId,
      'password': data.password,
      'mUniqueId': null
    };
    this.sessionStorageService.removeitemfromSessionStorage('tabId');
    this.api_loading = true;
    // if (this.data.type === 'provider') {
    //   post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
    //   // this.shared_functions.clearSessionStorage();
    //   this.sessionStorageService.clearSessionStorage();
    //   this.shared_functions.providerLogin(post_data)
    //     .then(
    //       () => {
    //         const encrypted = this.shared_services.set(data.password, projectConstants.KEY);
    //         this.lStorageService.setitemonLocalStorage('jld', encrypted.toString());
    //         // this.dialogRef.close();
    //         setTimeout(() => {
    //           this.dialogRef.close();
    //         }, projectConstants.TIMEOUT_DELAY_SMALL);
    //       },
    //       error => {
    //         ob.api_error = this.wordProcessor.getProjectErrorMesssages(error);
    //         this.api_loading = false;
    //       }
    //     );
    // } else if (this.data.type === 'consumer') {
      if (post_data.loginId.startsWith('55') && this.test_provider === false) {
        setTimeout(() => {
          ob.api_error = this.wordProcessor.getProjectMesssages('TESTACC_LOGIN_NA');
          this.api_loading = false;
        }, projectConstants.TIMEOUT_DELAY_SMALL);
      } else {
        post_data.mUniqueId = this.lStorageService.getitemfromLocalStorage('mUniqueId');
        this.shared_functions.consumerLogin(post_data, this.moreParams)
          .then(
            () => {
              // const encrypted = this.shared_services.set(data.password, projectConstants.KEY);
              this.lStorageService.setitemonLocalStorage('jld', data.password);
              // this.lStorageService.setitemonLocalStorage('qrp', data.password);
              this.dialogRef.close('success');
            },
            error => {
             if (error.status === 401 && error.error === 'Session already exists.') {
               this.shared_functions.doLogout().then( () => {
                 this.onSubmit(data);
               });
             } else {
              ob.api_error = this.wordProcessor.getProjectErrorMesssages(error);
            }
              this.api_loading = false;
            }
          );
      }
    // }
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
    //   // this.animal = result;
    // });
    this.step = 2;
  }
  cancelForgotPassword() {
    this.step = 1;
  }
  handleSignup() {
    this.dialogRef.close();
    this.doSignup();
    // if (this.moreParams && (this.moreParams['source'] === 'searchlist_checkin' || this.moreParams['source'] === 'business_page')) {
    //   this.dialogRef.close('showsignup');
    // } else {
    //   this.dialogRef.close('showsignupfromlogin'); // closing the signin window
    // }
    // if (this.data.moreparams && (this.data.moreparams.source === 'businesshome_page')) {
    //   this.doSignup();
    // }
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


