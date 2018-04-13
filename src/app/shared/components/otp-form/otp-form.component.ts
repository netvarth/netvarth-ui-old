import { Component, Inject, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SharedServices } from '../../services/shared-services';
import {NgForm} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';

import {Messages} from '../../constants/project-messages';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html'
})
export class OtpFormComponent  implements OnInit {

  otp_form: FormGroup;
  email_form: FormGroup;

  email_otp_req = false ;
  otp_email = null;
  message;
  showOTPContainer = true;
  showOTPEmailContainer = false;

  @Input()  submitdata;
  @Input()  type;
  @Output() onOtpSubmit: EventEmitter<any> = new EventEmitter();
  @Output() resetApiErrors: EventEmitter<any> = new EventEmitter();
  @Output() resendOtp: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.otp_form = this.fb.group({
      phone_otp: ['', Validators.compose(
      [Validators.required]) ]
      });

    this.setMessageType();

  }

  doOnOtpSubmit(value) {
    this.onOtpSubmit.emit(value);
  }

  doResetApiErrors() {
    this.message = null;
    this.resetApiErrors.emit();
  }

  resendOTP() {
    this.resendOtp.emit(this.submitdata);
    this.setMessageType();
  }

  setResendViaEmail() {
    this.doshowOTPEmailContainer();
    this.resetApiErrors.emit();
    this.email_form = this.fb.group({
      otp_email: ['', Validators.compose(
      [Validators.required, Validators.email]) ]
      });
    this.email_otp_req = true;
    this.showOTPEmailContainer = true;
    this.showOTPContainer = false;
  }

  resendViaEmail(email_form) {

    if (this.type === 'forgot_password') {
      this.resendOtp.emit(email_form.otp_email);

    } else if (this.type === 'signup') {
      this.submitdata.userProfile.email = email_form.otp_email;
      this.resendOtp.emit(this.submitdata);

      this.email_otp_req = false;
      this.showOTPEmailContainer = false;
      this.showOTPContainer = true;
      this.otp_email = null;

      delete this.submitdata.userProfile.email;

    }
    this.setMessage('email');
  }

  setMessageType() {
    if (this.type === 'change_email') {
      this.setMessage('email');
    } else {
      this.setMessage('mobile');
    }
  }

  setMessage (type) {

    if (type === 'email') {
      this.message  = Messages.OTP_SENT_EMAIL;
    } else if (type === 'mobile') {
      this.message = Messages.OTP_SENT_MOBILE;
    }

  }
  doshowOTPEmailContainer() {
    this.showOTPContainer = false;
    this.showOTPEmailContainer = true;
  }
  doCancelEmailOTP() {
    this.showOTPEmailContainer = false;
    this.showOTPContainer = true;
  }

}
