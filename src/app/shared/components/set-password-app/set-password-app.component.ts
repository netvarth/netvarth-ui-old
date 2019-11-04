import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Messages } from '../../constants/project-messages';
import { SharedServices } from '../../services/shared-services';
import { DOCUMENT } from '@angular/common';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedFunctions } from '../../functions/shared-functions';

@Component({
  selector: 'app-set-password-app',
  templateUrl: './set-password-app.component.html'
})
export class SetPasswordAppComponent implements OnInit {

  new_password_cap = Messages.NEW_PASSWORD_CAP;
  password_valid_cap = Messages.PASSWORD_VALID_CAP;
  re_enter_password_cap = Messages.RE_ENTER_PASSWORD_CAP;
  submit_cap = Messages.SUBMIT_CAP;
  set_password_msg = '';
  passworddialogRef;
  isValidConfirm_pw = false;

  spForm;
  @Input() type;
  @Output() retonPasswordSubmit: EventEmitter<any> = new EventEmitter();
  @Output() resetApiErrors: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCancelBtn: EventEmitter<any> = new EventEmitter();

  constructor(
    // public dialogRef: MatDialogRef<SetPasswordFormComponent>,
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
    this.spForm = this.fb.group({
      new_password: ['', Validators.compose(
        [Validators.required])],
      confirm_password: ['', Validators.compose(
        [Validators.required])],

    });
    setTimeout(() => {
      if (this.document.getElementById('newpassfield')) {
        this.document.getElementById('newpassfield').focus();
      }
    }, 500);
  }

  doOnPasswordSubmit(value) {
    this.retonPasswordSubmit.emit(value);
  }

  doResetApiErrors() {
    this.resetApiErrors.emit();
  }

  cancelDialog() {
    this.onCancelBtn.emit();
  }

  keyPressed(ev) {
    if (ev.keyCode === 13) {
      this.isValidConfirm_pw = this.fed_service.isFieldValid(this.spForm, 'confirm_password');
      if (this.spForm.valid) {
        this.doOnPasswordSubmit(this.spForm.value);
      }
    } else {
      this.resetError(ev);
    }
  }

  resetError(ev) {
    if (ev.keyCode) {
      this.isValidConfirm_pw = false;
    }
  }

}
