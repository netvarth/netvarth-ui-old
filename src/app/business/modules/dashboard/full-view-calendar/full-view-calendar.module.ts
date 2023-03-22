import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullViewCalendarComponent } from './full-view-calendar.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { AppointmentActionsModule } from '../../appointments/appointment-actions/appointment-actions.module';

@NgModule({
  declarations: [FullViewCalendarComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    FormsModule,
    DynamicDialogModule,
    AppointmentActionsModule,
    ToggleButtonModule
  ],
  exports: [
    FullViewCalendarComponent
  ]
})
export class FullViewCalendarModule { }