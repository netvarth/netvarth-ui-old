import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingSnippetComponent } from './booking-snippet.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
// import { Routes } from '@angular/router';

// const routes: Routes = [
//   { path: '', component: BookingSnippetComponent },
//   { path: 'appointments:id', loadChildren: () => import('./schedule-delay/adjust-schedule-delay.module').then(m => m.AdjustScheduleDelayModule)}
// ];

@NgModule({
  declarations: [
    BookingSnippetComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule
  ],
  exports: [
    BookingSnippetComponent
  ]
})
export class BookingSnippetModule { }
