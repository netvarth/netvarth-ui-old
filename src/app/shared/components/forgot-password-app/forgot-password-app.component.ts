import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Messages } from '../../constants/project-messages';
import { ForgotPasswordModel } from '../forgot-password/forgot-password.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedServices } from '../../services/shared-services';
import { MatDialog } from '@angular/material';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';

@Component({
  selector: 'app-forgot-password-app',
  templateUrl: './forgot-password-app.component.html'
})
export class ForgotPasswordAppComponent {

  forgot_password_cap = Messages.FORGOT_PASSWORD_CAP;
  mobile_no_cap = Messages.MOBILE_NUMBER_CAP;
  ok_btn_cap = Messages.OK_BTN;
  back_to_login_cap = Messages.BACK_TO_LOGIN_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  fp = new ForgotPasswordModel();
  fpForm: FormGroup;
  fpForm2: FormGroup;
  fpForm3: FormGroup;
  step = 1;
  api_error = null;
  api_success = null;
  otp = null;
  submit_data = {};
  is_provider = 'true';

  @Output() retonChangePassword: EventEmitter<any> = new EventEmitter();
  @Output() retonCancelForgotPassword: EventEmitter<any> = new EventEmitter();

  constructor(
    // public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private shared_services: SharedServices,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public fed_service: FormMessageDisplayService,
    public shared_functions: SharedFunctions
  ) {

    this.createForm(1);
    // this.is_provider = data.is_provider;
  }

  createForm(form_num) {
    this.step = form_num;

    switch (form_num) {
      case 1: this.fpForm = this.fb.group({
        phonenumber: ['', Validators.compose(
          [Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])]
      });
        break;
    }
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  cancelForgotPassword() {
    this.retonCancelForgotPassword.emit();
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  onPhoneSubmit(submit_data) {

    this.resetApiErrors();

    if (this.fpForm.valid) {
      this.sendOtpApi(submit_data.phonenumber);
    } else {
      this.fed_service.validateAllFormFields(this.fpForm);
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

            this.retonChangePassword.emit();
          }, projectConstants.TIMEOUT_DELAY);

        },
        error => {
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
        }
      );


  }

  resendOtp(phonenumber) {
    this.sendOtpApi(phonenumber);
  }

  sendOtpApi(phonenumber) {
    const type = (this.is_provider === 'true') ? 'provider' : 'consumer';

    this.resetApiErrors();

    this.shared_services.forgotPassword(type, phonenumber)
      .subscribe(
        () => {
          this.createForm(2);
          this.api_success = Messages.OTP_SENT_MOBILE.replace('[your_mobile]', phonenumber);
          this.submit_data = phonenumber;
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
