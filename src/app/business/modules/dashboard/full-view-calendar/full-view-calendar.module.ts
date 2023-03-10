import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullViewCalendarComponent } from './full-view-calendar.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [FullViewCalendarComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    FormsModule,
    ToggleButtonModule
  ],
  exports: [
    FullViewCalendarComponent
  ]
})
export class FullViewCalendarModule { }
