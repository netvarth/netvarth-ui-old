import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageTemplateComponent } from './manage-template.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    ManageTemplateComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    ManageTemplateComponent
  ]
})
export class ManageTemplateModule { }
