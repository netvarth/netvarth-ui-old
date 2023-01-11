import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemOptionsComponent } from './item-options.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    ItemOptionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    RadioButtonModule,
    CardModule,
    CheckboxModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    CalendarModule
  ]
})
export class ItemOptionsModule { }
