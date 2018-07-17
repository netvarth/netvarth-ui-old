import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { FormBase } from './form-base';
import { FormControlService } from './form-control.service';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ FormControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: FormBase<any>[] = [];
  @Output() retonFormSubmit: EventEmitter<any> = new EventEmitter();

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
  public shared_functions: SharedFunctions) {  }

  ngOnInit() {
    const form_ob  = this.qcs.toFormGroup(this.questions); // console.log(form_ob);
    this.form = form_ob.form;
    this.messages = form_ob.messages;
  }

  onSubmit() {
    this.api_error = null;
    // this.payLoad = JSON.stringify(this.form.value);
    // console.log(this.questions);
    // console.log(this.form.value);
    const mon_year_key = this.findYearMonthField();
    // console.log(mon_year_key);
    if ( mon_year_key['year_field'] && mon_year_key['month_field'] ) {
      const month_year_valid = this.validateMonthAndYear(mon_year_key);
      if (month_year_valid) {
        this.api_error = null;
        this.retonFormSubmit.emit(this.form.value);
      } else {
        this.shared_functions.apiErrorAutoHide(this, Messages.YEAR_MONTH_VALID);
      }
    } else {
      this.retonFormSubmit.emit(this.form.value);
    }
    //
  }

  findYearMonthField() {

    const mon_year_key = {
      'year_field': null,
      'month_field': null,
    };

    if (this.questions[0]) {
      // we are only passing one question at a time
      if (this.questions[0]['controlType'] === 'datagrid' && this.questions[0]['columns']) {

        for ( const que of this.questions[0]['columns'][0]) {
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
    // console.log(que_key);
    if (que_key &&  this.form.value &&  this.form.value[que_key]) {
     for (const val of this.form.value[que_key]) {
      // check validation for each row
       const year_key = mon_year_key['year_field'];

       const year_val = parseInt(val[year_key], 10);

       const current_year = new Date().getFullYear();
      // console.log(year_val, current_year);
       if (year_val === current_year) {

        const month_key = mon_year_key['month_field'];
        const month_val = val[month_key];
        const current_month = new Date().getMonth();
        // console.log(month_val, this.monthList[month_val], current_month);
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




}
