import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { FormBase } from './form-base';
import { projectConstants } from '../../../app.component';

@Injectable()
export class FormControlService {
  error_message = [];
  constructor() { }

  toFormGroup(questions: FormBase<any>[] ) {
    const group: any = {};
    questions.forEach(question => {
      if (question.controlType === 'datagrid') {
          // group[question.key] = new FormArray([this.toFormArray(question['columns'])]);
          group[question.key] = new FormArray(this.toArrayFormArray(question['columns']));
      } else if (question.controlType === 'enumlist') {
          group[question.key] =  new FormArray([this.toFormControlArray(question)]);
      } else {
        group[question.key] = this.toFormControl(question);
      }
    });

    return { 'form' : new FormGroup(group) , 'messages': this.error_message } ;
  }

  toFormControl(question) {
    const validators = [];
    if (!this.error_message[question.key]) {
      this.error_message[question.key] = [];
    }

    if (question.required) {
      validators.push(Validators.required);
      this.createError(question, 'required',
      question.label + ' is required');
    }
    if (question.minlength) {
      validators.push(Validators.minLength(question.minlength));
      this.createError(question, 'minlength',
      question.label + ' need minimum ' + question.minlength + ' character');
    }
    if (question.maxlength) {
      validators.push(Validators.maxLength(question.maxlength));
      this.createError(question, 'maxlength',
       question.label + ' exceeds maximum allowed length');
    }

    if (question.type === 'url') {
      validators.push(Validators.pattern(projectConstants.VALIDATOR_URL));
      this.createError(question, 'pattern',
      'Please enter a valid URL');
    }

    if (validators.length !== 0) {
      return new FormControl(question.value || '', Validators.compose(validators));

    } else {
      return  new FormControl(question.value || '');
    }
  }

  createError(question, cond, message) {
    const err_msg = this.error_message[question.key];
    err_msg[cond] = message;
    this.error_message[question.key] = err_msg;
  }

  toArrayFormArray(questions) {
    const control_array = [];
    questions.forEach(question => {
      control_array.push(this.toFormArray(question));
    });
    return control_array;
  }

  toFormArray(questions: FormBase<any>[] ) {
    const array: any = {};
    questions.forEach(question => {
      array[question.key] = this.toFormControl(question);
    });
    return new FormGroup(array);
  }

  toFormControlArray(questions) {
    const array: any = {};
    const check_columns = questions['options'];
    const values = (questions['value']) ? questions['value'] : [];
    check_columns.forEach(columns => {
      const checked = (this.checkEnumListInValue(columns.name, values) === -1) ? false : true;
      array[columns.name] = new FormControl(checked);
    });
    return new FormGroup(array);
  }

  checkEnumListInValue(key, values) {

    if (values.length > 0) {
        return values.indexOf(key);
    } else {

      return -1;
    }
  }

}
