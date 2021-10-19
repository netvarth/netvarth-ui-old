import { FormBase } from './form-base';

export class EnumListQuestion extends FormBase<string> {
  controlType = 'enumlist';
  options: {name: string, displayName: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
