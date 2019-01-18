import { Component, Inject, OnInit, EventEmitter, Output, ElementRef, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from '../../services/shared-services';
import { NgForm } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { DOCUMENT } from '@angular/common';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../functions/shared-functions';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';


@Component({
  selector: 'app-sp-form',
  templateUrl: './set-password-form.component.html'
})
export class SetPasswordFormComponent implements OnInit {


  new_password_cap = Messages.NEW_PASSWORD_CAP;
  password_valid_cap = Messages.PASSWORD_VALID_CAP;
  re_enter_password_cap = Messages.RE_ENTER_PASSWORD_CAP;
  submit_cap = Messages.SUBMIT_CAP;
  set_password_msg = Messages.SET_PASSWORD_MSG;
  passworddialogRef;
  isValidConfirm_pw = false;

  spForm;
  @Input() type;
  @Output() retonPasswordSubmit: EventEmitter<any> = new EventEmitter();
  @Output() resetApiErrors: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCancelBtn: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SetPasswordFormComponent>,
    private fb: FormBuilder, private dialog: MatDialog,
    public sharedfunctionObj: SharedFunctions,
    public fed_service: FormMessageDisplayService,
    @Inject(DOCUMENT) public document,
    public shared_services: SharedServices) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.spForm = this.fb.group({
      new_password: ['', Validators.compose(
        [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')])],
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
    this.isValidConfirm_pw = this.fed_service.isFieldValid(this.spForm, 'confirm_password');
    if (ev.keyCode === 13) {
      if (this.spForm.valid) {
        this.doOnPasswordSubmit(this.spForm.value);
      }
    }
  }

  resetError(ev) {
    if (ev.keyCode) {
      this.isValidConfirm_pw = false;
    }
  }
}
