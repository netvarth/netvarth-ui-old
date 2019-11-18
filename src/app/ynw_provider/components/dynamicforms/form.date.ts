import { FormBase } from './form-base';

export class DatePickerQuestion extends FormBase<string> {
  controlType = 'date';
  type: string;

  constructor(options: {} = {}) {
    super(options);
  }
}
