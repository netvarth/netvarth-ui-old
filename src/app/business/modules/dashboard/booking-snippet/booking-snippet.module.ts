import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingSnippetComponent } from './booking-snippet.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';


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
