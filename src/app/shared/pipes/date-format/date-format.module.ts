import { NgModule } from '@angular/core';
import { DateFormatPipe } from './date-format.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule],
    declarations: [DateFormatPipe],
    exports: [DateFormatPipe],
    providers: [DateFormatPipe]
})
export class DateFormatPipeModule {

}
