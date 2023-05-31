import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulesComponent } from './schedules.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    SchedulesComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    MatCheckboxModule,
    NgbTimepickerModule,
    ButtonModule,
    CalendarModule
  ],
  exports: [
    SchedulesComponent
  ]
})
export class SchedulesModule { }
