import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { FormBase } from './form-base';
import { FormControlService } from './form-control.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: FormBase<any>;
  @Input() form: FormGroup;
  @Input() messages;
  @Input() showlabel = false;
  @Input() origins;

  placeholder = '';
  errors = [];
  constructor(private qcs: FormControlService,
    public fed_service: FormMessageDisplayService,
    public shared_functions: SharedFunctions,
    public dateformat: DateFormatPipe) { }

  ngOnInit() {
    this.errors = this.messages[this.question.key] || [];
    if (this.question['type'] !== 'url') {
      this.placeholder = this.question.label;
    } else {
      this.placeholder = 'E.g:- https://www.jaldee.com';
    }
    // if (this.question.controlType === 'datagrid') {
    //   if (this.checkGridValue()) {
    //     this.removeRow(0);
    //   }
    // }
  }
  get isValid() { return this.form.controls[this.question.key].valid; }
  isNumberField(evt) {
    if (evt.target.type === 'number') {
      return this.shared_functions.isValid(evt);
    }
    return true;
  }
  checkGridValue() {
    if (this.question['columns'].length === 1) {
      const check_value = this.question['columns'][0].map((e) => {
        if (e.value) {
          return 'true';
        } else {
          return 'false';
        }
      });
      return (check_value.indexOf('true') !== -1) ? false : true;
    } else {
      return false;
    }
  }
  addRow() {
    // const control = <FormArray>this.form['controls'][this.question.key];
    // const addrCtrl = this.qcs.toFormArray();

    // control.push(addrCtrl);

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    // })
    const control = <FormArray>this.form['controls'][this.question.key];
    const addrCtrl = this.qcs.toFormArray(this.question['columns'][0]);
    control.push(addrCtrl);

  }

  removeRow(i: number) {
    const control = <FormArray>this.form.controls[this.question.key];
    control.removeAt(i);
  }

  setCheckBoxValue() {
    if (this.form.controls[this.question.key]['value'] === 'false' ||
      this.form.controls[this.question.key]['value'] === '') {
      this.form.controls[this.question.key].setValue('true');
    } else {
      this.form.controls[this.question.key].setValue('false');
    }
  }

  dateChange(value) {
    console.log(value);
    const date = this.dateformat.transformTomciDate(value);
    console.log(date);
    this.form.controls[this.question.key].setValue(value);
    // this.form.controls[this.question.key].setValue(date);
  }
  onFieldBlur(question) {

    if (question.type !== 'url' &&
      question.type !== 'number' &&
      question.type !== 'email' &&
      question.type !== 'DataGrid' &&
      question.type !== 'tel') {
      // this.form.get(key).setValue(this.toCamelCase(this.form.get(key).value));
    }
  }

  toCamelCase(word) {
    if (word) {
      return this.shared_functions.toCamelCase(word);
    } else {
      return word;
    }
  }

}
