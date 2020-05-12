
import {interval as observableInterval,  Observable , Subscription } from 'rxjs';
import { Component, OnInit, OnChanges, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedFunctions } from '../../functions/shared-functions';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { Messages } from '../../constants/project-messages';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html'
})
export class OtpFormComponent implements OnInit, OnChanges, OnDestroy {

  api_error = null;
  api_success = null;
  enter_otp_cap = Messages.ENTER_OTP_CAP;
  ok_btn_cap = Messages.OK_BTN;
  resend_otp_to_cap = Messages.RESEND_OTP_TO_CAP;
  email_id_cap = Messages.EMAIL_ID_CAP;
  mobile_cap = Messages.CUSTOMER_MOBILE_CAP;
  resend_otp_email = Messages.RESEND_OTP_EMAIL_CAP;
  resend_otp_opt_active_cap = Messages.RESEND_OTP_OPT_ACTIVE_IN_CAP;
  seconds_cap = Messages.SECONDS_CAP;
  enter_email_cap = Messages.ENTER_EMAIL_CAP;
  resend_btn_cap = Messages.RESEND_BTN;
  cancel_btn_cap = Messages.CANCEL_BTN;

  otp_form: FormGroup;
  email_form: FormGroup;
  buttonclicked = false;
  email_otp_req = false;
  otp_email = null;
  message;
  showOTPContainer = true;
  showOTPEmailContainer = false;
  checking_email_otpsuccess = false;
  resetCounterVal;
  cronHandle: Subscription;
  refreshTime = 30;
  otp_mobile = null;
  @Input() actionstarted;
  @Input() submitdata;
  @Input() consumerlogin;
  @Input() type;
  @Input() resendemailotpsuccess;
  @Output() retonOtpSubmit: EventEmitter<any> = new EventEmitter();
  @Output() resetApiErrors: EventEmitter<any> = new EventEmitter();
  @Output() resendOtp: EventEmitter<any> = new EventEmitter();
  @Output() resendOTPEmail: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions) { }

  ngOnInit() {
    this.createForm();
    this.resetCounter(this.refreshTime);
    this.cronHandle = observableInterval(1000).subscribe(() => {
      if (this.resetCounterVal > 0) {
        this.resetCounterVal = this.resetCounterVal - 1;
      }
      // this.reloadAPIs();
    });
    if (this.type !== 'forgot_password') {
      this.setMessageType();
    }
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
  }

  ngOnChanges() {
    this.buttonclicked = this.actionstarted;
    if (this.checking_email_otpsuccess && this.resendemailotpsuccess) {
      this.email_otp_req = false;
      this.showOTPEmailContainer = false;
      this.showOTPContainer = true;
      this.otp_email = null;
      this.buttonclicked = false;
    }
  }
  resetCounter(val) {
    this.resetCounterVal = val;
  }

  createForm() {
    this.otp_form = this.fb.group({
      phone_otp: ['', Validators.compose(
        [Validators.required])]
    });
    // this.setMessageType();
  }

  doOnOtpSubmit(value) {
    this.buttonclicked = true;
    this.retonOtpSubmit.emit(value);
  }

  doResetApiErrors() {
    // this.message = null;
    this.resetApiErrors.emit();
    this.buttonclicked = false;
  }

  resendOTPMobile() {
    this.resendOTPEmail.emit(false);
    this.resetCounter(this.refreshTime);
    if (this.submitdata.userProfile !== undefined) {
      this.submitdata.userProfile.email = null;
    }
    // delete this.submitdata.userProfile.email;
    this.resendOtp.emit(this.submitdata);
    if (this.type !== 'forgot_password') {
      this.setMessageType();
    }
  }

  setResendViaEmail() {
    this.resendOTPEmail.emit(true);
    this.doshowOTPEmailContainer();
    this.resetApiErrors.emit();
    this.email_form = this.fb.group({
      otp_email: ['', Validators.compose(
        [Validators.required, Validators.email])]
    });
    if (this.submitdata.userProfile && this.submitdata.userProfile.email) {
      this.email_form.get('otp_email').setValue(this.submitdata.userProfile.email);
    }
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
      this.resetCounter(this.refreshTime);
      this.checking_email_otpsuccess = true;
      this.resendOTPEmail.emit(false);
    }
    this.setMessage('email', email_form.otp_email);
  }

  setMessageType() {
    if (this.type === 'change_email') {
      this.setMessage('email', this.submitdata.email);
    } else {
      this.setMessage('mobile', this.submitdata.userProfile.primaryMobileNo);
    }
  }

  setMessage(type, data) {
    if (type === 'email') {
      const email = (data) ? data : 'your email';
      this.otp_mobile = Messages.OTP_SENT_EMAIL.replace('[your_email]', email);
    } else if (type === 'mobile') {
      const phonenumber = new Array(this.submitdata.userProfile.primaryMobileNo.length - 4).join('*') + this.submitdata.userProfile.primaryMobileNo.substr(this.submitdata.userProfile.primaryMobileNo.length - 4);
      this.otp_mobile = Messages.OTP_SENT_LABEL.replace('[your_mobile]', phonenumber);
    }
  }
  removSpecChar(evt) {
    return this.shared_functions.removSpecChar(evt);
  }

  doshowOTPEmailContainer() {
    this.showOTPContainer = false;
    this.showOTPEmailContainer = true;
    this.resendOTPEmail.emit(true);
  }
  doCancelEmailOTP() {
    this.doResetApiErrors();
    this.showOTPEmailContainer = false;
    this.showOTPContainer = true;
    this.resetCounterVal = 0;
    this.otp_mobile = null;
    this.resendOTPEmail.emit(false);
  }
}
