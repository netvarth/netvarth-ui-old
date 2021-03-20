import { Component, Inject, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedServices } from '../../services/shared-services';
import { FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { DOCUMENT } from '@angular/common';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../functions/shared-functions';

@Component({
  selector: 'app-sp-form',
  templateUrl: './set-password-form.component.html',
  styleUrls: ['./set-password-form.component.css']
})
export class SetPasswordFormComponent implements OnInit {

  new_password_cap = Messages.NEW_PASSWORD_CAP;
  password_valid_cap = Messages.PASSWORD_VALID_CAP;
  re_enter_password_cap = Messages.RE_ENTER_PASSWORD_CAP;
  submit_cap = Messages.SUBMIT_CAP;
  set_password_msg = '';
  passworddialogRef;
  isValidConfirm_pw = true;
  customer = '';
  spForm;
  disableButton = false;
  @Input() type;
  @Input() checkConsumerOrProvider;
  @Input() consumerlogin;
  @Output() retonPasswordSubmit: EventEmitter<any> = new EventEmitter();
  @Output() resetApiErrors: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCancelBtn: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SetPasswordFormComponent>,
    private fb: FormBuilder, public sharedfunctionObj: SharedFunctions,
    public fed_service: FormMessageDisplayService,
    @Inject(DOCUMENT) public document,
    public shared_services: SharedServices) { }

  ngOnInit() {
    this.createForm();
    if (this.type !== 'forgot_password') {
      this.set_password_msg = Messages.SET_PASSWORD_MSG;
    }
  }

  createForm() {
    if (this.checkConsumerOrProvider !== 'consumer') {
      this.spForm = this.fb.group({
        new_password: ['', Validators.compose(
          [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$')])],
        confirm_password: ['', Validators.compose(
          [Validators.required])],
      });
    } else {
      this.spForm = this.fb.group({
        new_password: ['', Validators.compose(
          [Validators.required, Validators.maxLength(32),
          Validators.minLength(8)])],
        confirm_password: ['', Validators.compose(
          [Validators.required, Validators.maxLength(32),
          Validators.minLength(8)])],
      });
    }
    setTimeout(() => {
      if (this.document.getElementById('newpassfield')) {
        this.document.getElementById('newpassfield').focus();
      }
    }, 500);
  }
  doOnPasswordSubmit(value) {
    if (this.spForm.get('new_password').value === this.spForm.get('confirm_password').value) {
      this.isValidConfirm_pw = true;
    } else {
      this.isValidConfirm_pw = false;
    }
    if (this.isValidConfirm_pw) {
      this.disableButton = true;
      this.retonPasswordSubmit.emit(value);
    }
  }

  doResetApiErrors() {
    this.resetApiErrors.emit();
  }

  cancelDialog() {
    this.onCancelBtn.emit();
  }

  keyPressed(ev) {
    this.disableButton = false;
    if (this.spForm.get('new_password').value === this.spForm.get('confirm_password').value) {
      this.isValidConfirm_pw = true;
    } else {
      this.isValidConfirm_pw = false;
    }
    if (ev.keyCode === 13) {
      // this.isValidConfirm_pw = this.fed_service.isFieldValid(this.spForm, 'confirm_password');
      if (this.spForm.valid) {
        this.doOnPasswordSubmit(this.spForm.value);
      }
    }
    //  else {
    //   this.resetError(ev);
    // }
  }

  resetError(ev) {
    if (ev.keyCode) {
      this.isValidConfirm_pw = false;
    }
  }
}
