import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionSelectComponent } from './prescription-select.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SaveTemplateModule } from './save-template/save-template.module';
import { ManageTemplateModule } from './manage-template/manage-template.module';



@NgModule({
  declarations: [
    PrescriptionSelectComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    SaveTemplateModule,
    ManageTemplateModule
  ]
})
export class PrescriptionSelectModule { }
