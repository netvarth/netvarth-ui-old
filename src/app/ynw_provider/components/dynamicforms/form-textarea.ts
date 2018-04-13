import { FormBase } from './form-base';

export class TextareaQuestion extends FormBase<string> {
  controlType = 'textarea';
  type: string;

  constructor(options: {} = {}) {
    super(options);
  }
}
