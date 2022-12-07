import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewReportComponent } from './view-report.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    ViewReportComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ]
})
export class ViewReportModule { }
