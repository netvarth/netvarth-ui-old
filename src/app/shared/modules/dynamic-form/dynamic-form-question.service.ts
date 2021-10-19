import { Injectable } from '@angular/core';
import { FormBase } from './components/form-base';
import { DataGridQuestion } from './components/form-datagrid';
import { DropdownQuestion } from './components/form-dropdown';
import { EnumListQuestion } from './components/form-enumlist';
import { RadioQuestion } from './components/form-radio';
import { TextareaQuestion } from './components/form-textarea';
import { TextboxQuestion } from './components/form-textbox';
import { DatePickerQuestion } from './components/form.date';

@Injectable()
export class QuestionService {

  // Todo: get from a remote source of question metadata
  // Todo: make asynchronous
  questions: FormBase<any>[] = [];
  // questions:any=[];

  getQuestions(questions_array) {
    this.questions = [];

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
        case 'Date' : this.questions.push(this.createDateField(que)); break;
      }
    }
    // return this.questions;
     return this.questions.sort((a, b) => a.order - b.order);
  }

  createDateField(que) {
    const obj = this.defaultObj(que);
    const txt = new DatePickerQuestion(obj);
    return txt;
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

    return this.createDropDownField(que, list, 'year_field');

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
      {name: 'October' , displayName : 'October'},
      {name: 'November' , displayName : 'November'},
      {name: 'December' , displayName : 'December'}
    ];
    return this.createDropDownField(que, list, 'month_field');
  }

  createDropDownField(que , list, type = null) {
    const obj = this.defaultObj(que);
    obj['options'] = list;

    if (type) {
      obj['controlType'] = type;
    }

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
    if (que.optional !== undefined) {
      if (que.optional) {
        que.mandatory = 'false';
      } else {
        que.mandatory = 'true';
      }
    }
    return {
        key: que.name || que.key || que.displayName.toLowerCase().replace(/ /g, ''),
        label:  que.displayName,
        value: que.value || que.defaultValue,
        required: (que.mandatory === 'true') ? true : false,
        order: que.order
     };
  }


}
