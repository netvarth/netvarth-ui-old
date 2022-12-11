import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDetailsDocComponent } from './loan-details-doc.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: '', component: LoanDetailsDocComponent }
]



@NgModule({
  declarations: [
    LoanDetailsDocComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    LoanDetailsDocComponent
  ]
})
export class LoanDetailsDocModule { }
