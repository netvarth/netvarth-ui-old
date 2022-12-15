import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewReportComponent } from './view-report.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: ViewReportComponent }
]



@NgModule({
  declarations: [
    ViewReportComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    ViewReportComponent
  ]
})
export class ViewReportModule { }
