import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxComponent } from './confirm-box.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    ConfirmBoxComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ]
})
export class ConfirmBoxModule { }
