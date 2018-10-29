
import {interval as observableInterval, Observable,  Subscription, SubscriptionLike as ISubscription } from 'rxjs';
import { Component, Inject, OnInit, OnChanges, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
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
export class OtpFormComponent  implements OnInit, OnChanges, OnDestroy {

  otp_form: FormGroup;
  email_form: FormGroup;

  email_otp_req = false ;
  otp_email = null;
  message;
  showOTPContainer = true;
  showOTPEmailContainer = false;
  checking_email_otpsuccess = false;
  resetCounterVal;
  cronHandle: Subscription;
  refreshTime = 30;

  @Input()  submitdata;
  @Input()  type;
  @Input()  resendemailotpsuccess;
  @Output() retonOtpSubmit: EventEmitter<any> = new EventEmitter();
  @Output() resetApiErrors: EventEmitter<any> = new EventEmitter();
  @Output() resendOtp: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices) {}

  ngOnInit() {
    this.createForm();
    this.resetCounter(this.refreshTime);
    this.cronHandle = observableInterval(1000).subscribe(x => {
      if (this.resetCounterVal > 0) {
        this.resetCounterVal = this.resetCounterVal - 1;
      }
      // this.reloadAPIs();
    });
    // console.log('type', this.type);
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
     }
  }

  ngOnChanges() {

    if (this.checking_email_otpsuccess && this.resendemailotpsuccess) {
      this.email_otp_req = false;
      this.showOTPEmailContainer = false;
      this.showOTPContainer = true;
      this.otp_email = null;
    }

  }
  resetCounter(val) {
    this.resetCounterVal = val;
  }

  createForm() {
    this.otp_form = this.fb.group({
      phone_otp: ['', Validators.compose(
      [Validators.required]) ]
      });

    // this.setMessageType();

  }

  doOnOtpSubmit(value) {
    this.retonOtpSubmit.emit(value);
  }

  doResetApiErrors() {
    // this.message = null;
    this.resetApiErrors.emit();
  }

  resendOTPMobile() {
    this.resetCounter(this.refreshTime);
    // console.log('test', this.submitdata.userProfile);
    if (this.submitdata.userProfile !== undefined) {
      this.submitdata.userProfile.email = null;
  }
    // delete this.submitdata.userProfile.email;
    this.resendOtp.emit(this.submitdata);
    // this.setMessageType();
  }

  setResendViaEmail() {
    this.doshowOTPEmailContainer();
    this.resetApiErrors.emit();
    this.email_form = this.fb.group({
      otp_email: ['', Validators.compose(
      [Validators.required, Validators.email]) ]
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
      // console.log('here',  this.submitdata,  this.submitdata.userProfile.email);



    }
    // this.setMessage('email', email_form.otp_email);
  }

  setMessageType() {
    if (this.type === 'change_email') {
      this.setMessage('email', this.submitdata.email);
    } else {
      this.setMessage('mobile', this.submitdata.phonenumber);
    }
  }

  setMessage (type, data) {

    if (type === 'email') {
      const email = (data) ? data : 'your email';
      this.message  = Messages.OTP_SENT_EMAIL.replace('[your_email]', email);
    } else if (type === 'mobile') {
      const phonenumber = (data) ? data : 'your mobile number';
      this.message = Messages.OTP_SENT_MOBILE.replace('[your_mobile]', phonenumber);
    }

  }
  doshowOTPEmailContainer() {
    this.showOTPContainer = false;
    this.showOTPEmailContainer = true;
  }
  doCancelEmailOTP() {
    this.doResetApiErrors();
    this.showOTPEmailContainer = false;
    this.showOTPContainer = true;
  }

}
