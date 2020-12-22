import { Component, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../constants/project-messages';
import { CountryISO, PhoneNumberFormat, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';

export class ForgotPasswordModel {
  constructor(
    public phonenumber: number = null,
    public phone_otp: string = null,
    public password: string = null,
    public confirm_password: string = null
  ) { }

}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  // styleUrls: ['./home.component.scss']
})

export class ForgotPasswordComponent {

  forgot_password_cap = Messages.FORGOT_PASSWORD_CAP;
  mobile_no_cap = Messages.MOBILE_NUMBER_CAP;
  ok_btn_cap = Messages.OK_BTN;
  back_to_login_cap = Messages.BACK_TO_LOGIN_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  custmerlogpage = 'custlogpage';
  fp = new ForgotPasswordModel();
  fpForm: FormGroup;
  fpForm2: FormGroup;
  fpForm3: FormGroup;
  step = 1;
  api_error = null;
  api_success = null;
  otp = null;
  submit_data = {};
  country_code = {};
  is_provider = 'true';
  post_data;

  @Input() consumerlogin;
  @Input() business;
  @Output() retonChangePassword: EventEmitter<any> = new EventEmitter();
  @Output() retonCancelForgotPassword: EventEmitter<any> = new EventEmitter();
  phoneNumber;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
  selectedCountry = CountryISO.India;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom, CountryISO.UnitedStates];
  phoneError: string;
  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private shared_services: SharedServices,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public fed_service: FormMessageDisplayService,
    public shared_functions: SharedFunctions
  ) {
    this.createForm(1);
    this.is_provider = data.is_provider;
  }
  // phonenumber: ['', Validators.compose(
  //   [Validators.required,
  //   Validators.maxLength(10),
  //   Validators.minLength(10),
  //   Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])]
  createForm(form_num) {
    this.step = form_num;
   
      switch (form_num) {
        case 1: this.fpForm = this.fb.group({
          phone: new FormControl(undefined, [Validators.required]),
          phonenumber: new FormControl(undefined, [Validators.required])
        });
          break;
      }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancelForgotPassword() {
    if (this.is_provider === 'true') {
      this.dialogRef.close();
    } else {
      this.retonCancelForgotPassword.emit();
    }
  }

  onPhoneSubmit(submit_data) {

    this.resetApiErrors();
    if(this.consumerlogin){
      console.log(this.consumerlogin);
      console.log(this.fpForm.get('phone').value.e164Number);
      console.log(this.fpForm.get('phone').value.e164Number.split(this.fpForm.get('phone').value.dialCode)[1]);
      if (this.fpForm.valid || (!this.fpForm.valid && this.fpForm.get('phone').value.e164Number)) {
        console.log(this.fpForm.get('phone').value.e164Number);
        const dialCode = this.fpForm.get('phone').value.dialCode;
        
         this.post_data = dialCode;
        this.sendOtpApi(this.fpForm.get('phone').value.e164Number.split(this.fpForm.get('phone').value.dialCode)[1], this.post_data);
      } else{
        console.log("else")
        this.fed_service.validateAllFormFields(this.fpForm);
      }
    } else {
       this.post_data = '+91';
      this.sendOtpApi(this.fpForm.get('phonenumber').value, this.post_data);
    }
  }

  onOtpSubmit(submit_data) {
    this.resetApiErrors();
    const type = (this.is_provider === 'true') ? 'provider' : 'consumer';
    this.shared_services.OtpValidate(type, submit_data.phone_otp)
      .subscribe(
        () => {
          this.otp = submit_data.phone_otp;
          this.createForm(3);
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
  }

  onPasswordSubmit(submit_data) {
    this.resetApiErrors();
    const type = (this.is_provider === 'true') ? 'provider' : 'consumer';
    const post_data = { password: submit_data.new_password };
    this.shared_services.changePassword(type, this.otp, post_data)
      .subscribe(
        () => {
          this.api_success = 'Password changed successfully .. you will be redirected to the login page now';
          setTimeout(() => {
            if (type === 'provider') {
              this.dialogRef.close();
            }
            this.retonChangePassword.emit();
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
  }

  resendOtp(phonenumber) {
    console.log(this.post_data)
    this.sendOtpApi(phonenumber, this.post_data);
  }

  sendOtpApi(phonenumber, post_data?) {
    const type = (this.is_provider === 'true') ? 'provider' : 'consumer';
    this.resetApiErrors();
    this.shared_services.forgotPassword(type, phonenumber, post_data)
      .subscribe(
        () => {
          this.createForm(2);
          // this.api_success = Messages.OTP_SENT_MOBILE.replace('[your_mobile]', phonenumber);
          this.submit_data = phonenumber;
          this.country_code = post_data;
          console.log(this.country_code)
          setTimeout(() => {
            this.api_success = '';
          }, projectConstants.TIMEOUT_DELAY_LARGE6);
        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );
  }

  reset() {
    this.fpForm.reset();
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }

}
