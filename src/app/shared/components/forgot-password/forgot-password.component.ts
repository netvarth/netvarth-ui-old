import { Component, Inject, Output, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import {NgForm} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';
import {projectConstants} from '../../../shared/constants/project-constants';
import {Messages} from '../../constants/project-messages';

export class ForgotPasswordModel {
  constructor(
    public phonenumber: number = null,
    public phone_otp: string  = null,
    public password: string  = null,
    public confirm_password: string = null
  ) {  }

}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  // styleUrls: ['./home.component.scss']
})


export class ForgotPasswordComponent  {



  fp = new ForgotPasswordModel();
  fpForm: FormGroup;
  fpForm2: FormGroup;
  fpForm3: FormGroup;
  step = 1;
  api_error = null;
  api_success = null;
  otp = null ;
  submit_data = {};
  is_provider = 'true';

  @Output() retonChangePassword: EventEmitter<any> = new EventEmitter();
  @Output() retonCancelForgotPassword: EventEmitter<any> = new EventEmitter();

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

    createForm(form_num) {
      this.step = form_num;

      switch (form_num) {
        case 1: this.fpForm = this.fb.group({
                               phonenumber: ['', Validators.compose(
                                [ Validators.required,
                                  Validators.maxLength(10),
                                  Validators.minLength(10),
                                  Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])  ]
                               });
                               break;
    }
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    cancelForgotPassword() {
      this.retonCancelForgotPassword.emit();
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
          data => {
            this.otp = submit_data.phone_otp;
            this.createForm(3);
          },
          error => {
            console.log(error);
            this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          }
        );

    }

    onPasswordSubmit(submit_data) {

        this.resetApiErrors();
        const type = (this.is_provider === 'true') ? 'provider' : 'consumer';
        const post_data = { password: submit_data.new_password };
        this.shared_services.changePassword(type, this.otp , post_data)
        .subscribe(
          data => {
            const origin = (this.is_provider) ? 'provider' : 'consumer';
            this.api_success = 'Password changed successfully .. you will be redirected to the login page now';
            setTimeout(() => {

              this.retonChangePassword.emit();
             }, projectConstants.TIMEOUT_DELAY);

          },
          error => {
            console.log(error);
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
        data => {
          this.createForm(2);
          this.api_success = Messages.OTP_SENT_MOBILE.replace('[your_mobile]', phonenumber);
          this.submit_data = phonenumber;
          setTimeout(() => {
            this.api_success = '';
            }, projectConstants.TIMEOUT_DELAY_LARGE6);
        },
        error => {
          console.log(error);
          this.api_error = this.shared_functions.getProjectErrorMesssages(error);
          console.log(this.api_error);
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


