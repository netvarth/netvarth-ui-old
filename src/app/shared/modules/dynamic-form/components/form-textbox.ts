import { FormBase } from './form-base';

export class TextboxQuestion extends FormBase<string> {
  controlType = 'textbox';
  type: string;
  min: number;
  max: number;
  maxlength: number;
  minlength: number;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.min = options['min'] || '';
    this.max = options['max'] || '';
    this.maxlength = options['maxlength'] || '';
    this.minlength = options['minlength'] || '';
  }
}
