import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaperDetailsComponent } from './paper-details.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: PaperDetailsComponent },

];

@NgModule({
  declarations: [
    PaperDetailsComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class PaperDetailsModule { }
