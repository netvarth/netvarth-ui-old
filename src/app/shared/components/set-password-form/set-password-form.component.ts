import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SharedServices } from '../../services/shared-services';
import {NgForm} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../modules/form-message-display/form-message-display.service';

@Component({
  selector: 'app-sp-form',
  templateUrl: './set-password-form.component.html'
})
export class SetPasswordFormComponent  implements OnInit {

  spForm: FormGroup;

  @Output() retonPasswordSubmit: EventEmitter<any> = new EventEmitter();
  @Output() resetApiErrors: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {

    this.spForm = this.fb.group({
                      new_password: ['', Validators.compose(
                        [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}$')]) ],
                      confirm_password: ['', Validators.compose(
                          [Validators.required]) ],

                  });

  }

  doOnPasswordSubmit(value) {
    this.retonPasswordSubmit.emit(value);
  }

  doResetApiErrors() {
    this.resetApiErrors.emit();
  }

}
