import { FormBase } from './form-base';

export class DropdownQuestion extends FormBase<string> {
  controlType = 'dropdown';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.controlType = options['controlType'] || this.controlType;
    // this.value =  this.value || this.options[0]['name'];
  }
}
