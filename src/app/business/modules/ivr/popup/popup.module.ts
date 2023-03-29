import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    PopupComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    CalendarModule,
    MultiSelectModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class PopupModule { }
