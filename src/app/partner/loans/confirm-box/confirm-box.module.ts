import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxComponent } from './confirm-box.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ConfirmBoxComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule
  ]
})
export class ConfirmBoxModule { }
