import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'capitalizeFirst'})
export class CapitalizeFirstPipe implements PipeTransform {
    transform(value: string, args: any[]): string {
      if (value !== null && value !== undefined ) {
        value = value.toString().trim();
        // console.log('inside pipe', value.charAt(0).toUpperCase());
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    }
  }
