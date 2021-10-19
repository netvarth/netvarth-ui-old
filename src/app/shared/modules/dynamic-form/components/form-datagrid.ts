import { FormBase } from './form-base';

export class DataGridQuestion extends FormBase<string> {
  controlType = 'datagrid';
  columns = [];

  constructor(options: {} = {}) {
    super(options);
    this.columns = options['columns'] || [];
    this.columns = this.setRowValue(this.value, this.columns);
  }

  setRowValue(data, columns) {
    if (data !== '' && data.length !== 0) {
      const datacolumns = [];
      for (const i in data) {
        if (data[i]) {

          const column_value = JSON.parse(JSON.stringify(columns));
          const row = data[i];
          datacolumns.push(this.setColumnValue(row, column_value));
        }
      }
      return datacolumns;
    } else {
      return [this.columns];
    }
  }

  setColumnValue(data, columns) {

    for (const i in columns) {
      if (data) {
        const row = columns[i];
        if (data[row.key]) {
          row['value'] = data[row.key];
          columns[i] = row;
        }
      }
    }
    return columns;
  }

}
