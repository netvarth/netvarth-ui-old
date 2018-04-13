import { Injectable } from '@angular/core';

import { DropdownQuestion } from './form-dropdown';
import { FormBase } from './form-base';
import { TextboxQuestion } from './form-textbox';
import { TextareaQuestion } from './form-textarea';
import { DataGridQuestion } from './form-datagrid';
import { RadioQuestion } from './form-radio';
import { EnumListQuestion } from './form-enumlist';

@Injectable()
export class QuestionService {

  // Todo: get from a remote source of question metadata
  // Todo: make asynchronous
  questions: FormBase<any>[] = [];

  getQuestions(questions_array) {
    this.questions = [];
    // const questions: FormBase<any>[] = [

    //   new DropdownQuestion({
    //     key: 'brave',
    //     label: 'Bravery Rating',
    //     options: [
    //       {key: 'solid',  value: 'Solid'},
    //       {key: 'great',  value: 'Great'},
    //       {key: 'good',   value: 'Good'},
    //       {key: 'unproven', value: 'Unproven'}
    //     ],
    //     order: 3
    //   }),

    //   new TextboxQuestion({
    //     key: 'firstName',
    //     label: 'First name',
    //     value: 'Bombasto',
    //     required: true,
    //     order: 1
    //   }),

    //   new TextboxQuestion({
    //     key: 'emailAddress',
    //     label: 'Email',
    //     type: 'email',
    //     order: 2
    //   })
    // ];

    for (const que of questions_array) {
      switch (que.dataType) {
        case 'TEXT' : this.questions.push(this.createTextField(que)); break;
        case 'TEXT_MED' : this.questions.push(this.createTextAreaField(que)); break;
        case 'URL' : this.questions.push(this.createTextField(que, 'url')); break;
        case 'Number' : this.questions.push(this.createTextField(que, 'number')); break;
        case 'Age' : this.questions.push(this.createRangeField(que)); break;
        case 'Email': this.questions.push(this.createTextField(que, 'email')); break;
        case 'Phone' : this.questions.push(this.createTextField(que, 'tel')); break;
        case 'DataGrid' : this.questions.push(this.createDataGrid(que)); break;
        case 'DT_Year'  : this.questions.push(this.createYearField(que)); break;
        case 'DT_Month': this.questions.push(this.createMonthField(que)); break;
        case 'Gender' : this.questions.push(this.createGenderField(que)); break;
        case 'Enum'   : this.questions.push(this.createDropDownField(que, que.enumeratedConstants)); break;
        case 'EnumList'   : this.questions.push(this.createEnumField(que)); break;
        case 'Boolean'   : this.questions.push(this.createTextField(que, 'checkbox')); break;
      }
    }
   // console.log(this.questions);
    // return this.questions;
     return this.questions.sort((a, b) => a.order - b.order);
  }

  createTextField(que, type = 'text') {

    const obj = this.defaultObj(que);
    obj['type'] = type;
    if (type === 'text') {
      obj['maxlength'] = que.maxBoundary;
      obj['minlength'] = que.minBoundary;
    } else {

      obj['min'] = que.minBoundary;
      obj['max'] = que.maxBoundary;
    }
    const txt = new TextboxQuestion(obj);

    return txt;
  }

  createRangeField(que) {
    const obj = this.defaultObj(que);
    obj['type'] = 'number';
    obj['min'] = 1;
    obj['max'] = 100;
    const txt = new TextboxQuestion(obj);

    return txt;
  }

  createTextAreaField(que) {
        const obj = this.defaultObj(que);
        const txt = new TextareaQuestion(obj);

        return txt;
  }

  createDataGrid(que) {
    let columns = [];
    columns = this.getFields(que.Columns, columns);
    const obj = this.defaultObj(que);
    obj['columns'] = columns;
    const txt = new DataGridQuestion(obj);
    return txt;
  }

  createYearField(que) {

    const d = new Date();
    const list = [];
    const highEnd = (!isNaN(parseInt(que.maxBoundary, 10))) ? que.maxBoundary : d.getFullYear();
    const lowEnd = (!isNaN(parseInt(que.minBoundary, 10))) ? que.minBoundary : d.getFullYear() - 100;

    for (let i = lowEnd; i <= highEnd; i++) {
        list.push( {name: '' + i,  displayName: i});
    }

    return this.createDropDownField(que, list);

  }

  createMonthField(que) {

    const list = [
      {name: 'January' , displayName : 'January'},
      {name: 'February' , displayName : 'February'},
      {name: 'March' , displayName : 'March'},
      {name: 'April' , displayName : 'April'},
      {name: 'May' , displayName : 'May'},
      {name: 'June' , displayName : 'June'},
      {name: 'July' , displayName : 'July'},
      {name: 'August' , displayName : 'August'},
      {name: 'September' , displayName : 'September'},
      {name: 'October ' , displayName : 'October '},
      {name: 'November' , displayName : 'November'},
      {name: 'December ' , displayName : 'December '}
    ];
    return this.createDropDownField(que, list);
  }

  createDropDownField(que , list) {
    const obj = this.defaultObj(que);
    obj['options'] = list;
    const txt =  new DropdownQuestion(obj);
    return txt;
  }

  createGenderField(que) {
    const obj = this.defaultObj(que);
    obj['options'] = que.enumeratedConstants;
    const txt =  new RadioQuestion(obj);
    return txt;
  }

  createEnumField(que) {
    const obj = this.defaultObj(que);
    obj['options'] = que.enumeratedConstants;
    const txt =  new EnumListQuestion(obj);
    return txt;
  }



  getFields(questions_array, questions) {
    for (const que of questions_array) {
      switch (que.type) {
        case 'TEXT' : questions.push(this.createTextField(que)); break;
        case 'TEXT_MED' : questions.push(this.createTextAreaField(que)); break;
        case 'URL' : questions.push(this.createTextField(que, 'url')); break;
        case 'Number' : questions.push(this.createTextField(que, 'number')); break;
        case 'Age' : questions.push(this.createRangeField(que)); break;
        case 'Email': questions.push(this.createTextField(que, 'email')); break;
        case 'Phone' : questions.push(this.createTextField(que, 'tel')); break;
        case 'DT_Year'  : questions.push(this.createYearField(que)); break;
        case 'DT_Month': questions.push(this.createMonthField(que)); break;
        case 'Gender' : questions.push(this.createGenderField(que)); break;
        case 'Enum'   : questions.push(this.createDropDownField(que, que.enumeratedConstants)); break;
        case 'EnumList'   : questions.push(this.createEnumField(que)); break;
        case 'Boolean'   : questions.push(this.createTextField(que, 'checkbox')); break;
      }
    }
    return questions.sort((a, b) => a.order - b.order);
  }

  defaultObj(que) {

    return {
        key: que.name || que.key || que.displayName.toLowerCase().replace(/ /g, ''),
        label:  que.displayName,
        value: que.value || que.defaultValue,
        required: (que.mandatory === 'true') ? true : false,
        order: que.order
     };
  }


}
