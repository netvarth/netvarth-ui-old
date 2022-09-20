import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovedComponent } from './approved.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ApprovedComponent}
]

@NgModule({
  declarations: [
    ApprovedComponent
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    ApprovedComponent
  ]
})
export class ApprovedModule { }
