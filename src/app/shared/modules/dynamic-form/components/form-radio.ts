import { FormBase } from './form-base';

export class RadioQuestion extends FormBase<string> {
  controlType = 'radio';
  options: {name: string, displayName: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
