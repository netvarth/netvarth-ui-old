import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { FormBase } from './form-base';
import { FormControlService } from './form-control.service';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import * as moment from 'moment';
import { projectConstants } from '../../../app.component';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [FormControlService]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: FormBase<any>[] = [];
  @Input() origin;
  @Output() retonFormSubmit: EventEmitter<any> = new EventEmitter();
  @Output() cancelClick = new EventEmitter<any>();

  form: FormGroup;
  messages = [];
  payLoad = '';
  api_error = null;

  monthList = {
    'January': 0,
    'February': 1,
    'March': 2,
    'April': 3,
    'May': 4,
    'June': 5,
    'July': 6,
    'August': 7,
    'September': 8,
    'October': 9,
    'November': 10,
    'December': 11
  };


  constructor(private qcs: FormControlService, private fb: FormBuilder,
    public shared_functions: SharedFunctions) { }

  ngOnInit() {
    const form_ob = this.qcs.toFormGroup(this.questions);
    this.form = form_ob.form;
    this.messages = form_ob.messages;
  }

  onSubmit() {
    this.api_error = null;
    // this.payLoad = JSON.stringify(this.form.value);

    const curdate = this.findDateField();
    const mon_year_key = this.findYearMonthField();
    if (mon_year_key['year_field'] && mon_year_key['month_field']) {
      const month_year_valid = this.validateMonthAndYear(mon_year_key);
      if (month_year_valid) {
        this.api_error = null;
        this.retonFormSubmit.emit(this.form.value);
      } else {
        this.shared_functions.apiErrorAutoHide(this, Messages.YEAR_MONTH_VALID);
      }
    } else if (curdate) {
      this.retonFormSubmit.emit(curdate);
    } else {
      this.retonFormSubmit.emit(this.form.value);
    }
    //
  }

  findDateField() {
    if (this.questions[0]) {
      if (this.questions[0]['controlType'] === 'date') {
        const curdate = moment(this.form.value[this.questions[0]['key']]).format('YYYY/MM/DD');
        const dateObj = {};
        dateObj[this.questions[0]['key']] = curdate;
         return dateObj;
      }
    }
    return null;
  }

  findYearMonthField() {

    const mon_year_key = {
      'year_field': null,
      'month_field': null,
    };

    if (this.questions[0]) {
      // we are only passing one question at a time
      if (this.questions[0]['controlType'] === 'datagrid' && this.questions[0]['columns']) {

        for (const que of this.questions[0]['columns'][0]) {
          if (que.controlType === 'year_field') {
            mon_year_key['year_field'] = que.key;
          } else if (que.controlType === 'month_field') {
            mon_year_key['month_field'] = que.key;
          }
        }
      }
    }
    return mon_year_key;
  }

  validateMonthAndYear(mon_year_key) {
    const que_key = this.questions[0]['key'] || null;
    if (que_key && this.form.value && this.form.value[que_key]) {
      for (const val of this.form.value[que_key]) {
        // check validation for each row
        const year_key = mon_year_key['year_field'];

        const year_val = parseInt(val[year_key], 10);

        const current_year = new Date().getFullYear();
        if (year_val === current_year) {

          const month_key = mon_year_key['month_field'];
          const month_val = val[month_key];
          const current_month = new Date().getMonth();
          if (current_month < this.monthList[month_val]) {
            return false;
          } else {
            return true;
          }

        } else {
          return true;
        }

      }
    }
  }
  cancelClicked() {
    this.cancelClick.emit();
  }
}
