import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SaveTemplateComponent } from './save-template.component';



@NgModule({
  declarations: [SaveTemplateComponent],
  imports: [
    CommonModule,
    MatDialogModule
  ]
})
export class SaveTemplateModule { }
