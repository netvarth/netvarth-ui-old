import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { FormBase } from './form-base';
import { FormControlService } from './form-control.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ FormControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: FormBase<any>[] = [];
  @Output() onFormSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  messages = [];
  payLoad = '';

  constructor(private qcs: FormControlService, private fb: FormBuilder) {  }

  ngOnInit() {
    const form_ob  = this.qcs.toFormGroup(this.questions);
    this.form = form_ob.form;
    this.messages = form_ob.messages;
  }

  onSubmit() {
    // this.payLoad = JSON.stringify(this.form.value);
    // console.log(this.form.value);
    this.onFormSubmit.emit(this.form.value);
  }
}
