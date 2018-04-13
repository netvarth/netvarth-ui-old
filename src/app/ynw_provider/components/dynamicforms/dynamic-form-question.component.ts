import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { FormBase } from './form-base';
import { FormControlService } from './form-control.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: FormBase<any>;
  @Input() form: FormGroup;
  @Input() messages;
  @Input() showlabel = false;

  errors = [];
  constructor(private qcs: FormControlService,
    public fed_service: FormMessageDisplayService) {}

  ngOnInit() {
    this.errors = this.messages[this.question.key] || [];
   // console.log(this.form.controls);
    // if (this.question.controlType === 'datagrid') {
    //   if (this.checkGridValue()) {
    //     this.removeRow(0);
    //   }
    // }
  }
  get isValid() { return this.form.controls[this.question.key].valid; }

  checkGridValue() {
    // console.log(this.question['columns']);
    if (this.question['columns'].length === 1) {
       const check_value = this.question['columns'][0].map((e) => {
         if (e.value) {
            return 'true';
          } else {
            return 'false';
          }
        });
        // console.log(check_value);
        return (check_value.indexOf('true') !== -1)  ?  false :  true;
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
    //   console.log(x);
    // })
    const control = <FormArray>this.form['controls'][this.question.key];
    const addrCtrl =  this.qcs.toFormArray(this.question['columns'][0]);
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
 // console.log(this.form.controls[this.question.key]['value'] );
}

}
