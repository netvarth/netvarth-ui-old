import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { SharedFunctions } from '../../functions/shared-functions';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { WordProcessor } from '../../services/word-processor.service';
import { FormMessageDisplayService } from '../form-message-display/form-message-display.service';
import { FormBase } from './components/form-base';
import { FormControlService } from './components/form-control.service';
@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: FormBase<any>;
  @Input() form: UntypedFormGroup;
  @Input() messages;
  @Input() showlabel = false;
  @Input() origins;

  placeholder = '';
  errors = [];
  constructor(private qcs: FormControlService,
    public fed_service: FormMessageDisplayService,
    public shared_functions: SharedFunctions,
    public dateformat: DateFormatPipe,
    private wordProcessor: WordProcessor) { }

  ngOnInit() {
    this.errors = this.messages[this.question.key] || [];
    if (this.question['type'] !== 'url') {
      this.placeholder = this.question.label;
    } else {
      this.placeholder = 'E.g:- https://www.jaldee.com';
    }
    if (this.question.controlType === 'date') {
      this.form.controls[this.question.key].setValue(new Date(this.question.value));
    }
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
    const control = <UntypedFormArray>this.form['controls'][this.question.key];
    const addrCtrl = this.qcs.toFormArray(this.question['columns'][0]);
    control.push(addrCtrl);

  }

  removeRow(i: number) {
    const control = <UntypedFormArray>this.form.controls[this.question.key];
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
      return this.wordProcessor.toCamelCase(word);
    } else {
      return word;
    }
  }

}
