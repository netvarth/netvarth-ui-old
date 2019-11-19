import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

  transformTofilterDate(value: any) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'yyyy-MM-dd');
    return value;
  }
  transformTomciDate(value: any) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'yyyy/MM/dd');
    return value;
  }

}
