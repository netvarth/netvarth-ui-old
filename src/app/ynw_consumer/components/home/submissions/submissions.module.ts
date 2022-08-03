import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionsComponent } from './submissions.component';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    SubmissionsComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
  ],
  exports: [
    SubmissionsComponent
  ]
})
export class SubmissionsModule { }
